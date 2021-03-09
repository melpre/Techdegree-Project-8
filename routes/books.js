const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* GET books listing. */
router.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: "Books" });
});

/* Create new book form */
router.get('/books/new', (req, res) => {
  res.render('new-book', { title: "New Book" });
});

/* POST new book */
router.post('/books/new', async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") { //error check
      book = await Book.build(req.body);
      res.render('/books/new', { book, errors: error.errors, title: 'New Book' });
    } 
    // } else {
    //   res.status(500).send(error); //not sure this is right
    // }
  }
});

/* GET individual book */
router.get('/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('book-detail', { book, title: book.title });
  } else {
    res.sendStatus(404);
  }
});

/* Edit individual book */
router.post('/books/:id', async (req, res) => {
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
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; //makes sure correct book gets updated
      res.render('/books/' + book.id, { book, errors: error.errors, title: 'Edit Book' });
    } else {
      res.status(500).send(error); //not sure this is right
    }
  }
});

/* Delete book */
router.get('/books/:id/delete', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404); // not sure this is right
  }
});

module.exports = router;
