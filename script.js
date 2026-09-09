let ipt = document.getElementById('iptfilme')
let button = document.getElementById('searchbutton')
let res = document.getElementById('res')

async function buscarFilmes() {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=3b208aeadbdf5e9fe136e90f988d0981&query=${ipt.value}&language=pt-BR`

    const resposta = await fetch(url)
    const dados = await resposta.json()

    res.innerHTML = ''

dados.results.forEach(filme => {
    res.innerHTML += `<div class = "card-filme"> 
        <img src = "https://image.tmdb.org/t/p/w200${filme.poster_path}" alt= "${filme.title}">
        <h3>${filme.title}</h3>
        <p>Nota: ${filme.vote_average}</p>
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


