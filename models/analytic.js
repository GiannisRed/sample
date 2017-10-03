var mongoose = require('mongoose');

var analyticSchema = mongoose.Schema({
    hashtags: [
        {   
            hashtag: { type: String, required: true }, 
            count: { type: Number, required: true } 
        }
    ]
},
    { timestamps: true }
);

module.exports = mongoose.model('Analytic', analyticSchema);