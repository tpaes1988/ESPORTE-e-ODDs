exports.handler = async (event, context) => {
  try {
    const API_KEY = process.env.THESPORTSDB_API_KEY;

    // --- NOVO: Verificação crucial para a chave da API ---
    if (!API_KEY) {
      console.error("ERRO CRÍTICO: THESPORTSDB_API_KEY não está configurada nas variáveis de ambiente do Netlify.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erro interno da função: Chave da API TheSportsDB não configurada no Netlify." }),
        headers: { "Content-Type": "application/json" },
      };
    }
    // --- FIM DA VERIFICAÇÃO ---

    // 2. Define o URL para o endpoint de "todas as ligas" do TheSportsDB
    const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/all_leagues.php`;

    console.log("INFO: Tentando chamar TheSportsDB com URL:", url); // Para debug nos logs do Netlify

    const response = await fetch(url);

    // 3. Verifica se a resposta HTTP da TheSportsDB foi bem-sucedida (status 2xx)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERRO: Resposta da API TheSportsDB com status ${response.status}: ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Erro na API TheSportsDB (HTTP ${response.status}): ${errorText}` }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const data = await response.json(); // Tenta converter a resposta para JSON

    // 4. Loga a resposta COMPLETA da TheSportsDB para debug
    console.log("SUCESSO: Dados completos recebidos da TheSportsDB e sendo retornados pela função:", JSON.stringify(data, null, 2));

    // 5. Retorna os dados crus (já em JSON stringificado) para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    };

  } catch (error) {
    console.error("ERRO: Erro inesperado na execução da função Netlify (TheSportsDB):", error);
    // Melhoria para garantir que a mensagem de erro sempre seja útil
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno da função: ' + (error.message || error.toString() || 'Erro desconhecido.') }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
