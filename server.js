const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

mongoose.connect(process.env.DATABASE_LOCAL).then(con =>{
    console.log('DB Connected');
});

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour need a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5    
    },
    price: {
        type: Number,
        required: [true, 'A tour need a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});