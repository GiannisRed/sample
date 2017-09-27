var mongoose = require('mongoose');

var trackBySchema = mongoose.Schema({
    keyword: { type: String, unique: true, required: true }
});

module.exports = mongoose.model('TrackBy', trackBySchema);