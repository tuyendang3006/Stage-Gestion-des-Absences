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

var db = require('../db');

var etudiant={
	getAllEtudiant:function(callback){
		return db.query("Select * from etudiants",callback);
	},
	getEtudiantById:function(id,callback){
		return db.query("select * from etudiants where Id=?",[id],callback);
	},
	addEtudiant:function(etudiant,callback){
		return db.query("Insert into etudiants(nom, prenom, sexe, DateDeNaissance, email) values(?,?,?,?,?)",[etudiant.Nom, etudiant.Prenom, etudiant.Sexe, etudiant.DateNaissance, etudiant.Email],callback);
	},
	deleteEtudiant:function(id,callback){
		return db.query("delete from etudiants where Id=?",[id],callback);
	},
	updateEtudiant:function(id,etudiant,callback){
		return db.query("update etudiants set nom=?, prenom=?, sexe=?, datedenaissance=?, email=? where Id=?",[etudiant.Nom, etudiant.Prenom, etudiant.Sexe, etudiant.DateNaissance, etudiant.Email],callback);
	}
};

module.exports = etudiant;

module.exports = {mysql, conmysql};