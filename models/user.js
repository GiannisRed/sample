var mongoose = require('mongoose');

var User = mongoose.model('User', new mongoose.Schema({
    instagramId: { type: String, index: true },
    twitter: { type: String, index: true },
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    username: String,
    fullName: String,
    picture: String,
    accessToken: String,
    role: { type: String, default: 'user' },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}));

module.exports = User;