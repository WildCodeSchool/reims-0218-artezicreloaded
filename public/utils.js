export const refreshInterval = () => setTimeout(()=>location.reload(), 2000)

export const showModal = (playlist) => {
    const modal = document.getElementById("modal")
    $(modal).modal('show')
    const modalBody = document.getElementById("showThisModal")
    modalBody.innerHTML = `
      <p>Titre: ${playlist.titre}</p>
      <iframe src="${playlist.url}" style="width:100%;" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" frameborder="0"></iframe>`
  }