import React, { useState, useEffect } from "react";
import HotelSearchForm from "./components/Hotel/HotelSearchForm";
import HotelList from "./components/Hotel/HotelList";
import BookingAndRoomChangeForm from "./BookingAndRoomChangeForm";
import BookingConfirmation from "./components/Booking/BookingConfirmation";
import RoomChangeConfirmation from "./components/Room/RoomChangeConfirmation";

const HotelSearchAndBooking = () => {
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [radius, setRadius] = useState("");
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [roomChangeConfirmation, setRoomChangeConfirmation] = useState(null);

  //   useEffect(() => {
  //     // Simulated user coordinates
  //     setUserCoordinates({ latitude: 46.2, longitude: 23.2 });
  //   }, []);

  // Get user's coordinates using the Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const roundedLatitude = Math.round(latitude * 10) / 10;
          const roundedLongitude = Math.round(longitude * 10) / 10;
          setUserCoordinates({
            latitude: roundedLatitude,
            longitude: roundedLongitude,
          });
        },
        (error) => {
          console.error("Error getting user coordinates:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearch = async (radius) => {
    setRadius(radius);
    try {
      const myHeaders = new Headers();

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `http://localhost:8080/api/v1/hotels/nearby?latitude=${userCoordinates.latitude}&longitude=${userCoordinates.longitude}&radius=${radius}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const hotels = await response.json();
      setHotels(hotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleBookingConfirmation = (confirmation) => {
    setBookingConfirmation(confirmation);
  };

  const handleRoomChangeConfirmation = (confirmation) => {
    setRoomChangeConfirmation(confirmation);
  };

  return (
    <div>
      <h1>Hotel Search and Booking</h1>
      <HotelSearchForm onSearch={handleSearch} />
      {hotels.length > 0 && (
        <HotelList hotels={hotels} onSelect={handleHotelSelect} />
      )}
      {selectedHotel && (
        <BookingAndRoomChangeForm
          hotel={selectedHotel}
          onBookingConfirm={handleBookingConfirmation}
          onRoomChangeConfirm={handleRoomChangeConfirmation}
          conf={bookingConfirmation}
        />
      )}
      {bookingConfirmation && (
        <BookingConfirmation confirmation={bookingConfirmation} />
      )}
      {roomChangeConfirmation && (
        <RoomChangeConfirmation confirmation={roomChangeConfirmation} />
      )}
    </div>
  );
};

export default HotelSearchAndBooking;
