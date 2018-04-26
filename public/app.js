const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}
// <iframe src="${item.url}" style="width:100%;" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0"></iframe>

const cleanUrl = (str) => {
    const urlRegex =  new RegExp('https:\/\/play.soundsgood.co\/embed\/\\d*\\w*')
    const urlFromIframe = urlRegex.exec(str)
    return urlFromIframe[0]
}

const showModal = (playlist) => {
    const modal = document.getElementById("modal")
    $(modal).modal('show')
    const modalBody = document.getElementById("showThisModal")
    modalBody.innerHTML =`
    <p>Titre: ${playlist.titre}</p>
    <iframe src="${playlist.url}" style="width:100%;" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0"></iframe>` 
}

const makePlaylistCard = item => `
    <div class="col-md-4">
        <div class="card mb-4 box-shadow">
            <div class="card-body">
                <p class="card-text">${item.titre}</p>
                <p>${item.genre}</a>
                <br>
                <button id="${item.playlistId}" type="button" class="launch btn btn-primary" data-toggle="modal" data-target="#modal${item.playlistId}">
                    Lancer ma playlist
                </button>
            </div>
        </div>
    </div>
    `
    
const makeWilder = item => `
<div class="col-12 col-sm-12 col-md-3">
  <div class="card-deck" >
    <div class="card">
      <div class="card">
          <div class="card-body">
              <img class="card-img-fluid-top" src="${item.avatar}" alt="Card image">
              <h5 class="card-title">${item.pseudo}</h5>
              <p class="card-text">${item.bio}</p>
              <a href="/viewplaylists/${item.pseudo.toLowerCase()}" class="btn btn-primary">Voir mes playlists</a>
          </div>
      </div>
    </div>    
  </div>
</div>    
    `
const makeCardMember = item => `
    <div class="jumbotron">
        <div class="row">
            <div class="col-sm-8">
                <h5 class="display-6">Mon profil</h1>
                <hr class="my-4">
                <h1 class="display-4">${item.pseudo}</h1>
                <hr class="my-4">
                <p>${item.bio}</p>
                
            </div>
            <div class="col-sm-4">
                <img src="${item.avatar}" hight="150px" width="300px" alt="My Image"/>
                <p class="mt-2"><a class="btn-sm btn-secondary btn-lg" href="/editer-mon-profil" role="button">Editer mon profil</a>
                <a class="btn-sm btn-info btn-lg" href="/newplaylist" role="button">Ajouter une playlist</a></p>
            </div>
        </div>
    </div>
    `

const makeWinningCard = item => `
    <div class="col-12 col-sm-12 col-md-4">
        <div class="card">
            <img class="card-img-top border" src="https://png.pngtree.com/element_origin_min_pic/17/07/23/473f204a1589862d0264b14f926b4b59.jpg" alt="Card image">
            <div class="card-body">
                <h4 class="card-title">${item.playlists[0].titre}</h4>
                <p class="card-text">${item.playlists[0].nbrevotes} votes</p>
                <a href="https://${item.playlists[0].url}" target="_blank" class="btn btn-primary">Voir la playlist</a>
            </div>
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
        let resultPlaylistCompete
        fetch('/playlistsCompete')
        .then(res => res.json())
        .then(result => result.reduce((carry, user) => carry + user))
        .then(user => {
            resultPlaylistCompete = user
        })
        fetch('/connected')
        .then(res => res.json())
        .then(connectedMember => {
            render(`
                <div class="container">
                    <div class="container text-center">
                        <div class="row">
                            <button type="button" id="hidePlaylist" class="btn btn-warning">La playlist gagnante de la semaine est : ${resultPlaylistCompete.playlists[0].titre} - Elle a obtenu ${resultPlaylistCompete.playlists[0].nbrevotes} votes</button>
                        </div>
                    </div>
                    <br/>
                    <h1>Bienvenue ${connectedMember[0].pseudo}</h1>
                    <h2>Ce que vous pouvez faire:</h2>
                    <ul>
                        <li> 
                            Ajouter une playlist sur votre page profil
                        </li>
                        <li>
                            Consulter la page membre
                        </li>
                    </ul>
                </div>
                `
            )
        })

      },
    '/monprofil': () => {
        fetch('/connected')
        .then(res => res.json())
        .then(membre => makeCardMember(membre[0]))
        .then(mesInfos => render(
            `
            <div class="container">
                <div class="row">
                    ${mesInfos}
                </div>
            </div>

        <h3><code>Mes playlists</code></h3>
        <div class="card-deck">
            <div class="row">
                <div class="card">   
                    <div class="card-body border border-info">
                    <h4 class="card-title">Ma playlist 1</h4>
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p class="card-text"><small class="text-muted">Lien de la playlist</small></p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body border border-info">
                    <h4 class="card-title">Ma playlist 2</h4>
                    <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                    <p class="card-text"><small class="text-muted">Lien de la playlist</small></p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body border border-info">
                    <h4 class="card-title">Ma playlist 3</h4>
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                    <p class="card-text"><small class="text-muted">Lien de la playlist</small></p>
                    </div>
                </div>
                <div class="card">   
                    <div class="card-body border border-info">
                        <h4 class="card-title">Ma playlist 4</h4>
                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        <p class="card-text"><small class="text-muted">Lien de la playlist</small></p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body border border-info">
                        <h4 class="card-title">Ma playlist 5</h4>
                        <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                        <p class="card-text"><small class="text-muted">Lien de la playlist</small></p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body border border-info">
                        <h4 class="card-title">Ma playlist 6</h4>
                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                        <p class="card-text"><small class="text-muted">Lien de la playlist</small></p>
                    </div>
                </div>
            </div>
        </div>
        `
        ))
    },
    '/editer-mon-profil': () => {
        render(`
            <div class="container">
                <div id="alert-box" class="hidden">
                </div>
                <form id="editMyProfile">
                    <div class="form-group col-md-9 ">
                        <label for="inputPseudo">Pseudo</label>
                        <input name="pseudo" type="text " class="form-control " id="inputPseudo" placeholder="Enter your pseudo ">
                    </div>             
                    <div class="form-group col-md-9">
                        <label for="inputBio">Bio</label>
                        <textarea name="bio" class="form-control" id="inputBio " placeholder="Bio"></textarea>
                    </div>
                <div class="form-group col-md-9 ">
                    <label for="inputAvatar ">Avatar</label>
                    <input name="avatar" type="text " class="form-control " id="inputAvatar" placeholder="Enter image URL ">
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
            const data = serializeForm(formProfile)
            if(! data.avatar) {
                const fullName = encodeURIComponent(`${data.bio} ${data.pseudo}`)
                data.avatar = `https://via.placeholder.com/640x480/?text=${fullName}`
            }
            fetch('/membres', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) 
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
            </div>`)
        const form = document.getElementById('add-playlist')
        form.addEventListener('submit', e => {
        e.preventDefault()
        const data = serializeForm(form)

        const embedUrl = cleanUrl(data.url)

        const dataWithId = {
            titre: data.title,
            genre: data.genre,
            url: embedUrl,
            compete: data.competition,
            id_wilders: 1
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
            `<div class="container">
                <div class="row">
                    ${book}  
                </div>
            </div>
                `))
    },
    '/viewplaylists/:slug': ctx => {
        const {
        slug
        } = ctx.params
        fetch(`/membre/${slug}`)
        .then(res => res.json())
        .then(wilder => {
            const playlists = wilder[0].playlists
            const wilderPlaylistsCards = playlists.reduce((acc, playlist) => acc + makePlaylistCard(playlist), '')
            render(`
            <div class="container">
                <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Artezic remercie Soundsgood !</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div id="showThisModal"class="modal-body">
                            </div>
                        </div>
                    </div> 
                </div>
                <h2>Les playlists de ${slug}</h2>
                <div class="row">
                    ${wilderPlaylistsCards}
                </div>
            </div>`
        )
        const launchPlaylistButtons = document.getElementsByClassName("launch")
        Array.from(launchPlaylistButtons).forEach(button => {
            const playlistData = {
                foo: "bar"
            }
            button.addEventListener('click', ()=>{
                const playlistClicked = playlists.filter(playlist => playlist.playlistId === Number(button.id))
                showModal(playlistClicked[0])
            }) 
        })
    })
  },
  '/concours': () => {
    fetch('/playlistsCompete')
      .then(res => res.json())
      .then(result => result.reduce((carry, user) => carry + makeWinningCard(user), ''))
      .then(book => render(`
        <div class="container align-items-center">
            <h3>La playlist gagnante de la semaine est :</h3>
        </div>
        <div class="container align-items-center" style="display: flex; justify-content: center; align-items: center;">
            <div class="row">
                ${book}
            </div>
        </div>    
        `))
    }
}


const route = pathname => {}

(() => {
  ['/', '/wilders', '/monprofil', '/newplaylist', '/editer-mon-profil', '/viewplaylists/:slug', '/concours'].forEach(
    path => page(path, controllers[path])
  )
  page()
})()
