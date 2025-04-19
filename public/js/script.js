async function fetchCars() {
    const response = await fetch('/api/cars');
    const cars = await response.json();
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';
    cars.forEach(car => {
      const li = document.createElement('li');
      li.textContent = `ID: ${car.id}, Name: ${car.name}, Available: ${car.available}`;
      carList.appendChild(li);
    });
  }
  
  async function fetchRentals() {
    const response = await fetch('/api/cars/rentals');
    const rentals = await response.json();
    const rentalList = document.getElementById('rental-list');
    rentalList.innerHTML = '';
    rentals.forEach(rental => {
      const li = document.createElement('li');
      li.textContent = `Car ID: ${rental.carId}, User: ${rental.user}, Time: ${new Date(rental.rentTime).toLocaleString()}`;
      rentalList.appendChild(li);
    });
  }
  
  async function rentCar() {
    const carId = document.getElementById('car-id').value;
    const user = document.getElementById('user-name').value;
    const response = await fetch('/api/cars/rent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId, user })
    });
    const result = await response.json();
    alert(result.message);
    fetchCars();
    fetchRentals();
  }
  
  async function returnCar() {
    const carId = document.getElementById('return-car-id').value;
    const response = await fetch('/api/cars/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId })
    });
    const result = await response.json();
    alert(result.message);
    fetchCars();
    fetchRentals();
  }
  
  // Load data on page load
  fetchCars();
  fetchRentals();