import React, { useState } from "react";
import axios from "axios";

function AddSensor() {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/add", {
      name,
      manufacturer,
      category_id: category,
    });

    alert("Sensor Added Successfully!");
    window.location = "/";
  };

  return (
      <div className="container">
        <div className="summary">
      <h2>Add New Sensor</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Sensor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        /><br /><br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="1">Temperature</option>
          <option value="2">Vibration</option>
          <option value="3">Current</option>
          <option value="4">Sound</option>
        </select><br /><br />

        <button type="submit">Add Sensor</button>
      </form>
          </div>
    </div>
  );
}

export default AddSensor;