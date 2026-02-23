import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SensorDetails() {
  const { id } = useParams();
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/sensor/${id}`)
      .then(res => setSensor(res.data));
  }, [id]);

  if (!sensor) return <p>Loading...</p>;

    return (
      
        <div className="container">
            <button onClick={() => window.history.back()}>
  ← Back
</button>
      <h2>{sensor.sensor_name}</h2>
      <p><b>Manufacturer:</b> {sensor.manufacturer}</p>
      <p><b>Category:</b> {sensor.category_name}</p>

      <h3>Electrical Specs</h3>
      <p>Voltage: {sensor.operating_voltage}</p>
      <p>Power: {sensor.power_consumption}</p>
      <p>Interface: {sensor.interface_type}</p>

      <h3>Measurement Specs</h3>
      <p>Range: {sensor.measurement_range}</p>
      <p>Accuracy: {sensor.accuracy}</p>
      <p>Sensitivity: {sensor.sensitivity}</p>
      <p>Response Time: {sensor.response_time}</p>

      <h3>Environmental Specs</h3>
      <p>Temperature: {sensor.operating_temperature}</p>
      <p>Durability: {sensor.durability}</p>
      <p>Mounting: {sensor.mounting_type}</p>
    </div>
  );
}

export default SensorDetails;