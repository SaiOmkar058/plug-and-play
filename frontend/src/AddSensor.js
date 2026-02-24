import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AddSensor() {
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "qi0bg3ee");

    const res = await fetch("https://api.cloudinary.com/v1_1/dxrfpaqpr/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedImageUrl = await handleUpload();

      await axios.post(`${API_URL}/add`, {
        name,
        manufacturer,
        category_id: category,
        image_url: uploadedImageUrl,
      });

      alert("Sensor Added Successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to add sensor:", error);
      alert(`Error adding sensor: ${error.message}\n\nPlease check if the backend API is reachable.`);
    } finally {
      setUploading(false);
    }
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

          <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", color: "#4b5563" }}>
            Upload Sensor Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ padding: "5px", width: "300px" }}
          /><br /><br />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Sensor"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSensor;