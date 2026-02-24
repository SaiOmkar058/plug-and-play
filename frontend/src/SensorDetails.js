import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function SensorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/sensor/${id}`)
      .then(res => setSensor(res.data))
      .catch(err => {
        console.error("Failed to fetch sensor details:", err);
        setError(`Failed to load sensor: ${err.message}. Please check if the backend API is reachable.`);
      });
  }, [id]);

  if (error) return <p style={{ color: "#f87171", padding: "30px" }}>{error}</p>;
  if (!sensor) return <p style={{ padding: "30px", color: "#94a3b8" }}>Loading...</p>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <div className="sensor-header">
        {sensor.image_url && (
          <img
            src={sensor.image_url}
            alt={sensor.sensor_name}
            className="sensor-image-full"
          />
        )}

        <div className="sensor-header-info">
          <h2>{sensor.sensor_name}</h2>
          <p><b>Manufacturer:</b> {sensor.manufacturer}</p>
          <p><b>Category:</b> {sensor.category_name}</p>
        </div>
      </div>

      <div className="detail-card">
        <h3>⚡ Electrical Specs</h3>
        <p><b>Voltage</b><span>{sensor.operating_voltage || "N/A"}</span></p>
        <p><b>Power</b><span>{sensor.power_consumption || "N/A"}</span></p>
        <p><b>Interface</b><span>{sensor.interface_type || "N/A"}</span></p>
      </div>

      <div className="detail-card">
        <h3>📐 Measurement Specs</h3>
        <p><b>Range</b><span>{sensor.measurement_range || "N/A"}</span></p>
        <p><b>Accuracy</b><span>{sensor.accuracy || "N/A"}</span></p>
        <p><b>Sensitivity</b><span>{sensor.sensitivity || "N/A"}</span></p>
        <p><b>Response Time</b><span>{sensor.response_time || "N/A"}</span></p>
      </div>

      <div className="detail-card">
        <h3>🌿 Environmental Specs</h3>
        <p><b>Temperature</b><span>{sensor.operating_temperature || "N/A"}</span></p>
        <p><b>Durability</b><span>{sensor.durability || "N/A"}</span></p>
        <p><b>Mounting</b><span>{sensor.mounting_type || "N/A"}</span></p>
      </div>
    </div>
  );
}

export default SensorDetails;