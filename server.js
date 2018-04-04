console.log("je suis le serveur, je commence")
const sqlite = require('sqlite') //for the post route
const express = require('express')
const Promise = require('bluebird') //...used to make the database promise
const app = express()
const playlist = require('./public/user-playlists.json')
//we see bodyParser (requirng body-parser module), but do we need it now?
const bodyParser = require('body-parser')
let db //apparently it's going to be redefined by the post route

app.use(express.static('public'))
app.use(bodyParser.json())

//this will be called by the Promise when redifining db
const insertPlaylist = p => {
  const { title, url, genre } = p
  console.log(p)
  return db.get('INSERT INTO playlists(title, url, genre) VALUES(?, ?, ?)', title, url, genre)
  .then(() => db.get('SELECT last_insert_rowid() as id'))
  .then(({id})=> db.get('SELECT * from playlists WHERE id = ?', id))
}
 const dbPromise = Promise.resolve()
 .then(() => sqlite.open('./database.sqlite', {Promise}))
.then(_db => {
db = _db
console.log(db)
return db.migrate({force: 'last'})
})
.then(() => Promise.map(playlist, p => insertPlaylist(p)))


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
    <h1>Hello Clément</h1>
    <p><a class="btn btn-success btn-lg" href="/playlist/new" role="button">Ajouter une playlist »</a></p>
    <div id="main">

    </div>
    <script src="/page.js"></script>
    <script src="/app.js"></script>
  </body>
</html>`

app.get('/', (req, res) => {
  res.send(html)
  res.end()
})

app.get('/membre', (req, res) => {
  db.all('SELECT * from playlists')//ici il y aura un appel à la base de donnée
  .then(recordNewPlaylist => res.json(recordNewPlaylist))
})

app.post('/membre', (req, res) => {
  console.log('on fait le post')
  return insertPlaylist(req.body)
  .then(recordNewPlaylist => res.json(recordNewPlaylist))
})

app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
