# 🎬 App-Filmes

Aplicativo de busca de filmes e séries com sistema de favoritos, desenvolvido em JavaScript puro, consumindo a API do TMDb (The Movie Database).

## 🔗 Link do projeto

[Acesse aqui](https://jeanezechiello.github.io/app-filmes/)

## ✨ Funcionalidades

- 🔍 Busca de filmes por nome, com resultados em tempo real via API
- 🎥 Exibição dos resultados em cards responsivos (poster, título e nota)
- ⭐ Favoritar e desfavoritar filmes com um clique
- 💾 Persistência de favoritos usando localStorage (os favoritos continuam salvos mesmo fechando o navegador)
- 📋 Tela dedicada para visualizar apenas os filmes favoritados
- 🎬 Mensagem amigável quando não há favoritos salvos
- 📱 Layout responsivo (grid adaptável para diferentes tamanhos de tela)

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3 (Grid Layout, Flexbox, tema escuro personalizado)
- JavaScript (ES6+) — Fetch API, async/await, manipulação de DOM, delegação de eventos, localStorage
- [API do TMDb](https://www.themoviedb.org/documentation/api)

## 💡 Aprendizados neste projeto

- Consumo de API externa com múltiplos parâmetros de busca
- Delegação de eventos para elementos criados dinamicamente
- Manipulação de arrays com `find`, `some` e `filter`
- Controle de estado simples entre diferentes "telas" da aplicação
- Persistência de dados complexos (objetos) no localStorage

## 🚀 Como rodar localmente

1. Clone este repositório
2. Abra o arquivo `index.html` no navegador
3. (Opcional) Gere sua própria chave de API em [themoviedb.org](https://www.themoviedb.org/) e substitua no `script.js`

---

Projeto desenvolvido como parte do meu aprendizado em JavaScript. 🎓
