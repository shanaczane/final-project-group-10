import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'question is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role, owner_id')
      .eq('id', user.id)
      .single();

    const ownerId = userData?.role === 'owner' ? user.id : userData?.owner_id;

    // Fetch data snapshot
    const [productsRes, movementsRes] = await Promise.all([
      supabase
        .from('products')
        .select('name, quantity, sell_price, min_threshold, category:categories(name)')
        .eq('owner_id', ownerId)
        .order('name'),
      supabase
        .from('stock_movements')
        .select('quantity_change, movement_type, created_at, product:products(name, sell_price, owner_id)')
        .order('created_at', { ascending: false })
        .limit(100),
    ]);

    const products = productsRes.data ?? [];
    const movements = (movementsRes.data ?? []).filter(
      (m: any) => m.product?.owner_id === ownerId,
    );

    // Build data summary for context
    const now = new Date();
    const todayLabel = now.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const saleMoves = (movements as any[]).filter((m) => m.movement_type === 'sale');

    // Build per-date sales breakdown for last 7 days
    const dayMap = new Map<string, { label: string; units: number; total: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const label = d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      dayMap.set(key, { label, units: 0, total: 0 });
    }
    for (const m of saleMoves) {
      const key = new Date(m.created_at).toDateString();
      if (dayMap.has(key)) {
        const entry = dayMap.get(key)!;
        const units = Math.abs(m.quantity_change);
        entry.units += units;
        entry.total += units * (m.product?.sell_price ?? 0);
      }
    }
    const weeklySales = Array.from(dayMap.values())
      .map((d) => `  ${d.label}: ${d.units} units, ₱${d.total.toFixed(2)}`)
      .join('\n');

    // Recent individual sales (last 20)
    const recentSales = saleMoves.slice(0, 20).map((m: any) => {
      const d = new Date(m.created_at);
      const dateStr = d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const timeStr = d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
      const units = Math.abs(m.quantity_change);
      const amount = units * (m.product?.sell_price ?? 0);
      return `  ${m.product?.name ?? 'Unknown'} x${units} on ${dateStr} at ${timeStr}: ₱${amount.toFixed(2)}`;
    }).join('\n');

    const lowStock = (products as any[]).filter((p) => p.quantity <= p.min_threshold);
    const productList = (products as any[]).map(
      (p) => `${p.name} (qty: ${p.quantity}, price: ₱${p.sell_price})`,
    ).join('\n');
    const lowStockList = lowStock.map(
      (p: any) => `${p.name} (${p.quantity} left, min: ${p.min_threshold})`,
    ).join(', ');

    const prompt = `You are a helpful assistant for a small Filipino retail store. Answer the owner's question based on their store data.

Today is ${todayLabel}.

Sales by day (last 7 days):
${weeklySales}

Recent individual sales:
${recentSales || '  No sales yet.'}

Inventory:
- Total products: ${products.length}
- Low stock (${lowStock.length}): ${lowStockList || 'none'}
- Product list:
${productList}

Question: "${question}"

Answer in 1-3 sentences in the same language as the question (Filipino or English). Be direct and specific with dates and amounts. Use ₱ for prices.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 200 },
        }),
      },
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const parts: { text?: string }[] = geminiData.candidates?.[0]?.content?.parts ?? [];
    const answer = parts.map((p) => p.text ?? '').join('') || 'Could not generate an answer.';

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
