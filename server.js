console.log("je suis le serveur, je commence")
const sqlite = require('sqlite') //importation du module sqlite dans la constante sqlite
const express = require('express') // importation du module express dans la constante express
const Promise = require('bluebird') // importation du module bluebird pour l'utilisation des promises
const app = express() // fonction express qui permet d'importer dans app les méthodes de express
//const team = require('./public/team.json')

//renommer le json, 'playlist" n'étant plus cohérent
const users = require('./public/user-playlists.json') // Pour que cela fonctionne il faut déclarer app.use(express.static('public'))
//we see bodyParser (requirng body-parser module), but do we need it now?
const bodyParser = require('body-parser') // Analyse les corps de requête entrants dans un middleware ?????
let db // db fera référence à sqlite

app.use(express.static('public')) // Acces statique au dossier public
app.use(bodyParser.json()) // Sert à parser le JSON =>  analyse le JSON

// Fonction insertPlaylist qui prend comme paramètre p. La fonction va créer l'objet p qui est composé d'un titre, url et genre.
// const insertPlaylist = p => {
//   const { title, url, genre,  } = p
//   console.log(p)
//   return db.get('INSERT INTO playlists(title, url, genre, id_wilders, compete, nbrevotes) VALUES(?, ?, ?, ?, ?, ?)', title, url, genre, id_wilders, compete, nbrevotes) // On retourne une méthode (db.get) On passe une requête MYSQL qui prend le titre, url et genre
//   .then(() => db.get('SELECT last_insert_rowid() as id')) // On sélectionne l'id de la dernière rangée de la dernière insertion
//   .then(({id})=> db.get('SELECT * from playlists WHERE id = ?', id)) // on sélectionne la playlist qui possède l'id indiqué
// }

  const insertWilder = w => {
    const { pseudo, bio } = w
    console.log('pseudo', pseudo, 'bio', bio)
    return db.get('INSERT INTO wilders(pseudo, bio) VALUES(?, ?)', pseudo, bio) // On retourne une méthode (db.get) On passe une requête MYSQL qui prend le titre, url et genre
    .then(() => db.get('SELECT last_insert_rowid() as id')) // On sélectionne l'id de la dernière rangée de la dernière insertion
    .then(({id})=> db.get('SELECT * from wilders WHERE id = ?', id)) // on sélectionne la playlist qui possède l'id indiqué
  }

  const insertPlaylist = w => {
    const { titre, genre, url, id_wilders, compete, nbrevotes } = w
    return db.get('INSERT INTO playlists(titre, genre, url, id_wilders, compete, nbrevotes) VALUES(?, ?, ?, ?, ?, ?)', titre, genre, url, id_wilders, compete, nbrevotes) // On retourne une méthode (db.get) On passe une requête MYSQL qui prend le titre, url et genre
    .then(() => db.get('SELECT last_insert_rowid() as id')) // On sélectionne l'id de la dernière rangée de la dernière insertion
    .then(({id})=> db.get('SELECT * from playlists WHERE id = ?', id)) // on sélectionne la playlist qui possède l'id indiqué
  }


  const modifyMyProfile = newInfo => {
    const { pseudo, bio } = newInfo
    console.log('pseudo is ', pseudo, 'and bio is : ', bio)
    return db.get('UPDATE wilders SET pseudo=?, bio=? WHERE id=1', pseudo, bio)
    .then(()=> db.get('SELECT * from wilders WHERE ID=1'))
  }

  const dbPromise = Promise.resolve() // insertUser reçoit l'objet data envoyé le post depuis l'app. Pour fonctionner il a besoin que db soit défini, (cf const dbPromise)
    .then(() => sqlite.open('./database.sqlite', {Promise}))
    .then(_db => {
      db = _db
    // console.log("que'est ce que j'obtiens pour db? ", db)
    return db.migrate({force: 'last'})
  })
  .then(() => {
    //console.log("Notre promise: ", Promise)
    Promise.map(users, w => {
      // console.log("notre résultat: ", wilder)
      //console.log('le w mystérieux: ', w)
      insertWilder(w)
      })
    }
) // Question à Thomas pour cette partie car incompréhensible

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

// Faire le app.post pour la route membres
app.post('/membres', (req, res) => { 
  console.log(typeof req.body)
  return insertWilder(req.body)
  .then(recordNewWilder => {
    res.json(recordNewWilder) //j'envoie comme réponse le résultat en json
  }) 
})


//aficher tous les wilders
app.get('/membres', (req, res) => { // Quand je lis la route /membre,
  db.all('SELECT * from wilders')// je sélectionne tous les wilders de la base de données et le résultat de cette sélection
  .then(allWilders => {
    //console.log("notre table wilders ", res.json(allWilders))
    res.json(allWilders)
  }) // on retourne le json
})


// Faire le app.post pour les playlists
app.post('/playlists', (req, res) => { 
  console.log(req.body)
  return insertPlaylist(req.body)
  .then(recordNewPlaylist => {
    res.json(recordNewPlaylist) //j'envoie comme réponse le résultat en json
  }) 
})

app.put('/membres', (req, res) => {
  console.log("nptre reqbody: ", req.body)
  return modifyMyProfile(req.body)
  .then(wilderIsEdited => {
    res.json(wilderIsEdited)
  })
})



// Faire le app.get pour les playlists
app.get('/playlists', (req, res) => { // Quand je lis la route /membre,
  db.all('SELECT * from playlists') // je sélectionne toutes les playlists de la base de données et le résultat de cette sélection
  .then(allPlaylists => {
    //console.log("notre table wilders ", res.json(allPlaylists))
    res.json(allPlaylists)
  }) // on retourne le json
})


//afficher toutes les playlists d'un wilder donné:
// app.get('/membre-:id', (req, res) => {
//   db.all(`SELECT pseudo from wilders WHERE id = 1`)
//   .then(recordNewPlaylist => {
//     console.log("retrouve-t-on notre wilder? ", res.json())
//     res.json(recordNewPlaylist)
//   }) // on retourne le json
// })

app.get('/team', (req, res) => { // Quand je lis la route /membre,
  //res.json(team)
  //db.all('SELECT * from playlists')// je sélectionne toutes les playlists de la base de données et le résultat de cette sélection
  //.then(recordNewPlaylist => res.json(recordNewPlaylist)) // on retourne le json
})



app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
