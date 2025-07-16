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
jogosDestaqueContainer.addEventListener("click", async (event) => {
  // Verifica se o que foi clicado foi um botão com a classe 'btn-odds'
  if (event.target.matches(".btn-odds")) {
    const botao = event.target;
    const fixtureId = botao.dataset.fixtureId; // Pega o ID que guardamos no botão!
    
    // Pega o card inteiro do jogo (o elemento 'pai' do botão)
    const cardDoJogo = botao.closest(".jogo-card"); 
    const oddsContainer = cardDoJogo.querySelector(".odds-container");

    // Mostra uma mensagem de "carregando"
    oddsContainer.style.display = "block";
    oddsContainer.innerHTML = "Buscando odds...";
    
    // Faz a chamada para a nossa função da Netlify
    try {
      const url = `/api/dados-esportes?endpoint=odds&fixtureId=${fixtureId}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.response && data.response.length > 0) {
        // Pega as odds da primeira casa de aposta que a API retornar (ex: Bet365)
        const bookmaker = data.response[0].bookmakers[0];
        const oddsVitoriaCasa = bookmaker.bets[0].values[0].odd;
        const oddsEmpate = bookmaker.bets[0].values[1].odd;
        const oddsVitoriaFora = bookmaker.bets[0].values[2].odd;

        // Exibe as odds formatadas
        oddsContainer.innerHTML = `
          <strong>${bookmaker.name}:</strong> 
          Casa: ${oddsVitoriaCasa} | 
          Empate: ${oddsEmpate} | 
          Fora: ${oddsVitoriaFora}
        `;
      } else {
        oddsContainer.innerHTML = "Odds não disponíveis para este jogo.";
      }
    } catch (error) {
      oddsContainer.innerHTML = "Erro ao buscar odds.";
      console.error("Erro ao buscar odds:", error);
    }
  }
});