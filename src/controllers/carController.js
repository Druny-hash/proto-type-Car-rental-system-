const carModel = require('../models/carModel');

exports.getAllCars = (req, res) => {
  try {
    const cars = carModel.getCars();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
};

exports.rentCar = (req, res) => {
  const { carId, user } = req.body;

  // Validate inputs
  if (!carId || isNaN(carId) || carId <= 0) {
    return res.status(400).json({ message: 'Invalid Car ID' });
  }
  if (!user || typeof user !== 'string' || user.trim() === '') {
    return res.status(400).json({ message: 'Invalid user name' });
  }

  const success = carModel.rentCar(parseInt(carId), user.trim());
  if (success) {
    res.status(200).json({ message: 'Car rented successfully' });
  } else {
    res.status(400).json({ message: 'Car not available or invalid ID' });
  }
};

exports.returnCar = (req, res) => {
  const { carId } = req.body;

  // Validate input
  if (!carId || isNaN(carId) || carId <= 0) {
    return res.status(400).json({ message: 'Invalid Car ID' });
  }

  const success = carModel.returnCar(parseInt(carId));
  if (success) {
    res.status(200).json({ message: 'Car returned successfully' });
  } else {
    res.status(400).json({ message: 'Car not rented or invalid ID' });
  }
};

exports.getRentals = (req, res) => {
  try {
    const rentals = carModel.getRentals();
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals' });
  }
};