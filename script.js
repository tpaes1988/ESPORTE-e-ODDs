
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. PEGA AS REFERÊNCIAS DOS ELEMENTOS HTML ---
  const divStatus = document.getElementById("status-api");
  const jogosDestaqueContainer = document.getElementById("jogos-destaque");
  const debugConsole = document.getElementById("debug-console");

  // --- 2. FUNÇÃO PARA ESCREVER NO NOSSO PAINEL DE DIAGNÓSTICO ---
  function logToPage(message) {
    if (debugConsole) {
      debugConsole.innerHTML += message + "\n";
    }
  }

  // --- 3. FUNÇÃO PRINCIPAL PARA CARREGAR OS JOGOS ---
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
        return;
      }

      divStatus.textContent = "✅ Jogos carregados com sucesso!";
      divStatus.style.backgroundColor = "#d4edda";
      
      jogosDestaqueContainer.innerHTML = '<h2>Jogos de Hoje</h2>'; // Limpa e adiciona o título
      partidas.forEach(jogo => {
        const casa = jogo.teams.home.name;
        const fora = jogo.teams.away.name;
        const golsCasa = jogo.goals.home ?? "-";
        const golsFora = jogo.goals.away ?? "-";

        const jogoEl = document.createElement("div");
        jogoEl.className = "jogo-card";
<button class="btn-apostar" data-fixture-id="${jogo.fixture.id}">Onde Apostar?</button>
        jogosDestaqueContainer.appendChild(jogoEl);
      });

    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      divStatus.textContent = `❌ Falha ao carregar jogos: ${error.message}`;
      divStatus.style.backgroundColor = "#f8d7da";
    }
  }
// script.js

// --- Pega as referências dos elementos do Modal ---
const modal = document.getElementById("modal-apostas");
const spanFechar = document.querySelector(".fechar-modal");
const listaCasasAposta = document.getElementById("lista-casas-aposta");

// --- Lógica para ABRIR o modal ---
jogosDestaqueContainer.addEventListener("click", (event) => {
  if (event.target.matches(".btn-apostar")) {
    // Seus links de afiliado
    const linksAfiliados = [
      { nome: "Bet365", url: "SEU_LINK_DE_AFILIADO_DA_BET365" },
      { nome: "Betano", url: "SEU_LINK_DE_AFILIADO_DA_BETANO" },
      { nome: "Outra Casa", url: "SEU_LINK_DE_AFILIADO_DE_OUTRA" }
    ];

    // Limpa a lista anterior e preenche com os novos links
    listaCasasAposta.innerHTML = "";
    linksAfiliados.forEach(link => {
      const linkEl = document.createElement("a");
      linkEl.href = link.url;
      linkEl.textContent = `Apostar na ${link.nome}`;
      linkEl.target = "_blank"; // Abre em nova aba
      linkEl.className = "link-aposta"; // Para estilizar depois
      listaCasasAposta.appendChild(linkEl);
    });

    modal.style.display = "block"; // Mostra o modal!
  }
});

// --- Lógica para FECHAR o modal ---
spanFechar.onclick = () => {
  modal.style.display = "none";
}
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}