var express = require('express');
var router = express.Router();
var Poll = require('../models/poll');
var mid = require('../middleware');

// GET /poll
// To load the page to create a poll
router.get('/', mid.requiresLogin, function(req, res, next) {
  return res.render('newpoll', { title: 'New poll' });
})

// POST /poll
// To create a new poll
router.post('/', mid.requiresLogin, function(req, res, next) {
    req.body.labels = req.body.labels.replace(/\r/g, '').split("\n");
    if ((req.body.labels.length < 2) || !req.body.title) {
      var err = new Error('You need to fill the title and at least 2 options');
      err.status = 400;
      return next(err);
    }
    var pollData = {
      author: req.session.username,
      title: req.body.title,
      labels: req.body.labels,
      votes: req.body.labels.map(function(label){
          return 0
        })
    };
    // using schema's create method to insert document into mongo
    Poll.create(pollData, function (error, poll) {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/profile')
      }
    });
})

// GET /poll/:id
// To load a poll
router.get('/:id', function(req, res, next) {
    Poll.findOne({ _id: req.params.id})
        .exec(function(error, poll){
          if (error) {
              var err = new Error('Poll not found');
              err.status = 404;
              return next(err);
          } else if (!poll) {
              var err = new Error('Poll not found');
              err.status = 404;
              return next(err);
          }
          return res.render('poll', { title: poll.title, labels: [poll.labels], votes: poll.votes, id: poll._id, author: poll.author});
        })
})

// POST /poll/:id/vote
// To vote
router.post('/:id/vote', function(req, res, next) {
  Poll.findOne({ _id: req.params.id})
        .exec(function(error, poll){
          if (error || !poll) {
              var err = new Error('Poll not found');
              err.status = 404;
              return next(err);
          } else {
            poll.votes[req.body.optionsRadios]++;
            poll.markModified('votes');
            poll.save(function(err, updatedPoll) {
              if (err) {
                var err = new Error("Couldn't save the vote");
                err.status = 404;
                next(err)
              }
            res.redirect('/poll/'+req.params.id)
            })
          }
        })
})

// GET /poll/:id/edit
// To load edit page of a poll
router.get('/:id/edit', mid.requiresLogin, function(req, res, next) {
  return res.render('editpoll', { title: 'Poll id ' + req.params.id, id: req.params.id});
})

// POST /poll/:id/edit
// To edit a poll (add a new option)
router.post('/:id/edit', mid.requiresLogin, function(req, res, next) {
  Poll.findOne({ _id: req.params.id})
        .exec(function(error, poll){
          if (error || !poll) {
              var err = new Error('Poll not found');
              err.status = 404;
              return next(err);
          } else {
            poll.labels.push(req.body.newopt);
            poll.markModified('labels');
            poll.votes.push(0);
            poll.markModified('votes');
            poll.save(function(err, updatedPoll) {
              if (err) {
                var err = new Error("Couldn't save the change");
                err.status = 404;
                next(err)
              }
            res.redirect('/poll/'+req.params.id)
            })
          }
        })
})

// POST /poll/:id/delete
// To delete
router.get('/:id/delete', mid.requiresLogin, function(req, res, next) {
      Poll.findOne({ _id: req.params.id})
        .exec(function(error, poll){
            if (error || !poll) {
                var err = new Error('Poll not found');
                err.status = 404;
                return next(err);
            } else if (req.session.username === poll.author) {
              poll.remove();
              return res.redirect('/profile');            
            } else {
                var err = new Error('You can only delete your polls');
                err.status = 403;
                return next(err);
            }
        })

})


module.exports = router;
