const context = {
        subject: "ćwiczenie 4 - dane z tablicy, select",
        fields:[
            {name:"title"},
            {name:"author"},
            {name:"lang"}        
        ],
        books: [
            { title: "Lalka", author: "B Prus", lang: "PL" },
            { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
            { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
            { title: "Zamek", author: "F Kafka", lang: "CZ" }
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
    res.render('index04.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
})
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
    })
app.get("/handleForm", function (req, res) {
    let x = req.query.selekcik;
    console.log(req.query.selekcik);
    let tab = []
    switch(req.query.selekcik) {
        case 'lang':
            tab = context.books.map(book => book.lang);
            console.log(tab)
            break;
        case 'author':
            tab = context.books.map(book => book.author);
            console.log(tab)
            break;
        case 'title':
            tab = context.books.map(book => book.title);
            console.log(tab)
            break;
        default:
            tab.push("Nie wybrano opcji w select!")
            break;

    }
    res.render('index041.hbs', {tab, x, context});
       // nie podajemy ścieżki tylko nazwę pliku
})    