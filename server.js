const express = require("express")
const app = express()
const PORT = 3000;
const fs = require("fs")
const hbs = require('express-handlebars');
const path = require("path")
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));         
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   
app.set('view engine', 'hbs');
//TABLICA Z PLIKAMI 
const filepath = path.join(__dirname, "files", "file01.txt")
const mapaRozszerzen = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'text/plain': 'txt',
    'application/vnd.oasis.opendocument.text': 'docs',
    'video/mp4': 'mp4',
    'application/x-zip-compressed': 'zip',
    'application/pdf': 'pdf'
}
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        getIco: function(type) {
            const extension = mapaRozszerzen[type] 
            return `${extension}`;
        }
        }
    }));
//------------------------------------------------------
app.get('/addfolder' , function (req, res) {
    const dirname = req.query.dirname;
    if (!fs.existsSync(`./files/${dirname}`)) {
        fs.mkdir(`./files/${dirname}`, (err) => {
            if (err) throw err
            console.log("jest");
            res.redirect("/filemanager")
        })
    }
    else {
        res.redirect("/filemanager")
    }
})
app.get("/addfile", function (req, res) {
    const filename = req.query.filename;
    if (!fs.existsSync(`./files/${filename}`)) {
        fs.writeFile(`./files/${filename}`, "", (err) => {
            if (err) throw err
            console.log("plik utworzony");
            res.redirect("/filemanager")
        })
    }
    else {
        res.redirect("/filemanager")
    }
})
app.get("/", function (req, res) {
    res.render('filemanager2.hbs');  
})

app.get("/filemanager", function (req, res) {
    res.render('filemanager2.hbs');  
})
 
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
})