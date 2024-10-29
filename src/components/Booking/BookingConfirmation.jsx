import React from "react";

const BookingConfirmation = ({ confirmation }) => {
  // Function to format LocalDateTime to a readable date string
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString(); // You can adjust the date format as needed
  };

  return (
    <div>
      <h2>Booking Confirmation</h2>
      <p>Booking ID: {confirmation.id}</p>
      <p>Hotel: {confirmation.hotelId}</p>
      <p>Room Number: {confirmation.roomNumber}</p>
      <p>Check-in Date: {formatDateTime(confirmation.checkIn)}</p>
      <p>Check-out Date: {formatDateTime(confirmation.checkOut)}</p>
    </div>
  );
};

export default BookingConfirmation;
