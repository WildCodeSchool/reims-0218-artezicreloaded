const express = require('express')
const app = express()

app.use(express.static('public'))

const html = `
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <title>Artezic Reloaded</title>
    <link rel="stylesheet" href="bootstrap.min.css" />
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

app.listen(8000)