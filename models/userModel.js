const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    sessionId : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'session'
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('user', userSchema);
