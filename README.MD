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