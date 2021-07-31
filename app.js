const cors = require('cors');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
require('dotenv').config()
process.env.TZ = 'Europe/Athens';

const app = express();
app.use(cors());
app.use(cookieParser());

//ROUTERS
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const questionsRouter = require('./routes/questions');
const answersRouter = require('./routes/answers');

//DATABASE
const db = require('./models/database');
db.sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Setting routes
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/question', questionsRouter);
app.use('/answer', answersRouter);

//setting custom PORT for heroku deployment
app.set('port', process.env.PORT || 3000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
