console.log("je suis le app.js, keskispasse?")
const mainDiv = document.getElementById('main')

const render = html => {
    mainDiv.innerHTML = html
}

const makeCard = item => `
    <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="..." alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.genre}</p>
            <a href="${item.url}" class="btn btn-primary">Voir ma playlist</a>
        </div>
    </div>
    `

const controllers = {
    '/': () => {
        console.log("coucou je suis le console log du controller pour le path /")
        fetch('/membre')
        .then(res => {
            console.log("dans le fetch, on s'occupe de la res")
             return res.json()
        })
        .then(mesplaylists => mesplaylists.reduce((carry, playlist) => carry + makeCard(playlist), ''))
        .then(album => render(
            `
            <div class="row">
            ${album}
            </div>
            `
        ))
    }
}

const route = pathname => {

}
(() => {
    ['/'].forEach(
        path => page(path, controllers[path])
    )
    page()
// route()
})()