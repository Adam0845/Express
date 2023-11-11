//KLASYKI
const express = require("express")
const app = express()
const PORT = 3000;
app.use(express.urlencoded({
    extended: true
  }));  
const hbs = require('express-handlebars');
const path = require("path")
app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));         
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   
app.set('view engine', 'hbs');
//==============================================
//BAZA DANYCH
const Datastore = require('nedb')
const coll1 = new Datastore({
    filename: 'samochody.db',
    autoload: true
});
//==============================================
                  
//PRZEKIEROWYWANIE STRONEK
app.get("/", function (req, res) {
    res.render('index.hbs');  
})
app.get("/addCar", function (req, res) {
    let id = req.query.id;
    res.render('add.hbs',{ newDocId: id });
})
app.post("/addCars", function (req, res) {
    let baza = {
           ubezpieczony: req.body.ubezpieczony=="on" ? "TAK" : "NIE",
           benzyna: req.body.benzyna=="on" ? "TAK" : "NIE",
           uszkodzony: req.body.uszkodzony=="on" ? "TAK" : "NIE",
           naped:  req.body.naped=="on" ? "TAK" : "NIE"
        }
    coll1.insert(baza, function (err, newDoc) {
            console.log("dodano dokument (obiekt):")
            console.log(newDoc)
            console.log("unikalne id dokumentu: "+newDoc._id)
            let id = newDoc._id
            res.redirect('/addCar?id=' + id);
            
    });
    
    
})
app.get("/carsList", function (req, res) {
    coll1.find({ }, function (err, samochody) {
        console.log("----- tablica obiektów pobrana z bazy: \n")
        res.render('list.hbs', {samochody: samochody});  
    });
    
})
// app.post("/carList", function (req, res) {
//     let carId = req.body.id;
//     console.log(req.body.id)
//     coll1.findOne({ _id: req.body.id }, function (err, doc) {
//         console.log("----- obiekt pobrany z bazy: ",doc)
//         res.redirect('/carsList')
//     });
    
// })

app.get("/deleteCars", function (req, res) {
    let numRemoved = req.query.nr;
    console.log(numRemoved);
    coll1.find({ }, function (err, samochody) {
        res.render('delete.hbs', {samochody: samochody, numRemoved: numRemoved});  
    }); 
})
app.get("/delSel", function (req, res) {
    let selCars = Object.keys(req.query);
    coll1.remove({ _id: { $in: selCars } }, { multi: true }, function (err, numRemoved) {
        let nr = numRemoved;
         res.redirect('/deleteCars?nr=' + nr);
     });
 });
app.get("/delAll", function (req, res) {
    coll1.remove({}, { multi: true }, function (err, numRemoved) {
            res.render("delete.hbs", {numRemoved: numRemoved}) 
        });
    
})

app.get("/editCars", function (req, res) {
    let carId = req.query.carId;
    
    console.log(carId)
    coll1.find({ }, function (err, samochody) {
        let carToEdit = samochody.find(car => car._id === carId);
        res.render('edit.hbs', {samochody: samochody, carToEdit: carToEdit});  
    }); 
})
app.get("/edit", function (req, res) {
    let carId = req.query.carId;
    res.redirect('/editCars?carId='+ carId);
})

app.get("/edited", function (req, res) {
    let carId = req.query.id;
    let ubezpieczony = req.query.ubezpieczony;
    let benzyna = req.query.benzyna;
    let uszkodzony = req.query.uszkodzony;
    let naped = req.query.naped;

    let updatedData = {
        ubezpieczony: ubezpieczony,
        benzyna: benzyna,
        uszkodzony: uszkodzony,
        naped: naped
    };

    coll1.update({ _id: carId }, { $set: updatedData }, {}, function (err, numUpdated) {
        res.redirect('/editCars');
        });
});

//====================================
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
    }));
app.listen(PORT, function () {
        console.log("start serwera na porcie " + PORT )
})