// ... (código anterior da função testarConexaoAPISegura)

        const response = await fetch(urlFuncaoSegura);

        // Verificar se a resposta da função Netlify foi OK antes de tentar parsear
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro da função Netlify (status: ${response.status}): ${errorBody}`);
        }

        const data = await response.json();
        console.log("Resposta recebida da nossa função segura (TheSportsDB):", data); // CONTINUA SENDO MUITO ÚTIL!

        // === ALTERAÇÃO AQUI PARA A NOVA ESTRUTURA DO THESPORTSDB ===
        // O TheSportsDB retorna um array 'leagues' se a chamada for bem-sucedida para 'all_leagues.php'
        if (data && data.leagues && Array.isArray(data.leagues) && data.leagues.length > 0) {
            const primeiraLiga = data.leagues[0].strLeague; // Pega o nome da primeira liga para exibir
            divStatus.innerHTML = `✅ **SUCESSO!** Conexão segura com a API TheSportsDB funciona! Primeira Liga: ${primeiraLiga}.`;
            divStatus.style.backgroundColor = '#d4edda'; // Verde
        } else {
            // Se a estrutura não for a esperada ou o array 'leagues' estiver vazio
            console.error("Dados da TheSportsDB inesperados ou vazios. Resposta:", data);
            throw new Error('A resposta da API TheSportsDB indica um problema, os dados estão vazios ou a chave está inválida.');
        }
    } catch (error) {
        console.error("FALHA na chamada para a função segura (frontend):", error);
        divStatus.innerHTML = `❌ **FALHA!** Não foi possível conectar com a API TheSportsDB. Verifique o código da função ou o log no Netlify. Detalhes: ${error.message}`;
        divStatus.style.backgroundColor = '#f8d7da'; // Vermelho
    }
}

// ... (restante do código, o addEventListener permanece o mesmo)
