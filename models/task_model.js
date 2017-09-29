var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name: String,
    subject: String,
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);