const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Function that handles rejected promises returned from DB.
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
      // res.status(500).send(error);
    }
  }
};

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books' });
}));

/* Create new book form */
router.get('/new', (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
});

/* POST new book */
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') { //error check
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New Book' });
    } else {
      throw error;
    }
  }
}));

/* GET individual book */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book, title: book.title, author: book.author, genre: book.genre, year: book.year });
  } else {
    res.sendStatus(404);
  }
}));

/* Edit individual book */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books/' + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id; //makes sure correct book gets updated
      res.render('update-book', { book, errors: error.errors, title: book.title, author: book.author, genre: book.genre, year: book.year });
    } else {
      res.status(500).send(error); //not sure this is right
    }
  }
}));

/* Delete book */
// router.post('/:id/delete', asyncHandler(async (req, res) => {
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/');
  } else {
    res.sendStatus(404); // not sure this is right
  }
}));

module.exports = router;
