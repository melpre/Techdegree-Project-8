const express = require('express');
// const { Sequelize } = require('../models');
const router = express.Router();
// const booksRoutes = require('./books');
const Book = require('../models').Book;

/* GET home page. */
// router.get('/', async function(req, res, next) {
//   const books = await Book.findAll();
//   await res.json(books);
//   console.log(books);
// });

router.get('/', (req, res, next) => {
  res.redirect('/books');
});

module.exports = router;
