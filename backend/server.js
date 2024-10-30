const express = require('express');
const { Pool } = require('pg');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.BACKEND_PORT || 3000;

console.log(process.env);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
    pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL)
    `, (err, res) => {
      if (err) {
        console.error('Error creating table', err.stack);
      } else {
        console.log('Table "users" is ready');
      }
    });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => { 
  pool.query('SELECT * FROM users', (err, data) => {
    if (err) {
      console.error('Error executing query', err.stack);
    }
    res.json(data.rows);
  });
});  

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  console.log(req.body);
  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (err, data) => {
    if (err) {
      console.error('Error executing query', err.stack);
    }
    res.json(data);
  });
});

app.delete('/users/:id', (req, res) => { 
  const id = req.params.id;
  pool.query('DELETE FROM users WHERE id = $1', [id], (err, data) => {
    if (err) {
      console.error('Error executing query', err.stack);
    }
    res.json(data);
  });
});

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id], (err, data) => {
    if (err) {
      console.error('Error executing query', err.stack);
    }
    res.json(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running`);
});
