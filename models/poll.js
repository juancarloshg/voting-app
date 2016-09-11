var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    labels: {
        type: [String],
        required: true,
        trim: true
    },
    votes: {
        type: [Number],
        required: true,
        trim: true
    },
});

var Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;

