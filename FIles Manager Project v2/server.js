const express = require("express")
const app = express()
const PORT = 3000;
const fs = require("fs");
const formidable = require('formidable');
const hbs = require('express-handlebars');
const path = require("path");
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieparser = require("cookie-parser");
app.use(cookieparser())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use('/upload', express.static('upload'));
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
let currentpath = "upload"
let splitedloc = [];
const filepath = path.join(__dirname, "upload", "file01.txt")
const ksiega_rozszerzen = ['jpg', 'pdf', 'doc', 'mp4', 'zip', 'txt', 'png', 'gif', 'docs', 'txt', 'svg', 'html', 'css', "json", "js"]
function takextension(fileName) {
    let parts = fileName.split('.');
    console.log(parts)
    if (parts.length > 1) {
        for (let i = 0; i < ksiega_rozszerzen.length; ++i) {
            if (parts[parts.length - 1] == ksiega_rozszerzen[i]) {
                return parts[parts.length - 1];
            }
        }
    }
    return 'else';
}
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
app.get("/chfilename", function (req, res) {
    const newname = req.query.newname
    const oldname = req.query.filename;
    fs.rename(currentpath + "/" + oldname, currentpath + "/" + newname, (err) => {
        if (err) throw err
        console.log("Zmieniono nazwę pliku");
        res.redirect("/showfile?name=" + newname)
    })
})
app.get("/showfile", function (req, res) {
    const filename = req.query.name;
    if (takextension(filename) === "png" || takextension(filename) === "jpg") {
        res.redirect("/showimage?name=" + filename)
    }
    fs.readFile(currentpath + "/" + filename, 'utf8', function (err, content) {
        if (err) {
            console.error(err);
        } else {
            res.render("edytor.hbs", { filename, content });
        }
    });
})
app.get("/previewImage", function(req, res) {
    let pathtoimg = req.query.name;
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(__dirname + pathtoimg);
});
const effects = [
    { name: "grayscale" },
    { name: "invert" },
    { name: "sepia" },
    { name: "none" }
]
app.get("/showimage", function (req, res) {
    const imagename = req.query.name;
    console.log(imagename);
    res.render("image.hbs", { imagename, effects, currentpath });
})
app.post('/saveimage', function(req, res) {
    const imagedata = req.body.image;
    const pathtoimg = req.body.path;
    let imagedata1 = imagedata.split(",")[1]; 
    console.log(pathtoimg);
    let imageBuffer = Buffer.from(imagedata1, 'base64');
    fs.writeFileSync("./" + pathtoimg, imageBuffer);
});
app.post("/savefile", function (req, res) {
    const fname = req.query.filename;
    const content = req.body.content;
    console.log("Plik o nazwie:", fname, "zawiera:", content)
    fs.writeFile(currentpath + "/" + fname, content, (err) => {
        if (err) throw err
        console.log("plik zapisany");
        res.redirect("/filemanager")
    })
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
                    //console.log('foldery:')
                    //console.log(dirs)
                }
                else {
                    filestab.push(file)

                    //console.log('pliki')
                    // console.log(filestab)
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
app.post('/saveConfig', (req, res) => {
    const settings = req.body;
    console.log('Przesłane ustawienia:', settings);
    fs.writeFile(__dirname + '/static/data/config.json', JSON.stringify(req.body), (err) => {
        if (err) {
            console.error(err);

        } else {
            console.log("Poprawnie!")
            res.end();
        }
    });
});
//login and register
//==============================================
//BAZA DANYCH
const Datastore = require('nedb')
const users = new Datastore({
    filename: __dirname + '/static/data/users.db',
    autoload: true
});
//==============================================
app.get('/register', (req, res) => {
    res.render('register.hbs');
});
app.get('/login', (req, res) => {
    res.render('login.hbs');
});
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.pass;
    const password2 = req.body.confpass;
    if(password !== password2) {
        res.redirect('/error?type=notsamepass');
        return;
    }
    if(password.length < 6) {
        res.redirect('/error?type=shortpass');
        return;
    }
    if(username.length < 4) {
        res.redirect('/error?type=shortusername');
        return;
    }
    const user = {
        username: username,
        password: password
    }
    users.find({ username: username }, function (err, docs) {    
        if (docs.length > 0) {
            res.redirect('/error?type=usertaken');
            return;
        }
        else {
            users.insert(user, function (err, newDoc) {
                console.log("dodano dokument (obiekt):")
                console.log(newDoc)
                console.log("unikalne id dokumentu: "+newDoc._id)
                let id = newDoc._id
                res.redirect('/login');
                
        });
        }
     });

});
app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.pass;
    const user = {
        username: username,
        password: password
    }
    users.find({ username: username, password: password }, function (err, docs) {    
        if (docs.length===0) {
            res.redirect('/error?type=passwordwrong');
            return;
        }
        else {
            res.cookie("login", username, { httpOnly: true, maxAge: 30 * 1000 }); 
            res.redirect('/index2?username='+username);
        }
    });
});
app.get('/index2', (req, res) => {
    const username = req.query.username;
    if(!req.cookies.login) {
        res.redirect('/logout');
        return;
    }
    res.render('index2.hbs', {username});
});
app.get('/error', (req, res) => {
    const type = req.query.type;
    let context = '';
    if(type==='notsamepass') {
        context = 'Hasła nie są takie same!';
    }
    if(type==='usertaken') {
        context = 'Użytkownik o podanej nazwie już istnieje!';
    }
    if(type==='passwordwrong') {
        context = 'Niepoprawne hasło!';
    }
    if(type==='shortpass') {
        context = 'Hasło jest za krótkie!';
    }
    if(type==='shortusername') {
        context = 'Nazwa użytkownika jest za krótka!';
    }
    res.render('error.hbs', {context});
});
app.get('/logout', (req, res) => {
    res.clearCookie("login");
    res.render('logout.hbs');
});
//=====================
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
