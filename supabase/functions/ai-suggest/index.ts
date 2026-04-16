import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    const { productName } = await req.json();
    if (!productName || typeof productName !== 'string') {
      return new Response(JSON.stringify({ error: 'productName is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are a helpful assistant for a small Filipino retail store.
Given the product name "${productName}", suggest:
1. A category (one of: Beverages, Snacks, Personal Care, Household, Dairy, Frozen, Condiments, Medicines, Other)
2. A typical sell price range in Philippine Peso (e.g. "₱25 – ₱35")
3. A recommended minimum stock level (just a number, e.g. 10)

Respond ONLY with valid JSON in this exact format:
{
  "category": "Beverages",
  "priceRange": "₱65 – ₱75",
  "minStock": 10
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 100,
            responseMimeType: 'application/json',
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

    // Parse and validate
    const suggestions = JSON.parse(rawText);
    return new Response(JSON.stringify({
      category: suggestions.category ?? null,
      priceRange: suggestions.priceRange ?? null,
      minStock: typeof suggestions.minStock === 'number' ? suggestions.minStock : null,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
