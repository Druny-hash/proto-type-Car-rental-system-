let cars = [
    { id: 1, name: 'Toyota Camry', available: true },
    { id: 2, name: 'Honda Civic', available: true }
  ];
  
  let rentals = [];
  
  module.exports = {
    getCars: () => cars,
    getCarById: (id) => cars.find(car => car.id === id),
    rentCar: (carId, user) => {
      const car = cars.find(car => car.id === carId);
      if (car && car.available) {
        car.available = false;
        rentals.push({ carId, user, rentTime: new Date() });
        return true;
      }
      return false;
    },
    returnCar: (carId) => {
      const car = cars.find(car => car.id === carId);
      if (car && !car.available) {
        car.available = true;
        return true;
      }
      return false;
    },
    getRentals: () => rentals
  };