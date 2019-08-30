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


module.exports = {mysql, conmysql};