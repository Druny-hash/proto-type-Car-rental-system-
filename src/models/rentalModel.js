const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  carId: { type: Number, required: true },
  user: { type: String, required: true },
  rentTime: { type: Date, default: Date.now },
  returned: { type: Boolean, default: false },
  returnTime: { type: Date, default: null }
});

module.exports = mongoose.model('Rental', rentalSchema);