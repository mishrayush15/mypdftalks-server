const mongoose = require('mongoose');


const sessionSchema = mongoose.Schema({
    pdfData : {
        type : String,
        required : true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    conversationHistory : [
        {
            question : String,
            answer : String,
            time : {
                type : Date,
                default : Date.now
            }
        }
    ],
    lastUpdated : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('session', sessionSchema);