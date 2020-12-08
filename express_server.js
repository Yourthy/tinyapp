const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.set('view engine', 'ejs');

//index page
// app.get('/', (request, response)=>{
//     response.render('pages/index');
// });

//about page
app.get('/about', (request, response)=>{
    response.render('pages/about');
});





// app.get('/', (request, response)=>{
//     response.send("hello there!");
// });
// app.get('/urls.json', (request, response)=>{
//     response.json(urlDatabase);
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


app.get('/', (request, response)=>{
    let mascots = [
        { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
    ];
    let tagline = 'No programming concept is complete without a cute animal mascot.';

    response.render('pages/index', {
        mascots: mascots,
        tagline: tagline
    });
});



app.listen(PORT, ()=>{
    console.log(`Now listening on port:${PORT}`);
});

