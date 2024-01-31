const express = require("express")
const app = express()
const PORT = 3000;
const fs = require("fs");
const formidable = require('formidable');
const hbs = require('express-handlebars');
const path = require("path");
const { dir } = require("console");
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
let currentpath = "upload"
let splitedloc = [];
const filepath = path.join(__dirname, "upload", "file01.txt")
const ksiega_rozszerzen = ['jpg', 'pdf', 'doc', 'mp4', 'zip', 'txt', 'png', 'gif', 'docs', 'txt', 'svg', 'html', 'css', "json", "js"]
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    helpers: {
        getIco: function (type) {
            const extension = mapaRozszerzen[type]
            return `${extension}`;
        },
        getExtension: function (fileName) {
            let parts = fileName.split('.');
            console.log(parts)
            if (parts.length > 1) {
                for (let i = 0; i < ksiega_rozszerzen.length; ++i) {
                    if (parts[parts.length - 1] == ksiega_rozszerzen[i]) {
                        return parts[parts.length - 1];
                    }
                }
                return 'else';

            }
            else {
                return "else";
            }
        },
        formatPath: function (index) {
            return '/' + splitedloc.slice(0, index + 1).join('/');
        },
        takeLast: function (splitedloc) {
            let lastFolder = splitedloc[splitedloc.length - 1];;
            return '/' + lastFolder;
        },
        equal: function (a, b) {
            return a === b;
        }
    }
}));
app.get("/delete", function (req, res) {
    filepath_del = path.join("./" + currentpath, req.query.name)
    fs.unlink(filepath_del, (err) => {
        if (err) throw err
        console.log("czas 1: " + new Date().getMilliseconds());
    })
    res.redirect('/filemanager')
})
app.get("/deldir", function (req, res) {
    filepath_del = path.join("./" + currentpath, req.query.name)
    fs.rmdir(filepath_del, { recursive: true }, (err) => {
        if (err) throw err
        console.log("nie ma ");
    })
    res.redirect('/filemanager')
})

//------------------------------------------------------
app.get('/addfolder', function (req, res) {
    const dirname = req.query.dirname;
    if (!fs.existsSync("./" + currentpath + "/" + + dirname)) {
        fs.mkdir(currentpath + "/" + dirname, (err) => {
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
    if (!fs.existsSync("./" + currentpath + "/" + filename)) {
        fs.writeFile("./" + currentpath + "/" + filename, "", (err) => {
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
app.get("/changedir", function (req, res) {
    const newname = req.query.newname
    let newPath = "";
    if (splitedloc[splitedloc.length - 1] === "upload") {
        newPath = splitedloc.join("/") + "/" + newname;
    }
    else {
        splitedloc.pop()
        newPath = splitedloc.join("/") + "/" + newname;
    }


    if (!fs.existsSync(newPath)) {
        fs.rename(currentpath, newPath, (err) => {
            if (err) throw err;
            console.log("Zmieniono nazwę katalogu");
            res.redirect("/filemanager");
            currentpath = newPath;
        });
    } else {
        res.redirect("/filemanager");
    }
});
app.get("/showfile", function (req, res) {
    const filename = req.query.name;
    res.render("edytor.hbs", { filename })
})
app.get("/filemanager", function (req, res) {

    if (req.query.path) {

        currentpath = path.join("./" + currentpath, req.query.path);
        console.log(currentpath)
    }
    if (req.query.back) {
        console.log(req.query.back)
        currentpath = path.join("./", req.query.back);
        console.log(currentpath)
    }
    splitedloc = currentpath.replace(/\\/g, '/').split("/");
    console.log('splitedlocs', splitedloc)

    let dirs = [] //folders
    let filestab = [] //files
    let extensions = []
    fs.readdir("./" + currentpath, (err, files) => {

        if (err) throw err
        console.log("lista 1  - ", files);
        files.forEach((file) => {
            fs.lstat("./" + currentpath + "/" + file, (err, stats) => {
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
    dirs.sort()
    filestab.sort()
    res.render('filemanager2.hbs', { filestab, dirs, currentpath: currentpath, splitedloc });

})
app.post('/upload', function (req, res) {
    let form = formidable({});
    form.keepExtensions = true
    form.multiples = true
    form.uploadDir = "./" + currentpath;
    form.keepFilenames = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.error(err.message);
        }
        if (!Array.isArray(files.uploaded)) {
            const file = files.uploaded.name;
            const newPath = path.join(form.uploadDir, file);
            fs.renameSync(files.uploaded.path, newPath);
        }
        else {
            for (let i = 0; i < files.uploaded.length; i++) {
                const file = files.uploaded[i].name;
                const newPath = path.join(form.uploadDir, file);
                fs.renameSync(files.uploaded[i].path, newPath);
            }
        }
    });
    res.redirect("/filemanager")
});

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
