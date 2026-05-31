
for(let i = 1; i <= 100; i++){
    const box = document.createElement('div');
    box.classList.add('box');
    document.querySelector('.container').appendChild(box);
}

const btn = document.querySelector('.btn');
const corAleatoriaBox = document.querySelectorAll('.box');
const listaFavoritosElemento = document.getElementById('lista-favoritos');


let coresFavoritas = JSON.parse(localStorage.getItem('minhasCoresFavoritas')) || [];

function hexCorCodigo(){
    var chars = "0123456789abcdef"; 
    var corTamanho = 6;
    var cor = "";
    for(var i = 0; i < corTamanho; i++){
        var corAleatoria = Math.floor(Math.random() * chars.length);
        cor += chars.substring(corAleatoria, corAleatoria + 1);
    }
    return '#' + cor;
}

function addCor(){
    corAleatoriaBox.forEach(e => {
        var novaCor = hexCorCodigo();
        e.style.backgroundColor = novaCor; 
        e.innerHTML = novaCor;
        
       
        e.removeEventListener('click', copiarTexto);
        e.removeEventListener('dblclick', salvarFavorito);
        
        
        e.addEventListener('click', copiarTexto);
        e.addEventListener('dblclick', salvarFavorito);
    });
}

function copiarTexto(event) {
    const elementoClicado = event.target;
    const textoCor = elementoClicado.innerHTML;

  
    if(textoCor.includes("!")) return;

    navigator.clipboard.writeText(textoCor).then(() => {
        mostrarToast(`Cor <strong>${textoCor}</strong> copiada!`);
    }).catch(err => console.error("Erro ao copiar: ", err));
}


function salvarFavorito(event) {
    const elementoClicado = event.target;
    const textoCor = elementoClicado.innerHTML;

    if(textoCor.includes("!")) return;

   
    if (!coresFavoritas.includes(textoCor)) {
        coresFavoritas.push(textoCor);
        
  
        localStorage.setItem('minhasCoresFavoritas', JSON.stringify(coresFavoritas));
        
     
        renderizarFavoritos();
        
        mostrarToast(`Cor <strong>${textoCor}</strong> salva nos favoritos!`);
    }
}


function renderizarFavoritos() {
    listaFavoritosElemento.innerHTML = ''; 
    
    coresFavoritas.forEach(cor => {
        const favBox = document.createElement('div');
        favBox.classList.add('fav-box');
        favBox.style.backgroundColor = cor;
        favBox.title = "Clique duplo para remover";
        
        
        favBox.addEventListener('click', () => {
            navigator.clipboard.writeText(cor);
            mostrarToast(`Cor <strong>${cor}</strong> copiada!`);
        });
        
        favBox.addEventListener('dblclick', () => {
            removerFavorito(cor);
        });
        
        listaFavoritosElemento.appendChild(favBox);
    });
}


function removerFavorito(cor) {
    coresFavoritas = coresFavoritas.filter(item => item !== cor);
    localStorage.setItem('minhasCoresFavoritas', JSON.stringify(coresFavoritas));
    renderizarFavoritos();
    mostrarToast(`Cor <strong>${cor}</strong> removida dos favoritos.`);
}


function mostrarToast(mensagem) {
    const toast = document.getElementById('toast');
    toast.innerHTML = mensagem;
    toast.classList.add('mostrar');

   
    if(window.toastTimeout) clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('mostrar');
    }, 2500);
}


renderizarFavoritos();

btn.addEventListener('click', addCor);



const btnCompartilhar = document.getElementById('btn-compartilhar');


if (navigator.share) {
    btnCompartilhar.style.display = 'block'; 

    btnCompartilhar.addEventListener('click', () => {
        navigator.share({
            title: 'Gerador de Cores Incrível!',
            text: 'Olha que legal esse gerador de paletas de cores que eu encontrei! Dá para criar e salvar favoritos.',
            url: window.location.href 
        })
        .then(() => console.log('Compartilhado com sucesso!'))
        .catch((error) => console.log('Erro ao compartilhar:', error));
    });
}
