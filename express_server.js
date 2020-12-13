//////////////////////////////////////////////////////////////
//                      SETUP                               //
//////////////////////////////////////////////////////////////

const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const {getUserByEmail, generateRandomString, getEmailByUserID} = require("./helpers");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.set("view engine", "ejs");

//////////////////////////////////////////////////////////////
//                    MIDDLEWARE                            //
//////////////////////////////////////////////////////////////

app.use(bodyParser.urlencoded(
  { 
    extended: true
   }));
app.use(cookieSession(
  {
    name: "session",
    keys: ["something-secure"],
    maxAge: 24 * 60 * 60 * 1000 //24 hrs
  }
));

//////////////////////////////////////////////////////////////
//                       DATABASES                          //
//////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",  userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "aJ48lW"}
};

const users = {
  "123ABC": {
    id:"123ABC",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  }
};

//////////////////////////////////////////////////////////////
//                     POST REQUESTS                        //
//////////////////////////////////////////////////////////////

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session["user_id"];
  res.redirect("/urls/" + shortURL);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(email === "" || password === ""){
    return res.status(400).send("no email or password was entered");
  }
  const userID = getUserByEmail(email, users);
  if(userID == undefined || userID === ''){
    return res.status(400).send("user does not exist");
  }else{
    const user = users[userID];
    const hashedPassword = user.password;
    if(!bcrypt.compareSync(password, hashedPassword)){
      return res.status(403).send("no user with that email found");
    }
    req.session.user_id = user.id;
    req.session.password = hashedPassword;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session = null; 
  res.redirect("/login");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if(urlDatabase[shortURL].userID === req.session["user_id"]){
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }else{
    res.redirect("/urls");
  }
});

app.post("/register", (req, res)=>{
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if(email === "" || password === ""){
    return res.status(400).send("no user with that email or password was found");
  }else if(getUserByEmail(email, users)){
    return res.status(400).send("that account already exists, please try again");
  }else{
    const user = {
      id,
      email,
      password: hashedPassword,
    }
    users[user.id] = user;
    req.session.user_id = user.id;
    res.redirect("/urls/")
  }
});

//////////////////////////////////////////////////////////////
//                     GET REQUESTS                         //
//////////////////////////////////////////////////////////////

app.get("/urls", (req, res) => {
  const user = req.session['user_id'];
  const userDB = {};
  if(!user){
    res.send("You have not logged in yet! <a href='/login'>Login Here </a>")
  }else{
    for(const obj in urlDatabase){
      if(user === urlDatabase[obj].userID){
        userDB[obj] = urlDatabase[obj];
      }
    }
    const templateVars = {
      urls: userDB,
      email: getEmailByUserID(req.session["user_id"], users),
    };
      res.render("urls_index", templateVars);
    }
});

app.get("/login", (req, res) => {
  const templateVars = {
    email: getEmailByUserID(req.session["user_id"], users)
  };
  res.render('login', templateVars);
});


app.get("/register", (req, res) => {
  const templateVars = {
    email: getEmailByUserID(req.session["user_id"], users),
  };
  res.render("register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    email: getEmailByUserID(req.session["user_id"], users),
  };
  if(getUserByEmail(templateVars.email, users)){
    res.render("urls_new", templateVars);
  }else{
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    email: getEmailByUserID(req.session["user_id"], users),
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    email: getEmailByUserID(req.session["user_id"], users),
  };
  res.render("urls_show", templateVars);
});

//////////////////////////////////////////////////////////////
//                     TERMINAL LOG                         //
//////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Now listening on port:${PORT}`);
});
