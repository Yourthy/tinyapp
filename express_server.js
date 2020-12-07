const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (request, response)=>{
    response.send("hello there!");
});

app.listen(PORT, ()=>{
    console.log(`Now listening on port:${PORT}`);
});