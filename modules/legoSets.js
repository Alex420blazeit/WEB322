const setData = require("../data/setData")
const themeData = require("../data/themeData")

let sets = []

function initialize(){
    sets.push(setData)
    // console.log(sets[0][0]["1"])
    // console.log(sets[0].length)
    for (let i = 0; i < sets[0].length; i++){
        return new Promise((resolve, reject) =>{

            let themeID = sets[0][i]["1"]
            themeData.find(function (id){
            // console.log(id)
                if (id["id"] == themeID){
                    sets[0][i].theme = id["name"]
                }
            })
            if(sets){
                resolve()
            }
            else{
                reject("Error encountered")
            }
        })
    }
}

function getAllSets(){
    return new Promise((resolve, reject) =>{  
        if(sets){
            resolve(sets)
        }
        else{
            reject("Set empty")
        }
    })
}

function getSetByNum(setNum){
    return new Promise ((resolve, reject) => {
        temp = sets[0].find(function(obj){
            if(obj["001-1"] == setNum){
                // console.log(obj)
                // return obj;
            }
        })
        if (temp){
            resolve(temp)
        }
        else{
            reject("Not found")
        }
    })
}

function getSetsByTheme(theme){
    return new Promise ((resolve, reject) => {
        let setsByTheme = [];
        let temp = theme.slice(0, 1)
        temp = temp.toUpperCase()
        let newTheme = temp + theme.slice(1)
        sets[0].find(function(obj){
            if(obj["theme"].includes(newTheme) == true){
                setsByTheme.push(obj)
            }
        })
        if(setsByTheme){
            resolve(setsByTheme)
        }
        else{
            reject("Unable to find set")
        }
    })
    // console.log(setsByTheme)
    // return setsByTheme
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }



// initialize();
// getSetByNum("0011-3");
// getSetsByTheme("technic")