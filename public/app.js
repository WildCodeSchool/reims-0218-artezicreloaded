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

// const serializeForm = form => {
//     const data = {}
//     const elements = form.getElementsByClassName('form-control')
//     for(el of elements) {
//         data[el.name] = el.value
//     }
//     return data
// }

const controllers = {
    '/clement': () => {
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
    },
    '/playlist/new': () => {
        render(`
        <div class="container">
          <div id="alert-box" class="hidden">
    
          </div>
          <form id="add-playlist">
            <div class="form-group">
              <label for="inputTitle">Titre</label>
              <input name="title" type="text" class="form-control" id="inputTitle" placeholder="Entrez le titre de votre playlist">
            </div>
            <div class="form-group">
              <label for="inputUrl">Url de votre playlist</label>
              <input name="lastName" type="text" class="form-control" id="inputLastName" placeholder="Enter last name">
            </div>
            <div class="form-group">
              <label for="inputImageUrl">Image URL</label>
              <input name="image" type="text" class="form-control" id="inputImageUrl" placeholder="Enter image URL">
            </div>
            <div class="form-group">
              <label for="inputBio">Bio</label>
              <textarea name="bio" class="form-control" id="inputLastName" placeholder="Bio"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
          <a class="btn btn-success btn-lg" href="/" role="button">retour page d'accueil »</a>
        </div>`
        )
    }

}

const route = pathname => {

}


(() => {
    ['/clement', '/playlist/new'].forEach(
        path => page(path, controllers[path])
    )
    page()
// route()
})()