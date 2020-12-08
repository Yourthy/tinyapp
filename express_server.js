const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString() {
    let r = Math.random().toString(36).substring(7);
    return "random", r;
};


app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/new", (request, response) =>{
    response.render("urls_new");
});

app.post("/urls", (req, res) => {
    console.log(req.body); 
    let shortURL = generateRandomString();
    urlDatabase[shortURL] = req.body.longURL;
    res.redirect('/urls/' + shortURL);         
  });

  

  app.get("/urls/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    const templateVars = { shortURL, longURL };
    res.render("urls_show", templateVars);
  });
  
  app.post("/urls/:shortURL/delete", (req, res) => {
    delete shortURL;
    console.log(urlDatabase);
    res.redirect("/urls")
  });
  


app.get('/urls', (request, response)=>{
    const templateVars = {urls: urlDatabase};
    response.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  });

app.get("/urls/:shortURL", (request, response) => {
    const templateVars = { shortURL: request.params.shortURL, longURL: request.params.longUrl };
    response.render("urls_show", templateVars);
  });


app.listen(PORT, ()=>{
    console.log(`Now listening on port:${PORT}`);
});

// app.get('/', (request, response)=>{
//     response.render('pages/index');
// });

//about page
// app.get('/about', (request, response)=>{
    //     response.render('pages/about');
// });





// app.get('/', (request, response)=>{
//     response.send("hello there!");
// });

// app.get('/hello', (request, response)=>{
//     response.send("<html><body>Hello <b>World!</b></body></html>\n");
// });

// app.get('/set', (request, response)=>{
//     const a = 1;
//     response.send(`a = ${a}`);
// });

// app.get('/fetch', (request, response)=>{
//     response.send(`a = ${a}`);
// });


// app.get('/', (request, response)=>{
//     let mascots = [
//         { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
//         { name: 'Tux', organization: "Linux", birth_year: 1996},
//         { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
//     ];
//     let tagline = 'No programming concept is complete without a cute animal mascot.';

//     response.render('pages/index', {
//         mascots: mascots,
//         tagline: tagline
//     });
// });




