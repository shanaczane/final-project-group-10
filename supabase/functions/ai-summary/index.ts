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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Get current user
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's role and owner_id
    const { data: userData } = await supabase
      .from('users')
      .select('role, owner_id')
      .eq('id', user.id)
      .single();

    const ownerId = userData?.role === 'owner' ? user.id : userData?.owner_id;

    // Query last 7 days of sales movements
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: movements } = await supabase
      .from('stock_movements')
      .select('quantity_change, created_at, product:products(name, sell_price, owner_id)')
      .eq('movement_type', 'sale')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    // Filter to owner's products
    const ownerMovements = (movements ?? []).filter(
      (m: any) => m.product?.owner_id === ownerId,
    );

    // Query low stock products
    const { data: products } = await supabase
      .from('products')
      .select('name, quantity, min_threshold')
      .eq('owner_id', ownerId)
      .lte('quantity', 10)
      .order('quantity', { ascending: true })
      .limit(5);

    // Aggregate sales by product
    const salesMap: Record<string, { units: number; revenue: number }> = {};
    let totalRevenue = 0;
    let totalUnits = 0;

    for (const m of ownerMovements) {
      const name = m.product?.name ?? 'Unknown';
      const price = m.product?.sell_price ?? 0;
      const units = Math.abs(m.quantity_change);
      if (!salesMap[name]) salesMap[name] = { units: 0, revenue: 0 };
      salesMap[name].units += units;
      salesMap[name].revenue += units * price;
      totalRevenue += units * price;
      totalUnits += units;
    }

    const topProduct = Object.entries(salesMap)
      .sort((a, b) => b[1].units - a[1].units)[0];

    const urgentRestock = (products ?? []).find(
      (p: any) => p.quantity <= p.min_threshold,
    );

    // Build prompt
    const prompt = `You are a helpful business assistant for a small Filipino retail store.
Based on this week's data, write a 3-4 sentence plain-English business summary in a friendly tone.

This week's data:
- Total sales: ₱${totalRevenue.toFixed(2)} across ${totalUnits} units sold
- Top selling product: ${topProduct ? `${topProduct[0]} (${topProduct[1].units} units)` : 'no sales yet'}
- Most urgent restock: ${urgentRestock ? `${urgentRestock.name} (only ${urgentRestock.quantity} units left)` : 'none critical'}
- Total low-stock products: ${(products ?? []).length}

Write a brief, actionable summary. Use ₱ for prices. Keep it under 4 sentences.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
        }),
      },
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Could not generate summary.';

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
