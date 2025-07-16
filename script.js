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
  console.log("CLIQUE DETECTADO NO CONTAINER DE JOGOS!"); // Pista 1: O ouvinte está ativo?

  if (event.target.matches(".btn-odds")) {
    console.log("BOTÃO 'Ver Odds' FOI CLICADO!"); // Pista 2: Ele reconheceu o botão?
    
    const botao = event.target;
    const fixtureId = botao.dataset.fixtureId;
    console.log("ID da Partida (Fixture ID) encontrado:", fixtureId); // Pista 3: Ele achou o ID?

    if (!fixtureId) {
      console.error("ERRO GRAVE: Não foi possível encontrar o fixtureId no botão!");
      return; // Para a execução se não houver ID
    }

    const cardDoJogo = botao.closest(".jogo-card");
    const oddsContainer = cardDoJogo.querySelector(".odds-container");
    console.log("Container para as odds encontrado:", oddsContainer); // Pista 4: Ele achou onde escrever?
    
    oddsContainer.style.display = "block";
    oddsContainer.innerHTML = "Buscando odds...";
    
    try {
      const url = `/api/dados-esportes?endpoint=odds&fixtureId=${fixtureId}`;
      console.log("Fazendo chamada para a API em:", url); // Pista 5: A URL está correta?

      const res = await fetch(url);
      const data = await res.json();

      if (data.response && data.response.length > 0 && data.response[0].bookmakers.length > 0) {
        const bookmaker = data.response[0].bookmakers[0];
        const oddsVitoriaCasa = bookmaker.bets[0].values.find(v => v.value === "Home").odd;
        const oddsEmpate = bookmaker.bets[0].values.find(v => v.value === "Draw").odd;
        const oddsVitoriaFora = bookmaker.bets[0].values.find(v => v.value === "Away").odd;

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
      console.error("Erro detalhado ao buscar odds:", error);
    }
  }
});