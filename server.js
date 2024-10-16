const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');



mongoose.connect(process.env.DATABASE_LOCAL).then(con =>{
    console.log('DB Connected');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1);
    });
});