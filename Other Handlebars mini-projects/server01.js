const context = {   

    t:[
       {a:1, b:1},
       {a:2, b:2}
    ]
 
 }
const express = require("express")
const app = express()
const PORT = 3000;
const hbs = require('express-handlebars');
const path = require("path")
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów
app.get("/login", function (req, res) {
    res.render('login.hbs');   // nie podajemy ścieżki tylko nazwę pliku
})
app.get("/index", function (req, res) {
    res.render('index.hbs');   // nie podajemy ścieżki tylko nazwę pliku
})
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
    })