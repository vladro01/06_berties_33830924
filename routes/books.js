// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
      res.redirect('/users/login');
    } else {
      next();
    }
  };

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    let keyword = req.sanitize(req.query.keyword || '');
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let params = ['%' + keyword + '%'];

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render('list.ejs', { availableBooks: result });
    });
});
router.get('/list',redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", { availableBooks: result });
     });
});
// Show the add book form
router.get('/addbook',redirectLogin, function (req, res, next) {
    res.render('addbook.ejs');
});

// Handle form submit and insert into DB
router.post('/bookadded', function (req, res, next) {
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return next(err);
        }
        res.send('This book is added to database, name: ' +
            req.body.name + ' price ' + req.body.price);
    });
});
//Extensions
router.get('/bargainbooks',redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render('list.ejs', { availableBooks: result });
    });
});


// Export the router object so index.js can access it
module.exports = router
