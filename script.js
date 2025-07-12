// Função para testar a conexão através do nosso intermediário seguro no Netlify
async function testarConexaoAPISegura() {
    const divStatus = document.getElementById("status-api");
    console.log("Iniciando teste de conexão via função segura do Netlify...");
    divStatus.innerHTML = "Testando conexão com a API...";
    divStatus.style.backgroundColor = '#e2e3e5'; // Cinza

    // O URL agora aponta para a NOSSA função segura no Netlify.
    const urlFuncaoSegura = "/.netlify/functions/dados-esportes";

    try {
        // Fazemos a chamada SEM a chave de API. A chave está segura no servidor.
        const response = await fetch(urlFuncaoSegura);
        const data = await response.json();
        console.log("Resposta recebida da nossa função segura:", data);

        // Verificamos a resposta que a nossa função nos encaminhou.
        if (data && data.response && data.response.active) {
            const plano = data.response.plan || "desconhecido";
            divStatus.innerHTML = `✅ **SUCESSO!** Conexão segura com a API funciona! Plano: ${plano}.`;
            divStatus.style.backgroundColor = '#d4edda'; // Verde
        } else {
            throw new Error('A resposta da API indica um problema. Verifique a chave no Netlify.');
        }
    } catch (error) {
        console.error("FALHA na chamada para a função segura:", error);
        divStatus.innerHTML = `❌ **FALHA!** Não foi possível conectar com a API. Verifique o código da função ou o log no Netlify.`;
        divStatus.style.backgroundColor = '#f8d7da'; // Vermelho
    }
}

// QUANDO A PÁGINA CARREGAR...
document.addEventListener("DOMContentLoaded", () => {
    // Chamamos a nossa nova função segura.
    testarConexaoAPISegura();
});