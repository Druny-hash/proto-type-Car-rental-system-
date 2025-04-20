document.addEventListener('DOMContentLoaded', () => {
  const carList = document.getElementById('carList');
  const rentalHistory = document.getElementById('rentalHistory');
  const rentButton = document.getElementById('rentButton');
  const returnButton = document.getElementById('returnButton');
  const rentMessage = document.getElementById('rentMessage');
  const returnMessage = document.getElementById('returnMessage');
  const loadingSpinner = document.getElementById('loadingSpinner');

  // Show the loading spinner
  const showSpinner = () => {
    loadingSpinner.style.display = 'block';
  };

  // Hide the loading spinner
  const hideSpinner = () => {
    loadingSpinner.style.display = 'none';
  };

  // Fetch and display available cars
  const fetchCars = async () => {
    showSpinner();
    try {
      const response = await fetch('/api/cars');
      const cars = await response.json();
      carList.innerHTML = cars.map(car => `
        <div class="car-item">
          ID: ${car.id}, Name: ${car.name}, Available: ${car.available ? 'Yes' : 'No'}
        </div>
      `).join('');
    } catch (error) {
      carList.innerHTML = 'Error loading cars';
      console.error('Error fetching cars:', error);
    } finally {
      hideSpinner();
    }
  };

  // Fetch and display rental history
  const fetchRentals = async () => {
    showSpinner();
    try {
      const response = await fetch('/api/cars/rentals');
      const rentals = await response.json();
      rentalHistory.innerHTML = rentals.map(rental => `
        <div class="car-item">
          Car ID: ${rental.carId}, User: ${rental.user}, 
          Rented: ${new Date(rental.rentTime).toLocaleString()},
          Returned: ${rental.returned ? 'Yes' : 'No'}${rental.returned ? `, Returned At: ${new Date(rental.returnTime).toLocaleString()}` : ''}
        </div>
      `).join('');
    } catch (error) {
      rentalHistory.innerHTML = 'Error loading rental history';
      console.error('Error fetching rentals:', error);
    } finally {
      hideSpinner();
    }
  };

  // Rent a car
  rentButton.addEventListener('click', async () => {
    const carId = parseInt(document.getElementById('carId').value);
    const user = document.getElementById('userName').value.trim();

    if (!carId || !user) {
      rentMessage.className = 'message error';
      rentMessage.textContent = 'Please enter a valid Car ID and Name';
      return;
    }

    rentButton.disabled = true;
    showSpinner();
    try {
      const response = await fetch('/api/cars/rent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, user })
      });

      const result = await response.json();
      rentMessage.className = `message ${response.ok ? 'success' : 'error'}`;
      rentMessage.textContent = result.message || 'Error renting car';
    } catch (error) {
      rentMessage.className = 'message error';
      rentMessage.textContent = 'Error renting car';
      console.error('Error renting car:', error);
    } finally {
      rentButton.disabled = false;
      hideSpinner();
      fetchCars(); // Refresh car list
      fetchRentals(); // Refresh rental history
    }
  });

  // Return a car
  returnButton.addEventListener('click', async () => {
    const carId = parseInt(document.getElementById('returnCarId').value);

    if (!carId) {
      returnMessage.className = 'message error';
      returnMessage.textContent = 'Please enter a valid Car ID';
      return;
    }

    returnButton.disabled = true;
    showSpinner();
    try {
      const response = await fetch('/api/cars/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId })
      });

      const result = await response.json();
      returnMessage.className = `message ${response.ok ? 'success' : 'error'}`;
      returnMessage.textContent = result.message || 'Error returning car';
    } catch (error) {
      returnMessage.className = 'message error';
      returnMessage.textContent = 'Error returning car';
      console.error('Error returning car:', error);
    } finally {
      returnButton.disabled = false;
      hideSpinner();
      fetchCars(); // Refresh car list
      fetchRentals(); // Refresh rental history
    }
  });

  // Initial load
  fetchCars();
  fetchRentals();
});