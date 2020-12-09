const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const { response } = require("express");

app.set("view engine", "ejs");
//middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


//function to generate random string for a short URL
function generateRandomString() {
    let r = Math.random().toString(36).substring(7);
    return "random", r;
};


//use to keep track of all URLs and their shortened form
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//generates a random string for short URL
app.post("/urls", (request, response) => {
  console.log(request.body); 
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = request.body.longURL;
  response.redirect('/urls/' + shortURL);         
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

  //displays all the URL and their shortened forms
  app.get('/urls', (request, response)=>{
    const templateVars = {
      urls: urlDatabase,
      username: request.cookies['username']
    };

    // console.log(request.cookies["username"]);
    response.render("urls_index", templateVars);
  });

  app.post("/logout", (request, response)=>{
    response.clearCookie("username");
    response.redirect('/urls');
  });

//route to render urls_new
app.get("/urls/new", (request, response) =>{
    const templateVars = {
      username: request.cookies['username']
    };
    response.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  response.redirect(longURL);
});

app.get("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, username: request.cookies['username'] };
  response.render("urls_show", templateVars);
});

//displays a single URL and its shortned form
  app.get("/urls/:shortURL", (request, response) => {
    const shortURL = request.params.shortURL;
    const longURL = urlDatabase[shortURL];
    const templateVars = { shortURL, longURL, username: request.cookies['username']};
    response.render("urls_show", templateVars);
  });
  
  
  app.post("/urls/:shortURL/delete", (request, response) => {
    let shortURL = request.params.shortURL;
    delete urlDatabase[shortURL];
    response.redirect("/urls");
  });
  
  //prints to console confirming server is up
  app.listen(PORT, ()=>{
    console.log(`Now listening on port:${PORT}`);
  });
  
  