// components/Room/RoomChangeConfirmation.js
import React from "react";

const RoomChangeConfirmation = ({ confirmation }) => {
  return (
    <div>
      <h2>Room Change Confirmation</h2>
      <p>Change ID: {confirmation.id}</p>
      <p>Hotel: {confirmation.hotelId}</p>
      <p>New Room Number: {confirmation.roomNumber}</p>
    </div>
  );
};

export default RoomChangeConfirmation;
