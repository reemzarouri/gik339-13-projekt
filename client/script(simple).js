// Base URL for the API
const apiUrl = "http://localhost:3000/cars";

// Fetch and display all cars
async function fetchCars() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch cars");

    const cars = await response.json();
    renderCarList(cars);
  } catch (error) {
    console.error("Error fetching cars:", error.message);
    alert("Error fetching cars: " + error.message);
  }
}

// Render the list of cars
function renderCarList(cars) {
  const carList = document.getElementById("car-list");
  carList.innerHTML = "";

  cars.forEach((car) => {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";
    listItem.style.backgroundColor = car.color;

    listItem.innerHTML = `
      <span>
        <strong>${car.brand} ${car.model}</strong> - ${car.year}
      </span>
      <div>
        <button class="btn btn-warning btn-sm me-2" onclick="editCar(${car.id}, '${car.brand}', '${car.model}', ${car.year}, '${car.color}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">Delete</button>
      </div>
    `;

    carList.appendChild(listItem);
  });
}

// Save (add or update) a car
async function saveCar(event) {
  event.preventDefault();

  const id = document.getElementById("car-id").value;
  const brand = document.getElementById("brand").value;
  const model = document.getElementById("model").value;
  const year = document.getElementById("year").value;
  const color = document.getElementById("color").value;

  const car = { brand, model, year, color };

  try {
    const response = await fetch(`${apiUrl}${id ? `/${id}` : ""}`, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });

    if (!response.ok) throw new Error("Failed to save car");
    console.log(id ? "Car updated successfully" : "Car added successfully");
    alert(id ? "Car updated successfully" : "Car added successfully");

    // Reset the form after successful save
    document.getElementById("car-form").reset();
    document.getElementById("car-id").value = "";
  } catch (error) {
    console.error("Error saving car:", error.message);
    alert("Error saving car: " + error.message);
  }
}

// Delete a car
async function deleteCar(id) {
  const confirmDelete = confirm("Are you sure you want to delete this car?");
  if (confirmDelete) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete car");

      console.log("Car deleted successfully");
      alert("Car deleted successfully");
    } catch (error) {
      console.error("Error deleting car:", error.message);
      alert("Error deleting car: " + error.message);
    }
  } else {
    console.log("Car deletion cancelled");
    alert("Car deletion cancelled");
  }
}

// Populate the form for editing a car
function editCar(id, brand, model, year, color) {
  document.getElementById("car-id").value = id;
  document.getElementById("brand").value = brand;
  document.getElementById("model").value = model;
  document.getElementById("year").value = year;
  document.getElementById("color").value = color;
}

// Attach event listeners
document.getElementById("car-form").addEventListener("submit", saveCar);

// Fetch cars on page load
fetchCars();
