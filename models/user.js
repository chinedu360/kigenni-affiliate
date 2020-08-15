const mongoose = require('mongoose')

const Schema = mongoose.Schema; 

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String
    },
/*     userId: {
        type: Schema.Types.$oid,
        required: true,
        ref: 'User'
    }, */
    resetToken: String,
    resetTokenExpiration: Date,
}) 

module.exports = mongoose.model('User', userSchema);