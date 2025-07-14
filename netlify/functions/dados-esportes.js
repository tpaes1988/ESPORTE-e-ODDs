exports.handler = async (event, context) => {
  try {
    const API_KEY = process.env.API_FOOTBALL_KEY; // Sua chave de API do Netlify
    const url = 'https://v3.football.api-sports.io/status'; // Ou a URL da API que você está usando

    const response = await fetch(url, {
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    if (!response.ok) {
      // Se a API externa retornar um erro
      const errorText = await response.text();
      console.error(`Erro da API externa (status ${response.status}): ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Erro da API externa: ${response.status} - ${errorText}` }),
      };
    }

    const data = await response.json();

    // *** ADICIONE ESTE CONSOLE.LOG AQUI ***
    console.log("Dados completos recebidos da API-Football e sendo retornados pela função:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Erro na execução da função Netlify:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno da função: ' + error.message }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
