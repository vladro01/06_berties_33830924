// routes/users.js

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const db = global.db;
const saltRounds = 10;

// GET /users/register: show registration form
router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

// POST /users/registered: hash password + save user
router.post("/registered", function (req, res, next) {
  const { username, first, last, email, password } = req.body;

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
});

// GET /users/list: list users (no passwords)
router.get("/list", function (req, res, next) {
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
        res.send("Login successful! Welcome, " + username);
      } else {
        logLoginAttempt(username, false);
        res.send("Login failed: incorrect username or password.");
      }
    });
  });
});

// GET /users/audit: show login audit history
router.get("/audit", function (req, res, next) {
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