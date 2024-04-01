/********************************************************************************
 * WEB322 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * 
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 * 
 * Name: Alex Leung Student ID: 163806227 Date: 2024-03-31
 * 
 * Published URL: https://tiny-ruby-moose-tux.cyclic.app/
 ********************************************************************************/
const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/lego/sets", async (req,res)=>{

  try{  
    if(req.query.theme){
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.render("legosets",{legosets:sets});
  
    }else{
      let sets = await legoData.getAllSets();
      res.render("legosets",{legosets:sets});
    }
  }catch(err){
    res.status(404).send(err);
  }

});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.render("legoset",{legoset:set});
  }catch(err){
    res.status(404).send(err);
  }
});

app.use((req, res, next) => {
  res.status(404).render("404",{message:"There was an error. Please try again!"});
});


legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});