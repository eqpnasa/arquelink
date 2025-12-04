// Seleciona as seções principais
const feedSection = document.getElementById("feed");
const postSection = document.getElementById("novaPostagem");
const profileSection = document.getElementById("perfil");
const loginSection = document.getElementById("login");
const singupSection = document.getElementById("singup");
const header = document.getElementById("Header");
const config = document.getElementById("config_Profile");
const footer = document.getElementById("footer")
const terms = document.getElementById("Terms")
const contact = document.getElementById("contactuss")
const API_URL = "http://localhost:3000";


const imgProfile = document.getElementById("mudarImgProfile__Img");
const bioModificar = document.getElementById("bioModificar");
const nomeModificar = document.getElementById("nomeModificar");
const buttonProfileModificar = document.getElementById("button_profile_modificar");

// Campos do formulário
const checker = document.getElementById("Arqueologo_Ou_Leigo")

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

function Terms()
{
  header.style.display = "none";
  profileSection.style.display = "none";
  postSection.style.display = "none";
  feedSection.style.display = "none";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  config.style.display = "none";
  footer.style.display = "none"
  terms.style.display = "block"
  contact.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo2.jpg')";
  window.scrollTo(0, 0);
}

function backPost() {
  header.style.display = "none";
  profileSection.style.display = "none";
  feedSection.style.display = "none";
  postSection.style.display = "block";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  config.style.display = "none";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "none";
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
  config.style.display = "none";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo3.jpg')";
  window.scrollTo(0, 0);

  // Limpa e exibe os posts do usuário
  perfilPosts.innerHTML = "";
  database.forEach((_, index) => {
    addPostToPerfil(index);
  });
}

function Contact_uss()
{
  header.style.display = "block";
  profileSection.style.display = "none";
  postSection.style.display = "none";
  feedSection.style.display = "none";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  config.style.display = "none";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "block";
  document.body.style.backgroundImage = "url('../img/fundo2.jpg')";
  window.scrollTo(0, 0);
}

async function singUp() {
  const nomeValor = nome.value.trim();
  const emailValor = email.value.trim();
  const senhaValor = senha.value.trim();
  const senhaConfirmaValor = senhaConfirmar.value.trim();
  const termosAceitos = document.getElementById("termosCheckbox").checked;

  if (!nomeValor || !emailValor || !senhaValor || !senhaConfirmaValor) {
    alert("Preencha todos os campos!");
    return;
  }

  if (!termosAceitos) {
    alert("Você deve concordar com os termos para continuar!");
    return;
  }

  if (senhaValor !== senhaConfirmaValor) {
    alert("As senhas não coincidem!");
    return;
  }

  const res = await fetch(`${API_URL}/usuarios`);
  const usuarios = await res.json();

  const usuarioExistente = usuarios.find(u => u.email === emailValor);

  if (usuarioExistente) {
    alert("Este email já está cadastrado!");
    return;
  }

  const novoUsuario = {
    nome: nomeValor,
    email: emailValor,
    senha: senhaValor,
    bio: "",
    foto: ""
  };

  await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoUsuario)
  });

  alert("Cadastro realizado com sucesso!");
  backFeed();
}



// Função de login
async function logIn() {
  const emailValor = emailLogin.value.trim();
  const senhaValor = senhaLogin.value.trim();

  if (!emailValor || !senhaValor) {
    alert("Preencha todos os campos!");
    return;
  }

  const response = await fetch(`${API_URL}/usuarios`);
  const usuarios = await response.json();

  const usuarioEncontrado = usuarios.find(
    u => u.email === emailValor && u.senha === senhaValor
  );

  if (usuarioEncontrado) {
    alert(`Login bem-sucedido! Bem-vindo, ${usuarioEncontrado.nome} 👋`);

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

    atualizarPerfil();
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
  config.style.display = "none";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo3.jpg')";
  window.scrollTo(0, 0);
}

function goToConfig(){
  header.style.display = "none";
  profileSection.style.display = "none";
  feedSection.style.display = "none";
  postSection.style.display = "none";
  loginSection.style.display = "none";
  singupSection.style.display = "none";
  config.style.display = "block";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "none";
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
  config.style.display = "none";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "none";
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
  config.style.display = "none";
  footer.style.display = "none";
  terms.style.display = "none";
  contact.style.display = "none";
  document.body.style.backgroundImage = "url('../img/fundo2.jpg')";
  window.scrollTo(0, 0);
}

// Carrega imagem no preview
function imageLoader() {
  imagemDisplay.src = URL.createObjectURL(imagemInput.files[0]);
}

// Envia um novo post
async function enviarPost() {

  const imagemBase64 = await pegarImagemBase64(); // <-- CORRIGIDO

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

  const location = `${xInput.value}, ${yInput.value}`;

  const post = {
    user: JSON.parse(localStorage.getItem("usuarioLogado")).nome,
    title: titleInput.value,
    hora: horaInput.value,
    data: dataInput.value,
    local: location,
    imagem: imagemBase64 ?? "",   // <-- evita erro
    descricao: descricaoInput.value,
    material: materialInput.value,
    cor: corInput.value,
    categoria: categoriaInput.value,
    integridade: integridadeInput.value
  };

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post)
  });

  const novoPost = await response.json();

  database.push(novoPost);
  addPost(database.length - 1);
  addPostToPerfil(database.length - 1);

  backFeed();
}

function converterImagemParaBase64(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => resolve(leitor.result);
        leitor.onerror = () => reject("Erro ao ler a imagem");

        leitor.readAsDataURL(arquivo); // <--- transforma em Base64
    });
}

async function pegarImagemBase64() {
    const arquivo = imagemInput.files[0];

    if (!arquivo) {
        return null;
    }

    const base64 = await converterImagemParaBase64(arquivo);
    return base64;
}

// Adiciona post no feed
function addPost(index) {
  const post = database[index];
  if (!post) return;

  const article = document.createElement("article"); // <-- AGORA certo

  const isArqueologo =
    checker && checker.value && checker.value.toLowerCase() === "arqueologo";

  if (isArqueologo) {
    article.className = "ArqueForm";
  } else {
    article.className = "post";
  }

  article.innerHTML = `
    <div class="post-header">
      <img src="../img/img_profile.png" class="img_profile"></img>
      <p>${post.user}${isArqueologo ? "✔️" : ""}</p>
      <div>
        <h2>${post.title}</h2><br>
        <div class="meta">
          <span class="data">📅 ${post.data}</span> • 
          <span class="hora">🕒 ${post.hora}</span> • 
          <span class="local">📍 ${post.local}</span>
        </div>
      </div>
    </div>

    ${post.imagem ? `<img src="${post.imagem}">` : ""}

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
    </div>
  `;

  feed.appendChild(article);
}


// -----------------------------
// CONFIGURAÇÃO DO PERFIL
// -----------------------------

function atualizarTodasAsFotos(fotoBase64) {
  const todasImagens = document.querySelectorAll("[data-user-img]");

  todasImagens.forEach(img => {
    img.src = fotoBase64;
  });
}


// Quando o usuário seleciona uma nova imagem
function mudarProfile(event) {
  const inputFile = event.target;
  if (inputFile.files.length === 0) return;

  const file = inputFile.files[0];
  const reader = new FileReader();

  const novaFoto = imgProfile.src;
  if (novaFoto && !novaFoto.includes("img_profile.png")) {
    usuarioLogado.foto = novaFoto;
    atualizarTodasAsFotos(novaFoto);
  }


  reader.readAsDataURL(file);
}

window.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuario && usuario.foto) {
    atualizarTodasAsFotos(usuario.foto);
  }
});


// Salvar as configurações do perfil
function salvarConfigProfile() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Erro: nenhum usuário logado!");
    return;
  }

  // Atualiza nome
  if (nomeModificar.value.trim() !== "") {
    usuarioLogado.nome = nomeModificar.value.trim();
  }

  // Atualiza bio
  if (bioModificar.value.trim() !== "") {
    usuarioLogado.bio = bioModificar.value.trim();
  }

  // Atualiza foto (se mudou)
  const novaFoto = imgProfile.src;
  if (novaFoto && !novaFoto.includes("img_profile.png")) {
    usuarioLogado.foto = novaFoto;
  }

  // Salva no localStorage
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

  alert("Perfil atualizado!");

  // Atualiza informações no perfil
  atualizarPerfil();

  // Volta para o perfil
  openProfile();
}

// Carrega os dados do usuário logado
function atualizarPerfil() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  document.getElementById("usernamePerfil").innerText = usuario.nome;
  document.getElementById("emailPerfil").innerText = usuario.email;

  const bioElement = document.getElementById("bioPerfil");
  if (usuario.bio) {
    bioElement.innerText = usuario.bio;
  } else {
    bioElement.innerText = "Bio do usuário...";
  }

  // Se tiver foto, aplica
  const fotoImg = document.querySelector("#perfil img.img_profile_large") || document.getElementById("img");
  if (usuario.foto) {
    fotoImg.src = usuario.foto;
  }
}


// Adiciona post no perfil
function addPostToPerfil(index) {
  const post = database[index];
  if (!post) return;

  const article = document.createElement("article");
  article.className = "post";
  article.innerHTML = `
    <div class="post-header">
      <img data-user-img src="../img/img_profile.png" class="img_profile"></img>
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

// Carrega os posts ao iniciar
async function carregarPostsDoBackend() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();

    database = posts; // popula seu array local
    feed.innerHTML = "";

    database.forEach((_, index) => addPost(index));

  } catch (err) {
    console.error("Erro ao carregar posts:", err);
  }
}

window.addEventListener("DOMContentLoaded", carregarPostsDoBackend);

