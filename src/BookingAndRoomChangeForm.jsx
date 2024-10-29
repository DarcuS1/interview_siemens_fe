import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const BookingAndRoomChangeForm = ({
  hotel,
  onBookingConfirm,
  onRoomChangeConfirm,
  conf,
}) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userName, setUserName] = useState("");

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
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.sub);
      }
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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      console.error("Please select a room");
      return;
    }
    try {
      // Make a booking request with selected room details
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          hotelId: hotel.id,
          roomNumber: selectedRoom.roomNumber,
          roomType: selectedRoom.roomType,
          userName: userName,
        }),
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/reservations/book",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const confirmation = await response.json();
      onBookingConfirm(confirmation);
      fetchAvailableRooms(); // Refresh available rooms
    } catch (error) {
      console.error("Error booking room:", error);
    }
  };

  const handleRoomChangeSubmit = async (e) => {
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

  const handleCancelReservation = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/reservations/${conf.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      const cf = null;
      onRoomChangeConfirm(cf);
      onBookingConfirm(cf);
      fetchAvailableRooms();
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  const isRoomSelected = (room) => {
    return selectedRoom && selectedRoom.roomNumber === room.roomNumber;
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          hotelId: hotel.id,
          body: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setShowReviewForm(false);
      setReviewText("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Available Rooms at {hotel.name}
        </h2>
        <ul className="space-y-4">
          {availableRooms.map((room) => (
            <li
              key={room.roomNumber}
              className={`p-4 border rounded-md flex justify-between items-center ${
                isRoomSelected(room) ? "bg-blue-200" : "hover:bg-gray-100"
              }`}
            >
              <div>
                <p>Room Number: {room.roomNumber}</p>
                <p>Type: {room.type}</p>
                <p>Price: ${room.price}</p>
              </div>
              <button
                onClick={() => handleRoomSelect(room)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Select
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleBookingSubmit} className="mt-4">
          <button
            type="submit"
            disabled={!selectedRoom}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
          >
            Book Room
          </button>
        </form>
        <form onSubmit={handleRoomChangeSubmit} className="mt-4">
          <button
            type="submit"
            disabled={!selectedRoom}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
          >
            Change Room
          </button>
        </form>
        <button
          onClick={handleCancelReservation}
          className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Cancel Reservation
        </button>
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Leave a Review
        </button>
        {showReviewForm && (
          <div className="mt-4">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full h-32 p-2 border rounded-md"
            ></textarea>
            <button
              onClick={handleReviewSubmit}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingAndRoomChangeForm;
