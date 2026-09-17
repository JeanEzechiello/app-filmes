let ipt = document.getElementById('iptfilme')
let button = document.getElementById('searchbutton')
let res = document.getElementById('res')
let verFavoritos = document.getElementById('verFavoritos')
let dados
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []
let telaAtual = document.getElementById('busca')
let modal = document.getElementById('modal')
let modalConteudo = document.getElementById('modal-conteudo')
let fecharModal = document.getElementById('fecharModal')

let timer;

ipt.addEventListener('input',function(){
    clearTimeout(timer)
    timer = setTimeout(function() {
        buscarFilmes()
    }, 400);
});

async function buscarFilmes() {
    telaAtual = 'busca'
    

    res.innerHTML = '<div class="spinner"></div>'
    button.disabled = true

    try{
        let urlFilmes = `https://api.themoviedb.org/3/search/movie?api_key=3b208aeadbdf5e9fe136e90f988d0981&query=${ipt.value}&language=pt-BR`

        let respostaFilmes = await fetch(urlFilmes)
        let dadosFilmes = await respostaFilmes.json()

        let urlSeries = `https://api.themoviedb.org/3/search/tv?api_key=3b208aeadbdf5e9fe136e90f988d0981&query=${ipt.value}&language=pt-BR`

        let respostaSeries = await fetch(urlSeries)
        let dadosSeries = await respostaSeries.json()

        let filmesComTipo = dadosFilmes.results.map(function(filme) {
            filme.tipo = 'movie'
            return filme
        })

        let seriesComTipo = dadosSeries.results.map(function(serie) {
            serie.tipo = 'tv'
            return serie
        })

        dados = {results: filmesComTipo.concat(seriesComTipo) }

        res.innerHTML = ''

        if(dados.results.length === 0 ) {
            res.innerHTML = '<p class="msg-vazio">Nada encontrado 🔍</p>'

        } else {
            dados.results.forEach(filme => {
            let titulo = filme.title || filme.name
            res.innerHTML += `<div class = "card-filme" data-tipo="${filme.tipo}" data-id = "${filme.id}"> 
            <img src = "https://image.tmdb.org/t/p/w200${filme.poster_path}" alt= "${titulo}">
            <h3>${titulo}</h3>
            <p>Nota: ${filme.vote_average}</p>
            <button class="btn-favoritar" data-id="${filme.id}" data-tipo = "${filme.tipo}">★</button>
        </div>`
    });
        }

        } catch(erro) {
            res.innerHTML = '<p class="msg-vazio">Não foi possivel buscar os filmes. Verifique sua conexão e tente novamente.</p>'
        }

        finally {
            button.disabled = false
        }
       
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
            if(telaAtual === 'favoritos') {
                event.target.parentElement.remove()
                if(favoritos.length === 0) {
                    res.innerHTML = '<p class="msg-vazio">Nenhum filme favorito ainda 🎬</p>'
                }
            }
        } else {
            let filmeFavoritado = dados.results.find(filme => filme.id == event.target.dataset.id)
            favoritos.push(filmeFavoritado)
            event.target.classList.add('favoritado')
        }

        localStorage.setItem('favoritos', JSON.stringify(favoritos))
    } else if (event.target.closest('.card-filme')) {
        let card = event.target.closest('.card-filme')
        abrirModal(card.dataset.id, card.dataset.tipo)
    }
})

async function abrirModal(id, tipo) {
    let url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=3b208aeadbdf5e9fe136e90f988d0981&language=pt-BR`

    const resposta = await fetch(url)
    let detalhes = await resposta.json()

    let titulo = detalhes.title || detalhes.name
    let lançamento = detalhes.release_date || detalhes.first_air_date

    modalConteudo.innerHTML = `<h2>${titulo}</h2>
    <p>${detalhes.overview}</p>
    <p>Lançamento: ${lançamento}</p>`

    modal.style.display = 'flex'
}

fecharModal.addEventListener('click', function(){
    modal.style.display = 'none'
})

verFavoritos.addEventListener('click', function() {
    mostrarFavoritos()
})

function mostrarFavoritos() {
    telaAtual = 'favoritos'
    res.innerHTML = ''
    if(favoritos.length === 0) {
        res.innerHTML = res.innerHTML = '<p class="msg-vazio">Nenhum filme favorito ainda 🎬</p>'
    } else {
        favoritos.forEach(filme => {
        let titulo = filme.title || filme.name
        res.innerHTML += `<div class = "card-filme" data-id= "${filme.id}" data-tipo = "${filme.tipo}"> 
        <img src = "https://image.tmdb.org/t/p/w200${filme.poster_path}" alt= "${titulo}">
        <h3>${titulo}</h3>
        <p>Nota: ${filme.vote_average}</p>
        <button class="btn-favoritar favoritado" data-id="${filme.id}" data-tipo = "${filme.tipo}">★</button>
    </div>`
    })
    }
}

