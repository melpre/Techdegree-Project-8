const express = require('express');
const { Sequelize } = require('../models');
const router = express.Router();

// router.get('/', async function(req, res, next) {
//   const books = await Book.findAll();
//   await res.json(books);
//   console.log(books);
// });

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books')
});

module.exports = router;
