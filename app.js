document.addEventListener("DOMContentLoaded", () => {
  let db;
  const request = indexedDB.open("DiarioGrupoJovens", 1);

  request.onupgradeneeded = function(e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains("perfil")) db.createObjectStore("perfil");
    if (!db.objectStoreNames.contains("memorias")) db.createObjectStore("memorias", { keyPath: "id", autoIncrement: true });
  };

  request.onsuccess = function(e) {
    db = e.target.result;
    carregarPerfil();
    carregarMemorias();
  };

  request.onerror = function() {
    console.error("Erro ao abrir o banco de dados.");
  };

  let selectedMood = "😊";
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMood = btn.getAttribute('data-mood');
    });
  });

  const profileTrigger = document.getElementById('profile-trigger');
  if (profileTrigger) {
    profileTrigger.addEventListener('click', () => {
      document.getElementById('profile-file').click();
    });
  }

  let base64MemoryImg = "";
  document.getElementById('memory-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        base64MemoryImg = event.target.result;
        const imgPreview = document.getElementById('image-preview');
        imgPreview.src = base64MemoryImg;
        imgPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('profile-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Img = event.target.result;
        salvarPerfilItem("foto", base64Img);
        mostrarFotoPerfil(base64Img);
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('profile-name').addEventListener('input', function(e) {
    salvarPerfilItem("nome", e.target.value);
  });

  function salvarPerfilItem(chave, valor) {
    if (!db) return;
    const tx = db.transaction("perfil", "readwrite");
    tx.objectStore("perfil").put(valor, chave);
  }

  function carregarPerfil() {
    if (!db) return;
    const tx = db.transaction("perfil", "readonly");
    const store = tx.objectStore("perfil");
    
    store.get("nome").onsuccess = (e) => {
      if(e.target.result) document.getElementById('profile-name').value = e.target.result;
    };
    store.get("foto").onsuccess = (e) => {
      if(e.target.result) mostrarFotoPerfil(e.target.result);
    };
  }

  function mostrarFotoPerfil(base64) {
    document.getElementById('profile-img').src = base64;
    document.getElementById('profile-img').style.display = "block";
    document.getElementById('profile-placeholder').style.display = "none";
  }

  document.getElementById('save-btn').addEventListener('click', () => {
    const title = document.getElementById('title-input').value.trim();
    const text = document.getElementById('text-input').value.trim();
    const verse = document.getElementById('verse-input').value.trim();
    const tagsRaw = document.getElementById('tags-input').value;

    if (!text) {
      alert("Escreva uma reflexão antes de salvar!");
      return;
    }

    const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const dataCriacao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' });

    const novaMemoria = { title, text, verse, tags, mood: selectedMood, image: base64MemoryImg, data: dataCriacao, timestamp: Date.now() };

    const tx = db.transaction("memorias", "readwrite");
    tx.objectStore("memorias").add(novaMemoria);
    
    tx.oncomplete = () => {
      document.getElementById('title-input').value = "";
      document.getElementById('text-input').value = "";
      document.getElementById('verse-input').value = "";
      document.getElementById('tags-input').value = "";
      document.getElementById('image-preview').style.display = "none";
      base64MemoryImg = "";
      carregarMemorias();
    };
  });

  function carregarMemorias() {
    const feed = document.getElementById('feed');
    feed.innerHTML = "";
    
    if (!db) return;
    const tx = db.transaction("memorias", "readonly");
    const store = tx.objectStore("memorias");
    const memorias = [];

    store.openCursor().onsuccess = function(e) {
      const cursor = e.target.result;
      if (cursor) {
        memorias.push(cursor.value);
        cursor.continue();
      } else {
        memorias.sort((a, b) => b.timestamp - a.timestamp);
        memorias.forEach(mem => {
          const card = document.createElement('div');
          card.className = 'memory-card';

          let tagHTML = mem.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('');
          let imgHTML = mem.image ? `<img class="memory-img" src="${mem.image}" alt="Foto">` : '';
          let verseHTML = mem.verse ? `<div class="memory-verse">"${mem.verse}"</div>` : '';
          let titleHTML = mem.title ? `<div class="memory-title">${mem.title}</div>` : `<div class="memory-title">Momento Sem Título</div>`;

          card.innerHTML = `
            <div class="memory-header">
              <div class="memory-title-area">
                ${titleHTML}
                <div class="memory-date">${mem.data}</div>
              </div>
              <div class="memory-mood">${mem.mood}</div>
            </div>
            ${verseHTML}
            <div class="memory-text">${mem.text}</div>
            ${imgHTML}
            <div class="tag-container">${tagHTML}</div>
            <button class="btn-delete" data-id="${mem.id}">Apagar permanentemente</button>
          `;
          feed.appendChild(card);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
          btn.addEventListener('click', (el) => {
            const id = Number(el.target.getAttribute('data-id'));
            deletarMemoria(id);
          });
        });
      }
    };
  }

  function deletarMemoria(id) {
    if (confirm("Tem certeza que quer apagar essa memória para sempre?")) {
      const tx = db.transaction("memorias", "readwrite");
      tx.objectStore("memorias").delete(id);
      tx.oncomplete = () => carregarMemorias();
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log("Erro SW:", err));
  }

  let deferredPrompt;
  const installBtn = document.getElementById('pwa-install-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          installBtn.style.display = 'none';
        }
        deferredPrompt = null;
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
  });
});
