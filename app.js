// Install required packages: npm install express sqlite3 body-parser

const express = require("express");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// Connect to SQLite database
const db = new sqlite3.Database("./foodWebsite.db");

// Create User table if not exists
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, phone TEXT, password TEXT)",
  (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    }
  }
);

app.use(bodyParser.json());

// Signup endpoint
app.post("/api/signup", (req, res) => {
  const { username, phone, password } = req.body;

  // Insert user into the database
  db.run(
    "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)",
    [username, phone, password],
    (err) => {
      if (err) {
        console.error("Error creating user:", err.message);
        res
          .status(500)
          .json({ message: "Error creating user", error: err.message });
      } else {
        res.status(201).json({ message: "User created successfully" });
      }
    }
  );
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists with the provided credentials
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, user) => {
      if (err) {
        console.error("Error checking user credentials:", err.message);
        res
          .status(500)
          .json({
            message: "Error checking user credentials",
            error: err.message,
          });
      } else if (user) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
