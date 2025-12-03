const express = require('express');
const router = express.Router();

// GET /api/books
// Returns a JSON list of books, with optional filters:
//   ?search=world
//   ?minprice=5&max_price=10
//   ?sort=name  or  ?sort=price
router.get('/books', function (req, res, next) {
  // Base SQL
  let sqlquery = 'SELECT * FROM books';
  const params = [];
  const conditions = [];

  // search term search = world
  if (req.query.search) {
    conditions.push('name LIKE ?');
    params.push('%' + req.query.search + '%');
  }

  // price range minprice = 5 max_price = 10
  if (req.query.minprice && req.query.max_price) {
    conditions.push('price BETWEEN ? AND ?');
    params.push(req.query.minprice, req.query.max_price);
  }

  // If we added any conditions, add WHERE clause
  if (conditions.length > 0) {
    sqlquery += ' WHERE ' + conditions.join(' AND ');
  }

  // sort sort = name or sort = price
  if (req.query.sort === 'name') {
    sqlquery += ' ORDER BY name';
  } else if (req.query.sort === 'price') {
    sqlquery += ' ORDER BY price';
  }

  // Execute the SQL query
  db.query(sqlquery, params, (err, result) => {
    if (err) {
      // Return the error as JSON
      res.status(500).json(err);
      return next(err);
    } else {
      // Return results as JSON
      res.json(result);
    }
  });
});

module.exports = router;