
//                        SETUP                               

const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const methodOverride = require("method-override");
const {getUserByEmail, generateRandomString, getEmailByUserID, doesUrlBelongToUser} = require("./helpers");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.set("view engine", "ejs");


//                      MIDDLEWARE    

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


//                       DATABASES     

//url database to store created/edited urls
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",  userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "aJ48lW"}
};

//user databse for cookies
const users = {
  "123ABC": {
    id:"123ABC",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  }
};


//                     POST REQUESTS                        

//urls route that creates a new url database and redirects to urls/(shortURL created)
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session["user_id"];
  res.redirect("/urls/" + shortURL);
});

//login route that checks if input is entered correctly/userID exists and redirects to urls page...
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

//logout route to redirect to login page...
app.post("/logout", (req, res) => {
  req.session = null; 
  res.redirect("/login");
});

//url delete route that removes url if you are the user...
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if(urlDatabase[shortURL].userID === req.session["user_id"]){
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }else{
    res.redirect("/urls");
  }
});

//register page that hashes the password given and checks if account already exists. Updates user object...
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

//edit url route that allows user to update an existing url if they had previously created it...
app.post("/urls/:id", (req, res)=>{
  const userID = req.session.user_id;
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  if(doesUrlBelongToUser(userID, urlDatabase, shortURL)){
    urlDatabase[shortURL] = {
      longURL,
      userID,
    };
    res.redirect("/urls");

  }else{
    return res.status(403).send("cannot edit urls you do not own!");
  }
});


//                     GET REQUESTS                         

//urls render page that allows users to see/edit/delete urls they've created
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
      urlDatabase: urlDatabase,
      urls: userDB,
      email: getEmailByUserID(req.session["user_id"], users),
    };
    res.render("urls_index", templateVars);
  }
});

//login render page...
app.get("/login", (req, res) => {
  const templateVars = {
    email: getEmailByUserID(req.session["user_id"], users)
  };
  res.render('login', templateVars);
});

//register render page 
app.get("/register", (req, res) => {
  const templateVars = {
    email: getEmailByUserID(req.session["user_id"], users),
  };
  res.render("register", templateVars);
});

//new urls render page that restricts users from seeing page if not logged in...
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

//created url page render that limits users from seeing urls they did not create...
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userID = req.session["user_id"];
  if(!userID){
    res.redirect("/login");
  }else{
    const templateVars = {
      shortURL: shortURL,
      longURL: longURL,
      email: getEmailByUserID(req.session["user_id"], users),
    };
    res.render("urls_show", templateVars);
  }
});

//allows user to redirect to url using short or long url they created...
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//                     TERMINAL LOG                         


app.listen(PORT, () => {
  console.log(`Now listening on port:${PORT}`);
});
