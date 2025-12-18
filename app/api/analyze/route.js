export async function POST(request) {
  const { image, type, mediaType } = await request.json();
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
  }

  let prompt;
  if (type === 'label') {
    prompt = 'Extract the ingredients list from this food label. Return ONLY the ingredients as a comma-separated list, nothing else. If you cannot read the ingredients clearly, respond with exactly: ERROR: Could not read';
  } else {
    prompt = `Identify this food. If it's a branded/packaged product (like a Big Mac, Oreos, Coca-Cola, Doritos, etc.), provide the typical/known ingredients for that product. If it's a whole unprocessed food (like an apple, raw chicken, etc.), note that.

Respond in this exact JSON format only, no other text:
{"food": "name of food", "brand": "brand name or null", "isWholeFood": true or false, "isPackaged": true or false, "category": "category", "ingredients": "comma-separated ingredient list", "confidence": "high or medium or low", "notes": "brief note about processing level"}

If you cannot identify the food, respond with exactly: {"error": "Could not identify"}`;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 500 });
    }
    
    return Response.json({ result: data.content[0].text });
  } catch (error) {
    return Response.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
