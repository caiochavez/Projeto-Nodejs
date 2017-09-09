const express      = require('express'),
      path         = require('path'),
      favicon      = require('serve-favicon'),
      logger       = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      load         = require('express-load'),
      flash        = require('express-flash'),
      moment       = require('moment'),
      session      = require('express-session');

const app = express();

//Conexão com o MongoDB
require('./connection.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({secret: 'woot'}));

//Helpers
app.use(function(req,res,next){
  res.locals.session  = req.session.usuario;
  res.locals.isLogged = req.session.usuario ? true : false;
  res.locals.moment   = moment;
  next();
});

load('models').then('controllers').then('routes').into(app);

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function(){
	console.log('Servidor rondando em localhost:3000');
});

module.exports = app;
