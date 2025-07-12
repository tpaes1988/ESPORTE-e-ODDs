// Arquivo: /netlify/functions/dados-esportes.js
// VERSÃO MELHORADA PARA DIAGNÓSTICO

exports.handler = async function(event, context) {
    console.log("INFO: Função 'dados-esportes' iniciada.");

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        console.error("ERRO GRAVE: A variável de ambiente API_KEY não foi encontrada no Netlify!");
        return { statusCode: 500, body: JSON.stringify({ error: "Chave de API não configurada no servidor." }) };
    }

    // Vamos usar o endpoint /status, que é mais simples para testar a chave.
    const url = 'https://v3.football.api-sports.io/status';

    const options = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY
        }
    };

    try {
        console.log("INFO: Tentando fazer a chamada (fetch) para a API de Esportes...");
        const response = await fetch(url, options);
        console.log(`INFO: A API respondeu com o status: ${response.status} ${response.statusText}`);

        const data = await response.json();

        // Se a API retornou um erro (ex: chave inválida), os detalhes estarão em 'data.errors'
        if (!response.ok || (data.errors && Object.keys(data.errors).length > 0)) {
            console.error("ERRO: A API de Esportes retornou uma mensagem de erro:", JSON.stringify(data.errors));
            throw new Error('A API retornou um erro. Verifique a chave ou sua assinatura.');
        }

        console.log("SUCESSO: Dados recebidos da API e sendo enviados para o site.");
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("ERRO FATAL na execução da função:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Falha na execução da função: ${error.message}` })
        };
    }
};