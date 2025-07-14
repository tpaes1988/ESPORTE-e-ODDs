exports.handler = async (event, context) => {
  try {
    // A variável de ambiente agora é API_FOOTBALL_KEY
    const API_KEY = process.env.API_FOOTBALL_KEY;

    // --- NOVO/REVIDO: Verificação crucial para a chave da API-Football ---
    if (!API_KEY) {
      console.error("ERRO CRÍTICO: API_FOOTBALL_KEY não está configurada nas variáveis de ambiente do Netlify.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erro interno da função: Chave da API-Football não configurada no Netlify." }),
        headers: { "Content-Type": "application/json" },
      };
    }
    // --- FIM DA VERIFICAÇÃO ---

    // URL para o endpoint de status da API-Football (o mesmo de antes)
    const url = 'https://v3.football.api-sports.io/status';

    console.log("INFO: Chamando API-Football com URL:", url);

    const response = await fetch(url, {
      headers: {
        'x-apisports-key': API_KEY, // Para API-Football, a chave vai no cabeçalho
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERRO: Resposta da API-Football com status ${response.status}: ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Erro na API-Football (HTTP ${response.status}): ${errorText}` }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const data = await response.json();

    // Log para ver a resposta completa da API-Football
    console.log("SUCESSO: Dados completos recebidos da API-Football e sendo retornados pela função:", JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("ERRO: Erro inesperado na execução da função Netlify (API-Football):", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno da função: ' + (error.message || error.toString() || 'Erro desconhecido.') }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
