// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import HotelSearchAndBooking from "./HotelSearchAndBooking";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hotels" element={<HotelSearchAndBooking />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Welcome to Siemens Hotels</h1>
      <div>
        <Link to="/signin">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </Link>
        <Link to="/signup">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default App;
