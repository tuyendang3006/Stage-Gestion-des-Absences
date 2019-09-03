
module.exports = {
    ajouterAbsencePage: (req, res) => {
        res.render('signaler.ejs', {
            message: ''
        });
    },
    AjouterAbsence: (req, res) => {
        if (!req.files) {
            return res.status(400).send("Aucun fichier est téléchargé");
        }

        let message = '';
        let nomCours = req.body.nomCours;
        let dateAbsences = req.body.dateAbsences;
        let nbHeures = req.body.nomHeures;
        let heureDebut = req.body.heureDebut;

        let absenceQuery = "SELECT * FROM `absences` WHERE nomCours = '" + nomCours + "'";

        conmysql.query(absenceQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('signaler.ejs', {
                    message
                });
            } else {
                // send the player's details to the database
                let query = "INSERT INTO `absences` (nomCours, dateAbsences, nbHeures, heureDebut) VALUES ('" +
                nomCours + "', '" + dateAbsences + "', '" + nbHeures + "', '" + heureDebut +  "')";
                conmysql.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
            }
        });
    }
};