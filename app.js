var express = require('express');
var app = express();
var mongoose = require('mongoose');// mongodb package
var expressValidator = require('express-validator'); // express validation package
var bodyParser = require('body-parser'); // express package for req.body in user.js controller
var path = require('path'); // path package
var cookieParser = require('cookie-parser');//Third-party middleware

mongoose.connect("localhost:27017/nodeapi");// connect to database
var user = require('./models/user'); // including and calling model
var info = require('./models/info'); // including and calling model
var userController = require('./controllers/user');// including and calling controller
var birds = require('./middleware/birds'); // including and calling middleware function file named as birds.js

app.use(bodyParser.json());// using req.body in user.js controller 
app.use(bodyParser.urlencoded({ extended: true }));// using req.body in user.js controller
app.use(expressValidator()); // using express validator
app.use(cookieParser());//load the cookie-parsing middleware
app.use('/birds', birds);// url /birds and /birds/about
app.set('view engine', 'pug'); //Using template engines with Express

// API's
app.get('/', function (req, res) {
  res.send('Hello Worlds!')
})
// middleware logger
var myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger);
app.get('/', function (req, res) {
  res.send('Hello World!')
})
//middleware function requestime
var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', function (req, res) {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
})
// application level middleware
// app.use('/user/:id', function (req, res, next) {
//   console.log('Request URL:', req.originalUrl)
//   next()
// }, function (req, res, next) {
//   console.log('Request Type:', req.method)
//   next()
// })
// app.get('/user/:id', function (req, res, next) {
//   console.log('ID:', req.params.id)
//   next()
// }, function (req, res, next) {
//   res.send('User Info')
// })

// handler for the /user/:id path, which prints the user ID
// app.get('/user/:id', function (req, res, next) {
//   res.end(req.params.id)
// })

// app.route()..  single route for get,post,put
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
// callback function 
app.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function1 ...')
  next()
},function(req, res, next){
  console.log('the response will be sent by the next function2 ...')
  next()
}, function (req, res) {
  res.send('Hello from B!')
})
// array of callback array
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

var cb2 = function (req, res) {
  res.send('Hello from C!')
}
app.get('/example/c', [cb0, cb1, cb2])
// combination of independent function and array of function
var cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

var cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from D!')
})
//view engine
app.get('/engine', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
// Add Data API
app.post('/signup', userController.signUp);
// View Data API
app.get('/listofusers', userController.listofusers);
// View Data by Id API
app.get('/edituser/:userId', userController.listofusers);
// Delete Data by Id API
app.get('/deleteuser/:id', userController.listofusers);

// catch 404 error
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// (Access-Control-Allow-Origin)
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

// run server
// app.listen(3000, function () {
//   console.log('Node app listening on port 3000!')
// })
app.listen(3000);
module.exports = app;