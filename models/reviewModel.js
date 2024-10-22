const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        maxlength: [200, 'maximum review size is 200 characters'],
        required: [true, 'this can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'you need to rate the review']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'review must belong to a tour']
        }
    ],
    user: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'review must belong to a user']
        }
    ]
},
{
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.pre(/^find/, function(next) {
    this.populate(
        {
            path: 'tour',
            select: 'name'
        }
    ).populate(
        {
            path: 'user',
            select: 'name photo'
        }
    );
    next();
})

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.agregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1},
                avgRating: { $avg: rating },

            }
        }
    ])

    Tour.findByIdAndUpdate(tourId, {ratingQuantity: stats[0].nRatings, ratingAverage: stats[0].avgRating})
}

reviewSchema.post('save', function(next) {
    this.constructor.calcAverageRatings(this.tour)
    next();
});

const Review = mongoose.model('Review', userSchema);

module.exports = Review;