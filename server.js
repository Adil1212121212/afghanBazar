const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key-here',
  resave: false,
  saveUninitialized: false
}));

const db = new sqlite3.Database('database.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to database.');
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, role TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL, seller_id INTEGER, location_id INTEGER, category TEXT, stock INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, name TEXT, city TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS carts (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, quantity INTEGER)");
  db.run("INSERT OR IGNORE INTO locations (name, city) VALUES ('Hub 1', 'Jalalabad'), ('Hub 2', 'Kabul'), ('Hub 3', 'Kandahar'), ('Hub 4', 'Herat'), ('Hub 5', 'Balkh')");
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/pashto.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pashto.html')));
app.get('/dashboard', (req, res) => {
  if (req.session.user && req.session.user.role === 'seller') {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/');
  }
});
app.get('/categories', (req, res) => res.sendFile(path.join(__dirname, 'public', 'categories.html')));
app.get('/cart', (req, res) => {
  if (req.session.user) res.sendFile(path.join(__dirname, 'public', 'cart.html'));
  else res.redirect('/');
});
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error registering');
    db.run("INSERT INTO users (username, password, role) VALUES (?, ?, 'buyer')", [username, hash], (err) => {
      if (err) return res.status(400).send('Username taken');
      res.redirect('/');
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.status(400).send('Invalid credentials');
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.status(400).send('Invalid credentials');
      req.session.user = { id: user.id, username: user.username, role: user.role };
      res.redirect('/dashboard');
    });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

app.get('/products', (req, res) => {
  db.all("SELECT p.*, u.username as seller, l.city FROM products p JOIN users u ON p.seller_id = u.id JOIN locations l ON p.location_id = l.id", [], (req, rows) => {
    res.json(rows);
  });
});

app.post('/add-product', (req, res) => {
  if (req.session.user && req.session.user.role === 'seller') {
    const { name, price, location_id, category, stock } = req.body;
    db.run("INSERT INTO products (name, price, seller_id, location_id, category, stock) VALUES (?, ?, ?, ?, ?, ?)", [name, price, req.session.user.id, location_id, category, stock], (err) => {
      if (err) return res.status(500).send('Error adding product');
      res.redirect('/dashboard');
    });
  } else {
    res.status(403).send('Unauthorized');
  }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, () => console.log(`Server running on port ${port}`));