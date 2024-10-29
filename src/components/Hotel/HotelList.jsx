import React, { useState, useEffect } from "react";

const HotelList = ({ hotels, onSelect }) => {
  const [hotelReviews, setHotelReviews] = useState({});
  const [showReviews, setShowReviews] = useState({});

  const fetchHotelReviews = async (hotelId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/reviews/hotel/${hotelId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch hotel reviews");
      }
      const reviews = await response.json();
      setHotelReviews((prevReviews) => ({
        ...prevReviews,
        [hotelId]: reviews,
      }));
    } catch (error) {
      console.error("Error fetching hotel reviews:", error);
    }
  };

  useEffect(() => {
    hotels.forEach((hotel) => fetchHotelReviews(hotel.id));
  }, [hotels]);

  const toggleReviews = (hotelId) => {
    setShowReviews((prevShowReviews) => ({
      ...prevShowReviews,
      [hotelId]: !prevShowReviews[hotelId],
    }));
  };

  return (
    <div>
      <h2>Hotels Found</h2>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <div className="flex items-center justify-between border-b py-2">
              <div>
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <p>{hotel.address}</p>
                {/* Toggle button */}
                <button
                  onClick={() => toggleReviews(hotel.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {showReviews[hotel.id] ? "Hide Reviews" : "Show Reviews"}
                </button>
                {/* Collapsible reviews */}
                {showReviews[hotel.id] && hotelReviews[hotel.id] && (
                  <table className="w-full mt-4">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelReviews[hotel.id].map((review) => (
                        <tr key={review.id}>
                          <td>{review.userId}</td>
                          <td>{review.body}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <button
                onClick={() => onSelect(hotel)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Select
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;
