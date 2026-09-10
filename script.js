let ipt = document.getElementById('iptfilme')
let button = document.getElementById('searchbutton')
let res = document.getElementById('res')
let verFavoritos = document.getElementById('verFavoritos')
let dados
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []

async function buscarFilmes() {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=3b208aeadbdf5e9fe136e90f988d0981&query=${ipt.value}&language=pt-BR`

    const resposta = await fetch(url)
    dados = await resposta.json()

    res.innerHTML = ''

dados.results.forEach(filme => {
    res.innerHTML += `<div class = "card-filme"> 
        <img src = "https://image.tmdb.org/t/p/w200${filme.poster_path}" alt= "${filme.title}">
        <h3>${filme.title}</h3>
        <p>Nota: ${filme.vote_average}</p>
        <button class="btn-favoritar" data-id="${filme.id}">★</button>
    </div>`
});

} 

button.addEventListener ('click', function(){
    buscarFilmes()
})

ipt.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        buscarFilmes()
    }
})

res.addEventListener('click', function(event) {
    if (event.target.dataset.id) {
        if (favoritos.some(filme => filme.id == event.target.dataset.id))  {
            favoritos = favoritos.filter(filme => filme.id != event.target.dataset.id)
            event.target.classList.remove('favoritado')
            event.target.parentElement.remove()
        } else {
            let filmeFavoritado = dados.results.find(filme => filme.id == event.target.dataset.id)
            favoritos.push(filmeFavoritado)
            event.target.classList.add('favoritado')
        }

        localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }
})

verFavoritos.addEventListener('click', function() {
    mostrarFavoritos()
})

function mostrarFavoritos() {
    res.innerHTML = ''
    favoritos.forEach(filme => {
        res.innerHTML += `<div class = "card-filme"> 
        <img src = "https://image.tmdb.org/t/p/w200${filme.poster_path}" alt= "${filme.title}">
        <h3>${filme.title}</h3>
        <p>Nota: ${filme.vote_average}</p>
        <button class="btn-favoritar favoritado" data-id="${filme.id}">★</button>
    </div>`
    })
}

