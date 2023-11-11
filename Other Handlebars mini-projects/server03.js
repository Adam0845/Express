const context = {
    subject: "ćwiczenie 3 - dane z tablicy obiektów",  
    books: [
             { title: "Lalka", author: "B Prus", lang: "PL" },
             { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
             { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
             { title: "Homo Deus", author: "Yuval Noah Harari", lang: "CZ" }
   ]
 }
const express = require("express")
const app = express()
const PORT = 3000;
const hbs = require('express-handlebars');
const path = require("path")
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów
app.get("/", function (req, res) {
    res.render('index03.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
})
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
    })