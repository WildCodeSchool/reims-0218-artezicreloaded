module.exports =  {
    makeArtezicObject: (arrOfObj) => {
    const arr = arrOfObj.map(el => el.id_wilders)
    console.log(arr)
    let newArr = []
    for (let el of arr) {
        if (el !== null) {
            if (!newArr.includes(el) ) {
                newArr.push(el)

            }
        }
    }
    return newArr
    }
}