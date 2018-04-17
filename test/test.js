const mocha = require('mocha')
const chai = require('chai').assert
const allFunctions = require ('../public/our-functions') 

artezicObj = allFunctions.makeArtezicObject([{"id":2,"pseudo":"gontran","avatar":"http://i.pravatar.cc/150","bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS","titre":"gontran the best","genre":"rap","url":"www.blu.com","id_wilders":1,"compete":"false","nbrevotes":2},{"id":1,"pseudo":"gontran","avatar":"http://i.pravatar.cc/150","bio":"lorem ipsum developer at WCS lorem ipsum developer at WCS lorem ipsum developer at WCS","titre":"jaime le rock","genre":"rock","url":"www.truc.com","id_wilders":1,"compete":"true","nbrevotes":17},{"id":3,"pseudo":"Max","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":"SQL le retour","genre":"chill","url":"www.sqlite.com","id_wilders":2,"compete":"false","nbrevotes":8},{"id":4,"pseudo":"Max","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":"linux forever","genre":"slow","url":"www.linux.com","id_wilders":2,"compete":"true","nbrevotes":15},{"id":5,"pseudo":"Aurélie","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":"express","genre":"varietoche","url":"www.express.com","id_wilders":3,"compete":"false","nbrevotes":5},{"id":6,"pseudo":"Aurélie","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":"pugs life","genre":"rnb","url":"www.pug.com","id_wilders":3,"compete":"true","nbrevotes":11},{"id":7,"pseudo":"Arnaud","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":"node","genre":"serveur","url":"www.express.com","id_wilders":4,"compete":"false","nbrevotes":6},{"id":8,"pseudo":"Arnaud","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":"npm","genre":"rap français","url":"www.npm.com","id_wilders":4,"compete":"true","nbrevotes":7},{"id":null,"pseudo":"Thibaud","avatar":"http://i.pravatar.cc/150","bio":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida, justo et semper blandit, mauris justo tempus arcu, eu auctor erat ipsum nec leo. Proin convallis nibh ac elementum condimentum. Etiam varius, est sed suscipit tempor, tortor lacus porta enim, non dapibus augue magna at magna.","titre":null,"genre":null,"url":null,"id_wilders":null,"compete":null,"nbrevotes":null}])



describe('Make Artezic Object with playlists by wilder', () => {
    const result = artezicObj
    // it('should return an object', ()=> {
    //     chai.typeOf(result, 'object')
    // })
    it('should return an array', ()=> {
        chai.isArray(result)
    })
    it('should be 4 elements long', ()=> {
        chai.equal(result.length, 4)
    })
    
    
})