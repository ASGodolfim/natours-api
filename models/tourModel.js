const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
const { promises } = require('nodemailer/lib/xoauth2');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour need a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'maximum name size is 40 characters'],
        minlength: [5, 'minimum name size is 5 characters'] 
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour need a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour need a max group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour need a dificulty level'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5    
    },
    ratingQuantity: {
        type: Number,
        default: 0 
    },
    price: {
        type: Number,
        required: [true, 'A tour need a price']
    },
    priceDicount: {
        type: Number,
        validate: function(value) {
            return value < this.price;
        },
        message: 'Discount must be below regular price'
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A tour need a description'],
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

/*
tourSchema.pre('save', async function(next) {
    const guidesPromisses = this.guides.map(async id => User.findById(id));
    this.guides = await Promise.all(guidesPromisses);
    next();
});
*/

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next(); 
});

tourSchema.pre(/^find/, function(next) {
    this.populate(
        {
            path: 'guides',
            select: '-__v -passwordChangedAt'
        }
    );
    next();
})

tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true }});
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: {secretTour: { $ne:true }}});
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;