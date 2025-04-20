require('dotenv').config();
console.log('Loaded environment variables');

const express = require('express');
console.log('Imported express');

const mongoose = require('mongoose');
console.log('Imported mongoose');

const path = require('path');
console.log('Imported path');

const Car = require('./models/carModel');
console.log('Imported Car model');

const Rental = require('./models/rentalModel');
console.log('Imported Rental model');

const app = express();
console.log('Initialized Express app');

const PORT = process.env.PORT || 3000;
console.log('PORT set to:', PORT);

app.use(express.json());
console.log('Added express.json middleware');

app.use(express.static(path.join(__dirname, '../public')));
console.log('Added static file middleware for public directory:', path.join(__dirname, '../public'));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Seed initial cars if the collection is empty
    const carCount = await Car.countDocuments();
    console.log('Car count:', carCount);
    if (carCount === 0) {
      const initialCars = [
        { id: 1, name: 'Toyota Camry', available: true },
        { id: 2, name: 'Honda Civic', available: true }
      ];
      await Car.insertMany(initialCars);
      console.log('Initial cars seeded into database');
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });

// API Routes
console.log('Defining API routes');

app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars' });
  }
});

app.get('/api/cars/rentals', async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals' });
  }
});

app.post('/api/cars/rent', async (req, res) => {
  const { carId, user } = req.body;

  if (typeof carId !== 'number' || carId <= 0) {
    return res.status(400).json({ message: 'Invalid Car ID' });
  }
  if (typeof user !== 'string' || user.trim() === '') {
    return res.status(400).json({ message: 'Invalid user name' });
  }

  try {
    const car = await Car.findOne({ id: carId });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (!car.available) {
      return res.status(400).json({ message: 'Car is not available' });
    }

    car.available = false;
    await car.save();

    const rental = new Rental({ carId, user });
    await rental.save();

    res.status(200).json({ message: 'Car rented successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error renting car' });
  }
});

app.post('/api/cars/return', async (req, res) => {
  const { carId } = req.body;

  if (typeof carId !== 'number' || carId <= 0) {
    return res.status(400).json({ message: 'Invalid Car ID' });
  }

  try {
    const car = await Car.findOne({ id: carId });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (car.available) {
      return res.status(400).json({ message: 'Car is not rented' });
    }

    const rental = await Rental.findOne({ carId, returned: false });
    if (!rental) {
      return res.status(400).json({ message: 'No active rental found for this car' });
    }

    rental.returned = true;
    rental.returnTime = new Date();
    await rental.save();

    car.available = true;
    await car.save();

    res.status(200).json({ message: 'Car returned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error returning car' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log('Server listening on port', PORT);