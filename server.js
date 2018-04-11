console.log("je suis le serveur, je commence")
const sqlite = require('sqlite') //importation du module sqlite dans la constante sqlite
const express = require('express') // importation du module express dans la constante express
const Promise = require('bluebird') // importation du module bluebird pour l'utilisation des promises
const app = express() // fonction express qui permet d'importer dans app les méthodes de express
const team = require('./public/team.json')
const playlist = require('./public/user-playlists.json') // Pour que cela fonctionne il faut déclarer app.use(express.static('public'))
//we see bodyParser (requirng body-parser module), but do we need it now?
const bodyParser = require('body-parser') // Analyse les corps de requête entrants dans un middleware ?????
let db // db fera référence à sqlite

app.use(express.static('public')) // Acces statique au dossier public
app.use(bodyParser.json()) // Sert à parser le JSON =>  analyse le JSON

// Fonction insertPlaylist qui prend comme paramètre p. La fonction va créer l'objet p qui est composé d'un titre, url et genre.
const insertPlaylist = p => {
  const { title, url, genre } = p
  console.log(p)
  return db.get('INSERT INTO playlists(title, url, genre) VALUES(?, ?, ?)', title, url, genre) // On retourne une méthode (db.get) On passe une requête MYSQL qui prend le titre, url et genre
  .then(() => db.get('SELECT last_insert_rowid() as id')) // On sélectionne l'id de la dernière rangée de la dernière insertion
  .then(({id})=> db.get('SELECT * from playlists WHERE id = ?', id)) // on sélectionne la playlist qui possède l'id indiqué
}

 const dbPromise = Promise.resolve() // insertUser reçoit l'objet data envoyé le post depuis l'app. Pour fonctionner il a besoin que db soit défini, (cf const dbPromise)
 .then(() => sqlite.open('./database.sqlite', {Promise}))
.then(_db => {
db = _db
console.log(db)
return db.migrate({force: 'last'})
})
.then(() => Promise.map(playlist, p => insertPlaylist(p))) // Question à Thomas pour cette partie car incompréhensible

// Squelette de la page /*
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
    <h1>Bienvenue ---nom de l'utilisateur---</h1>
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
    <script src="/page.js"></script>
    <script src="/app.js"></script>
  </body>
</html>`


 // Quand je lis la route /, j'envoie le html sur la route /
app.get('/', (req, res) => {
  res.send(html)
  res.end()
})

app.get('/membre', (req, res) => { // Quand je lis la route /membre,
  db.all('SELECT * from playlists')// je sélectionne toutes les playlists de la base de données et le résultat de cette sélection
  .then(recordNewPlaylist => res.json(recordNewPlaylist)) // on retourne le json
})

app.get('/team', (req, res) => { // Quand je lis la route /membre,
  res.json(team)
  //db.all('SELECT * from playlists')// je sélectionne toutes les playlists de la base de données et le résultat de cette sélection
  //.then(recordNewPlaylist => res.json(recordNewPlaylist)) // on retourne le json
})

app.post('/membre', (req, res) => { // Quand je fais un appel pour créer sur la route membre, je retourne le résultat de insertPlayList auquel je passe le body de la request
  console.log('on fait le post')
  return insertPlaylist(req.body)
  .then(recordNewPlaylist => res.json(recordNewPlaylist)) //j'envoie comme réponse le résultat en json
})

app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
