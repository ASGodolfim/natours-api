const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username needed'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password needed'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'password needed'],
        select: false,
        validate: {
            validator: function(el) {
                return el === this.password;
            }
        }
    },
    name: {
        type: String,
        required: [true, 'name needed'],
    },
    photo: String,
    email: {
        type: String,
        required: [true, 'email needed'],
        unique: true,
        validate: [validator.isEmail, 'please provide a valid']    
    },
    age: {
        type: Number,
        required: [true, 'must be over 18'],
        validate: {
            validator: function(el) {
                return el >= 18;
            }
        }
        }
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;