module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `etudiants` ORDER BY id ASC"; // query database to get all the etudiants

        // execute query
        conmysl.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('signaler.ejs', {etudiants: result
            });
        });
    },
};