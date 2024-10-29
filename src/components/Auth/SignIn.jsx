// SignIn.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../Pages/Navbar";
import Footer from "../Pages/Footer";

const SignInFetch = async (email, password) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: email,
    password: password,
  });

  console.log("Login page", raw);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/auth/authenticate",
      requestOptions
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = async () => {
    try {
      const result = await SignInFetch(email, password);
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        console.log("Sign-in successful. Token:", result.token);
        localStorage.setItem("jwtToken", result.token);

        navigate("/hotels");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="grid md:grid-cols-2 items-start gap-6 max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col justify-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4 text-primary">Sign In</h1>
            <p className="text-gray-600">
              Enter your information to access the tennis management system
            </p>
          </div>
          <div className="mt-6">
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:bg-white focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="mt-4">
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-100 focus:outline-none focus:bg-white focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            onClick={handleSignIn}
            className="mt-6 bg-primary text-black font-semibold py-3 px-6 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign In
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
        <div className="flex flex-col justify-center">
          <div className="rounded-lg border bg-white text-gray-800 shadow-sm w-full max-w-sm mx-auto p-6 space-y-4">
            <h2 className="text-3xl font-bold text-primary">New to the app?</h2>
            <p className="text-gray-600">Sign up to create an account</p>
            <button
              onClick={handleSignUp}
              className="mt-4 bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
export default SignIn;
