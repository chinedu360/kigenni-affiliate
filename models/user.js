const mongoose = require('mongoose')

const Schema = mongoose.Schema; 

const userSchema = new Schema({
    name: {
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
/*     userId: {
        type: Schema.Types.$oid,
        required: true,
        ref: 'User'
    }, */
    resetToken: String,
    resetTokenExpiration: Date,
}) 

module.exports = mongoose.model('User', userSchema);