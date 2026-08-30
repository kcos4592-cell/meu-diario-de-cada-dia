document.addEventListener("DOMContentLoaded", function() {
  let bancoDeDados;
  const conexaoIDB = indexedDB.open("DiarioGrupoJovens", 1);

  conexaoIDB.onupgradeneeded = function(evento) {
    bancoDeDados = evento.target.result;
    if (!bancoDeDados.objectStoreNames.contains("perfil")) {
      bancoDeDados.createObjectStore("perfil");
    }
    if (!bancoDeDados.objectStoreNames.contains("memorias")) {
      bancoDeDados.createObjectStore("memorias", { keyPath: "id", autoIncrement: true });
    }
  };

  conexaoIDB.onsuccess = function(evento) {
    bancoDeDados = evento.target.result;
    executarCargaDoPerfil();
    executarCargaDasMemorias();
  };

  conexaoIDB.onerror = function() {
    console.error("Erro critico ao tentar abrir o banco de dados IndexedDB local.");
  };

  let humorSelecionado Atualmente = "😊";
  const botoesDeHumor = document.querySelectorAll('.mood-btn');
  
  botoesDeHumor.forEach(function(botao) {
    botao.addEventListener('click', function() {
      botoesDeHumor.forEach(function(b) {
        b.classList.remove('active');
      });
      botao.classList.add('active');
      humorSelecionadoAtualmente = botao.getAttribute('data-mood');
    });
  });

  const gatilhoDoPerfil = document.getElementById('profile-trigger');
  if (gatilhoDoPerfil) {
    gatilhoDoPerfil.addEventListener('click', function() {
      document.getElementById('profile-file').click();
    });
  }

  let imagemDaMemoriaBase64 = "";
  const campoArquivoMemoria = document.getElementById('memory-file');
  
  campoArquivoMemoria.addEventListener('change', function(evento) {
    const listaArquivos = evento.target.files;
    if (listaArquivos && listaArquivos[0]) {
      const leitorArquivos = new FileReader();
      leitorArquivos.onload = function(eventoLeitura) {
        imagemDaMemoriaBase64 = eventoLeitura.target.result;
        const preVisualizacaoImg = document.getElementById('image-preview');
        preVisualizacaoImg.src = imagemDaMemoriaBase64;
        preVisualizacaoImg.style.display = "block";
      };
      leitorArquivos.readAsDataURL(listaArquivos[0]);
    }
  });

  const campoArquivoPerfil = document.getElementById('profile-file');
  campoArquivoPerfil.addEventListener('change', function(evento) {
    const listaArquivosPerfil = evento.target.files;
    if (listaArquivosPerfil && listaArquivosPerfil[0]) {
      const leitorPerfil = new FileReader();
      leitorPerfil.onload = function(eventoLeituraPerfil) {
        const resultadoBase64 = eventoLeituraPerfil.target.result;
        gravarItemNoPerfil("foto", resultadoBase64);
        renderizarFotoPerfil(resultadoBase64);
      };
      leitorPerfil.readAsDataURL(listaArquivosPerfil[0]);
    }
  });

  const campoNomePerfil = document.getElementById('profile-name');
  campoNomePerfil.addEventListener('input', function(evento) {
    gravarItemNoPerfil("nome", evento.target.value);
  });

  function gravarItemNoPerfil(chaveRegistro, valorRegistro) {
    if (!bancoDeDados) return;
    const transacao = bancoDeDados.transaction("perfil", "readwrite");
    const armazem = transacao.objectStore("perfil");
    armazem.put(valorRegistro, chaveRegistro);
  }

  function executarCargaDoPerfil() {
    if (!bancoDeDados) return;
    const transacao = bancoDeDados.transaction("perfil", "readonly");
    const armazem = transacao.objectStore("perfil");
    
    armazem.get("nome").onsuccess = function(evento) {
      if (evento.target.result) {
        document.getElementById('profile-name').value = evento.target.result;
      }
    };
    armazem.get("foto").onsuccess = function(evento) {
      if (evento.target.result) {
        renderizarFotoPerfil(evento.target.result);
      }
    };
  }

  function renderizarFotoPerfil(dadosBase64) {
    document.getElementById('profile-img').src = dadosBase64;
    document.getElementById('profile-img').style.display = "block";
    document.getElementById('profile-placeholder').style.display = "none";
  }

  const botaoSalvarMemoria = document.getElementById('save-btn');
  botaoSalvarMemoria.addEventListener('click', function() {
    const textoTitulo = document.getElementById('title-input').value.trim();
    const textoPrincipal = document.getElementById('text-input').value.trim();
    const textoVersiculo = document.getElementById('verse-input').value.trim();
    const textoTagsBrutas = document.getElementById('tags-input').value;

    if (!textoPrincipal) {
      alert("Por favor, escreva uma reflexao ou relatorio antes de salvar sua memoria!");
      return;
    }

    const listaTagsFormatadas = textoTagsBrutas.split(',').map(function(tag) {
      return tag.trim();
    }).filter(function(tag) {
      return tag.length > 0;
    });

    const dataAtualDoSistema = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const objetoNovaMemoria = {
      title: textoTitulo,
      text: textoPrincipal,
      verse: textoVersiculo,
      tags: listaTagsFormatadas,
      mood: humorSelecionadoAtualmente,
      image: imagemDaMemoriaBase64,
      data: dataAtualDoSistema,
      timestamp: Date.now()
    };

    const transacaoEscrita = bancoDeDados.transaction("memorias", "readwrite");
    const armazemEscrita = transacaoEscrita.objectStore("memorias");
    armazemEscrita.add(objetoNovaMemoria);
    
    transacaoEscrita.oncomplete = function() {
      document.getElementById('title-input').value = "";
      document.getElementById('text-input').value = "";
      document.getElementById('verse-input').value = "";
      document.getElementById('tags-input').value = "";
      document.getElementById('image-preview').style.display = "none";
      imagemDaMemoriaBase64 = "";
      executarCargaDasMemorias();
    };
  });

  function executarCargaDasMemorias() {
    const painelFeed = document.getElementById('feed');
    painelFeed.innerHTML = "";
    
    if (!bancoDeDados) return;
    const transacaoLeitura = bancoDeDados.transaction("memorias", "readonly");
    const armazemLeitura = transacaoLeitura.objectStore("memorias");
    const colecaoDeMemorias = [];

    armazemLeitura.openCursor().onsuccess = function(eventoCursor) {
      const cursorCorrente = eventoCursor.target.result;
      if (cursorCorrente) {
        colecaoDeMemorias.push(cursorCorrente.value);
        cursorCorrente.continue();
      } else {
        colecaoDeMemorias.sort(function(itemA, itemB) {
          return itemB.timestamp - itemA.timestamp;
        });
        
        colecaoDeMemorias.forEach(function(memoria) {
          const elementoCard = document.createElement('div');
          elementoCard.className = 'memory-card';

          let stringTags = memoria.tags.map(function(t) {
            return '<span class="tag-pill">#' + t + '</span>';
          }).join('');
          
          let stringImg = memoria.image ? '<img class="memory-img" src="' + memoria.image + '" alt="Foto">' : '';
          let stringVerse = memoria.verse ? '<div class="memory-verse">"' + memoria.verse + '"</div>' : '';
          let stringTitle = memoria.title ? '<div class="memory-title">' + memoria.title + '</div>' : '<div class="memory-title">Momento Sem Titulo</div>';

          elementoCard.innerHTML = '<div class="memory-header"><div class="memory-title-area">' + stringTitle + '<div class="memory-date">' + memoria.data + '</div></div><div class="memory-mood">' + memoria.mood + '</div></div>' + stringVerse + '<div class="memory-text">' + memoria.text + '</div>' + stringImg + '<div class="tag-container">' + stringTags + '</div><button class="btn-delete" data-id="' + memoria.id + '">Apagar permanentemente</button>';
          
          painelFeed.appendChild(elementoCard);
        });

        const botoesDeletar = document.querySelectorAll('.btn-delete');
        botoesDeletar.forEach(function(botaoDeletar) {
          botaoDeletar.addEventListener('click', function(eventoCliqueBotao) {
            const identificadorUnico = Number(eventoCliqueBotao.target.getAttribute('data-id'));
            executarRemocaoDeMemoria(identificadorUnico);
          });
        });
      }
    };
  }

  function executarRemocaoDeMemoria(idRegistro) {
    if (confirm("Tem certeza absoluta que deseja remover esta memoria para sempre?")) {
      const transacaoDelecao = bancoDeDados.transaction("memorias", "readwrite");
      transacaoDelecao.objectStore("memorias").delete(idRegistro);
      transacaoDelecao.oncomplete = function() {
        executarCargaDasMemorias();
      };
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function(erroSW) {
      console.log("Erro Service Worker:", erroSW);
    });
  }

  let promptInstalacaoSuspenso;
  const botaoInstalacaoPWA = document.getElementById('pwa-install-btn');

  window.addEventListener('beforeinstallprompt', function(eventoPrompt) {
    eventoPrompt.preventDefault();
    promptInstalacaoSuspenso = eventoPrompt;
    if (botaoInstalacaoPWA) {
      botaoInstalacaoPWA.style.display = 'block';
    }
  });

  if (botaoInstalacaoPWA) {
    botaoInstalacaoPWA.addEventListener('click', async function() {
      if (promptInstalacaoSuspenso) {
        promptInstalacaoSuspenso.prompt();
        const escolhaUsuario = await promptInstalacaoSuspenso.userChoice;
        if (escolhaUsuario.outcome === 'accepted') {
          botaoInstalacaoPWA.style.display = 'none';
        }
        promptInstalacaoSuspenso = null;
      }
    });
  }

  window.addEventListener('appinstalled', function() {
    if (botaoInstalacaoPWA) {
      botaoInstalacaoPWA.style.display = 'none';
    }
  });
});
