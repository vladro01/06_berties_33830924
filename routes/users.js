// routes/users.js

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const db = global.db;
const saltRounds = 10;

const { check, validationResult } = require('express-validator');

// Middleware to protect  the routes
const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    res.redirect('/usr/247/users/login');
  } else {
    next();
  }
};

// GET /users/register: show registration form
router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

// POST /users/registered: validate, sanitise, hash password + save user
router.post(
  "/registered",
  [
    check('username')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters.'),
    check('first')
      .notEmpty()
      .withMessage('First name is required.'),
    check('last')
      .notEmpty()
      .withMessage('Last name is required.'),
    check('email')
      .isEmail()
      .withMessage('A valid email address is required.'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).render("register.ejs", { errors: errors.array() });
    }

    // SANITISE user input
    const username = req.sanitize(req.body.username);
    const first = req.sanitize(req.body.first);
    const last = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const password = req.body.password; // don’t sanitise password

    const plainPassword = password;

    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Error registering user.");
      }

      const sql = `
        INSERT INTO users (username, first, last, email, hashedPassword)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [username, first, last, email, hashedPassword],
        function (err, result) {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send("Error saving user.");
          }
          let resultMsg =
            "Hello " +
            first +
            " " +
            last +
            " you are now registered!  We will send an email to you at " +
            email;

          resultMsg +=
            "<br>Your password is: " +
            plainPassword +
            " and your hashed password is: " +
            hashedPassword;

          res.send(resultMsg);
        }
      );
    });
  }
);

// GET /users/list: list users (no passwords)
router.get("/list",redirectLogin, function (req, res, next) {
  const sql = "SELECT username, first, last, email FROM users";

  db.query(sql, function (err, rows) {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Error fetching users.");
    }

    res.render("users_list.ejs", { users: rows });
   });
});

// Helper: log login attempts
function logLoginAttempt(username, success) {
  const sql = "INSERT INTO login_audit (username, success) VALUES (?, ?)";
  db.query(sql, [username, success], function (err) {
    if (err) {
      console.error("Error logging login attempt:", err);
    }
  });
};

// GET /users/login:login form
router.get("/login", function (req, res, next) {
  res.send(`
    <h1>Login</h1>
    <form method="post" action="/users/loggedin">
      <label>Username: <input type="text" name="username" required></label><br>
      <label>Password: <input type="password" name="password" required></label><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// POST /users/loggedin: check bcrypt password
router.post("/loggedin", function (req, res, next) {
  const { username, password } = req.body;

  const sql = "SELECT hashedPassword FROM users WHERE username = ?";

  db.query(sql, [username], function (err, rows) {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Error during login.");
    }

    if (rows.length === 0) {
      // No such user
      logLoginAttempt(username, false);
      return res.send("Login failed: incorrect username or password.");
    }

    const hashedPassword = rows[0].hashedPassword;

    bcrypt.compare(password, hashedPassword, function (err, same) {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Error during login.");
      }

      if (same) {
        logLoginAttempt(username, true);
        req.session.userId = username; //save the user logged in the session 
        res.send("Login successful! Welcome, " + username);
      } else {
        logLoginAttempt(username, false);
        res.send("Login failed: incorrect username or password.");
      }
    });
  });
});

// GET /users/audit: show login audit history
router.get("/audit",redirectLogin, function (req, res, next) {
  const sql = "SELECT * FROM login_audit ORDER BY timestamp DESC";

  db.query(sql, function (err, rows) {
    if (err) {
      console.error("Error fetching audit log:", err);
      return res.status(500).send("Error fetching audit log.");
    }
    res.render("audit.ejs", { logs: rows });
  });
});

// Export the router
module.exports = router;