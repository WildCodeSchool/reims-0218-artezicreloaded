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

const serializeForm = form => {
    const data = {}
    const elements = form.getElementsByClassName('form-control')
    for(el of elements) {
        data[el.name] = el.value
    }
    console.log(data)
    return data
}

const controllers = {
  //chaque propriété est une fonction
    '/clement': () => {
        console.log("coucou je suis le console log du controller pour le path /")
        fetch('/membre')
        .then(res => {
            console.log("dans le fetch, on s'occupe de la res")
             return res.json()
        })
        //on concatène les cartes, une carte par objet du json
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
              <input name="url" type="text" class="form-control" id="inputUrl" placeholder="Entrez l'url de votre playlist">
            </div>
            <div class="form-group">
              <label for="inputGenre">Genre musical</label>
              <input name="genre" type="text" class="form-control" id="inputGenre" placeholder="Quel est le genre de votre playlist ?">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
          <a class="btn btn-success btn-lg" href="/" role="button">retour page d'accueil</a>
        </div>`
        )
        const form = document.getElementById('add-playlist')
        form.addEventListener('submit', e => {
            e.preventDefault()
            const data = serializeForm(form) //mon objet data contient toutes les valeurs des inputs du formulaire
            console.log(data)
            //quand je soumets le formulaire, je fetch /membre pour une création (POST)
            fetch('/membre', {
                method: 'POST',
                headers: {
                  // Se renseigner sur la façon de mettre en forme le message
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // le corps de ma requête est mon objet data jsonifié. car sqlite fonctionne en json
            })
            .then(res => res.json()) // Demander à Jean-Luc pourquoi il n'aime pas la syntaxe entre accolades
            .then(playlist => {
                const alertBox = document.getElementById('alert-box')
                alertBox.className = 'alert alert-success'
                alertBox.innerHTML = `Votre playlist titre ${playlist.title} a bien été créée`
            })
        })
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
