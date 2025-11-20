# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)
VALUES
  ('Brighton Rock', 20.25),
  ('Brave New World', 25.00),
  ('Animal Farm', 12.99);

-- Default login user for marking
INSERT INTO users (username, first, last, email, hashedPassword)
VALUES ('gold', 'Gold', 'User', 'gold@example.com', '$2b$10$avfgy9Oo1ACXX/B3xDTxu.SHMMQm7rq0LZkZ5BG4C4JDzegP4J.iS');