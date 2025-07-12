// Arquivo: script.js

// Função para testar a conexão através do nosso intermediário seguro no Netlify
async function testarConexaoAPISegura() {
  const divStatus = document.getElementById("status-api");
  console.log("Iniciando teste de conexão via função segura do Netlify...");
  divStatus.innerHTML = "Testando conexão com a API...";
  divStatus.style.backgroundColor = '#e2e3e5'; // Cinza

  // 1. O URL agora aponta para a NOSSA função segura no Netlify.
  //    É sempre o mesmo caminho.
  const urlFuncaoSegura = "/.netlify/functions/dados-esportes";

  try {
    // 2. Fazemos a chamada SEM a chave de API. A chave está segura no servidor.
    const response = await fetch(urlFuncaoSegura);
    const data = await response.json();
    console.log("Resposta recebida da nossa função segura:", data);

    // 3. Verificamos a resposta que a nossa função nos encaminhou.
    //    (A estrutura de 'data' é a mesma da API original, pois nossa função só a repassou)
    if (data.results > 0 && data.response.account) {
      divStatus.innerHTML = `✅ **SUCESSO!** Conexão segura com a API funciona! Plano: ${data.response.subscription.plan}.`;
      divStatus.style.backgroundColor = '#d4edda'; // Verde
    } else {
       // Se a API retornou um erro (ex: chave inválida), nossa função vai repassá-lo.
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