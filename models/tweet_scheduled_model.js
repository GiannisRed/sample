var mongoose = require('mongoose');

var tweetScheduledSchema = mongoose.Schema({
    text: { type: String, required: true },
    datetime: { type: Date, required: true },
    completed: { type: Boolean, default: false } 
});

module.exports = mongoose.model('TweetScheduled', tweetScheduledSchema);