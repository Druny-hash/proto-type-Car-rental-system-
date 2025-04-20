const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  available: { type: Boolean, default: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;