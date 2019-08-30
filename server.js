var express = require('express');
var app = express();

// On utilise les cookies, les sessions et les formulaires
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/* On utilise le template: ejs */
app.use('/', express.static(__dirname + '/'));
//app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");


/* On utilise les sessions */
//Ou: app.use(session({secret: 'signalersecret'}))
app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'signalersecret'
    })
);

// mysql pour la base de donnée
var mysql = require('mysql');

var conmysql = mysql.createConnection({
    database: 'absences',
    host: "localhost",
    user: "root",
    password: "tuyen1994"
});

// connecter mysql à server
conmysql.connect(function(error){
    if(error){
        console.log("Error while connecting to database")
    }
    else{

        // console.log("connected");
        conmysql.query("SELECT * FROM etudiants", function (err, result, fields) {
    if (err) throw err;
        for (var i = 0; i < result.length; i++) {
            var row = result[i];
            console.log(row.Id, "Nom", row.Nom, "Prénom", row.Prenom, "Sexe", row.Sexe, "Date de naissance", row.DateNaissance, "Email", row.Email  );
       }   
    // console.log(result);
    })
}});


/* S'il n'y a pas de signlerabsence dans la session,
on en crée une vide sous forme d'array avant la suite */
app.use(function(req, res, next){
    if (typeof(req.session.signalerabsence) == 'undefined') {
        req.session.signalerabsence = [];
    }
    next();
});


/* On affiche la signalerabsence et le formulaire */
app.get('/signaler', function(req, res, next) { 
    res.render('signaler.ejs', {signalerabsence: req.session.signalerabsence});
});


/* On ajoute un élément à la signalerabsence */
app.post('/signaler/ajouter/', urlencodedParser, function(req, res) {

    if (req.body.newabsence != '') {
        req.session.signalerabsence.push(req.body.newabsence);
    }
    res.redirect('/signaler', { data: req.body });
});

/* On affiche la etudiantconsulte et le formulaire */
app.get('/etudiant', function(req, res) { 
    res.render('etudiant_consulter.ejs', {signalerabsence: req.session.signalerabsence});
});

/* On ajoute un élément à la etudiantconsulte */
app.post('/etudiant/etudiant_consulter', urlencodedParser, function(req, res) {

    res.render('/etudiant', { data: req.body });

    if (req.body.newabsence != '') {
       req.session.signalerabsence.push(req.body.newabsence);
     }
    res.redirect('/etudiant', { data: req.body });
});

/* On redirige vers la signalerabsence si la page demandée n'est pas trouvée */
app.use(function(req, res, next){
    res.redirect('/signaler');
});

app.listen(8000, () => {
    console.log('express started on 8000');
});