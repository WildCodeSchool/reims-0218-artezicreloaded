const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')
const passport = require('passport')
const jwt = require('jsonwebtoken')

require('./passport-strategy')
//const auth = require('./auth')

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
//app.use('/auth', auth)

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const insertWilder = w => {
  const {
    pseudo,
    password,
    bio,
    avatar
  } = w
  return db.get('INSERT INTO wilders(pseudo, password, bio, avatar) VALUES(?, ?, ?, ?)', pseudo, password, bio, avatar)
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

const insertVote = w => {
  const {
    date,
    id_playlists,
    id_wilders
  } = w
  return db.get('INSERT INTO votes(date, id_playlists, id_wilders) VALUES(?, ?, ?)', date, id_playlists, id_wilders)
}

const modifyMyProfile = newInfo => {
  const { pseudo, bio, avatar } = newInfo
  return db.get('UPDATE wilders SET pseudo=?, bio=?, avatar=? WHERE id=1', pseudo, bio, avatar)
  .then(()=> db.get('SELECT * from wilders WHERE ID=1'))
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
  .then(() => {
    Promise.map(users, w => {
      insertVote(w)
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
        <nav class="navbar navbar-expand-lg navbar-light bg-light col-12 col-sm-12 col-md-12">
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
          <div id="carouselSlidesOnly" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img class="d-block w-100" src="http://res.cloudinary.com/dlfnke6kc/image/upload/v1524129058/artezik_2_reloaded_zfn4l4.jpg" alt="Artezik2 reloaded">
              </div>
            </div>
          </div>
        <div id="main">
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
      return res.json(recordNewWilder)
    })
})

app.post('/voteforplaylist', function(req, res) {
  insertVote(req.body)
  return res.redirect('/concours')
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
      return res.json(wildersWithPlaylists(wilderPlaylists))
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

app.get('/playlists/1', (req, res) => {
  db.all("SELECT * from playlists")
    .then(allPlaylists => {
      res.json(allPlaylists)
    })
})

app.get('/connexion', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.send(`authorized for user ${req.user.username} with id ${req.user.id}`)
})

app.post('/auth/login', function (req, res) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            })
        }
      req.login(user, {session: false}, (err) => {
          if (err) {
              res.send(err)
          }
          // generate a signed son web token with the contents of user object and return it in the response
          const token = jwt.sign(user, 'your_jwt_secret')
          return res.json({user, token})
        })
      })(req, res)
})


app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8000)
