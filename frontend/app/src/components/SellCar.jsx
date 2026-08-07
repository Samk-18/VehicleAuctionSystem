import React, { useState } from "react";
import { addCar } from "../services/carService";

const SellCar = () => {
  const [car, setCar] = useState({
    registration_no: "",
    brand: "",
    model: "",
    fuel_type: "PETROL",
    transmission: "MANUAL",
    price: 0,
    sale_type: "AUCTION",
    mileage: 0,
    manufacture_year: 2020,
    color: "",
    engine_cc: 0,
    description: ""
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setCar({
      ...car,
      [name]:
        type === "number" ? Number(value) : value
    });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addCar(car, images);
      alert("Car added successfully 🚗");

      // optional reset
      setCar({
        registration_no: "",
        brand: "",
        model: "",
        fuel_type: "PETROL",
        transmission: "MANUAL",
        price: 0,
        sale_type: "AUCTION",
        mileage: 0,
        manufacture_year: 2020,
        color: "",
        engine_cc: 0,
        description: ""
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add car");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sell Your Car</h2>

      <input name="registration_no" placeholder="Registration No" onChange={handleChange} required />
      <input name="brand" placeholder="Brand" onChange={handleChange} required />
      <input name="model" placeholder="Model" onChange={handleChange} required />

      <select name="fuel_type" onChange={handleChange}>
        <option value="PETROL">Petrol</option>
        <option value="DIESEL">Diesel</option>
        <option value="CNG">CNG</option>
        <option value="ELECTRIC">Electric</option>
      </select>

      <select name="transmission" onChange={handleChange}>
        <option value="MANUAL">Manual</option>
        <option value="AUTOMATIC">Automatic</option>
      </select>

      <select name="sale_type" onChange={handleChange}>
        <option value="AUCTION">Auction</option>
        <option value="DIRECT">Direct Sale</option>
      </select>

      <input name="price" type="number" placeholder="Price" onChange={handleChange} />
      <input name="mileage" type="number" placeholder="Mileage" onChange={handleChange} />
      <input name="manufacture_year" type="number" placeholder="Year" onChange={handleChange} />
      <input name="engine_cc" type="number" placeholder="Engine CC" onChange={handleChange} />
      <input name="color" placeholder="Color" onChange={handleChange} />

      <textarea name="description" placeholder="Description" onChange={handleChange} />

      <input type="file" multiple accept="image/*" onChange={handleImageChange} />

      <button type="submit">Add Car</button>
    </form>
  );
};

export default SellCar;
