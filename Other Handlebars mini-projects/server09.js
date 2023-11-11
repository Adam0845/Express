const context = require("./data/data09.json")
console.log(context)
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
    res.render('index09.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
})
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs' ,
    helpers: {         
    shortTitle: function (title) {
    return title.substring(0,10) +"...";
    },
    bigLetters: function (title) {
        const words = title.split(" ");
        const titled = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return titled.join(" ")
        },
    myslniki: function (title) {
            const words = title.split(" ");
            const myslnikowe = words.map(word => {
                const letters = word.split("");
                const myslnikowe = letters.join("-");
                return myslnikowe;
            });
            return myslnikowe.join(" ")
        }
    }
    }));
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
    })