const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

mongoose.connect('mongodb://localhost:27017/natours').then(con =>{
    console.log('DB Connected');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data Loaded');
    } catch (err){
        console.log(err);
    }
}

const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data Deleted');
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete'){
    deleteData();
}

console.log(process.argv);
