const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
try{
    const queryObj = {...req.query};
    let queryStr = JSON.stringfy(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }

    const tours = await query;

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
        })
    }
};

