exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://uat.simplythankyou.co.uk', // change this to your frontend domain
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: 'OK'
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

  try {
    const zbUrl = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${encodeURIComponent(email)}`;
    const zbResponse = await fetch(zbUrl);
    const result = await zbResponse.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Validation failed",
        message: error.message
      })
    };
  }
};
