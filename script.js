document.addEventListener("DOMContentLoaded", () => {
  const divStatus = document.getElementById("status-api");
  const jogosDestaqueContainer = document.getElementById("jogos-destaque");

  // Carrega os jogos do dia ao iniciar
  carregarJogosDoDia();

  async function carregarJogosDoDia() {
    divStatus.textContent = "🟡 Carregando jogos do dia...";
    divStatus.style.backgroundColor = "#fff3cd"; // amarelo claro

    try {
      // Ajuste aqui a data fixa ou dinâmica: YYYY-MM-DD
      const hoje = new Date().toISOString().split("T")[0];
      const url = `/.netlify/functions/dados-esportes?endpoint=fixtures&date=${hoje}`;

      console.log("Buscando fixtures em:", url);
      const res = await fetch(url);

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Status ${res.status}: ${body}`);
      }

      const data = await res.json();
      console.log("Resposta da Netlify Function:", data);

      // Garante que encontre um array de partidas em data.response
      const partidas = Array.isArray(data.response) ? data.response : [];

      if (partidas.length === 0) {
        divStatus.textContent = "⚠️ Nenhum jogo encontrado para hoje.";
        divStatus.style.backgroundColor = "#fff3cd";
        jogosDestaqueContainer.innerHTML = "";
        return;
      }

      // Exibe sucesso
      divStatus.textContent = "✅ Jogos carregados com sucesso!";
      divStatus.style.backgroundColor = "#d4edda"; // verde claro

      // Monta a lista de jogos
      jogosDestaqueContainer.innerHTML = ""; 
      partidas.forEach(jogo => {
        const casa = jogo.teams.home.name;
        const fora = jogo.teams.away.name;
        const golsCasa = jogo.goals.home ?? 0;
        const golsFora = jogo.goals.away ?? 0;

        const jogoEl = document.createElement("div");
        jogoEl.className = "jogo";
        jogoEl.innerHTML = `
          <span class="time-casa">${casa}</span>
          <span class="placar">${golsCasa} x ${golsFora}</span>
          <span class="time-fora">${fora}</span>
        `;
        jogosDestaqueContainer.appendChild(jogoEl);
      });

    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      divStatus.textContent = `❌ Falha ao carregar jogos: ${error.message}`;
      divStatus.style.backgroundColor = "#f8d7da"; // vermelho claro
    }
  }
});