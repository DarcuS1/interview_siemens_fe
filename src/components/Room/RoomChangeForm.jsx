import React, { useState, useEffect } from "react";

const RoomChangeForm = ({ hotel, onRoomChangeConfirm, conf }) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/hotels/${hotel.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch available rooms");
      }
      const hotelDetails = await response.json();
      const { rooms } = hotelDetails;

      // Filter rooms to only include those that are available
      const availableRooms = rooms.filter((room) => room.isAvailable === true);

      setAvailableRooms(availableRooms);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  useEffect(() => {
    if (hotel) {
      fetchAvailableRooms();
    }
  }, [hotel]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      console.error("Please select a room and provide a reservation ID");
      return;
    }
    try {
      // Make a room change request with selected room details
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `http://localhost:8080/api/v1/reservations/${conf.id}/change-room/${selectedRoom.roomNumber}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to change room");
      }

      const confirmation = await response.json();
      onRoomChangeConfirm(confirmation);
      fetchAvailableRooms(); // Refresh available rooms
    } catch (error) {
      console.error("Error changing room:", error);
    }
  };

  return (
    <div>
      <h2>Available Rooms at {hotel.name}</h2>
      <ul>
        {availableRooms.map((room) => (
          <li key={room.roomNumber} onClick={() => handleRoomSelect(room)}>
            Room Number: {room.roomNumber}, Type: {room.type}, Price: $
            {room.price}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={!selectedRoom}>
          Change Room
        </button>
      </form>
    </div>
  );
};

export default RoomChangeForm;
