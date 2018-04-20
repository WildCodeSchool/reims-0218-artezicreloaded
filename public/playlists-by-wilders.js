module.exports =  {
    makeArtezicObject: (arrOfObj) => {
        const arr = arrOfObj.map(el => el.id_wilders)
        let idArr = []
        for (let el of arr) {
            if (el !== null) {
                if (!idArr.includes(el) ) {
                    idArr.push(el)
                }
            }
        }
        let obj = idArr.reduce((acc, id) => {
            
            acc[id] = {
                peudo: null,
                avatar: null,
                bio: null,
                playlists: []
            }
            
            return acc
        }, {})
        console.log(obj)
        return obj
    }
}