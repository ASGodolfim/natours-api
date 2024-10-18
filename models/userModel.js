const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead', 'admin'],
        default: 'user'
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
        },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: String,
    passwordResetExpire: Date
    }
);
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcryptjs.compare(candidatePassword, userPassword)
};
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    if (this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    return resetToken;

};

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;