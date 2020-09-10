const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
uniqid: String,
data: mongoose.Schema.Types.Mixed,
date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Entry', entrySchema);