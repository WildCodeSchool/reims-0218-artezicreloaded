const mainDiv = document.getElementById('main')

const render = html => {
    mainDiv.innerHTML = html
}

const makePlaylistCard = item => {
    console.log(item)
    return `
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${item.titre}</h5>
            <p class="card-text">${item.genre}</p>
            <a href="${item.url}" class="btn btn-primary">Voir ma playlist</a>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal${item.playlistId}">
            Lancer ma playlist
            </button>

            <!-- Modal -->
            <div class="modal fade" id="modal${item.playlistId}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">${item.titre}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <iframe width="480" height="270" src="${item.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `}
const makeWilder = item => `
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <img class="card-img-top" src="${item.avatar}" alt="Card image">
            <h5 class="card-title">${item.pseudo}</h5>
            <p class="card-text">${item.bio}</p>
            <a href="/viewplaylists/${item.pseudo.toLowerCase()}" class="btn btn-primary">Voir mes playlist</a>
        </div>
    </div>
    `
const makeCardMember = item => `
    <div class="card" style="width:400px">
        <img class="card-img-top" src="${item.avatar}" alt="Card image">
        <div class="card-body">
            <h4 class="card-title">${item.pseudo}</h4>
            <p class="card-text">${item.bio}</p>
            <a href="/viewplaylists/${item.pseudo.toLowerCase()}" class="btn btn-primary">Voir mes playlists</a>
        </div>
    </div>
        `

    const makeWinningCard = item => `
        <div class="card" style="width:400px">
            <img class="card-img-top" src="https://png.pngtree.com/element_origin_min_pic/17/07/23/473f204a1589862d0264b14f926b4b59.jpg" alt="Card image">
            <div class="card-body">
                <h4 class="card-title">${item.playlists[0].titre}</h4>
                <p class="card-text">${item.playlists[0].nbrevotes} votes</p>
                <a href="${item.playlists[0].url}" class="btn btn-primary">Voir la playlist</a>
            </div>
        </div>
        `

const serializeForm = form => {
    const data = {}
    const elements = form.getElementsByClassName('form-control')
    for (let el of elements) {
        data[el.name] = el.value
    }
    return data
}

const controllers = {
    '/': () => {
        fetch('/membre/gontran')
        .then(res => res.json())
        .then(connectedMember => {
            render(`
            <h1>Bienvenue ${connectedMember[0].pseudo}</h1>
            <h2>Ce que vous pouvez faire:</h2>
            <ul>
                <li> 
                    Ajouter une playlist sur votre page profil
                </li>
                <li>
                    Consulter la page membre
                </li>
            </ul>`)
       }) 
        
    },
    '/monprofil': () => {
        fetch('/membre/gontran')
        .then(res => res.json())
        .then(membre => makeCardMember(membre[0]))
        .then(mesInfos=> render(
            `<div class="row">
                ${mesInfos}
            </div>
            <p><a class="btn btn-success btn-lg" href="/editer-mon-profil" role="button">Editer mon profil</a></p>
            <p><a class="btn btn-success btn-lg" href="/newplaylist" role="button">Ajouter une playlist »</a></p>
            `
        ))
    },
    '/editer-mon-profil' : () => {
        render(`
        <div class="container">
            <div id="alert-box" class="hidden">
            </div>
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
        formProfile.addEventListener('submit', e => {
            e.preventDefault()
            const dataProfile = serializeForm(formProfile)
            fetch('/membres', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataProfile) 
            })
            .then(res => res.json())
            .then(wilderEdition => {
                const alertBox = document.getElementById('alert-box')
                alertBox.className = 'alert alert-success'
                alertBox.innerHTML = `${wilderEdition.pseudo}, votre profil titre été édité.`
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
            const data = serializeForm(form)
            const dataWithId = {
                titre: data.title,
                genre: data.genre,
                url: data.url,
                compete: data.competition,
                id_wilders:1
            } 
            
            fetch('/playlists', {
                method: 'POST',
                headers: {
                    
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataWithId)
            })
            .then(res => res.json())
            .then(playlist => {
                const alertBox = document.getElementById('alert-box')
                alertBox.className = 'alert alert-success'
                alertBox.innerHTML = `Votre playlist titre ${playlist.titre} (${playlist.id}) a bien été créée`
            })
        })
    },
    '/wilders': () => {
        fetch('/membres')
        .then(res => res.json())
        .then(listusers => listusers.reduce((carry, user) => carry + makeWilder(user), ''))
        .then(book => render(
            `
            <div class="row">
            ${book}
            </div>
            `)
        )
    },
    '/viewplaylists/:slug': ctx => {
        const { slug } = ctx.params
        fetch(`/membre/${slug}`)
        .then(res => res.json())
        .then(gontran => {
            const playlists = gontran[0].playlists
            const gontranPlaylistsCards = playlists.reduce((acc, playlist) => acc + makePlaylistCard(playlist), '')
            render(`
            <h2>Hello ${slug}, voici vos playlists:</h2>
            <div class="row>
                ${gontranPlaylistsCards}
            </div>`)
        }
      )
    },
    '/concours': () => {
        fetch('/playlistsCompete')
        .then(res => res.json())
        .then(result => result.reduce((carry, user) => carry + makeWinningCard(user), ''))
        .then(book => render(
            `
            <h3>La playlist gagnante de la semaine est :</h3>
            <div class="row">
            ${book}
            </div>
            `)
        )
    }
}


const route = pathname => {
}

(() => {
    ['/', '/wilders', '/monprofil', '/newplaylist', '/editer-mon-profil', '/viewplaylists/:slug', '/concours'].forEach(
        path => page(path, controllers[path])
    )
    page()
})()
