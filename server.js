var express = require('express');
var app = express();

// On utilise les cookies, les sessions et les formulaires
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var fileUpload = require('express-fileupload');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


//const {getHomePage} = require('./routes/index');
//const {ajouterEtudiantPage, AjouterEtudiant} = require('./routes/etudiant');
//const {ajouterAbsencePage, AjouterAbsence} = require('./routes/absence');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/* On utilise le template: ejs */
app.use('/', express.static(__dirname + '/'));
//app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");
// configuer fileupload
app.use(fileUpload()); 


/* On utilise les sessions */
app.use(session({secret: 'signalersecret'}))

// mysql pour la base de donnée
var mysql = require('mysql');

var conmysql = mysql.createConnection({
    database: 'absences',
    host: "localhost",
    user: "root",
    password: "tuyen1994"
});

// connecter mysql à server
conmysql.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.conmysql = conmysql;


/* S'il n'y a pas de signlerabsence dans la session,
on en crée une vide sous forme d'array avant la suite */
app.use(function(req, res, next){
    if (typeof(req.session.signalerabsence) == 'undefined') {
        req.session.signalerabsence = [];
    }
    next();
});

app.use(function(req, res, next){
    if (typeof(req.session.consulterabsence) == 'undefined') {
        req.session.consulterabsence = [];
    }
    next();
});

app.use(function(req, res, next){
    if (typeof(req.session.consultervalide) == 'undefined') {
        req.session.consultervalide = [];
    }
    next();
});

app.use(function(req, res, next){
    if (typeof(req.session.justifierabsence) == 'undefined') {
        req.session.justifierabsence = [];
    }
    next();
});


/* On affiche la signalerabsence et le formulaire */
app.get('/ajouter', function(req, res, next) { 
    // var sql = "SELECT * FROM etudiants";
    //     conmysql.query(sql, function(err, results){
    //        if(err) throw err;
    //            console.log(results);
    //         res.send(results);
    // });
    res.render('ajouter.ejs', {signalerabsence: req.session.signalerabsence});
});

/* On ajoute un élément à la signalerabsence */
app.post('/ajouter', urlencodedParser, function(req, res) {
    var nomCours = req.body.nomCours;
    var dateAbsences = req.body.dateAbsences;
    var nbHeures = req.body.nbHeures;
    var heureDebut = req.body.heureDebut;
    // res.write('Envoyer nom de cours "' + req.body.nomCours+'".\n');
    // res.write('Envoyer date de absence "' + req.body.dateAbsences+'".\n');
    // res.write('Envoyer la durée "' + req.body.nbHeures+'".\n');
    // res.write('Envoyer le temps de début "' + req.body.heureDebut+'".\n');

    conmysql.connect(function(err) {
        if (err) throw err;
        var sql = "INSERT INTO absences (nomCours, dateAbsences, nbHeures, heureDebut) VALUES ('"+nomCours+"', '"+dateAbsences+"','"+nbHeures+"','"+heureDebut+"')";
        conmysql.query(sql, function (err, result) {
            if (err) throw err;
                console.log("1 record inserted");
            res.end();
        });
    });

});

// afficher le signaler page
app.get('/signaler', function(req, res, next) { 
    var sql = "SELECT * FROM etudiants";
    conmysql.query(sql, function(err, results){
        if(err) throw err;
            console.log(results);
        res.send(results);
    });
   
});

// app.get('/ajouter/signaler', function(req, res, next) { 
//     var sqletudiant = "SELECT * FROM etudiants"; // query database pour afficher la liste d'étudiant
//     conmysql.query(sqletudiant, function(err, results){
//         if (err) {
//             res.redirect('/');
//         }
//         res.render('signaler.ejs', {players: result
//         });
//     });

// });

app.get('/consulter', function(req, res, next) { 
    res.render('signaler.ejs', {consultervalide: req.session.consultervalide});
});

app.get('/etudiant', function(req, res, next) { 
    res.render('etudiant_consulter.ejs', {consulterabsence: req.session.consulterabsence});
});

app.get('/justificatifs', function(req, res, next) { 
    res.render('justificatifs.ejs', {justifierabsence: req.session.justifierabsence});
});


//app.get('/signaler', getHomePage);

/* On redirige vers la ajouterabsence si la page demandée n'est pas trouvée */
app.use(function(req, res, next){
    res.redirect('/ajouter');
});

app.listen(8000, () => {
    console.log('express started on 8000');
});