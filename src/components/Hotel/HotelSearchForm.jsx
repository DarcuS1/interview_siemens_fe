// components/Hotel/HotelSearchForm.js
import React, { useState } from "react";

const HotelSearchForm = ({ onSearch }) => {
  const [radius, setRadius] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(radius);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        placeholder="Radius (km)"
        required
      />
      <button type="submit">Search Hotels</button>
    </form>
  );
};

export default HotelSearchForm;
