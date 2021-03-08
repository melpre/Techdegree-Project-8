/* Required Dependencies */
  const createError = require('http-errors');
  const express = require('express');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');


/* Routes */
  const indexRouter = require('./routes/index');
  const usersRouter = require('./routes/books');


// Import Sequelize instance (access to all Sequelize methods and functionality)
const { sequelize } = require('./models');
  

// Initialize app
const app = express();

/* Middleware */
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // connect to database with logged message
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

  app.use('/', indexRouter);
  // app.use('/users', usersRouter);


  /* Error Handlers */
    // 404 error handler
    app.use( (req, res, next) => {
      next(createError(404));
      // const err = new Error();
      // err.status = 404;
      // console.log(err);
      // next(err);
      // res.render('page-not-found', { err }) // pass {error} as 2nd parameter
    });

    // Global error handler
    app.use(function(err, req, res, next) {
    // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

  // Global error handler
  // app.use((err, req, res, next) => {
  //     if (err.status === 404) {
  //         console.log('404 error handler called', err);
  //         res.locals.error = err;
  //         err.message = "Sorry! We couldn't find the page you were looking for.";
  //         res.status(err.status).render('page-not-found', { err } );
  //     } else {
  //         res.locals.error = err;
  //         err.status = 500;
  //         err.message = "Sorry! There was an unexpected error on the server.";
  //         console.log('Global error handler called', err);
  //         res.status(err.status).render('error', { err } );
  //     };
  // }); 

  module.exports = app;
