document.addEventListener("DOMContentLoaded", () => {
  const divStatus = document.getElementById("status-api");
  const jogosDestaqueContainer = document.getElementById("jogos-destaque");

  carregarJogosDoDia();

  async function carregarJogosDoDia() {
    divStatus.textContent = "🟡 Carregando jogos do dia...";
    divStatus.style.backgroundColor = "#fff3cd";

    try {
      const hoje = new Date().toISOString().split("T")[0];
      const url = `/api/dados-esportes?endpoint=fixtures&date=${hoje}`;

      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Status ${res.status}: ${body}`);
      }

      const data = await res.json();
      const partidas = Array.isArray(data.response) ? data.response : [];

      if (partidas.length === 0) {
        divStatus.textContent = "⚠️ Nenhum jogo encontrado para hoje.";
        divStatus.style.backgroundColor = "#fff3cd";
        jogosDestaqueContainer.innerHTML = "";
        return;
      }

      divStatus.textContent = "✅ Jogos carregados com sucesso!";
      divStatus.style.backgroundColor = "#d4edda";

      jogosDestaqueContainer.innerHTML = "";
      partidas.forEach(jogo => {
        const casa = jogo.teams.home.name;
        const fora = jogo.teams.away.name;
        const golsCasa = jogo.goals.home ?? "-";
        const golsFora = jogo.goals.away ?? "-";

        const jogoEl = document.createElement("div");
jogoEl.className = "jogo-card"; // <- MUDANÇA IMPORTANTE! Usando a nova classe.
jogoEl.innerHTML = `
  <span class="time-casa">${casa}</span>
  <span class="placar">${golsCasa} x ${golsFora}</span>
  <span class="time-fora">${fora}</span>
  
  <!-- O BOTÃO DE ODDS -->
  <button class="btn-odds" data-fixture-id="${jogo.fixture.id}">Ver Odds</button>
  
  <!-- Um espaço reservado para exibir as odds depois -->
  <div class="odds-container" style="display: none;"></div> 
`;
        jogosDestaqueContainer.appendChild(jogoEl);
      });

    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      divStatus.textContent = `❌ Falha ao carregar jogos: ${error.message}`;
      divStatus.style.backgroundColor = "#f8d7da";
    }
  }
});   
// script.js (Substituir o addEventListener pelo código abaixo)

// Pega a referência do nosso novo painel de diagnóstico
const debugConsole = document.getElementById("debug-console");

function logToPage(message) {
  debugConsole.innerHTML += message + "\n"; // Adiciona a mensagem e uma nova linha
}

// VERSÃO FINAL DE DIAGNÓSTICO (ESCREVE NA PÁGINA)
jogosDestaqueContainer.addEventListener("click", async (event) => {
  logToPage("INFO: Clique detectado no container de jogos!");

  if (event.target.matches(".btn-odds")) {
    logToPage("INFO: Botão 'Ver Odds' foi clicado!");
    
    const botao = event.target;
    const fixtureId = botao.dataset.fixtureId;
    logToPage(`INFO: ID da Partida encontrado: ${fixtureId}`);

    if (!fixtureId) {
      logToPage("ERRO: Não foi possível encontrar o fixtureId no botão!");
      return;
    }

    const cardDoJogo = botao.closest(".jogo-card");
    const oddsContainer = cardDoJogo.querySelector(".odds-container");
    logToPage("INFO: Container para as odds encontrado.");
    
    oddsContainer.style.display = "block";
    oddsContainer.innerHTML = "Buscando odds...";
    
    try {
      const url = `/api/dados-esportes?endpoint=odds&fixtureId=${fixtureId}`;
      logToPage(`INFO: Fazendo chamada para a API em: ${url}`);

      const res = await fetch(url);
      const data = await res.json();

      if (data.response && data.response.length > 0 && data.response[0].bookmakers.length > 0) {
        const bookmaker = data.response[0].bookmakers[0];
        const oddsVitoriaCasa = bookmaker.bets[0].values.find(v => v.value === "Home")?.odd || 'N/A';
        const oddsEmpate = bookmaker.bets[0].values.find(v => v.value === "Draw")?.odd || 'N/A';
        const oddsVitoriaFora = bookmaker.bets[0].values.find(v => v.value === "Away")?.odd || 'N/A';

        oddsContainer.innerHTML = `
          <strong>${bookmaker.name}:</strong> 
          Casa: ${oddsVitoriaCasa} | 
          Empate: ${oddsEmpate} | 
          Fora: ${oddsVitoriaFora}
        `;
        logToPage("SUCESSO: Odds exibidas na página.");
      } else {
        oddsContainer.innerHTML = "Odds não disponíveis para este jogo.";
        logToPage("AVISO: A API não retornou odds para este jogo.");
      }
    } catch (error) {
      oddsContainer.innerHTML = "Erro ao buscar odds.";
      logToPage(`ERRO DETALHADO: ${error.message}`);
    }
  }
});