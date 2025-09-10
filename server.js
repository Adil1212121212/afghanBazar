const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

const db = new sqlite3.Database('database.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to database.');
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL, seller_id INTEGER, location_id INTEGER, category TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, name TEXT, city TEXT)");
  db.run("INSERT OR IGNORE INTO locations (name, city) VALUES ('Hub 1', 'Jalalabad'), ('Hub 2', 'Kabul'), ('Hub 3', 'Kandahar'), ('Hub 4', 'Herat'), ('Hub 5', 'Balkh')");
});

app.get('/locations', (req, res) => {
  db.all("SELECT * FROM locations", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/products', (req, res) => {
  db.all("SELECT p.*, u.username as seller, l.name as location_name, l.city as location_city FROM products p JOIN users u ON p.seller_id = u.id JOIN locations l ON p.location_id = l.id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Fallback to serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => console.log(`Server running on port ${port}`));