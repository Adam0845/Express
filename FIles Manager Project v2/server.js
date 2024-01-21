const express = require("express")
const app = express()
const PORT = 3000;
const fs = require("fs");
const formidable = require('formidable');
const hbs = require('express-handlebars');
const path = require("path")
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
//TABLICA Z PLIKAMI 

const filepath = path.join(__dirname, "upload", "file01.txt")
const ksiega_rozszerzen = ['jpg','pdf','doc','mp4','zip','txt','png','gif','docs','txt','svg']
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        getIco: function (type) {
            const extension = mapaRozszerzen[type]
            return `${extension}`;
        },
        getExtension: function(fileName) {
            let parts = fileName.split('.');
            console.log(parts)
            if (parts.length > 1) {
                for(let i = 0; i < ksiega_rozszerzen.length;++i)
                {
                    if(parts[parts.length - 1] == ksiega_rozszerzen[i])
                    {
                        return parts[parts.length - 1];
                    }
                }
                return 'else';
                
            }
            else {
                return "else";
            }
        }
    }
}));
app.get("/delete", function (req, res) {
    filepath_del = path.join(__dirname, "upload", req.query.name)
    fs.unlink(filepath_del,  (err) =>{
            if (err) throw err
            console.log("czas 1: " + new Date().getMilliseconds());
        })
        res.redirect('/filemanager')
 })
 app.get("/deldir", function (req, res) {
    filepath_del = path.join(__dirname, "upload", req.query.name)
    fs.rmdir(filepath_del, (err) => {
        if (err) throw err
        console.log("nie ma ");
    })
    res.redirect('/filemanager')
 })
//------------------------------------------------------
app.get('/addfolder', function (req, res) {
    const dirname = req.query.dirname;
    if (!fs.existsSync(`./upload/${dirname}`)) {
        fs.mkdir(`./upload/${dirname}`, (err) => {
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
    if (!fs.existsSync(`./upload/${filename}`)) {
        fs.writeFile(`./upload/${filename}`, "", (err) => {
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
    res.redirect("/filemanager")
})


app.get("/filemanager", function (req, res) {
    dirs = [] //folders
    filestab = [] //files
    extensions = []
    fs.readdir('./upload/', (err, files) => {
        if (err) throw err
        console.log("lista 1  - ", files);
        files.forEach((file) => {
            fs.lstat("./upload/" + file, (err, stats) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (stats.isDirectory()) {

                    dirs.push(file)
                    extensions.push()
                    console.log('foldery:')
                    console.log(dirs)
                }
                else {
                    filestab.push(file)
                    
                    console.log('pliki')
                    console.log(filestab)
                }
            })
        })
    })
    res.render('filemanager2.hbs', { filestab, dirs });
})
app.post('/upload', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = __dirname + '/upload';
    form.keepFilenames = true;
    form.parse(req, function (err, fields, files) {
        Object.keys(files).forEach(function (name) {
            const file = files[name];
            const oldPath = file.path;
            const newPath = path.join(form.uploadDir, file.name);

            fs.renameSync(oldPath, newPath);
        });
    });
    res.redirect("/filemanager")
});
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
