const mainDiv = document.getElementById('main')

export { render, refreshInterval, refreshToHome, showModal, disconnect, makePlaylistWithoutToken, makePlaylistCardWithToken }

const render = html => {
    mainDiv.innerHTML = html
}

const refreshInterval = () => setTimeout(()=>location.reload(), 2000)

const refreshToHome = () => setTimeout(() => location.replace('/'), 1500)

const showModal = (playlist) => {
    const modal = document.getElementById("modal")
    $(modal).modal('show')
    const modalBody = document.getElementById("showThisModal")
    modalBody.innerHTML = `
      <p>Titre: ${playlist.titre}</p>
      <iframe src="${playlist.url}" style="width:100%;" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0"></iframe>`
  }

const disconnect = obj => {
    const disconnectButton = document.getElementById('disconnect')
    disconnectButton.addEventListener('click', () => {
        obj.removeItem('token')
        obj.removeItem('username')
        render(`
        <div class="alert alert-warning" role="alert">
            Vous avez êté déconnecté.
        </div>
            
        `)
        refreshToHome()
    })
}

const makePlaylistWithoutToken = (item) => {
	return `
	<div class="col-md-6">
		<div class="card text-center text-white bg-secondary mt-4 pt-3">
			<div class="card-block">
			<h2 class="text-warning">${item.titre}</h2>
			<p class="text-light">${item.genre}</p>
			<button id="${
				item.playlistId
			}" type="button" class="launch btn-lg btn-warning" data-toggle="modal" data-target="#modal${
		item.playlistId
	}">
				Ecouter cette playlist
			</button>
			<p>
				<a href="/authentification" id="vote${
					item.playlistId
				}" style="font-size:3em; color:GhostWhite" id="vote${
		item.playlistId
	}" type="submit" class="btn btn-info mt-2"><i class="fas fa-thumbs-up"></i></a>
			</p>
			</div>
		</div>
	</div>   
	`;
}
const makePlaylistCardWithToken = (item, tokenInStore, idWilder, arr) => {
	if (!arr.includes(item.playlistId)) {
		return ` 
		<div class="col-md-6">
			<div class="card text-center text-white bg-secondary mt-4 pt-3">
				<div class="card-block">
				<h2 class="text-warning">${item.titre}</h3>
				<p class="text-light">${item.genre}</p>
					<button id="${
						item.playlistId
					}" type="button" class="launch btn-lg btn-warning" data-toggle="modal" data-target="#modal${
			item.playlistId
		}">
						Ecouter cette playlist
					</button>
					
					<button data-idPlaylist=${item.playlistId} data-idWilder=${idWilder} style="font-size:3em; color:GhostWhite" id="vote${
						item.playlistId
					}" type="submit" class="votingButton btn btn-info mt-2"><i class="fas fa-thumbs-up"></i></button>
				
				</div>
			</div>
		</div>
        `;
	} else {
		return `
		<div class="col-md-6">
			<div class="card text-center text-white bg-secondary mt-4 pt-3">
				<div class="card-block">
					<h2 class="text-warning">${item.titre}</h3>
					<p class="text-light">${item.genre}</p>
					<br>
					<button id="${
						item.playlistId
					}" type="button" class="launch btn-lg btn-warning" data-toggle="modal" data-target="#modal${
			item.playlistId
		}">
						Ecouter cette playlist
					</button>
					<p><button id="vote${
						item.playlistId
					}" class="alreadyVoted btn btn-success mt-5">&#10003;</button></p>
				</div>
			</div>
		</div>
		`;
	}
}

export default { render, refreshInterval, refreshToHome, showModal, disconnect, makePlaylistWithoutToken, makePlaylistCardWithToken }