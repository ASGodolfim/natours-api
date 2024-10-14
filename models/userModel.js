const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username needed'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password needed'],
    },
    name: {
        type: String,
        required: [true, 'name needed'],
    },
    email: {
        type: String,
        required: [true, 'email needed'],
        unique: true    
    },
    age: {
        type: Number,
        required: [true, 'must be over 18']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;