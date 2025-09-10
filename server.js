const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/pashto.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pashto.html'));
});

const db = new sqlite3.Database('database.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Connected to database.');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));