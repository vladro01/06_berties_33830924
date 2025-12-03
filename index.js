// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2');
require('dotenv').config();
var session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const request = require('request');

// Create the express application object
const app = express()
const port = 8000


// Define the database connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: process.env.BB_USER,
  password: process.env.BB_PASSWORD,
  database: process.env.BB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
  
global.db = db;
// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: { expires: 600000 }
}));

app.use(expressSanitizer());

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Define our application-specific data
app.locals.shopData = {shopName: "Bertie's Books"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

// Load the route handlers for /api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Show the weather form
app.get('/weather', function (req, res) {
  res.render('weather.ejs', { city: null, weatherMessage: null, error: null });
});

// Handle the form submission and call the API
app.post('/weather', function (req, res, next) {
  const apiKey = process.env.OWM_API_KEY;
  const city = req.body.city;

  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      return next(err);
    } else {
      try {
        const weather = JSON.parse(body);

        // If the city is invalid or we didn’t get the expected data
        if (!weather || !weather.main) {
          return res.render('weather.ejs', {
            city,
            weatherMessage: null,
            error: 'No data found for that city.',
          });
        }

        const wmsg =
          'It is ' + weather.main.temp + '°C in ' + weather.name +
          '. Feels like ' + weather.main.feels_like + '°C.' +
          '<br>Humidity: ' + weather.main.humidity + '%.' +
          '<br>Wind speed: ' + weather.wind.speed + ' m/s.';

        res.render('weather.ejs', {
          city,
          weatherMessage: wmsg,
          error: null,
        });
      } catch (e) {
        res.render('weather.ejs', {
          city,
          weatherMessage: null,
          error: 'There was a problem reading the weather data.',
        });
      }
    }
  });
});

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))