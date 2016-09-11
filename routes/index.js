var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Poll = require('../models/poll');
var mid = require('../middleware');
// GET /
router.get('/', function(req, res, next) {
  Poll.find({}, function(err, polls) {
    return res.render('index', { title: 'Home', polls: polls.reverse()});
  });  
});

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  Poll.find({author: req.session.username}, function(err, polls) {
    return res.render('index', { title: 'My polls', polls: polls.reverse()});
  });
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.username &&
  req.body.password &&
  req.body.confirmpass) {
    //Confirm passwords match
    if (req.body.password !== req.body.confirmpass) {
      var err = new Error('Passwords do not match');
      err.status = 400;
      return next(err);
    }
    //Create object with form input
    var userData = {
      username: req.body.username,
      password: req.body.password
    };

    // using schema's create method to insert document into mongo
    User.create(userData, function (error, user) {
      if (error) {
        console.log('ha fallado')
        console.log(error)
        return next(error);
      } else {
        req.session.username = user.username;
        req.session.userId = user._id;
        return res.redirect('/profile')
      }
    });
  } else {
    var err = new Error('All fields required');
    err.status = 400;
    return next(err);
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log in' });
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.password) {
    User.authenticate(req.body.username, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong username or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        req.session.username = user.username;
        return res.redirect('/profile')
      }
    })
  } else {
    var err = new Error('Username and password are required');
    err.status = 401;
    return next(err);
  }
});

// GET /logout
router.get('/logout', mid.requiresLogin, function(req, res, next) {
  if (req.session) {
    //delete session object
    req.session.destroy(function(err){
      if (err) {
        return next(err);
      }
     else {
       res.redirect('/');
     }
    });
  }
});


module.exports = router;
