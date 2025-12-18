export async function POST(request) {
  const { question, context } = await request.json();
  
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 });
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
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `${context}\n\nQuestion: ${question}\n\nProvide a helpful, concise answer about the health and processing aspects of this food.`
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 500 });
    }
    
    return Response.json({ result: data.content[0].text });
  } catch (error) {
    return Response.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
