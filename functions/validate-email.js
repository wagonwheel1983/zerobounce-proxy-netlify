exports.handler = async function (event, context) {
  const allowedOrigins = [
  'https://uat.simplythankyou.co.uk',
  'https://www.simplythankyou.co.uk',
  'https://client.simplythankyou.co.uk'
];

const origin = event.headers.origin;
const allowOrigin = allowedOrigins.includes(origin) ? origin : 'https://client.simplythankyou.co.uk';

const headers = {
  'Access-Control-Allow-Origin': allowOrigin,
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
