const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')

const {
  wildersWithPlaylists
} = require('./playlists.js')
const {
  isolatePlaylist
} = require('./playlists.js')

const app = express()

const users = require('./public/user-playlists.json')
const bodyParser = require('body-parser')
let db

app.use(express.static('public'))
app.use(bodyParser.json())

const insertWilder = w => {
  const {
    pseudo,
    bio,
    avatar
  } = w
  return db.get('INSERT INTO wilders(pseudo, bio, avatar) VALUES(?, ?, ?)', pseudo, bio, avatar)
    .then(() => db.get('SELECT last_insert_rowid() as id'))
    .then(({
      id
    }) => db.get('SELECT * from wilders WHERE id = ?', id))
}

const insertPlaylist = w => {
  const {
    titre,
    genre,
    url,
    id_wilders,
    compete,
    nbrevotes
  } = w
  return db.get('INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes) VALUES(?, ?, ?, ?, ?, ?)', titre, genre, url, id_wilders, compete, nbrevotes) // On retourne une méthode (db.get) On passe une requête MYSQL qui prend le titre, url et genre
    .then(() => db.get('SELECT last_insert_rowid() as id'))
    .then(({
      id
    }) => db.get('SELECT * from playlists WHERE id = ?', id))
}

const modifyMyProfile = newInfo => {
  const {
    pseudo,
    bio
  } = newInfo
  return db.get('UPDATE wilders SET pseudo=?, bio=? WHERE id=1', pseudo, bio)
    .then(() => db.get('SELECT * from wilders WHERE ID=1'))
}

const dbPromise = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', {
    Promise
  }))
  .then(_db => {
    db = _db
    return db.migrate({
      force: 'last'
    })
  })
  .then(() => {
    Promise.map(users, w => {
      insertWilder(w)
    })
  })
  .then(() => {
    Promise.map(users, w => {
      insertPlaylist(w)
    })
  })

const html = `
  <!doctype html>
  <html class="no-js" lang="">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>Artezic Reloaded</title>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <div class="row">
          <nav class="navbar navbar-expand-lg navbar-dark bg-primary col-12 col-sm-12 col-md-12">
            <a class="navbar-brand" href="/">Artezic</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <a class="nav-link" href="/monprofil">Mon profil<span class="sr-only">(current)</span></a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/wilders">Equipe</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/concours">Concours</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="/vainqueurs">Vainqueurs</a>
                  </li>
                </ul> 
              </div>
                <button class="btn btn-outline-light my-2 my-sm-0" href="/connexion" role="button">Connexion</button>
          </nav>
          <div id="carouselSlidesOnly" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img class="d-block w-100" src="http://res.cloudinary.com/dlfnke6kc/image/upload/v1524129058/artezik_2_reloaded_zfn4l4.jpg" alt="Artezik2 reloaded">
              </div>
            </div>
          </div>
        <div id="main">
        </div>
      </div>
      <script src="/page.js"></script>
      <script src="/app.js"></script>
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    </body>
  </html>`

app.get('/', (req, res) => {
  res.send(html)
  res.end()
})

app.post('/membres', (req, res) => {
  return insertWilder(req.body)
    .then(recordNewWilder => {
      res.json(recordNewWilder)
    })
})

app.get('/connected', (req, res) => {
  db.all(`
      SELECT wilders.id as wilderId, playlists.id as playlistId, pseudo, avatar, bio, titre, genre, url, compete, nbrevotes
      from wilders
      left join playlists on wilders.id = playlists.id_wilders
      WHERE id_wilders = 1
      ; 
      `)
    .then(wilderPlaylists => {
      res.json(wildersWithPlaylists(wilderPlaylists))
    })
})

app.get('/membre/:slug', (req, res) => {
  const slug = req.params
  const pseudoFromSlug = [...slug.slug][0].toUpperCase() + slug.slug.slice(1)
  db.all(`
    SELECT wilders.id as wilderId, playlists.id as playlistId, pseudo, avatar, bio, titre, genre, url, compete, nbrevotes
    from wilders
    left join playlists on wilders.id = playlists.id_wilders
    WHERE pseudo = "${pseudoFromSlug}"
    ; 
    `)
    .then(wilderPlaylists => {
      res.json(wildersWithPlaylists(wilderPlaylists))
    })
})

app.get('/membres', (req, res) => {
  db.all('SELECT * from wilders')
    .then(allWilders => {
      res.json(allWilders)
    })
})

app.post('/playlists', (req, res) => {
  return insertPlaylist(req.body)
    .then(recordNewPlaylist => {
      res.json(recordNewPlaylist)
    })
})

app.put('/membres', (req, res) => {
  return modifyMyProfile(req.body)
    .then(wilderIsEdited => {
      res.json(wilderIsEdited)
    })
})

app.get('/playlists', (req, res) => {
  db.all('SELECT * from wilders')
    .then(allPlaylists => {
      res.json(allPlaylists)
    })
})

app.get('/playlistsWilders', (req, res) => {
  db.all(
    `SELECT wilders.id as wilderId, playlists.id as playlistId, pseudo, avatar, bio, titre, genre, url, compete, nbrevotes
      from wilders
      left join playlists on wilders.id = playlists.id_wilders
    `
  )
    .then(playlistsByWilders => {
      res.json(playlistsByWilders)
    })
})

app.get('/playlistsInCompete', (req, res) => {
  db.all(
    `SELECT wilders.id as wilderId, playlists.id as playlistId, pseudo, avatar, bio, titre, genre, url, compete, nbrevotes
      from wilders
      left join playlists on wilders.id = playlists.id_wilders
      where compete = "true"
    `
  )
    .then(playlistsReturn => {
      return res.json(wildersWithPlaylists(playlistsReturn))
    })
})

app.get('/playlistsCompete', (req, res) => {
  db.all(
    `SELECT wilders.id as wilderId, playlists.id as playlistId, pseudo, avatar, bio, titre, genre, url, compete, nbrevotes
      from wilders
      left join playlists on wilders.id = playlists.id_wilders
      where compete = "true"
      order by nbrevotes desc
      limit 1
    `
  )
    .then(playlistsReturn => {
      return res.json(wildersWithPlaylists(playlistsReturn))
    })
})

app.get('/playlists/1', (req, res) => {
  db.all("SELECT * from playlists")
    .then(allPlaylists => {
      res.json(allPlaylists)
    })
})

app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
