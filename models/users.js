const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String, //{type: String, required: true},
    email: String,//{type: String, required: true, unique: true},
    password: String//{type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);