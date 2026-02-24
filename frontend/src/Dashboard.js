import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ filteredSensors, fetchSensors, filterCategory, handleSearch }) {
  const navigate = useNavigate();
  return (
    <div className="container">

      <div className="filters">
        <button onClick={() => fetchSensors()}>All</button>
        <button onClick={() => filterCategory("Temperature")}>Temperature</button>
        <button onClick={() => filterCategory("Current")}>Current</button>
        <button onClick={() => filterCategory("Vibration")}>Vibration</button>
        <button onClick={() => filterCategory("Sound")}>Sound</button>

        <input
          className="search"
          placeholder="Search Sensor..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="summary">
        Total Sensors: <b>{filteredSensors.length}</b>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Sensor Name</th>
            <th>Manufacturer</th>
            <th>Category</th>
          </tr>
        </thead>

        <tbody>
          {filteredSensors.map((s) => (
            <tr key={s.sensor_id} onClick={() => navigate(`/sensor/${s.sensor_id}`)}>
              <td>{s.sensor_id}</td>
              <td>
                {s.image_url ? (
                  <img src={s.image_url} alt={s.sensor_name} className="sensor-image-thumb" />
                ) : (
                  <div className="placeholder-thumb">No Image</div>
                )}
              </td>
              <td>{s.sensor_name}</td>
              <td>{s.manufacturer}</td>
              <td>{s.category_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;