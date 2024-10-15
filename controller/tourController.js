const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
try{
    const queryObj = {...req.query};
    let queryStr = JSON.stringfy(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //filter
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //field limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit *1 || 100;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit)
    
    if(req.query.page){
        const numTour = await Tour.countDocuments();
        if(skip >= numTour) return throw new Error("This Page doesn't exist");
        
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

class APIFeature{
    constructor()
}

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields  = 'name,price,ratingsAverage,summary,dificulty';
  next();
};