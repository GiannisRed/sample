var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
    twitter_id: String,
    active: Boolean,
    author: String,
    avatar: String,
    body: String,
    date: Date,
    screenname: String,
    hashtags: [{ type: String }],
});

tweetSchema.statics.getTweets = function(page, skip, callback) {
    var tweets = [];
    var start = (page * 10) + (skip * 1);

    Tweet
        .find({}, 'twitter_id active author avatar body date screenname hashtags', {skip: start, limit: 10})
        .sort({date: 'desc'})
        .exec(function(err, data) {
            console.log(data);
            if(!err) {
                tweets = data;
                tweets.forEach(function(tweet) {
                    tweet.active = true;
                });
            }

            Tweet
                .count({}, function(err, count) {
                    if(!err) {
                        var pages = count / 10;
                        callback(tweets, count, Math.ceil(pages));
                    }
                })
            // callback(tweets);
        });
}

module.exports = Tweet =  mongoose.model('Tweet', tweetSchema);