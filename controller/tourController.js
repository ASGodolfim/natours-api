const Tour = require('./../models/tourModel');
const APIFeature = require('./../utils/apiFeatures');

exports.getAllTours = async (req, res) => {
try{
    const features = new APIFeature(Tour.find(), req.query).filter().sort().limitFields().pagination();
    const tours = await features.query;

    res.status(200).json({
        status: 'succsess',
        results: tours.length,
    data: {
        tours
        }
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Not Found'
        })
    }
};
exports.getTourById = async (req, res) => {
try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: 'succsess',
        data: {
          tour
        }
    });
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: 'Not Found'
        })
    }
};
exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'succsess',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid Body'
        })    }
};
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
        status: 'success',
        data: {
            tour
        }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Not Found'
        })
    }
};
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
        status: 'success',
        data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Not Found'
        });
    };
};

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields  = 'name,price,ratingsAverage,summary,dificulty';
  next();
};
exports.getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                _id: { $toUpper: 'difficulty'},
                numTours: { $sum: 1},
                numRating: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data:{
                stats
            }
        });


    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Not Found'
        });
    }
};