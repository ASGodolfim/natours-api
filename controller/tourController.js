const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
    res.status(200).json({
      status: 'succsess'
    });
};
exports.getTourById = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1;
};
exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'succsess'
    })
};
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success'
    });
};
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json(
            {
                status: 'fail',
                message: 'missing name or price'
            }
        );
    }
    next();
};
