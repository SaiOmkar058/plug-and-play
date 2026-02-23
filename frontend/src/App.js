import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./Dashboard";
import AddSensor from "./AddSensor";
import SensorDetails from "./SensorDetails";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);

  const fetchSensors = async () => {
    const res = await axios.get(`${API_URL}/sensors`);
    setSensors(res.data);
    setFilteredSensors(res.data);
  };

  const filterCategory = async (cat) => {
    const res = await axios.get(`${API_URL}/category/${cat}`);
    setFilteredSensors(res.data);
  };

  const handleSearch = (text) => {
    const filtered = sensors.filter(s =>
      s.sensor_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSensors(filtered);
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <Router>
      <div className="navbar">
        Sensor Monitoring Dashboard
        <Link to="/" className="navlink">Home</Link>
        <Link to="/add" className="navlink">Add Sensor</Link>
      </div>

      <Routes>
        <Route path="/" element={
          <Dashboard
            filteredSensors={filteredSensors}
            fetchSensors={fetchSensors}
            filterCategory={filterCategory}
            handleSearch={handleSearch}
          />
        } />

        <Route path="/add" element={<AddSensor />} />
        <Route path="/sensor/:id" element={<SensorDetails />} />
      </Routes>
    </Router>
  );
}

export default App;