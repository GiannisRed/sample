var mongoose = require('mongoose');

var hashtagSchema = mongoose.Schema({
    text: { type: String, required: true, unique: true },
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
},
    { timestamps: true }
);

module.exports = mongoose.model('Hashtag', hashtagSchema);