// Seleciona as seções principais
const feedSection = document.getElementById("feed");
const postSection = document.getElementById("novaPostagem");
const profileSection = document.getElementById("perfil");
const loginSection = document.getElementById("login");
const singupSection = document.getElementById("singup");
const header = document.getElementById("Header")

// Campos do formulário
var buttonEnviar = document.getElementById("submitBtn");
var horaInput = document.getElementById("time");
var dataInput = document.getElementById("date");
var xInput = document.getElementById("eixoX");
var yInput = document.getElementById("eixoY");
var imagemInput = document.getElementById("image");
var descricaoInput = document.getElementById("description");
var imagemDisplay = document.getElementById("imagem");
var materialInput = document.getElementById("material");
var corInput = document.getElementById("color");
var categoriaInput = document.getElementById("category");
var integridadeInput = document.getElementById("integrity");
var titleInput = document.getElementById("title");

var email = document.getElementById("email")
var senha = document.getElementById("senha")
var senhaConfirmar = document.getElementById("senhaConfirm")
var nome = document.getElementById("name")
var emailLogin = document.getElementById("emailLogin")
var senhaLogin = document.getElementById("senhaLogin")

var profileDatabase = [];
var database = []; // "banco" local de posts
var feed = document.getElementById("feed");
var perfilPosts = document.getElementById("perfil__posts");

// Funções de navegação
function backPost() {
  header.style.display = "none";
  profileSection.style.display = "none";
  feedSection.style.display = "none";
  postSection.style.display = "block";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo.jpg')";
  window.scrollTo(0, 0);
}

function openProfile() {
  header.style.display = "block";
  profileSection.style.display = "block";
  feedSection.style.display = "none";
  postSection.style.display = "none";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo3.jpg')";
  window.scrollTo(0, 0);

  // Limpa e exibe os posts do usuário
  perfilPosts.innerHTML = "";
  database.forEach((_, index) => {
    addPostToPerfil(index);
  });
}

// linka com o database
async function salvarPostNoBackend(post) {
  const formData = new FormData();

  formData.append("file", imagemInput.files[0]);
  formData.append("dados", JSON.stringify(post));

  await fetch("http://localhost:8000/salvar-post", {
    method: "POST",
    body: formData
  });
}



function singUp() {
  const nomeValor = nome.value.trim();
  const emailValor = email.value.trim();
  const senhaValor = senha.value.trim();
  const senhaConfirmaValor = senhaConfirmar.value.trim();

  if (!nomeValor || !emailValor || !senhaValor || !senhaConfirmaValor) {
    alert("Preencha todos os campos!");
    return;
  }

  if (senhaValor !== senhaConfirmaValor) {
    alert("As senhas não coincidem!");
    return;
  }

  // Verifica se o email já existe
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioExistente = usuarios.find(u => u.email === emailValor);

  if (usuarioExistente) {
    alert("Este email já está cadastrado!");
    return;
  }

  // Salva o novo usuário
  const novoUsuario = {
    nome: nomeValor,
    email: emailValor,
    senha: senhaValor
  };

  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Cadastro realizado com sucesso!");
  backFeed();
}

// Função de login
function logIn() {
  const emailValor = emailLogin.value.trim();
  const senhaValor = senhaLogin.value.trim();

  if (!emailValor || !senhaValor) {
    alert("Preencha todos os campos!");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarioEncontrado = usuarios.find(
    u => u.email === emailValor && u.senha === senhaValor
  );

  if (usuarioEncontrado) {
    alert("Login bem-sucedido! Bem-vindo, " + usuarioEncontrado.nome + " 👋");

    // Salva quem está logado
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

    // Atualiza perfil com os dados do usuário
    atualizarPerfil();

    // Vai para o feed
    backFeed();
  } else {
    alert("Email ou senha incorretos!");
  }
}

// Atualiza o perfil com o usuário logado
function atualizarPerfil() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    document.getElementById("usernamePerfil").innerText = usuarioLogado.nome;
    document.getElementById("emailPerfil").innerText = usuarioLogado.email;
  }
}

// Deslogar
function logout() {
  localStorage.removeItem("usuarioLogado");
  alert("Você saiu da conta.");
  goToLogIn();
}

// Quando o site abre, verifica se há alguém logado
window.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    atualizarPerfil();
    backFeed();
  } else {
    goToLogIn();
  }
});

function goToLogIn() {
  header.style.display = "none";
  profileSection.style.display = "none";
  feedSection.style.display = "none";
  postSection.style.display = "none";
  loginSection.style.display = "block";
  singupSection.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo3.jpg')";
  window.scrollTo(0, 0);
}

function goToSingUp(){
  header.style.display = "none";
  profileSection.style.display = "none";
  feedSection.style.display = "none";
  postSection.style.display = "none";
  loginSection.style.display = "none";
  singupSection.style.display = "block";
  document.body.style.backgroundImage = "url('../img/fundo3.jpg')";
  window.scrollTo(0, 0);
}

function backFeed(event) {
  event?.preventDefault();
  header.style.display = "block";
  profileSection.style.display = "none";
  postSection.style.display = "none";
  feedSection.style.display = "block";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo2.jpg')";
  window.scrollTo(0, 0);
}

//Linka com o python

async function compararImagemDoPost(srcDaImagem) {
  try {
    const blob = await fetch(srcDaImagem).then(r => r.blob());
    const formData = new FormData();
    formData.append("file", blob, "imagem.jpg");

    const resposta = await fetch("http://localhost:8000/comparar", {
      method: "POST",
      body: formData
    });

    const dados = await resposta.json();
    console.log("RESULTADO COMPARAÇÃO:", dados);

    alert("Comparação concluída! Veja o console.");
  } 
  catch (e) {
    console.error(e);
    alert("Falha ao comparar imagem.");
  }
}


// Carrega imagem no preview
function imageLoader() {
  imagemDisplay.src = URL.createObjectURL(imagemInput.files[0]);
}

// Envia um novo post
function enviarPost() {
  if (
    titleInput.value == "" ||
    horaInput.value == "" ||
    dataInput.value == "" ||
    xInput.value == "" ||
    yInput.value == "" ||
    descricaoInput.value == "" ||
    imagemInput.files.length == 0 ||
    materialInput.value == "" ||
    corInput.value == "" ||
    categoriaInput.value == "" ||
    integridadeInput.value == ""
  ) {
    alert("Por favor, preencha todos os campos antes de enviar.");
    return;
  }

  buttonEnviar.disabled = true;
  buttonEnviar.innerText = "Enviando...";

  const location = `${xInput.value}, ${yInput.value}`;

  const post = {
    title: titleInput.value,
    hora: horaInput.value, 
    data: dataInput.value,
    local: location,
    imagem: imagemDisplay.src,
    descricao: descricaoInput.value,
    material: materialInput.value,
    cor: corInput.value,
    categoria: categoriaInput.value,
    integridade: integridadeInput.value
  };

  // Adiciona ao banco local
  database.push(post);

  // Exibe no feed e no perfil
  const index = database.length - 1;
  addPost(index);
  addPostToPerfil(index); 
  salvarPostNoBackend(post);

  // Reativa botão
  setTimeout(() => {
    buttonEnviar.disabled = false;
    buttonEnviar.innerText = "Enviar";
  }, 800);

  // Volta ao feed
  backFeed();
}

// Adiciona post no feed
function addPost(index) {
  const post = database[index];
  if (!post) return;

  const article = document.createElement("article");
  article.className = "post";
  article.innerHTML = `
    <div class="post-header">
      <img src="../img/img_profile.png" class="img_profile"></img>
      <div>
        <h2>${post.title}</h2>
        <div class="meta">
          <span class="data">📅 ${post.data}</span> • 
          <span class="hora">🕒 ${post.hora}</span> • 
          <span class="local">📍 ${post.local}</span>
        </div>
      </div>
    </div>
    <img src="${post.imagem}">
    <p class="descricao">${post.descricao}</p>
    <ul class="info">
      <li><strong>Material:</strong> ${post.material}</li>
      <li><strong>Cor:</strong> ${post.cor}</li>
      <li><strong>Categoria:</strong> ${post.categoria}</li>
      <li><strong>Integridade:</strong> ${post.integridade}</li>
    </ul>
    <div class="acoes">
      <button>👍 Curtir</button>
      <button>💬 Comentar</button>
      <button>🔗 Compartilhar</button>
      <button>✨ Comparar</button>
    </div>
  `;
  feed.appendChild(article);
}

// Adiciona post no perfil
function addPostToPerfil(index) {
  const post = database[index];
  if (!post) return;

  const article = document.createElement("article");
  article.className = "post";
  article.innerHTML = `
    <div class="post-header">
      <img src="../img/img_profile.png" class="img_profile"></img>
      <div>
        <h2>${post.title}</h2>
        <div class="meta">
          <span class="data">📅 ${post.data}</span> • 
          <span class="hora">🕒 ${post.hora}</span> • 
          <span class="local">📍 ${post.local}</span>
        </div>
      </div>
    </div>
    <img src="${post.imagem}" alt="Imagem do achado arqueológico">
    <p class="descricao">${post.descricao}</p>
    <ul class="info">
      <li><strong>Material:</strong> ${post.material}</li>
      <li><strong>Cor:</strong> ${post.cor}</li>
      <li><strong>Categoria:</strong> ${post.categoria}</li>
      <li><strong>Integridade:</strong> ${post.integridade}</li>
    </ul>
  `;
  perfilPosts.appendChild(article);
}

// Interações no feed
feed.addEventListener("click", function (event) {
  const target = event.target;

  if (target.textContent.includes("👍")) {
    let counter = target.querySelector(".like-count");
    if (!counter) {
      counter = document.createElement("span");
      counter.className = "like-count";
      counter.style.marginLeft = "5px";
      counter.textContent = "1";
      target.appendChild(counter);
      target.style.color = "#ffffff";
    }
  }

  if (target.textContent.includes("💬")) {
    let commentBox = target.closest(".post").querySelector(".comment-box");
    if (!commentBox) {
      commentBox = document.createElement("div");
      commentBox.className = "comment-box";
      commentBox.style.marginTop = "10px";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Escreva um comentário...";
      input.style.width = "80%";
      input.style.padding = "5px";

      const btn = document.createElement("button");
      btn.textContent = "Enviar";
      btn.style.marginLeft = "5px";

      const list = document.createElement("ul");
      list.className = "comment-list";
      list.style.marginTop = "5px";

      btn.addEventListener("click", () => {
        if (input.value.trim() !== "") {
          const li = document.createElement("li");
          li.textContent = input.value;
          list.appendChild(li);
          input.value = "";
        }
      });

      commentBox.appendChild(input);
      commentBox.appendChild(btn);
      commentBox.appendChild(list);

      target.closest(".post").appendChild(commentBox);
    } else {
      // Toggle para mostrar/ocultar
      commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
    }
  }

  // COMPARTILHAR
  if (target.textContent.includes("🔗")) {
    // Copia a URL do post (simulação, aqui vamos pegar a imagem do post)
    const post = target.closest(".post");
    const img = post.querySelector("img").src;
    navigator.clipboard.writeText(img)
      .then(() => alert("Link da imagem copiado para a área de transferência!"))
      .catch(() => alert("Falha ao copiar o link."));
  }

if (target.textContent.includes("✨")) {
  const post = target.closest(".post");
  const img = post.querySelector("img").src;  

  compararImagemDoPost(img);
}

});

//-------------------------------------------------------------------------------------

const searchInput = document.getElementById("search");

// Quando o usuário digitar e apertar Enter
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const term = searchInput.value.trim().toLowerCase();

    // Limpa o feed
    feed.innerHTML = "";

    // Filtra posts cujo título contém o termo
    const resultados = database.filter(post =>
      post.title.toLowerCase().includes(term)
    );

    // Se não encontrar nada
    if (resultados.length === 0) {
      feed.innerHTML = "<p>Nenhum post encontrado 😢</p>";
      return;
    }

    // Recria os posts filtrados
    resultados.forEach(post => {
      const index = database.indexOf(post);
      addPost(index);
    });
  }
});


async function carregarPostsDoBackend() {
  try {
    const resposta = await fetch("http://localhost:8000/posts");
    const posts = await resposta.json();

    database = posts; // substitui seu banco local pelos dados reais

    feed.innerHTML = "";
    posts.forEach((post, index) => addPost(index));
  } catch (err) {
    console.error("Erro ao carregar posts:", err);
  }
}

// Carrega os posts ao iniciar
window.addEventListener("DOMContentLoaded", carregarPostsDoBackend);
