
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. REFERÊNCIAS DOS ELEMENTOS HTML ---
  const divStatus = document.getElementById("status-api");
  const jogosDestaqueContainer = document.getElementById("jogos-destaque");
  const seletorLiga = document.getElementById("seletor-liga"); // Nosso novo seletor!
  const modal = document.getElementById("modal-apostas");
  const spanFechar = document.querySelector(".fechar-modal");
  const listaCasasAposta = document.getElementById("lista-casas-aposta");

  // --- 2. FUNÇÃO PARA CARREGAR OS JOGOS (AGORA MAIS INTELIGENTE) ---
  async function carregarJogos(ligaId) { // Agora ela recebe o ID da liga!
    divStatus.textContent = "🟡 Carregando jogos...";
    jogosDestaqueContainer.innerHTML = ''; // Limpa a lista de jogos antiga

    try {
      const hoje = new Date().toISOString().split("T")[0];
      // A URL agora inclui o ID da liga que foi escolhido!
      const url = `/api/dados-esportes?endpoint=fixtures&date=${hoje}&league=${ligaId}`;

      const res = await fetch(url);
      if (!res.ok) { throw new Error(`Erro na API: ${res.statusText}`); }

      const data = await res.json();
      const partidas = data.response || [];

      if (partidas.length === 0) {
        divStatus.textContent = "⚠️ Nenhum jogo encontrado para hoje nesta liga.";
        return;
      }

      divStatus.textContent = "✅ Jogos carregados com sucesso!";
      
      jogosDestaqueContainer.innerHTML = '<h2>Jogos de Hoje</h2>'; 
      partidas.forEach(jogo => {
        // ... (O código para criar os cards dos jogos continua exatamente o mesmo de antes) ...
        const casa = jogo.teams.home.name;
        const fora = jogo.teams.away.name;
        const golsCasa = jogo.goals.home ?? "-";
        const golsFora = jogo.goals.away ?? "-";
        const jogoEl = document.createElement("div");
        jogoEl.className = "jogo-card";
        jogoEl.innerHTML = `
          <span class="time-casa"><img src="${jogo.teams.home.logo}" alt="Escudo do ${casa}" class="escudo-time"><span>${casa}</span></span>
          <span class="placar">${golsCasa} x ${golsFora}</span>
          <span class="time-fora"><span>${fora}</span><img src="${jogo.teams.away.logo}" alt="Escudo do ${fora}" class="escudo-time"></span>
          <button class="btn-apostar" data-fixture-id="${jogo.fixture.id}">Onde Apostar?</button>
        `;
        jogosDestaqueContainer.appendChild(jogoEl);
      });

    } catch (error) {
      divStatus.textContent = `❌ Falha ao carregar jogos.`;
    }
  }

  // --- 3. LÓGICA DO FILTRO E DO MODAL ---
  
  // OUVINTE DE EVENTOS PARA O SELETOR DE LIGAS
  seletorLiga.addEventListener("change", () => {
    const ligaIdSelecionada = seletorLiga.value; // Pega o ID da liga escolhida
    carregarJogos(ligaIdSelecionada); // Chama a função para carregar os jogos da nova liga
  });
  
  // OUVINTE DE EVENTOS PARA O MODAL (código igual ao anterior)
  jogosDestaqueContainer.addEventListener("click", (event) => {
      if (event.target.matches(".btn-apostar")) {
        // ... (toda a lógica para abrir e preencher o modal continua aqui, sem alterações) ...
        const linksAfiliados = [
          { nome: "Bet365", url: "#" },
          { nome: "Betano", url: "#" },
          { nome: "Outra Casa", url: "#" }
        ];
        listaCasasAposta.innerHTML = "";
        linksAfiliados.forEach(link => {
          const linkEl = document.createElement("a");
          linkEl.href = link.url;
          linkEl.textContent = `Apostar na ${link.nome}`;
          linkEl.target = "_blank";
          linkEl.className = "link-aposta";
          listaCasasAposta.appendChild(linkEl);
        });
        modal.style.display = "block";
      }
    });

    spanFechar.onclick = () => { modal.style.display = "none"; }
    window.onclick = (event) => { if (event.target == modal) { modal.style.display = "none"; } }

  // --- 4. INICIA TUDO ---
  // Carrega a primeira liga da lista (Brasileirão) assim que a página abrir.
  carregarJogos(seletorLiga.value);

});