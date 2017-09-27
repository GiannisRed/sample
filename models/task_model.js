var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name: String,
    subject: String,
    completed: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Task', taskSchema);