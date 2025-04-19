const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getAllCars);
router.post('/rent', carController.rentCar);
router.post('/return', carController.returnCar);
router.get('/rentals', carController.getRentals);

module.exports = router;