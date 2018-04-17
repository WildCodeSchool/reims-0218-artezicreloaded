console.log("je suis le serveur, je commence")
const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')
const app = express() 

const users = require('./public/user-playlists.json') 
const bodyParser = require('body-parser')
let db 

app.use(express.static('public')) 
app.use(bodyParser.json())

const insertWilder = w => {
  const { pseudo, bio, avatar } = w
  return db.get('INSERT INTO wilders(pseudo, bio, avatar) VALUES(?, ?, ?)', pseudo, bio, avatar) 
  .then(() => db.get('SELECT last_insert_rowid() as id')) 
  .then(({id})=> db.get('SELECT * from wilders WHERE id = ?', id)) 
}

const insertPlaylist = w => {
  const { titre, genre, url, id_wilders, compete, nbrevotes } = w
  return db.get('INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes) VALUES(?, ?, ?, ?, ?, ?)', titre, genre, url, id_wilders, compete, nbrevotes) // On retourne une méthode (db.get) On passe une requête MYSQL qui prend le titre, url et genre
  .then(() => db.get('SELECT last_insert_rowid() as id')) 
  .then(({id})=> db.get('SELECT * from playlists WHERE id = ?', id))
}

const modifyMyProfile = newInfo => {
  const { pseudo, bio } = newInfo
  console.log('pseudo is ', pseudo, 'and bio is : ', bio)
  return db.get('UPDATE wilders SET pseudo=?, bio=? WHERE id=1', pseudo, bio)
  .then(()=> db.get('SELECT * from wilders WHERE ID=1'))
}

const dbPromise = Promise.resolve() 
  .then(() => sqlite.open('./database.sqlite', {Promise}))
  .then(_db => {
    db = _db
  return db.migrate({force: 'last'})
})
.then(() => {
  Promise.map(users, w => {
    insertWilder(w)
    })
  }
) 

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
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
      </ul>
      </div>
      </nav>
      <div id="main">

      </div>
    </div>
    <script src="/page.js"></script>
    <script src="/app.js"></script>
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

app.get('/membre', (req, res) => { 
  db.all("SELECT * from wilders WHERE id='1'")
  .then(oneWilder => {
    res.json(oneWilder)
  })
})


app.get('/membres', (req, res) => { 
  db.all('SELECT * from wilders')
  .then(allWilders => {
    res.json(allWilders)
  })
})

app.post('/playlists', (req, res) => {
  console.log("the req sends: ", req.body)
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
  db.all('SELECT * from playlists')
  .then(allPlaylists => {
    res.json(allPlaylists)
  })
})

//HERE SHOW supposedly connected user playlists. His id_wilders is 1.
app.get('/playlists/1', (req, res) => {
  console.log("on est en train de requeter playlists/1") 
  //db.all("SELECT * from playlists WHERE titre='pioupiou'") //this works. Just a test, erase it when feature is completed
  //TODO: we need some kind of inner join because we cannot request 
  //WHERE id_wilders directly.
  db.all("SELECT * from playlists WHERE ..........)
  .then(allPlaylists => {
    res.json(allPlaylists)
  })
})

app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
