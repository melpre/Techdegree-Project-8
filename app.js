/* Required Dependencies */
  const createError = require('http-errors');
  const express = require('express');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');


/* Routes */
  const indexRoute = require('./routes/index');
  const booksRoutes = require('./routes/books');
  

/* Import Sequelize Instance*/ 
// (access to all Sequelize methods and functionality)
const { sequelize } = require('./models');


/* Connect to Database */
// with logged message
async function connectDB(sequelize) {
  try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('Connection has been established successfully');
  } catch (error) {
      console.error('Unable to connect to the database');
  };
};

connectDB(sequelize);
  

/* Initialize app */
const app = express();


/* Middleware */
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public'))); // serves static files

  // import routes
  app.use('/', indexRoute);
  app.use('/books', booksRoutes);

  // error handlers
  // 404 handler to catch undefined or non-existent route requests
  app.use((req, res, next) => {
    const err = new Error();
    err.status = 404;
    next(err);
  });

  // global error handler (middleware that catches errors in defined routes)
  app.use((err, req, res, next) => {
    if (err.status === 404) {
      console.log('404 error handler called', err);
      res.locals.error = err;
      err.message = "Sorry! We couldn't find the page you were looking for.";
      res.status(err.status).render('page-not-found', { err });
    } else {
      console.log('Global error handler called', err);
      res.locals.error = err;
      err.status = 500;
      err.message = "Sorry! There was an unexpected error on the server.";
      res.status(err.status).render('server-error', { err });
    };
  });
  
module.exports = app;
