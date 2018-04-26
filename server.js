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
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <body>
    <div class="container-fluid">
      
        <nav class="navbar navbar-expand-lg navbar-light bg-light col-12 col-sm-12 col-md-12"">
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
  </body>
	<section id="footer">
		<div class="container">
			<div class="row text-center text-xs-center text-sm-left text-md-left">
				<div class="col-xs-12 col-sm-4 col-md-4">
					<h5>Linkedin des développeurs</h5>
					<ul class="list-unstyled quick-links">
						<li><a href="https://www.linkedin.com/in/aureliebayre/"><i class="fa fa-angle-double-right"></i>Aurélie Bayre</a></li>
						<li><a href="https://www.linkedin.com/in/max-gallois/"><i class="fa fa-angle-double-right"></i>Max Gallois</a></li>
						<li><a href="https://www.linkedin.com/in/arnaud-gadroy-63136115a/"><i class="fa fa-angle-double-right"></i>Arnaud Gadroy</a></li>
						<li><a href="https://www.linkedin.com/in/thibaud-royer-93a7b715a/"><i class="fa fa-angle-double-right"></i>Thibaud Royer</a></li>
					</ul>
				</div>
        <div class="col-xs-12 col-sm-4 col-md-5">
          <a href="https://fr-fr.facebook.com/"><i class="fa fa-facebook fa-4x fa-fw"></i></a>
          <a href="https://twitter.com/"><i class="fa fa-twitter fa-4x fa-fw"></i></a>
          <a href="https://www.youtube.com/"><i class="fa fa-youtube-play fa-4x fa-fw"></i></a>
          <a href="https://www.spotify.com/fr/"><i class="fa fa-spotify fa-4x fa-fw"></i></a>
          <a href="https://soundcloud.com/"><i class="fa fa-soundcloud fa-4x fa-fw"></i></a>
        </div>	
        <div class="col-xs-12 col-sm-4 col-md-3">
          <img id="school" src="https://wildcodeschool.fr/wp-content/uploads/2016/05/cropped-naviconWCS-300x300.png">
        </div>
       </div> 	
		</div>
	</section>
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
