//////////////////////////////////////////////////////////////
//                      SETUP                               //
//////////////////////////////////////////////////////////////
const cookieSession = require("cookie-session")
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
// const bcrypt = require('bcrypt');
// const password = "purple-monkey-dinosaur"; // found in the req.params object
// const hashedPassword = bcrypt.hashSync(password, 10);

const PORT = 8080;
const bodyParser = require("body-parser");
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

// const urlsForUser = (user_id)=>{
//   let userURL = {};
//   for(let key in urlDatabase){
//     if(urlDatabase[key].user_id === user_id){
//       userURL[key] = urlDatabase[key];
//     }
//   }
//   return userURL;
// }

//////////////////////////////////////////////////////////////
//                       DATABASES                          //
//////////////////////////////////////////////////////////////

//use to keep track of all URLs and their shortened form
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",  userID: "aJ48lW"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "aJ48lW"}
};
//

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
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].id = req.body.id;
  console.log("urlData POST", urlDatabase);
  res.redirect("/urls/" + shortURL);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const user = getUserByEmail(email);
  if(user){
    res.cookies("user_id", user.id);
    return res.redirect("/urls");
  }
  return res.status(403).send("no user with that email found");
  // res.redirect('/register');
});

app.post("/logout", (req, res) => {
  res.clearCookies("user_id");
  // res.clearCookie("username");
  res.redirect("/login");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // console.log(urlDatabase[shortURL]["userID"]);
  if(urlDatabase[shortURL].user_id === req.cookies['user_id']){
   delete urlDatabase[shortURL];
   res.redirect("/urls");
  }else{
    res.redirect("/urls");
  }
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
    res.cookies("user_id", user.id);
    res.redirect("/urls/")
  
  }
});


//////////////////////////////////////////////////////////////
//                     GET REQUESTS                         //
//////////////////////////////////////////////////////////////
//displays all the URL and their shortened forms
app.get("/urls", (req, res) => {
if(!req.cookies["user_id"]){
  res.send("You have not logged in yet! <a href='/login'>Login Here </a>")
}else{
  const templateVars = {
    urls: urlDatabase,
    email: getUserNameByUserId([req.cookies["user_id"]]),
  };
    res.render("urls_index", templateVars);

}
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
  if(getUserByEmail(templateVars.email)){
    res.render("urls_new", templateVars);
  }else{
    res.redirect('/login');
  }
});

app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    fullURL = urlDatabase[req.params.shortURL].longURL;
    console.log(fullURL);
    res.redirect(fullURL);
  }
  else {
    res.sendStatus(404);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    email: getUserNameByUserId([req.cookies["user_id"]]),
  };
  console.log(templateVars);
  res.render("urls_show", templateVars);
});


//------------------------------------------------------------//

app.listen(PORT, () => {
  console.log(`Now listening on port:${PORT}`);
});
