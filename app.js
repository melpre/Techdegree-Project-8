// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/book');

// import Sequelize instance (access to all Sequelize methods and functionality)
const { sequelize } = require('./models');

const app = express();

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
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  const error = new Error();
  error.status = 404;
  error.message = 'Sorry! We couldn"t find the page you were looking for.'
  res.render('page-not-found', { error, message: error.message }) // pass {error} as 2nd parameter
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
