let ipt = document.getElementById('iptfilme')
let button = document.getElementById('searchbutton')
let btnAnt = document.getElementById('ant')
let btnProx = document.getElementById('prox')
let res = document.getElementById('res')
let verFavoritos = document.getElementById('verFavoritos')
let dados
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []
let telaAtual = 'busca'
let paginaAtual = 1
let modal = document.getElementById('modal')
let modalConteudo = document.getElementById('modal-conteudo')
let fecharModal = document.getElementById('fecharModal')
let totalPaginas;

let timer;

ipt.addEventListener('input',function(){
    clearTimeout(timer)
    timer = setTimeout(function() {
        buscarFilmes()
    }, 400);
});

async function buscarFilmes() {
    telaAtual = 'busca'
    paginaAtual = 1
    

    res.innerHTML = '<div class="spinner"></div>'
    button.disabled = true

    try{
        dados = await buscarPagina(ipt.value, paginaAtual)
        totalPaginas = dados.totalPaginas

        renderizarResultados(dados)

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
        let id = event.target.dataset.id
        let tipo = event.target.dataset.tipo

        if (favoritos.some(filme => filme.id == id && filme.tipo == tipo))  {
            favoritos = favoritos.filter(filme => !(filme.id == id && filme.tipo == tipo))
            event.target.classList.remove('favoritado')
            if(telaAtual === 'favoritos') {
                event.target.parentElement.remove()
                if(favoritos.length === 0) {
                    res.innerHTML = '<p class="msg-vazio">Nenhum filme favorito ainda 🎬</p>'
                }
            }
        } else {
            let filmeFavoritado = dados.results.find(filme => filme.id == id && filme.tipo == tipo)
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
    modalConteudo.innerHTML = '<div class="spinner"></div>'
    modal.style.display = 'flex'

    let url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=3b208aeadbdf5e9fe136e90f988d0981&language=pt-BR`

    const resposta = await fetch(url)
    let detalhes = await resposta.json()

    let urlElenco = `https://api.themoviedb.org/3/${tipo}/${id}/credits?api_key=3b208aeadbdf5e9fe136e90f988d0981&language=pt-BR`

    let respostaElenco = await fetch(urlElenco)
    let dadosElenco = await respostaElenco.json()

    let urlRecomendacoes = `https://api.themoviedb.org/3/${tipo}/${id}/recommendations?api_key=3b208aeadbdf5e9fe136e90f988d0981&language=pt-BR`

    let respostaRecomendacoes = await fetch(urlRecomendacoes)
    let dadosRecomendacoes = await respostaRecomendacoes.json()

    let elenco = dadosElenco.cast.slice(0, 5).map(ator => ator.name)

    let titulo = detalhes.title || detalhes.name
    let lançamento = detalhes.release_date || detalhes.first_air_date

    modalConteudo.innerHTML = `<h2>${titulo}</h2>
    <p>${detalhes.overview}</p>
    <p>Lançamento: ${lançamento}</p>`
    modalConteudo.innerHTML += `<p>Elenco: ${elenco.join(', ')}</p>`

    let htmlRecomendacoes = '<p>Você também pode gostar:</p><div class="recomendacoes">'
    dadosRecomendacoes.results.slice(0, 5).forEach(recomendacao => {
        let titulo = recomendacao.title || recomendacao.name
        htmlRecomendacoes += `<div class = "mini-card" data-id= "${recomendacao.id}" data-tipo = "${tipo}"> 
        <img src = "https://image.tmdb.org/t/p/w300${recomendacao.backdrop_path}" alt= "${titulo}">
        <h4>${titulo}</h4>
    </div>`
})
    htmlRecomendacoes += '</div>'

    modalConteudo.innerHTML += htmlRecomendacoes
}

modalConteudo.addEventListener('click', function(event) {
    if(event.target.closest('.mini-card')) {
        let card = event.target.closest('.mini-card')
        abrirModal(card.dataset.id, card.dataset.tipo)
    }
})

fecharModal.addEventListener('click', function(){
    modal.style.display = 'none'
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        modal.style.display = 'none'
    }
})

modal.addEventListener('click',function(event){
    if(event.target === modal) {
        modal.style.display = 'none'
    }
})

verFavoritos.addEventListener('click', function() {
    mostrarFavoritos()
})

function mostrarFavoritos() {
    telaAtual = 'favoritos'
    res.innerHTML = ''
    if(favoritos.length === 0) {
        res.innerHTML = '<p class="msg-vazio">Nenhum filme favorito ainda 🎬</p>'
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

async function buscarPagina(termo, pagina) {
    let urlFilmes = `https://api.themoviedb.org/3/search/movie?api_key=3b208aeadbdf5e9fe136e90f988d0981&query=${termo}&page=${pagina}&language=pt-BR`

        let respostaFilmes = await fetch(urlFilmes)
        let dadosFilmes = await respostaFilmes.json()

        let urlSeries = `https://api.themoviedb.org/3/search/tv?api_key=3b208aeadbdf5e9fe136e90f988d0981&query=${termo}&page=${pagina}&language=pt-BR`

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

        return {results: filmesComTipo.concat(seriesComTipo), totalPaginas: Math.max(dadosFilmes.total_pages, dadosSeries.total_pages) }
}

function renderizarResultados(resultado) {
    res.innerHTML = ''

        if(resultado.results.length === 0 ) {
            res.innerHTML = '<p class="msg-vazio">Nada encontrado 🔍</p>'

        } else {
            resultado.results.forEach(filme => {
            let titulo = filme.title || filme.name
            res.innerHTML += `<div class = "card-filme" data-tipo="${filme.tipo}" data-id = "${filme.id}"> 
            <img src = "https://image.tmdb.org/t/p/w200${filme.poster_path}" alt= "${titulo}">
            <h3>${titulo}</h3>
            <p>Nota: ${filme.vote_average}</p>
            <button class="btn-favoritar" data-id="${filme.id}" data-tipo = "${filme.tipo}">★</button>
        </div>`
    });
        }
}

async function mudarPagina(lado) {
    paginaAtual = paginaAtual + lado

    dados = await buscarPagina(ipt.value, paginaAtual)
        totalPaginas = dados.totalPaginas

        renderizarResultados(dados)
}

btnProx.addEventListener('click', function() {
    mudarPagina(1)
})

btnAnt.addEventListener('click', function() {
    mudarPagina(-1)
})