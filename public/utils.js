const mainDiv = document.getElementById('main')

export { render, refreshInterval, refreshToHome, showModal, disconnect }

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

export default { render, refreshInterval, refreshToHome, showModal, disconnect }