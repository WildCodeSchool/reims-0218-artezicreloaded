const express = require('express')
const app = express()
const playlist = require('./public/user-playlists.json')

app.use(express.static('public'))

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
    <h1>elo Toma</h1>
    <div id="main">

    </div>
    <script src="app.js"></script>
  </body>
</html>`
 
app.get('/', (req, res) => {
  res.send(html)
  res.end()
})

app.get('/membre', (req, res) => {
    res.json(playlist)
    res.end()
  })

app.listen(8000)