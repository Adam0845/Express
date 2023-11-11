const context = {
    subject: "ćwiczenie 2 - podstawowy context",
    content: "to jest lorem ipsum",
    footer: "to jest stopka na mojej stronie"
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
    res.render('index02.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
})
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
    })