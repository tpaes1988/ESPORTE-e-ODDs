exports.handler = async (event, context) => {
  try {
    // 1. Usa a nova variável de ambiente para a chave do TheSportsDB
    const API_KEY = process.env.THESPORTSDB_API_KEY;

    // 2. Define o URL para o endpoint de "todas as ligas" do TheSportsDB
    //    A chave de API vai diretamente na URL para este tipo de endpoint
    const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/all_leagues.php`;

    console.log("INFO: Chamando TheSportsDB com URL:", url); // Para debug nos logs do Netlify

    const response = await fetch(url);

    // 3. Verifica se a resposta HTTP da TheSportsDB foi bem-sucedida (status 2xx)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERRO: Resposta da API TheSportsDB com status ${response.status}: ${errorText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Erro na API TheSportsDB: ${response.status} - ${errorText}` }),
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
    console.error("ERRO: Erro na execução da função Netlify (TheSportsDB):", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno da função: ' + error.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
