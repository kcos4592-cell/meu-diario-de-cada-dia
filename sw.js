// Executa assim que a página termina de carregar
document.addEventListener("DOMContentLoaded", () => {
    carregarHistorico();
});

// Função para salvar a nova linha do diário
function salvarMemoria() {
    const campoTexto = document.getElementById("texto-diario");
    const texto = campoTexto.value.trim();

    if (texto === "") {
        alert("Escreva algo antes de salvar!");
        return;
    }

    // Pega a data e hora atual formatada
    const dataAtual = new Date().toLocaleString("pt-BR");

    // Cria um objeto com a nova memória
    const novaMemoria = {
        data: dataAtual,
        conteudo: texto
    };

    // Pega as memórias antigas já salvas ou cria uma lista vazia
    let memoriasSalvas = JSON.parse(localStorage.getItem("meu_diario_memorias")) || [];

    // Adiciona a nova memória no topo da lista
    memoriasSalvas.unshift(novaMemoria);

    // Salva a lista atualizada de volta no navegador do usuário
    localStorage.setItem("meu_diario_memorias", JSON.stringify(memoriasSalvas));

    // Limpa o campo de texto e atualiza a tela
    campoTexto.value = "";
    carregarHistorico();
}

// Função para exibir as memórias salvas na tela
function carregarHistorico() {
    const container = document.getElementById("historico-memorias");
    let memoriasSalvas = JSON.parse(localStorage.getItem("meu_diario_memorias")) || [];

    if (memoriasSalvas.length === 0) {
        container.innerHTML = "<p>Nenhuma memória registrada ainda. Comece a escrever!</p>";
        return;
    }

    // Monta o visual de cada bloco de texto salvo
    container.innerHTML = memoriasSalvas.map(memoria => `
        <div class="bloco-memoria">
            <small>📅 ${memoria.data}</small>
            <p>${memoria.conteudo.replace(/\n/g, '<br>')}</p>
        </div>
    `).join("");
}
