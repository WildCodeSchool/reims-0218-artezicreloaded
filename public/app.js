import {
    refreshInterval,
    refreshToHome,
    showModal,
    disconnect
} from "./utils.js";

const mainDiv = document.getElementById("main");

const render = html => {
    mainDiv.innerHTML = html;
};

const cleanUrl = str => {
    const urlRegex = new RegExp("https://play.soundsgood.co/embed/\\d*\\w*");
    const urlFromIframe = urlRegex.exec(str);
    return urlFromIframe[0];
};

const makePlaylistCard = (item, tokenInStore, username, idWilder, arr) => {
    if (!tokenInStore) {
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
    } else {
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
                        <form action="/voteforplaylist" method="post" class="mt-3 mb-3">
                            <input type="hidden" value="${idWilder}" name="id_wilders" />
                            <input type="hidden" value="1" name="vote" />
                            <input type="hidden" value="${
                                item.playlistId
                            }" name="id_playlists" />
                            <input type="hidden" value="${Date.now()}" name="date" />
                            <button style="font-size:3em; color:GhostWhite" id="vote${
                                item.playlistId
                            }" type="submit" class="btn btn-info mt-2"><i class="fas fa-thumbs-up"></i></button>
                        </form>
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
};

const makeWilder = item => `
    <div class="blocks col-12 col-sm-12 col-md-4">
      <div class="card" id="card_sponsor">
        <div class="card-block">
          <div class="row">
            <div class="member">
              <h3 class="card-title">${item.pseudo}</h3>
              <img class="center" src="${
                  item.avatar
              }" alt="Card image" style="width: 14rem;">
              <hr style="background-color: #00001c;">
              <p class="card-text">${item.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

const makeCardMember = item => `
    <div class="col-md-8 mt-5">
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-header text-white bg-info">
                            <h4>Mon Profil</h4>
                        </div>
                        <div class="card-block ml-3 mr-3">
                            <textarea class="mt-3 form-control" rows="1" id="pseudo">${
                                item.pseudo
                            }</textarea>
                            <div class="form-group mt-5">
                                <label for="bio">Bio</label>
                                <textarea rows="9" name="editor1" class="form-control" id="bio">${
                                    item.bio
                                }</textarea>
                                <button class="btn btn-info btn-block mt-3" id="saveProfile">Enregistrer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>

    <div class="col-md-4 mt-5">
        <h3>Votre avatar</h3>
        <img src="${
            item.avatar
        }" alt="" class="d-block id="avatar" img-fluid mb-3" width="300px">
        <input value="${item.avatar}" id="avatar" size="36"></input>
    </div>
    `;

const makeWinningCard = item =>
    item.votesNb === null ?
    `<h5> Pas de gagnant pour l'instant </h5>` :
    `
    <div class="jumbotron col-md-12" id="card_sponsor">
    <div class="row">
      <div class="col-md-9 order-md-last">
        <h1 class="card-title display-4" >${item.titre}</h1>
        <p>Le vainqueur du concour de la semaine a gagné avec ${
            item.votesNb
        } votes sur sa playlist. <br> Bravo !</p>
            <button id="launchPlaylist" type="button" class="launch btn btn-primary" data-toggle="modal" data-target="#modal${
                item.playlistId
            }">
        Ecouter
        </button>
        <hr>
      </div>
      <div class="col-md-3 order-md-first">
        <img class="center" src="http://theblog.is/thackley/files/2017/07/winner.jpeg" alt="Card image" style="width: 12rem;">
      </div>
    </div>
    </div>
    `;

const makeListsInCompete = item => `
    <div class="card mt-3 mr-3" style="width:400px">
        <div class="card-body">
            <h4 class="card-title">${item.playlists[0].titre}</h4>
            <p class="card-text">${item.playlists[0].nbrevotes} votes</p>
            <a href="${
                item.playlists[0].url
            }" class="btn btn-primary">Afficher la playlist</a>
            <form action="/voteforplaylist" method="post">
                <input type="hidden" value="1" name="id_wilders" />
                <input type="hidden" value="${
                    item.playlists[0].playlistId
                }" name="id_playlists" />
                <input type="hidden" value="${Date.now()}" name="date" />
                <button type="submit" class="btn btn-success mt-2">Voter pour cette playlist</button>
            </form>
        </div>
    </div>
    `;

const serializeForm = form => {
    const data = {};
    const elements = form.getElementsByClassName("form-control");
    for (let el of elements) {
        data[el.name] = el.value;
    }
    return data;
};

const localStore = localStorage;
const token = localStore.getItem("token");
const username = localStore.getItem("username");
const idWilder = localStore.getItem("idWilder");

const controllers = {
    "/": () => {
        console.log("What happens in firefox?"); //we get nothing...:(
        fetch("/playlistsWilders")
            .then(res => res.json())
            .then(allPlaylists => {
                fetch(`/votes/${idWilder}`)
                    .then(res => res.json())
                    .then(playlistsVotedByUser => {
                        const cannotBeVoted = playlistsVotedByUser.map(
                            playlist => playlist.id_playlists
                        );
                        const allPlaylistsCards = allPlaylists.reduce(
                            (carry, playlist) =>
                            carry +
                            makePlaylistCard(
                                playlist,
                                token,
                                username,
                                idWilder,
                                cannotBeVoted
                            ),
                            ""
                        );
                        render(
                            `<div class="container">
                                <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Artezic remercie Soundsgood !</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div id="showThisModal"class="modal-body">
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                                <div class="row">
                                    ${allPlaylistsCards}  
                                </div>
                            </div>
                            `
                        );
                        const launchPlaylistButtons = document.getElementsByClassName(
                            "launch"
                        );
                        Array.from(launchPlaylistButtons).forEach(button => {
                            button.addEventListener("click", () => {
                                const playlistClicked = allPlaylists.filter(
                                    playlist =>
                                    playlist.playlistId ===
                                    Number(button.id)
                                );
                                showModal(playlistClicked[0]);
                            });
                        });
                        if (!username) {
                            const isConnectedUser = (document.getElementById(
                                "userName"
                            ).innerHTML = `<span class="fa fa-user"></span> Se connecter`);
                        } else {
                            const isConnectedUser = (document.getElementById(
                                "userName"
                            ).innerHTML = `<span class="fa fa-user"></span> ${username}`);
                        }
                    });
                disconnect(localStore);
            });
    },
    "/monprofil": () => {
        const username = localStore.username;
        if (!username) {
            return render(`
            <div class="alert alert-danger" role="alert">
              Vous devez vous connecter pour accéder à cette page.
            </div>
          </div>
            <div class="col-md-2">
              <a href="/authentification" class="btn btn-success mt-2">Me connecter</a>
            </div>
            `);
        } else {
            fetch("/connected")
                .then(res => res.json())
                .then(allWildersWithPlaylists =>
                    allWildersWithPlaylists.filter(
                        wilder => wilder.pseudo === username
                    )
                )
                .then(connectedMember => {
                    return makeCardMember(connectedMember[0]);
                })
                .then(mesInfos =>
                    render(
                        `
                    <div class="container">
                        <div id="alert-box" class="hidden">
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            ${mesInfos}
                        </div>
                        <p><a class="btn btn-info btn-lg mt-5" href="/viewplaylists/${username.toLowerCase()}">Voir mes playlists</a>
                        <a class="btn btn-success btn-lg mt-5" href="/newplaylist">Ajouter une playlist</a></p>
                    </div>
                `))
                .then(() => {
                    const saveProfile = document.getElementById("saveProfile")
                    saveProfile.addEventListener('click', sendData)

                    function sendData() {
                        let pseudo = document.getElementById("pseudo").value;
                        let bio = document.getElementById("bio").value;
                        let avatar = document.getElementById("avatar").value;
                        fetch("/membres", {
                                method: "PUT",
                                headers: {
                                    Accept: "application/json, text/plain, */*",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    pseudo: pseudo,
                                    bio: bio,
                                    avatar: avatar
                                })
                            })
                            .then(res => res.json())
                            .then(wilderEdition => {
                                const alertBox = document.getElementById(
                                    "alert-box"
                                );
                                alertBox.className = "alert alert-success";
                                alertBox.innerHTML = `${
                                    wilderEdition.pseudo
                                }, votre profil titre été édité.`;
                            });
                    }
                });
            disconnect(localStore);
        }
    },
    "/editer-mon-profil": () => {
        render(`
        <div class="container">
          <div id="alert-box" class="hidden">
          </div>
            <form id="editMyProfile">
              <div class="form-group col-md-9 ">
                  <label for="inputPseudo">Pseudo</label>
                  <input name="pseudo" type="text " class="form-control " id="inputPseudo" placeholder="Enter your pseudo ">
              </div>             
              <div class="form-group col-md-9">
                  <label for="inputBio">Bio</label>
                  <textarea name="bio" class="form-control" id="inputBio " placeholder="Bio"></textarea>
              </div>
              <div class="form-group col-md-9 ">
                  <label for="inputAvatar ">Avatar</label>
                  <input name="avatar" type="text " class="form-control " id="inputAvatar" placeholder="Enter image URL ">
              </div>
              <div class="form-group col-md-3 ">
                  <button type="submit " class="btn btn-primary ">Submit</button>
              </div>
            </form>
        </div>
            <div class="form-group">
                <label for="inputTitle">Titre</label>
                <input name="title" type="text" class="form-control" id="inputTitle" placeholder="Entrez le titre de votre playlist">
            </div>
            <div class="form-group">
                <label for="inputGenre">Genre musical</label>
                <input name="genre" type="text" class="form-control" id="inputGenre" placeholder="Quel est le genre de votre playlist ?">
            </div>
            <div class="form-group">
                <label for="inputUrl">Copiez Le code intégré de Soundsgood</label>
                <input name="url" type="text" class="form-control" id="inputUrl" placeholder="Copiez Ici">
            </div> 
            <button type="submit" class="btn btn-primary">Submit</button>     
        </form>
        <a class="btn btn-success btn-lg" href="/" role="button">retour page d'accueil</a>
      </div>`);
        const form = document.getElementById("add-playlist");
        form.addEventListener("submit", e => {
            e.preventDefault();
            const data = serializeForm(form);
            const dataWithId = {
                titre: data.title,
                genre: data.genre,
                url: data.url,
                compete: data.competition,
                id_wilders: idWilder
            }
            fetch('/playlists', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataWithId)
                })
                .then(res => res.json())
                .then(playlist => {
                    const alertBox = document.getElementById("alert-box");
                    alertBox.className = "alert alert-success";
                    alertBox.innerHTML = `Votre playlist titre ${
                        playlist.titre
                    } (${playlist.id}) a bien été créée`;
                });
        });
    },
    "/newplaylist": () => {
        render(`
		  <div class="container">
			<div id="alert-box" class="hidden">
			</div>
			<form id="add-playlist">
				<div class="form-group">
					<label for="inputTitle">Titre</label>
					<input name="title" type="text" class="form-control" id="inputTitle" placeholder="Entrez le titre de votre playlist">
				</div>
				<div class="form-group">
					<label for="inputGenre">Genre musical</label>
					<input name="genre" type="text" class="form-control" id="inputGenre" placeholder="Quel est le genre de votre playlist ?">
				</div>
				<div class="form-group">
					<label for="inputUrl">Copiez Le code intégré de Soundsgood</label>
					<input name="url" type="text" class="form-control" id="inputUrl" placeholder="Copiez Ici">
				</div> 
				<button type="submit" class="btn btn-primary">Submit</button>     
			</form>
			<a class="btn btn-success btn-lg" href="/" role="button">retour page d'accueil</a>
		  </div>`);
        const form = document.getElementById("add-playlist");
        form.addEventListener("submit", e => {
            e.preventDefault();
            const data = serializeForm(form);
            const dataWithId = {
                titre: data.title,
                genre: data.genre,
                url: cleanUrl(data.url),
                compete: data.competition,
                id_wilders: idWilder
            };
            fetch("/playlists", {
                    method: "POST",
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataWithId)
                })
                .then(res => res.json())
                .then(playlist => {
                    const alertBox = document.getElementById("alert-box");
                    alertBox.className = "alert alert-success";
                    alertBox.innerHTML = `Votre playlist titre ${
                        playlist.titre
                    } (${playlist.id}) a bien été créée`;
                });
        });
    },
    "/wilders": () => {
        fetch("/membres")
            .then(res => res.json())
            .then(listusers =>
                listusers.reduce((carry, user) => carry + makeWilder(user), "")
            )
            .then(book => {
                render(
                    `<div class="container">
                       <div class="row">
                            ${book}  
                        </div>
                    </div>
                    `
                );
                disconnect(localStore);
            });
    },
    "/viewplaylists/:slug": ctx => {
        const { slug } = ctx.params;
        fetch(`/membre/${slug}`)
            .then(res => res.json())
            .then(wilder => {
                const playlists = wilder[0].playlists;
                const wilderPlaylistsCards = playlists.reduce(
                    (acc, playlist) => acc + makePlaylistCard(playlist),
                    ""
                );
                render(`
                    <div class="container">
                        <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Artezic remercie Soundsgood !</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div id="showThisModal"class="modal-body">
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <h2>Les playlists de ${slug}</h2>
                        <div class="row">
                            ${wilderPlaylistsCards}
                        </div>
                    </div>
                    `);
                const launchPlaylistButtons = document.getElementsByClassName(
                    "launch"
                );
                Array.from(launchPlaylistButtons).forEach(button => {
                    button.addEventListener("click", () => {
                        const playlistClicked = playlists.filter(
                            playlist =>
                            playlist.playlistId === Number(button.id)
                        );
                        showModal(playlistClicked[0]);
                    });
                });
            });
    },

    "/authentification": () => {
        const loginFormHtml = `
        <form id="loginForm">
            <div class="form-row">
                <div class="col-md-5">
                    <input class="form-control form-group mb-4" name="username" placeholder="username"/>
                </div>
                <div class="col-md-5">
                    <input class="form-control form-group mb-4" type="password" name="password" placeholder="password"/>
                </div>
                <div class="col-md-2">
                    <input type="submit" class="btn btn-primary" value="se connecter" />
                </div>
            </div>
        </form>
		`;
        render(`
            <div class="container">  
                <div id="alert-login">
                </div> 
                ${
                    !token
                        ? loginFormHtml
                        : '<button id="disconnectButton" type="button">se deconnecter</button>'
                }
            </div>`);
        if (!token) {
            const loginForm = document.getElementById("loginForm");
            loginForm.addEventListener("submit", e => {
                e.preventDefault();
                const data = serializeForm(loginForm);
                //post sur le server /auth/login
                fetch("/auth/login", {
                        method: "POST",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(data => {
                        const alert = document.getElementById("alert-login");
                        if (!data.user) {
                            //alert class danger
                            alert.innerHTML = `
                            <div class="alert alert-danger" role="alert"> 
                            Nom d'utilisateur ou mots de passe incorrect!
                            </div>
                        `;
                        } else {
                            alert.innerHTML = `
                            <div class="alert alert-success" role="alert">
                            Bonjour ${data.user.username} !
                            </div>`;
                            localStorage.setItem("token", data.token);
                            localStorage.setItem(
                                "username",
                                data.user.username
                            );
                            localStorage.setItem("idWilder", data.user.id);
                            loginForm.style.display = "none";
                            refreshToHome();
                        }
                    });
            });
        } else {
            document
                .getElementById("disconnect")
                .addEventListener("click", () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    localStorage.removeItem("idWilder");
                    render(`
                        <div class="container">
                            <div class="alert alert-warning" role="alert">
                                Vous avez êté déconnecté.
                            </div>
                        </div>
                    `);
                });
        }
    },
    "/concours": () => {
        fetch("/playlistsCompete")
            .then(res => res.json())
            .then(result => {
                const winningPlaylistData = result[0].playlists;
                const winner = makeWinningCard(result[0]);
                render(`           
                    <div class="container align-items-center">
                        <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Artezic remercie Soundsgood !</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div id="showThisModal"class="modal-body">
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            ${winner}
                        </div>
                    </div>    
                `);
                const winningPlaylistButton = document.getElementById(
                    "launchPlaylist"
                );
                winningPlaylistButton.addEventListener("click", () => {
                    return showModal(result[0]);
                });
                disconnect(localStore);
            });
    },
    '/faq': () => {
        render(`
        <link rel="stylesheet" href="style.css" />
        
        <div class="question">
            <p class="pfaq">Bienvenue dans la F.A.Q jeune troubadour !</p><br />
            <p>Comment faire sa propre playlist ?</p><br />
            <p>Pour commencer il te faut crer un compte sur soundgood<br /> pour ensuite pouvoir faire t'es super playlist !</p>
        </div>
        
        <div><img src="https://agenceho5.com/wp-content/uploads/2017/04/Boulevard-des-airs-1-2000x500.jpg" class="imgfaq" alt="DJ" ></div>
        
        <div class="question">
            <p>Comment importer ta playlist sur Artezic reloaded ?</p><br /
            <p>Vous devez aller sur votre playlist soundgood, cliquer sur intégrer puis copier le code<br /> iframe pour ensuite le coller dans le champ dédié sur Artezic reloaded.</p>
        </div>
        
        <div><img src="http://www.buuworld.com/image/115006258.jpg" class="imgfaq" alt="violoniste" ></div>
        
        <div class="question">
            <p>Comment ajouter une photo sur son profil ?</p><br />
            <p>Il suffit juste de copier l'url de ta photo pour la coller dans le champ dédié pour. Nous<br /> te conseillons de redimensionner ta photo pour éviter les images qui prennent<br /> trop d'espace.<a href="https://www.iloveimg.com/fr/redimensionner-image">- IloveIMG -</a> est top pour redimensionner une image. </p>
        </div>
        
        <div><img src="https://www.in-akustik.de/uploads/tx_flexslider/Michael_Schenker_Live_In_Tokyo_Slider_01.jpg" class="imgfaq" alt="rap"></div>
        
        <div class="question">
            <p>Est-il possible d'importer sa playlist entière<br /> d'une autre plateforme sur soudgood ?</p><br />
            <p>Oui, il faut aller sur la plateforme ou il y a la playlist en question aller sur<br /> l'option partager ou share pour ensuite copier le code playlist link.<br />
            Une fois ceci de fait aller sur soundgood puis faite importer<br /> une playlist et coller y le code playlist link.</p><br />
            <p class="pfaq">Fin de la F.A.Q</p>
        </div>
        `)
        
    }, 
};

const route = pathname => {};

(() => {
    [
        "/",
        "/wilders",
        "/monprofil",
        "/newplaylist",
        "/editer-mon-profil",
        "/viewplaylists/:slug",
        "/concours",
        "/authentification",
        "/faq"
    ].forEach(path => page(path, controllers[path]));
    page();
})();