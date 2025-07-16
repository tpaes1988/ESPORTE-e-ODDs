const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const { endpoint = "fixtures", date } = event.queryStringParameters || {};

  let query = "";
  if (date) {
    query = `?date=${date}`;
  }

  const url = `https://v3.football.api-sports.io/${endpoint}${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY
      }
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};