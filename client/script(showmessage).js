// Base URL for the API
const apiUrl = "http://localhost:3000/cars";

function showMessage(message, type = "success", buttons = []) {
  const messageBoxContent = document.getElementById("messageBoxContent");
  const messageBoxFooter = document.getElementById("messageBoxFooter");

  messageBoxContent.innerText = message;

  // Clear previous buttons
  messageBoxFooter.innerHTML = "";

  // Add buttons dynamically
  buttons.forEach((button) => {
    const btn = document.createElement("button");
    btn.className = `btn ${button.class || "btn-primary"}`;
    btn.innerText = button.label;
    btn.onclick = () => {
      if (button.onClick) button.onClick();
      const messageBox = bootstrap.Modal.getInstance(
        document.getElementById("messageBox")
      );
      if (messageBox) messageBox.hide();
    };
    messageBoxFooter.appendChild(btn);
  });

  /* Show the modal without animation
  const messageBox = new bootstrap.Modal(
    document.getElementById("messageBox"),
    {
      backdrop: true,
      keyboard: true,
      focus: true,
      animation: false,
    }
  );*/
  const messageBox = new bootstrap.Modal(document.getElementById("messageBox"));
  messageBox.show();
}

function showToast(message, type = "success") {
  const toastTitle = document.getElementById("toast-title");
  const toastBody = document.getElementById("toast-body");

  toastTitle.innerText = type === "success" ? "Success" : "Error";
  toastBody.innerText = message;

  const toastEl = document.getElementById("liveToast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// Fetch and display all cars
async function fetchCars() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch cars");

    const cars = await response.json();
    renderCarList(cars);
  } catch (error) {
    console.error("Error fetching cars:", error.message);
    showMessage("Error fetching cars: " + error.message, "error", [
      { label: "Ok", class: "btn-primary" },
    ]);
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

    const message = id ? "Car updated successfully" : "Car added successfully";
    showToast(message, "success");

    showMessage(message, "success", [
      {
        label: "Ok",
        class: "btn-primary",
        onClick: () => {
          //fetchCars();
        },
      },
    ]);

    alert(message);
    console.log(message);

    // Reset the form after successful save
    document.getElementById("car-form").reset();
    document.getElementById("car-id").value = "";
  } catch (error) {
    console.error("Error saving car:", error.message);
    showMessage("Error saving car: " + error.message, "error", [
      { label: "Ok", class: "btn-primary" },
    ]);
  }
}

//Delete car

async function deleteCar(id) {
  showMessage("Are you sure you want to delete this car?", "warning", [
    {
      label: "Yes",
      class: "btn-danger",
      onClick: async () => {
        try {
          const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          if (!response.ok) throw new Error("Failed to delete car");

          showMessage("Car deleted successfully!");
          console.log("Car deleted successfully!");
          alert("Car deleted successfully!");
        } catch (error) {
          console.error("Error deleting car:", error.message);
          showMessage("Error deleting car: " + error.message, "error", [
            { label: "Ok", class: "btn-primary" },
          ]);
        }
      },
    },
    {
      label: "No",
      class: "btn-secondary",
      onClick: async () => {
        console.log("Car deletion cancelled!");
        showMessage("Car deletion cancelled!");
      },
    },
  ]);
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
//window.confirm("Car edited successfully")

// Fetch cars on page load
fetchCars();
