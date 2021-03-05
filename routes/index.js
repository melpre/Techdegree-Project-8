const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  const books = await Book.findAll();
  await res.json(books);
  console.log(books);
});

module.exports = router;
