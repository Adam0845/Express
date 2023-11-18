const express = require("express")
const app = express()
const PORT = 3000;
const formidable = require('formidable');
const hbs = require('express-handlebars');
const path = require("path")
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));         
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   
app.set('view engine', 'hbs');
//TABLICA Z PLIKAMI 
let uploadedFiles = [];
let id = 1;
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
//------------------------------------------------------
app.get("/", function (req, res) {
    res.render('upload.hbs');  
})
app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', {uploadedFiles});  
})
app.get("/show", function (req, res) {
    let id = parseInt(req.query.id);
    let file = uploadedFiles.find(f => f.id === id);
    res.sendFile(file.path)
})
app.get("/info", function (req, res) {
    let id = parseInt(req.query.id);
    let file = uploadedFiles.find(f => f.id === id);
    res.render("info.hbs",{file})
})
app.get("/download", function (req, res) {
    let id = parseInt(req.query.id);
    let file = uploadedFiles.find(f => f.id === id);
    console.log(file)
    res.download(file.path, file.name)
})
app.get("/delAll", function (req, res) {
   uploadedFiles = [];
   res.redirect("/filemanager")
})
app.get("/delete", function (req, res) {
    let id = parseInt(req.query.id);
    let file = uploadedFiles.find(f => f.id === id);
    uploadedFiles = uploadedFiles.filter(f => f.id !== id);
    console.log(file)
    res.redirect("/filemanager")
 })
//-----------------------------------------------------
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        getIco: function(type) {
            const extension = mapaRozszerzen[type] // Domyślne rozszerzenie, gdy brak mapowania
            return `${extension}`;
        }
        }
    }));
app.post('/upload', function (req, res) {

            let form = formidable({});
            form.keepExtensions = true   // zapis z rozszerzeniem pliku
            form.multiples = true
            form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
        
            form.parse(req, function (err, fields, files) {
         
                console.log("----- przesłane pola z formularza ------");
        
                console.log(fields);
        
                console.log("----- przesłane formularzem pliki ------");
        
                console.log(files);
        Object.keys(files).forEach(key => {
            if (Array.isArray(files[key])) {
                files[key].forEach(file => {
                    uploadedFiles.push({
                        id: id++,
                        name: file.name,
                        path: file.path,
                        size: file.size,
                        type: file.type,
                        savedate: file.lastModifiedDate
                    });
                });
            } else {
                uploadedFiles.push({
                    id: id++,
                    name: files[key].name,
                    path: files[key].path,
                    size: files[key].size,
                    type: files[key].type,
                    savedate: files[key].lastModifiedDate
                });
            }
            console.log(uploadedFiles)
        });
       
            });
        res.redirect("/")
});   
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
})