exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://uat.simplythankyou.co.uk',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  const email = event.queryStringParameters.email;
  const apiKey = process.env.ZEROBOUNCE_API_KEY;

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid or missing email" })
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Missing API key" })
    };
  }

  const zbUrl = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`;

  try {
    const response = await fetch(zbUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Fetch error", detail: error.message })
    };
  }
};