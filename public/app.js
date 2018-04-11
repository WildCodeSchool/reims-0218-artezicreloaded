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
    const makeWilder = item => `
    <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="..." alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${item.pseudo}</h5>
            <p class="card-text">${item.password}</p>
            <a href="${item.email}" class="btn btn-primary">Voir ma playlist</a>
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
    '/': () => {
      render(`
        <h2>Ce que vous pouvez faire:</h2>
        <li> Ajouter une playlist sur votre page profil
        </li>
        <li>Consulter la page membre
        </li>`)
    },
    '/monprofil': () => {
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
                <p><a class="btn btn-success btn-lg" href="/playlist/new" role="button">Ajouter une playlist »</a></p>
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
            // Quand je soumet le formulaire, je fais une action create (post) et j'envoie l'objet data
            fetch('/profil', {
                method: 'POST',
                headers: {
                  // Se renseigner sur la façon de mettre en forme le message
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // le corps de ma requête est mon objet data jsonifié. car sqlite fonctionne en json
            })
            .then(res => res.json()) // Demander à THOMAS pourquoi il n'aime pas la syntaxe entre accolades
            .then(playlist => {
                console.log("alerte ?")
                const alertBox = document.getElementById('alert-box')
                alertBox.className = 'alert alert-success'
                alertBox.innerHTML = `Votre playlist titre ${playlist.title} (${playlist.id}) a bien été créée`
            })
        })
    },
    '/wilders': () => {
        fetch('/team')
        .then(res => res.json())
        .then(listusers => listusers.reduce((carry, user) => carry + makeWilder(user), ''))
        .then(book => render(
            `
            <div class="row">
            ${book}
            </div>
            `
        ))
    },

    // Voir mes playlists au lieu de voir ma playlist

    '/viewplaylists/:slug': ctx => {
      const { slug } = ctx.params
      fetch('/team')
      .then(res => res.json())
      .then(members => members.find(member => member.slug === slug))
      .then(member => render(`<div class="container">
        <div class="row">
          <div class="col-md-6">
            <img src="${member.avatar}" alt="${member.avatar} ${member.user}" class="img-fluid" />
          </div>
          <div class="col-md-6">
            <h1>${member.user}</h1>
            <p>${member.bio}</p>
          </div>
        </div>
      </div>`))
    }
}

const route = pathname => {

}


(() => {
    ['/', '/wilders', '/monprofil', '/playlist/new', '/users/:slug'].forEach(
        path => page(path, controllers[path])
    )
    page()
// route()
})()
