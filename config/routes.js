const axios = require('axios');
const bcrypt = require("bcryptjs");
const { authenticate } = require('../auth/authenticate');
const db = require("../database/dbConfig.js");

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 16);
  credentials.password = hash;
  db("users")
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      db("users")
        .where({ id })
        .then(user => {
          const token = generateToken(user);
          res.status(201).json({ username: user[0].username, token });
        })
        .catch(err =>
          res.status(500).json({ message: "First Warning", err })
        );
    })
    .catch(err => {
      res.status(500).json({ message: "Second Warning", err });
    });
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Dad Jokes', error: err });
    });
}
