
module.exports = {
    ajouterEtudiantPage: (req, res) => {
        res.render('ajouterEtudiant.ejs', {
            message: ''
        });
    },
    AjouterEtudiant: (req, res) => {
        if (!req.files) {
            return res.status(400).send("Aucun fichier est téléchargé");
        }

        let message = '';
        let Nom = req.body.Nom;
        let Prenom = req.body.Prenom;
        let Email = req.body.Email;
        let Sexe = req.body.Sexe;
        let DateNaissance = req.body.DateNaissance;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM etudiants WHERE Nom = '" + Nom + "'";

        conmysql.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('ajouterEtudiant.ejs', {
                    message
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`image/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `etudiants` (Nom, Prenom, Sexe, DateNaissance, Email) VALUES ('" +
                            Nom + "', '" + Prenom + "', '" + Sexe + "', '" + DateNaissance + "', '" + Email +  "')";
                        conmysql.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('ajouterEtudiant.ejs', {
                        message
                    });
                }
            }
        });
    }
};