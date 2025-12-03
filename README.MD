# Bertie’s Books

This repository contains my solution for Berties Books

The lab combines:

- MySQL 
- Node.js + Express 
- EJS templates 
- Session-based authentication and simple security features

## 1. What the app does

Bertie’s Books is a small bookshop web app that allows users to:

- View all books stored in a MySQL database
- Add new books
- View bargain books (books below a certain price)
- Search for books by title
- Register and log in
- View a login audit of user logins  which is a protected route
- Log out 

The app uses the route groups:

- `/` - main menu and about page
- `/books/...` - all book-related features
- `/users/...` - authentication and audit

## 2. Tech stack and dependencies

Main technologies:

- **Node.js / Express**
- **EJS**
- **MySQL** with **mysql2** connection pool
- **express-session** for sessions
- **express-sanitizer** for simple input sanitisation
- **dotenv** for loading database credentials from `.env`

Install dependencies:

```bash
npm install
```

``` bash 
env
BB_USER=berties_books_app
BB_PASSWORD=your_db_password_here
BB_DATABASE=berties_books
OWM_API_KEY=your_openweathermap_8966c9d292dcf7908a7466e89d9b4ac7
```


## 3. Database 
CREATE DATABASE berties_books;
USE berties_books;
SOURCE create_db.sql;
SOURCE insert_test_data.sql;

## 4. Api additions
-  GET /weather- simple form asking for a city 
- POST /weather - uses request to call the OpenWeatherMap “current weather” API with OWM_API_KEY from .env
-GET /api/books - returns all the books as JSON.
Public no login required

Query parameters:
- search - filter by title substring
/api/books?search=world
- minprice, max_price - price range
/api/books?minprice=5&max_price=10
- sort – name or price
/api/books?sort=name

This displays temperature , what it feels like, city name, wind speed and humidity values
It also includes error handling 

## Links
home=https://www.doc.gold.ac.uk/usr/247/
Github repo=https://github.com/vladro01/06_berties_33830924.git

