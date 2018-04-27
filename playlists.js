const isolatePlaylist = wilder => {
    return {
        "wilderId": wilder.wilderId,            
        "pseudo": wilder.pseudo,
        "avatar": wilder.avatar,
        "bio": wilder.bio,
        playlist: {
            "playlistId": wilder.playlistId,
            "titre": wilder.titre,
            "genre": wilder.genre,
            "url": wilder.url
        }
    }
}

module.exports = {
    isolatePlaylist,
    wildersWithPlaylists: (wildersJoinedPlaylists) => 
        Object.values(
            wildersJoinedPlaylists
            .map(wilderJoinPlaylist => isolatePlaylist(wilderJoinPlaylist))
            .reduce(
                (acc, wilder) => {
                    
                    if (acc[wilder.wilderId]) {
                        acc[wilder.wilderId].playlists = [
                            ...acc[wilder.wilderId].playlists,
                            wilder.playlist
                        ]
                    } else {
                        const wilderWithPlaylists = {
                            "wilderId": wilder.wilderId,            
                            "pseudo": wilder.pseudo,
                            "avatar": wilder.avatar,
                            "bio": wilder.bio,
                            playlists: [wilder.playlist]
                        }
                        acc[wilder.wilderId] = wilderWithPlaylists
                    }
                    
                    return acc
                },
                {}
            )
        )
        
}