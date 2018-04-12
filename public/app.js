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
    for (el of elements) {
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
        fetch('/membres')
            .then(res => {
                console.log("dans le fetch, on s'occupe de la res")
                return res.json()
            })
            //on concatène les cartes, une carte par objet du json
            .then(mesplaylists => mesplaylists.reduce((carry, playlist) => carry + makeCard(playlist), ''))
            .then(album => render(`
            <article class="row">
                    <figure class="col-md-3">
                        <img src="http://via.placeholder.com/200x250" alt="avatar" class="img-thumbnail">
                    </figure>
                    <div class="col-md-3">
                        <h2>User Speudo</h2>
                    </div>
                   
                    <div class="card col-md-9">
                        <div class="card-body">
                            <p>Bio :
                                <br> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut commodo sagittis,
                                sapien dui mattis dui, non pulvinar lorem felis nec erat. Aliquam egestas, velit at condimentum placerat,
                                sem sapien laoreet mauris, dictum porttitor lacus est nec enim. Vivamus feugiat elit lorem, eu porttitor
                                ante ultrices id. Phasellus suscipit tellus ante, nec dignissim elit imperdiet nec. Nullam fringilla
                                feugiat nisl. Ut pretium, metus venenatis dictum viverra, dui metus finibus enim, ac rhoncus sem
                                lorem vitae mauris. Suspendisse ut venenatis libero. Suspendisse lorem felis, pretium in maximus
                                id, tempor non ipsum</p>
                        </div>
                    </div>
                    <p><a class="btn btn-success btn-lg" href="/editer-mon-profil" role="button">Editer mon profil</a></p>

                    </article>
                    <div class="row">
                        ${album}
                    </div>
                    <p><a class="btn btn-success btn-lg" href="/newplaylist" role="button">Ajouter une playlist »</a></p>
            `))
    },
    '/editer-mon-profil' : () => {
        render(`
        <div class="container">
            <form id="editMyProfile">
                <div class="form-group col-md-9 ">
                    <label for="inputPseudo ">Pseudo</label>
                    <input name="pseudo" type="text " class="form-control " id="inputPseudo" placeholder="Enter your pseudo ">
                </div>             
                <div class="form-group col-md-9 ">
                    <label for="inputBio ">Bio</label>
                    <textarea name="bio" class="form-control " id="inputBio " placeholder="Bio"></textarea>
                </div>
                <div class="form-group col-md-3 ">
                    <button type="submit " class="btn btn-primary ">Submit</button>
                </div>
            </form>
        </div>
        `)
        const formProfile = document.getElementById('editMyProfile')
        console.log(formProfile)
        formProfile.addEventListener('submit', e => {
            e.preventDefault()
            const dataProfile = serializeForm(formProfile) //mon objet data contient toutes les valeurs des inputs du formulaire
            // Quand je soumet le formulaire, je fais une action create (post) et j'envoie l'objet data
            console.log(dataProfile)
            fetch('/membres', {
                method: 'PUT',
                headers: {
                    // Se renseigner sur la façon de mettre en forme le message
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataProfile) // le corps de ma requête est mon objet data jsonifié. car sqlite fonctionne en json
            })
                .then(res => res.json()) // Demander à THOMAS pourquoi il n'aime pas la syntaxe entre accolades
                .then(wilderEdition => {
                    console.log("notre wilder a bien été edité!!!: ", wilderEdition)
                    // const alertBox = document.getElementById('alert-box')
                    // alertBox.className = 'alert alert-success'
                    // alertBox.innerHTML = `Votre playlist titre ${playlist.title} (${playlist.id}) a bien été créée`
                })
        })
        

    },   
    '/newplaylist': () => {
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
              <label for="inputGenre">Genre musical</label>
              <input name="genre" type="text" class="form-control" id="inputGenre" placeholder="Quel est le genre de votre playlist ?">
            </div>
            <div class="form-group">
                <label for="inputUrl">Url de votre playlist</label>
                <input name="url" type="text" class="form-control" id="inputUrl" placeholder="Entrez l'url de votre playlist">
            </div>
            <div class="form-group">
                <label for="competition">Concourir avec cette playlist?</label>
                <input name="competition" type="radio" id="competition" class="form-control" value="true">
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
            fetch('/playlists', {
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
        fetch('/wilders')
            .then(res => res.json())
            .then(listusers => listusers.reduce((carry, user) => carry + makeWilder(user), ''))
            .then(book => render(
                `
            <div class="row">
            ${book}
            </div>
            `
            ))
    }
}

const route = pathname => {

}


(() => {
    ['/', '/wilders', '/monprofil', '/newplaylist', '/editer-mon-profil'].forEach(
        path => page(path, controllers[path])
    )
    page()
    // route()
})()
