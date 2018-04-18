const { assert } = require('chai')
const { wildersWithPlaylists } = require('../playlists.js')
const { isolatePlaylist } = require('../playlists.js')

console.log(wildersWithPlaylists)

describe('playlists module', () => {
    describe('isolatePlaylist', () => {
        const wilder = {  
            "wilderId":1,
            "playlistId":2,
            "pseudo":"gontran",
            "avatar":"http://i.pravatar.cc/150",
            "bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS",
            "titre":"gontran the best",
            "genre":"rap",
            "url":"www.blu.com",
            "compete":"false",
            "nbrevotes":2
         }

         const expected = {  
            "wilderId":1,            
            "pseudo":"gontran",
            "avatar":"http://i.pravatar.cc/150",
            "bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS",
            playlist: {
                "playlistId":2,
                "titre":"gontran the best",
                "genre":"rap",
                "url":"www.blu.com",
                "compete":"false",
                "nbrevotes":2
            }
         }

         it.only('should return wilder with a playlist', () => {
             assert.deepEqual(isolatePlaylist(wilder),expected)
         })
    })
    describe.only('wildersWithPlaylists', () => {

        const wildersJoinedPlaylistsExample = [  
            {  
               "wilderId":1,
               "playlistId":2,
               "pseudo":"gontran",
               "avatar":"http://i.pravatar.cc/150",
               "bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS",
               "titre":"gontran the best",
               "genre":"rap",
               "url":"www.blu.com",
               "compete":"false",
               "nbrevotes":2
            },
            {  
               "wilderId":1,
               "playlistId":1,
               "pseudo":"gontran",
               "avatar":"http://i.pravatar.cc/150",
               "bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS",
               "titre":"jaime le rock",
               "genre":"rock",
               "url":"www.truc.com",
               "compete":"true",
               "nbrevotes":17
            },
            {  
               "wilderId":2,
               "playlistId":3,
               "pseudo":"Max",
               "avatar":"http://i.pravatar.cc/150",
               "bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.",
               "titre":"SQL le retour",
               "genre":"chill",
               "url":"www.sqlite.com",
               "compete":"false",
               "nbrevotes":8
            },
            {  
               "wilderId":5,
               "playlistId":null,
               "pseudo":"Arnaud",
               "avatar":"http://i.pravatar.cc/150",
               "bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.",
               "titre":null,
               "genre":null,
               "url":null,
               "compete":null,
               "nbrevotes":null
            }
         ]

         const expected = [
            {
                "wilderId":1,
                
                "pseudo":"gontran",
                "avatar":"http://i.pravatar.cc/150",
                "bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS",
                
                playlists: [
                    {
                        "playlistId":2,
                        "titre":"gontran the best",
                        "genre":"rap",
                        "url":"www.blu.com",
                        "compete":"false",
                        "nbrevotes":2,
                    },
                    {
                        "playlistId":1,
                        "titre":"jaime le rock",
                        "genre":"rock",
                        "url":"www.truc.com",
                        "compete":"true",
                        "nbrevotes":17
                    }
                ]
            },
            {
                "wilderId":2,
                "pseudo":"Max",
                "avatar":"http://i.pravatar.cc/150",
                "bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.",
               
                playlists: [
                    {
                        "playlistId":3,
                        "titre":"SQL le retour",
                        "genre":"chill",
                        "url":"www.sqlite.com",
                        "compete":"false",
                        "nbrevotes":8
                    }
                ]
            },
            {
                "wilderId":5,
                "pseudo":"Arnaud",
                "avatar":"http://i.pravatar.cc/150",
                "bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.",
                
                playlists: [
                    {
                        "playlistId":null,
                        "titre":null,
                        "genre":null,
                        "url":null,
                        "compete":null,
                        "nbrevotes":null
                    }
                ]
            }
         ]

        it('should return an array', () => {
            assert.typeOf(wildersWithPlaylists([]), 'array')
        })
        it('should return wilders with playlists', () => {
            const result = wildersWithPlaylists(wildersJoinedPlaylistsExample)
            assert.deepEqual(result, expected)
        })
    })
})
