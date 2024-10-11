const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'succsess',
    results: tours.lenght,
    data: {
        tours
    }
  });
});

app.get(`/api/v1/tours/:id`, (req, res) => {
    console.log(req.params)

    const id = req.params.id * 1;

    const tour = tours.find(el => el.id === req.params)

    if (!tour)
        res.status(404).json({
            status: "Fail",
            message: "Id not Found"
        })
    res.status(200).json(
    {
      status: 'succsess',
      data: { 
      tour
      }
    });
});

app.post('/api/v1/tours', function (req, res) {
   
   const newId = tours[tours.lenght -1].id +1;
   const newTour = Object.assign({id : newId}, req.body); 

   tours.push(newTour);
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
    res.status(201).json({
        status: 'succsess',
        data: {
            tour: newTour
        }
    })
   });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});