console.log("je suis le app.js, keskispasse?")
const mainDiv = document.getElementById('main')

const render = html => {
    mainDiv.innerHTML = html
}

const makeCard = item => `
    <div class="card" style="width: 18rem;">
        <img class="card-img-top" src="..." alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.genre}</p>
            <a href="${item.url}" class="btn btn-primary">Voir ma playlist</a>
        </div>
    </div>
    `

const controllers = {
    '/': () => {
        console.log("coucou je suis le console log du controller pour le path /")
        fetch('/membre')
        .then(res => {
            console.log("dans le fetch, on s'occupe de la res")
             return res.json()
        })
        .then(mesplaylists => mesplaylists.reduce((carry, playlist) => carry + makeCard(playlist), ''))
        .then(album => render(
            `
            <div class="row">
            ${album}
            </div>
            `
        ))
    },
    '/users/new': () => {
        render(
        `<div class="container">
          <div id="alert-box" class="hidden">
    
          </div>
          <form id="add-pirate">
            <div class="form-group">
              <label for="inputFirstName">First name</label>
              <input name="firstName" type="text" class="form-control" id="inputFirstName" placeholder="Enter first name">
            </div>
            <div class="form-group">
              <label for="inputLastName">Last name</label>
              <input name="lastName" type="text" class="form-control" id="inputLastName" placeholder="Enter last name">
            </div>
            <div class="form-group">
              <label for="inputImageUrl">Image URL</label>
              <input name="image" type="text" class="form-control" id="inputImageUrl" placeholder="Enter image URL">
            </div>
            <div class="form-group">
              <label for="inputBio">Bio</label>
              <textarea name="bio" class="form-control" id="inputLastName" placeholder="Bio"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>`
        )
        const form = document.getElementById('add-pirate')
        form.addEventListener('submit', e => {
            e.preventDefault()
            const data = serializeForm(form)
            if(! data.image) {
                const fullName = encodeURIComponent(`${data.firstName} ${data.lastName}`)
                data.image = `https://via.placeholder.com/640x480/?text=${fullName}`
            }
            fetch('/pirates', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(pirate => {
                const alertBox = document.getElementById('alert-box')
                alertBox.className = 'alert alert-success'
                alertBox.innerHTML = `Successfully created pirate ${pirate.firstName} (${pirate.id})`
            })
        })
    }
}

const route = pathname => {

}
(() => {
    ['/'].forEach(
        path => page(path, controllers[path])
    )
    page()
// route()
})()