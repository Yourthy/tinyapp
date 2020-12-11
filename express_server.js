//////////////////////////////////////////////////////////////
//                      SETUP                               //
//////////////////////////////////////////////////////////////
const cookieSession = require("cookie-session")
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const { res } = require("express");
app.set("view engine", "ejs");


//////////////////////////////////////////////////////////////
//                    MIDDLEWARE                            //
//////////////////////////////////////////////////////////////
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


//////////////////////////////////////////////////////////////
//                 FUNCTIONS                                //
//////////////////////////////////////////////////////////////
//function to generate random string for a short URL
function generateRandomString(){
  let r = Math.random().toString(36).substring(7);
  return "random", r;
};

const getUserByEmail = (email)=>{
  for (let userID in users){
    if(users[userID].email === email){
      return users[userID];
    }
  }return null;
};

const getUserNameByUserId = (userID)=>{
  if(users[userID]){
    return users[userID].email;
  }
  return "";

};





//////////////////////////////////////////////////////////////
//                       DATABASES                          //
//////////////////////////////////////////////////////////////

//use to keep track of all URLs and their shortened form
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
//generates a random string for short URL
app.post("/urls", (req, res) => {
  console.log(req.body);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls/" + shortURL);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const user = getUserByEmail(email);
  if(user){
    res.cookie("user_id", user.id);
    return res.redirect("/urls");
  }
  return res.status(403).send("no user with that email found");
  // res.redirect('/register');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  // res.clearCookie("username");
  res.redirect("/login");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/register", (req, res)=>{
  let email = req.body.email;
  let password = req.body.password;
  // const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(email);
  
  
  // console.log(hashedPassword);
  if(email === "" || password === ""){
    return res.status(400).send("no user with that email found");
    // res.redirect("/register");
    
  }else if(getUserByEmail(email)){
    return res.status(400).send("that account already exists, please try again");

  }else{
    
    const user = {
      id: generateRandomString(),
      email,
      password
    }
    users[user.id] = user;
    res.cookie("user_id", user.id);
    res.redirect("/urls/")
  
  }
});


//////////////////////////////////////////////////////////////
//                     GET REQUESTS                         //
//////////////////////////////////////////////////////////////
//displays all the URL and their shortened forms
app.get("/urls", (req, res) => {
  
  if(req.cookies["user_id"] === undefined){
    res.redirect("register");
  }else{
   
  const templateVars = {
    urls: urlDatabase,
    email: getUserNameByUserId([req.cookies["user_id"]]),
  };
    res.render("urls_index", templateVars);

  }
  // console.log(req.cookies["username"]);
});

app.get("/login", (req, res) => {

  const templateVars = {
    email: getUserNameByUserId([req.cookies["user_id"]]),

  };
  res.render('login', templateVars);
});


app.get("/register", (req, res) => {
  const templateVars = {
    email: getUserNameByUserId([req.cookies["user_id"]]),

  };
  res.render("register", templateVars);
});

//route to render urls_new
app.get("/urls/new", (req, res) => {
  const templateVars = {
    email: getUserNameByUserId([req.cookies["user_id"]]),
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    email: getUserNameByUserId([req.cookies["user_id"]]),
  };
  res.render("urls_show", templateVars);
});

//displays a single URL and its shortned form
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = {
    shortURL,
    longURL,
    email: rgetUserNameByUserId([req.cookies["user_id"]]),
  };
  res.render("urls_show", templateVars);
});

//------------------------------------------------------------//

app.listen(PORT, () => {
  console.log(`Now listening on port:${PORT}`);
});
