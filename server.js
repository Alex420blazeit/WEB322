/********************************************************************************
 * WEB322 – Assignment 06
 * 
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * 
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 * 
 * Name: Alex Leung Student ID: 163806227 Date: 2024-04-14
 * 
 * Published URL: https://tiny-ruby-moose-tux.cyclic.app/
 ********************************************************************************/
const clientSessions = require("client-sessions")
const legoData = require("./modules/legoSets");
const authData = require("./modules/auth-service");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(
  clientSessions({
    cookieName: 'session', 
    secret: 'dk49fmRM3mOIWu3j46msi5ImFhdjFw044', 
    duration: 60 * 1000, 
    activeDuration: 1000 * 60,
  })
);

app.use((req, res, next)=>{
  res.locals.session = req.session;
  next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/lego/addSet", ensureLogin, async (req, res) => {
  let themes = await legoData.getAllThemes()
  res.render("addSet", { themes: themes })
});

app.post("/lego/addSet", ensureLogin, async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }

});

app.get("/lego/editSet/:num", ensureLogin, async (req, res) => {

  try {
    let set = await legoData.getSetByNum(req.params.num);
    let themes = await legoData.getAllThemes();

    res.render("editSet", { set, themes });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }

});

app.post("/lego/editSet", ensureLogin, async (req, res) => {

  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.get("/lego/deleteSet/:num", ensureLogin, async (req, res) => {
  try {
    await legoData.deleteSet(req.params.num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
})

app.get("/lego/sets", async (req, res) => {

  let sets = [];

  try {
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }

    res.render("sets", { sets })
  } catch (err) {
    res.status(404).render("404", { message: err });
  }

});

app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", { set })
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

app.use((req, res, next) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
}).catch(err => {
  console.log(err)
});

legoData.initialize()
.then(authData.initialize)
.then(function(){
  app.listen(HTTP_PORT, function(){
    console.log(`app listening on: ${HTTP_PORT}`);
  });
}).catch(function(err){
  console.log(`unable to start server: ${err}`);
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}