# 📖 O Diário de cada dia

Um aplicativo de diário privado, moderno e **100% offline**, projetado especialmente para um grupo de jovens registrar suas memórias, reflexões e momentos marcantes com total privacidade e sem custos de manutenção.

Este projeto foi construído como um **PWA (Progressive Web App)**, o que significa que ele pode ser instalado diretamente no celular pelo navegador, funcionando exatamente como um aplicativo nativo, sem a necessidade de baixar um arquivo APK ou depender de lojas de aplicativos.

---

## ✨ Funcionalidades Principais

*   **👤 Perfil Personalizado:** Espaço no topo da tela para o jovem digitar seu nome e carregar uma foto de perfil direto da galeria do celular.
*   **✍️ Editor de Memórias Completo:** 
    *   Campos para Título e Texto principal.
    *   Seção opcional para **Versículo ou Reflexão do Dia**.
    *   Sistema de **#tags** separadas por vírgula para organizar pensamentos.
    *   Seleção rápida de humor por meio de emojis interativos (😊, 🙏, ✨, 📝, ☁️).
    *   Anexo de fotos com pré-visualização instantânea antes de guardar o momento.
*   **⏳ Linha do Tempo Cronológica:** Exibição das memórias salvas da mais recente para a mais antiga, com formatação automática de data e hora.
*   **🔒 Privacidade e Segurança Máxima (Offline):** Utiliza o banco de dados interno do navegador (**IndexedDB**). Os textos e as fotos (convertidos em Base64) são salvos de forma segura **dentro do próprio celular do usuário**. Nenhum dado é enviado para a internet ou servidores externos.

---

## 🎨 Identidade Visual

O design foi planejado para ser moderno, minimalista e limpo:
*   **Fundo:** Bege Areia Confortável (`#F5F2EB`), ideal para reduzir o cansaço visual durante a leitura e escrita.
*   **Tipografia:** Fontes limpas e sem serifa para garantir excelente legibilidade no celular.
*   **Logotipo:** Logotipo oficial moderno integrado nativamente nas configurações visuais do aplicativo.

---

## 📂 Estrutura de Arquivos

Para o aplicativo funcionar corretamente, mantenha os seguintes arquivos na mesma pasta (diretório raiz):

```text
├── index.html       # Interface visual, lógica do diário e banco de dados local
├── sw.js            # Service Worker (permite que o app funcione sem internet)
├── manifest.json    # Configurações de instalação do PWA e ícones
└── README.md        # Este guia de instruções
```

---

## 🚀 Como Hospedar e Distribuir para os Jovens

Como os PWAs e os bancos de dados locais exigem um ambiente seguro para funcionar, o aplicativo precisa ser publicado em um link com protocolo **HTTPS**. Você pode fazer isso de forma **totalmente gratuita** seguindo um dos métodos abaixo:

### Opção 1: Netlify (Mais fácil e rápido)
1. Acesse [netlify.com](https://netlify.com) e crie uma conta gratuita.
2. Vá na seção de implantação rápida (ou arraste e solte).
3. Simplesmente arraste a pasta contendo os arquivos (`index.html`, `sw.js`, `manifest.json`) para dentro da área indicada no site.
4. O Netlify gerará um link seguro (ex: `https://netlify.app`) pronto para enviar aos jovens.

### Opção 2: GitHub Pages (Ideal para quem usa GitHub)
1. Crie um repositório público no GitHub.
2. Faça o upload dos arquivos para a ramificação (`main` ou `master`).
3. Vá em **Settings** (Configurações) > **Pages**.
4. Em *Build and deployment*, selecione a branch correspondente e clique em **Save**.
5. Em poucos minutos, seu aplicativo estará online em um endereço `https://github.io`.

---

## 📲 Como os Jovens Podem Instalar no Celular

Assim que você enviar o link gerado para o grupo de jovens (via WhatsApp, por exemplo), eles devem seguir os passos abaixo dependendo do sistema operacional:

### No Android (Google Chrome)
1. Abra o link do aplicativo no navegador **Chrome**.
2. Um botão azul escrito **"📥 Adicionar à Tela Inicial"** aparecerá no topo do aplicativo.
3. Clique nele e confirme a instalação. O ícone do diário aparecerá na tela de aplicativos do celular.

### No iOS / iPhone (Safari)
1. Abra o link do aplicativo obrigatoriamente no navegador **Safari**.
2. Toque no botão de **Compartilhar** (o ícone de um quadrado com uma seta para cima na barra inferior).
3. Role a lista de opções para baixo e clique em **"Adicionar à Tela de Início"**.
4. Confirme clicando em **Adicionar**. O diário estará pronto na tela inicial.

---

## 🛠️ Customizações Futuras
Se você desejar alterar a imagem padrão do logotipo que já vem desenhada em código, basta salvar a sua imagem em formato quadrado com o nome `logo.png` na mesma pasta e ajustar a referência de imagem dentro do arquivo `manifest.json`.

