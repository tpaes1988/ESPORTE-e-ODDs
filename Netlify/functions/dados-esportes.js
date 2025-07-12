// Arquivo: /netlify/functions/dados-esportes.js

exports.handler = async function(event, context) {
    // 1. Pega a chave secreta que você salvou no Netlify.
    const API_KEY = process.env.API_KEY;

    // 2. Define a URL completa da API.
    //    (Estou usando o endpoint '/leagues' como exemplo. Você pode mudar para '/teams', '/fixtures', etc.)
    const url = 'https://v3.football.api-sports.io/leagues';

    // 3. Monta as opções para a requisição, incluindo a chave no cabeçalho (header).
    const options = {
        method: 'GET',
        headers: {
            'x-apisports-key': API_KEY
        }
    };

    try {
        // 4. Faz a chamada para a API com a URL e as opções.
        const response = await fetch(url, options);
        const data = await response.json();

        // 5. Retorna os dados com sucesso.
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        // 6. Retorna um erro se algo der errado.
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Falha ao buscar dados da API" })
        };
    }
};