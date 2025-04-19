const carModel = require('../models/carModel');

exports.getAllCars = (req, res) => {
  const cars = carModel.getCars();
  res.json(cars);
};

exports.rentCar = (req, res) => {
  const { carId, user } = req.body;
  const success = carModel.rentCar(parseInt(carId), user);
  if (success) {
    res.json({ message: 'Car rented successfully' });
  } else {
    res.status(400).json({ message: 'Car not available or invalid ID' });
  }
};

exports.returnCar = (req, res) => {
  const { carId } = req.body;
  const success = carModel.returnCar(parseInt(carId));
  if (success) {
    res.json({ message: 'Car returned successfully' });
  } else {
    res.status(400).json({ message: 'Car not rented or invalid ID' });
  }
};

exports.getRentals = (req, res) => {
  const rentals = carModel.getRentals();
  res.json(rentals);
};