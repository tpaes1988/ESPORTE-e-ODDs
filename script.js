document.addEventListener('DOMContentLoaded', function() {
    const divStatus = document.getElementById('api-status');
    const dropdownLigas = document.getElementById('dropdown-ligas');
    const jogosDestaqueContainer = document.getElementById('jogos-destaque');

    // Função para testar a conexão com a API segura via Netlify Function
    async function testarConexaoAPISegura() {
        divStatus.innerHTML = '🟡 Testando conexão com a API-Football...'; // Mensagem AGORA correta para API-Football
        divStatus.style.backgroundColor = '#fff3cd'; // Amarelo
        try {
            // URL da sua função Netlify (não muda)
            const urlFuncaoSegura = '/.netlify/functions/dados-esportes';
            console.log("Chamando função Netlify em:", urlFuncaoSegura);

            const response = await fetch(urlFuncaoSegura);

            // Verificar se a resposta da função Netlify foi OK antes de tentar parsear
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Erro da função Netlify (status: ${response.status}): ${errorBody}`);
            }

            const data = await response.json();
            console.log("Resposta recebida da nossa função segura (API-Football):", data);

            // === LÓGICA CORRETA PARA A ESTRUTURA DA API-FOOTBALL ===
            // A API-Football retorna 'response.active' e 'response.plan' no endpoint de status
            if (data && data.response && data.response.active) {
                const plan = data.response.plan;
                divStatus.innerHTML = `✅ **SUCESSO!** Conexão segura com a API-Football funciona! Plano: ${plan}.`;
                divStatus.style.backgroundColor = '#d4edda'; // Verde
            } else {
                // Se a estrutura não for a esperada ou o 'response.active' não for true
                console.error("Dados da API-Football inesperados ou 'response.active' não é true. Resposta:", data);
                // Verifica se há erros específicos da API-Football na resposta
                if (data && data.errors && Object.keys(data.errors).length > 0) { // Alterado para Object.keys
                    const errorKeys = Object.keys(data.errors);
                    const firstError = data.errors[errorKeys[0]]; // Pega a mensagem do primeiro erro
                    throw new Error(`Erro da API-Football: ${firstError}`);
                } else {
                    throw new Error('A resposta da API-Football indica um problema ou os dados estão vazios/inválidos.');
                }
            }
        } catch (error) {
            console.error("FALHA na chamada para a função segura (frontend):", error);
            divStatus.innerHTML = `❌ **FALHA!** Não foi possível conectar com a API-Football. Verifique o código da função ou o log no Netlify. Detalhes: ${error.message}`;
            divStatus.style.backgroundColor = '#f8d7da'; // Vermelho
        }
    }

    // Chama a função ao carregar a página
    testarConexaoAPISegura();

    // ... (restante do código para o dropdown e jogos em destaque, se houver)
});
