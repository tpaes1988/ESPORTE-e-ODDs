// FUNÇÃO DE TESTE DEFINITIVO
async function testarConexaoAPI() {
  const divStatus = document.getElementById("status-api");
  console.log("Iniciando teste de conexão direta com a NOVA CHAVE...");

  const url = `https://v3.football.api-sports.io/status`;

  // AQUI ESTÁ A MUDANÇA COM SUA NOVA CHAVE.
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': "acc6b157e5991013cbc872eb6c31c583", 
      'x-rapidapi-host': 'v3.football.api-sports.io'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Resposta do teste de status:", data);

    if (data.results > 0 && data.response.account) {
      divStatus.innerHTML = `✅ **SUCESSO!** A nova chave funciona perfeitamente! Assinatura: ${data.response.subscription.plan}.`;
      divStatus.style.backgroundColor = '#d4edda'; // Verde
    } else {
       throw new Error('A resposta da API indica um problema na chave.');
    }
  } catch (error) {
    console.error("FALHA no teste de conexão:", error);
    divStatus.innerHTML = `❌ **FALHA!** Mesmo a nova chave não funcionou. O problema pode ser na sua conta ou um bloqueio temporário.`;
    divStatus.style.backgroundColor = '#f8d7da'; // Vermelho
  }
}
// QUANDO A PÁGINA CARREGAR...
document.addEventListener("DOMContentLoaded", () => {
  // AGORA CHAMANDO A FUNÇÃO CORRETA QUE USA A SUA NOVA CHAVE
  testarConexaoAPI(); 
});