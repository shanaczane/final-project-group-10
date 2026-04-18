import { observable } from '@legendapp/state';
import { supabase } from './lib/supabase';
import type { Product, Category, StockMovement } from './types';

// Global reactive store
export const store$ = observable({
  products: [] as Product[],
  categories: [] as Category[],
  stockMovements: [] as StockMovement[],
  loading: false,
});

// ─── Timeout helper ──────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms / 1000}s. Check your internet connection and try again.`)), ms),
    ),
  ]);
}

// ─── Load ────────────────────────────────────────────────────────────────────

export async function loadAllData(): Promise<void> {
  store$.loading.set(true);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    store$.loading.set(false);
    return;
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role, owner_id')
    .eq('id', session.user.id)
    .single();

  const ownerId =
    userData?.role === 'helper' && userData?.owner_id
      ? userData.owner_id
      : session.user.id;

  const [productsRes, categoriesRes, movementsRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('owner_id', ownerId)
      .order('name'),
    supabase
      .from('categories')
      .select('*')
      .eq('owner_id', ownerId)
      .order('name'),
    supabase
      .from('stock_movements')
      .select('*, product:products!inner(name, sell_price, owner_id)')
      .eq('product.owner_id', ownerId)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);
  if (productsRes.data) store$.products.set(productsRes.data as Product[]);
  if (categoriesRes.data) store$.categories.set(categoriesRes.data as Category[]);
  if (movementsRes.data) store$.stockMovements.set(movementsRes.data as StockMovement[]);
  store$.loading.set(false);
}

// ─── Product mutations ────────────────────────────────────────────────────────

export async function addProduct(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'owner_id'>,
): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Not authenticated' };
  console.log('[addProduct] inserting with owner_id:', session.user.id);
  const { error } = await withTimeout(
    supabase.from('products').insert({ ...product, owner_id: session.user.id }),
  );
  if (error) {
    console.error('[addProduct] insert error:', error);
    return { error: error.message };
  }
  console.log('[addProduct] insert success, reloading data');
  await loadAllData();
  return { error: null };
}

export async function updateProduct(
  id: string,
  changes: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>>,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('products')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };
  await loadAllData();
  return { error: null };
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { error: error.message };
  store$.products.set(store$.products.get().filter((p) => p.id !== id));
  return { error: null };
}

// ─── Category mutations ───────────────────────────────────────────────────────

export async function addCategory(name: string): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Not authenticated' };
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, owner_id: session.user.id })
    .select('*')
    .single();
  if (error) return { error: error.message };
  store$.categories.set([...store$.categories.get(), data as Category]);
  return { error: null };
}

export async function updateCategory(
  id: string,
  name: string,
): Promise<{ error: string | null }> {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select('*')
    .single();
  if (error) return { error: error.message };
  store$.categories.set(
    store$.categories.get().map((c) => (c.id === id ? (data as Category) : c)),
  );
  return { error: null };
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  store$.categories.set(store$.categories.get().filter((c) => c.id !== id));
  return { error: null };
}

// ─── Sales / stock movement ───────────────────────────────────────────────────

export async function recordSale(
  productId: string,
  quantity: number,
  recordedBy: string,
): Promise<{ error: string | null }> {
  const product = store$.products.get().find((p) => p.id === productId);
  if (!product) return { error: 'Product not found' };
  if (product.quantity < quantity) return { error: 'Insufficient stock' };

  const newQty = product.quantity - quantity;

  // Insert movement
  const { error: moveErr } = await supabase
    .from('stock_movements')
    .insert({
      product_id: productId,
      quantity_change: -quantity,
      movement_type: 'sale',
      recorded_by: recordedBy,
    });
  if (moveErr) return { error: moveErr.message };

  // Update product quantity
  const { error: prodErr } = await supabase
    .from('products')
    .update({ quantity: newQty, updated_at: new Date().toISOString() })
    .eq('id', productId);
  if (prodErr) return { error: prodErr.message };

  // Reload to get fresh state
  await loadAllData();

  return { error: null };
}

// ─── Computed helpers (plain functions, used in observer components) ──────────

export function getLowStockItems(products: Product[]): Product[] {
  return products.filter((p) => p.quantity <= p.min_threshold);
}

export function getTotalInventoryValue(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.quantity * p.sell_price, 0);
}

export function getSalesToday(movements: StockMovement[]): number {
  const today = new Date().toDateString();
  return movements
    .filter(
      (m) =>
        m.movement_type === 'sale' &&
        new Date(m.created_at).toDateString() === today,
    )
    .reduce((sum, m) => sum + Math.abs(m.quantity_change), 0);
}

export function getWeeklySales(
  movements: StockMovement[],
): { day: string; qty: number; amount: number }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayMoves = movements.filter(
      (m) =>
        m.movement_type === 'sale' &&
        new Date(m.created_at).toDateString() === dayStr,
    );
    const qty = dayMoves.reduce((s, m) => s + Math.abs(m.quantity_change), 0);
    const amount = dayMoves.reduce(
      (s, m) =>
        s + Math.abs(m.quantity_change) * (m.product?.sell_price ?? 0),
      0,
    );
    return { day: days[d.getDay()], qty, amount };
  });
}
