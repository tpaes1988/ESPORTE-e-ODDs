// Arquivo: /netlify/functions/dados-esportes.js
// VERSÃO FINAL: Lida com diferentes endpoints e parâmetros

exports.handler = async function(event, context) {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: "Chave de API não configurada no servidor." }) };
    }

    // 1. Pega os parâmetros que o script.js enviou (endpoint, date, etc.)
    const params = event.queryStringParameters;
    const endpoint = params.endpoint || 'status'; // Se não vier endpoint, usa 'status' como padrão

    // 2. Monta a URL da API de Esportes dinamicamente
    let apiUrl = `https://v3.football.api-sports.io/${endpoint}`;
    
    // Adiciona outros parâmetros na URL, como a data
    const urlParams = new URLSearchParams();
    for (const key in params) {
        if (key !== 'endpoint') {
            urlParams.append(key, params[key]);
        }
    }
    if (urlParams.toString()) {
        apiUrl += `?${urlParams.toString()}`;
    }

    const options = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY
        }
    };

    try {
        console.log(`INFO: Chamando a API externa em: ${apiUrl}`);
        const response = await fetch(apiUrl, options);
        const data = await response.json();

        if (!response.ok || (data.errors && Object.keys(data.errors).length > 0)) {
             console.error("ERRO da API de Esportes:", JSON.stringify(data.errors || data));
             throw new Error('A API de Esportes retornou um erro.');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("ERRO FATAL na função:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Falha na execução da função: ${error.message}` })
        };
    }
};