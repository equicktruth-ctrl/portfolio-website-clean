const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { question } = JSON.parse(event.body);

   const apiResponse = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "sonar",
    messages: [
      { role: "system", content: "Be precise and concise." }, // optional
      { role: "user", content: question } // required
    ]
  })
});

    // Log status for debugging
    console.log('API response status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      console.error('Perplexity API error:', errText);
      throw new Error(`Perplexity API error: ${apiResponse.status} ${apiResponse.statusText} - ${errText}`);
    }

    const data = await apiResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.answer })
    };
  } catch (error) {
    // Log the error for debugging
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

