// Arquivo: /netlify/functions/dados-esportes.js
// VERSÃO FINAL CORRIGIDA: Garante a inclusão do parâmetro "season"

exports.handler = async function(event, context) {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: "Chave de API não configurada no servidor." }) };
    }

    const params = event.queryStringParameters;
    const endpoint = params.endpoint || 'status';

    let apiUrl = `https://v3.football.api-sports.io/${endpoint}`;
    
    // Constrói a URL de parâmetros dinamicamente
    const urlParams = new URLSearchParams();
    for (const key in params) {
        if (key !== 'endpoint') {
            urlParams.append(key, params[key]);
        }
    }
    
    // **A CORREÇÃO CRÍTICA ESTÁ AQUI**
    // Se uma liga for especificada, adiciona a temporada (ano atual), que é obrigatória.
    if (params.league) {
        const anoAtual = new Date().getFullYear();
        urlParams.append('season', anoAtual.toString());
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
        console.log(`INFO: Chamando a API externa em: ${apiUrl}`); // Este log agora nos mostrará a URL completa
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