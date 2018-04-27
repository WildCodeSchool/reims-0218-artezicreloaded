const mainDiv = document.getElementById('main')

require('./passport-strategy');

const render = html => {
  mainDiv.innerHTML = html
}

const cleanUrl = (str) => {
  const urlRegex = new RegExp('https:\/\/play.soundsgood.co\/embed\/\\d*\\w*')
  const urlFromIframe = urlRegex.exec(str)
  return urlFromIframe[0]
}

const showModal = (playlist) => {
  const modal = document.getElementById("modal")
  $(modal).modal('show')
  const modalBody = document.getElementById("showThisModal")
  modalBody.innerHTML = `
    <p>Titre: ${playlist.titre}</p>
    <iframe src="${playlist.url}" style="width:100%;" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0"></iframe>`
}

//TODO: change value of first input when authentication is ready 

const makePlaylistCard = (item, tokenInStore) => {
    return !tokenInStore ? `
        <div class="col-md-4">
            <div class="card mb-4 box-shadow">
                <div class="card-body">
                    <p class="card-text">${item.titre}</p>
                    <p>${item.genre}</a>
                    <br>
                    <button id="${item.playlistId}" type="button" class="launch btn btn-primary" data-toggle="modal" data-target="#modal${item.playlistId}">
                        Lancer ma playlist
                    </button>
                    <a href="/authentification" id="vote${item.playlistId}"class="btn btn-success mt-2">J'aime</a>
                </div>
            </div>
        </div>
    
    ` : `
    <div class="col-md-4">
        <div class="card mb-4 box-shadow">
            <div class="card-body">
                <p class="card-text">${item.titre}</p>
                <p>${item.genre}</a>
                <br>
                <button id="${item.playlistId}" type="button" class="launch btn btn-primary" data-toggle="modal" data-target="#modal${item.playlistId}">
                    Lancer ma playlist
                </button>
                <form action="/voteforplaylist" method="post">
                    <input type="hidden" value="1" name="id_wilders" />
                    <input type="hidden" value="1" name="vote" />
                    <input type="hidden" value="${item.playlistId}" name="id_playlists" />
                    <input type="hidden" value="${Date.now()}" name="date" />
                    <button id="vote${item.playlistId}" type="submit" class="btn btn-success mt-2">J'aime</button>
                </form>
            </div>
        </div>
    </div>
    ` }
const makeWilder = item => `
  <div class="col-12 col-sm-12 col-md-3 ">
    <div class="d-flex justify-content-around">
      <div class="card w-100">
          <div class="card-body">
              <img class="card-img-top" src="${item.avatar}" alt="Card image">
              <h5 class="card-title">${item.pseudo}</h5>
              <p class="card-text">${item.bio}</p>
              <a href="/viewplaylists/${item.pseudo.toLowerCase()}" class="btn btn-primary">Voir mes playlists</a>
          </div>
        </div>
      </div>  
  </div>
    `
const makeCardMember = item => `
    <div class="card">
        <img class="card-img-top" src="${item.avatar}" alt="Card image">
        <div class="card-body">
          <h4 class="card-title">${item.pseudo}</h4>
          <p class="card-text">${item.bio}</p>
          <a href="/viewplaylists/${item.pseudo.toLowerCase()}" class="btn btn-primary">Voir mes playlists</a>
        </div>
    </div>
        `

const makeWinningCard = item => item.votesNb === null ? `<h5> Pas de gagnant pour l'instant </h5>` : `
    <div class="col-12 col-sm-12 col-md-4">
        <div class="card">
            <img class="card-img-top" src="https://png.pngtree.com/element_origin_min_pic/17/07/23/473f204a1589862d0264b14f926b4b59.jpg" alt="Card image">
            <div class="card-body">
                <h4 class="card-title">${item.titre}</h4>
                <p class="card-text">${item.votesNb} votes</p>
                <br>
                <button id="launchPlaylist" type="button" class="launch btn btn-primary" data-toggle="modal" data-target="#modal${item.playlistId}">
                    Lancer ma playlist
                </button>
            </div>
        </div>
      </div>
    </div>
    `

const makeListsInCompete = item => `
    <div class="card mt-3 mr-3" style="width:400px">
        <div class="card-body">
            <h4 class="card-title">${item.playlists[0].titre}</h4>
            <p class="card-text">${item.playlists[0].nbrevotes} votes</p>
            <a href="${item.playlists[0].url}" class="btn btn-primary">Afficher la playlist</a>
            <form action="/voteforplaylist" method="post">
                <input type="hidden" value="1" name="id_wilders" />
                <input type="hidden" value="${item.playlists[0].playlistId}" name="id_playlists" />
                <input type="hidden" value="${Date.now()}" name="date" />
                <button type="submit" class="btn btn-success mt-2">Voter pour cette playlist</button>
            </form>
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

//const token = localStorage.getItem('token')
  /*
    *   const token gets the token from local store. 
    * if no token in store, then value = null
    */
   const localStore = localStorage
   let token = localStore.getItem('token')
   console.log(token)


const controllers = {
  '/': () => {
    fetch('/playlistsWilders')
      .then(res => res.json())
      .then(allPlaylists => {

        const allPlaylistsCards = allPlaylists.reduce((carry, playlist) => carry + makePlaylistCard(playlist, token), '')
        render(
          `<div class="container">
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
                <div class="row">
                    ${allPlaylistsCards}  
                </div>
            </div>
            `
        )
        const launchPlaylistButtons = document.getElementsByClassName("launch")
        Array.from(launchPlaylistButtons).forEach(button => {
          button.addEventListener('click', () => {
            const playlistClicked = allPlaylists.filter(playlist => playlist.playlistId === Number(button.id))
            showModal(playlistClicked[0])
          })
        })
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
            <br/>
            <p><a class="btn btn-success btn-lg" href="/editer-mon-profil" role="button">Editer mon profil</a></p>
            <p><a class="btn btn-success btn-lg" href="/newplaylist" type="button">Ajouter une playlist</a></p>
          </div>
        </div>
      `))
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
      if (!data.avatar) {
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
                <label for="inputUrl">Copiez Le code intégré de Soundsgood</label>
                <input name="url" type="text" class="form-control" id="inputUrl" placeholder="Copiez Ici">
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

    '/authentification': () => {
        const loginFormHtml = `<form id="loginForm">
            <input class="form-control" name="username" placeholder="username"/>
            <input class="form-control" type="password" name="password" placeholder="password"/>
            <input type="submit" value="se connecter" />
            </form>
            `
    render(`
        <div id="alert-login"></div> 
        ${ !token ? loginFormHtml : '<button id="disconnect" type="button">se deconnecter</button>' }
        <div id="test">CALL TEST</div>
    `)
    if (!token) {
        const loginForm = document.getElementById('loginForm')
        loginForm.addEventListener('submit', e => {
            e.preventDefault()
            //data ?
            const data = serializeForm(loginForm)
            console.log(data)
            //post sur le server /auth/login
            fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                const alert = document.getElementById('alert-login')
                if(!data.user) {
                    //alert class danger
                    alert.innerHTML = `echec`
                } else {
                    alert.innerHTML = `${data.user.username} est connecté <button id="disconnect" type="button">se deconnecter</button>`
                    //stores the token
                    localStorage.setItem('token', data.token)
                    loginForm.style.display = 'none'
                    document.getElementById('disconnect').addEventListener('click', () => {
                        localStorage.removeItem('token')
                        render(`
                            <div id="alert-login"></div> 
                            ${ loginFormHtml }
                            <div id="test">CALL TEST</div>
                        `)
                    })
                }
            })
        })
    } else {
        document.getElementById('disconnect').addEventListener('click', () => {
            localStorage.removeItem('token')
            render(`
                <div id="alert-login"></div> 
                ${ loginFormHtml }
                <div id="test">CALL TEST</div>
            `)
        })
    }

    document.getElementById('test').addEventListener('click', () => {
        const token = localStorage.getItem('token')
        console.log(token)
        fetch('test',{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,          
            }
        })
        .then(res => res.json())
        .catch(err => console.log(err))
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
          button.addEventListener('click', () => {
            const playlistClicked = playlists.filter(playlist => playlist.playlistId === Number(button.id))
            showModal(playlistClicked[0])
          })
        })
      })
  },

  '/concours': () => {
    fetch('/playlistsCompete')
      .then(res => res.json())
      .then(result => {
        const winningPlaylistData = result[0].playlists
        const winner = makeWinningCard(result[0])
        render(`
            <div class="container align-items-center">
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
            </div>
            <div class="container align-items-center" style="display: flex; justify-content: center; align-items: center;">
                <div class="row">
                    ${winner}
                </div>
            </div>    
            `)
        const winningPlaylistButton = document.getElementById('launchPlaylist')
        winningPlaylistButton.addEventListener('click', () => {
          return showModal(result[0])
        })
      })
  },
  '/connexion': () => {
    render(`<form id="loginForm">
    <input class="form-control" name="username" placeholder="username"/>
    <input class="form-control" type="password" name="password" placeholder="password"/>
    <input type="submit" value="se connecter" />
    </form>`)
    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', e => {
      e.preventDefault()
      const data = serializeForm(loginForm)
      console.log(data)
      fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    })
  }
}


const route = pathname => { }

(() => {
  ['/', '/wilders', '/monprofil', '/newplaylist', '/editer-mon-profil', '/viewplaylists/:slug', '/concours', '/authentification', '/connexion'].forEach(
    path => page(path, controllers[path])
  )
  page()
})()
