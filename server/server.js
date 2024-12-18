const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const server = express();

// Middleware to handle JSON requests and enable CORS
server.use(express.json());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});

// GET route to fetch all cars
server.get("/cars", (req, res) => {
  const db = new sqlite3.Database("./cars.db");

  db.all("SELECT * FROM cars", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(rows);
    }
  });

  db.close();
});

// POST route to add a new car
server.post("/cars", (req, res) => {
  const db = new sqlite3.Database("./cars.db");
  const { brand, model, year, color } = req.body;

  if (!brand || !model || !year || !color) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `INSERT INTO cars (brand, model, year, color) VALUES (?, ?, ?, ?)`;
  db.run(sql, [brand, model, year, color], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to add the car" });
    } else {
      res.status(201).json({
        message: "Car added successfully",
        car: { id: this.lastID, brand, model, year, color },
      });
    }
  });

  db.close();
});

// PUT route to update a car
server.put("/cars/:id", (req, res) => {
  const db = new sqlite3.Database("./cars.db");
  const carId = req.params.id;
  const { brand, model, year, color } = req.body;

  if (!brand || !model || !year || !color) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `UPDATE cars SET brand = ?, model = ?, year = ?, color = ? WHERE id = ?`;
  db.run(sql, [brand, model, year, color, carId], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to update the car" });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Car not found" });
    } else {
      res.status(200).json({ message: "Car updated successfully" });
    }
  });

  db.close();
});

// DELETE route to delete a car by ID
server.delete("/cars/:id", (req, res) => {
  const db = new sqlite3.Database("./cars.db");
  const carId = req.params.id;

  db.run("DELETE FROM cars WHERE id = ?", [carId], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to delete the car" });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Car not found" });
    } else {
      res.status(200).json({ message: "Car deleted successfully" });
    }
  });

  db.close();
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
