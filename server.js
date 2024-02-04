/********************************************************************************
 * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * 
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 * 
 * Name: Alex Leung Student ID: 163806227 Date: 2024-02-04
 * 
 * Published URL:
 * 
 * *******************************************************************************/ 
const legoData = require("./modules/legoSets")
const express = require('express'); 
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 

legoData.initialize()

app.get("/", (req, res)=>{
    res.send("Assignment 2: Alex Leung - 163806227")
});

app.get("/lego/sets", (req, res)=>{
    res.send(legoData.getAllSets())
});

app.get("/lego/sets/num-demo", (req, res)=>{
    let num = "0011-3"
    let result = null
    result = legoData.getSetByNum(num)
    if(result){
        res.send(result)
    }
    else{
        res.send("Unable to get object")
    }
});

app.get("/lego/sets/theme-demo", (req, res)=>{
    let theme = "technic"
    let result = null
    result = legoData.getSetsByTheme(theme)
    if(result){
        res.send(result)
    }
    else{
        res.send("Unable to get object")
    }
})

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
