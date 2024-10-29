// SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Pages/Navbar";
import Footer from "../Pages/Footer";

const SignUpFetch = async (email, password) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email: email,
    password: password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  console.log("Signing up data: ", raw);

  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/auth/register",
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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await SignUpFetch(email, password);
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
      <div className="flex justify-center items-center h-screen">
        <div className="grid md:grid-cols-2 items-start gap-6 max-w-5xl mx-auto px-4 py-6">
          <div className="mx-auto max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Sign Up</h1>
              <p className="text-gray-500">
                Enter your information to create an account
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  onChange={(e) => setPassword(e.target.value)} //:)
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="peer h-4 w-4 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
                <label htmlFor="terms" className="font-medium">
                  I agree to the{" "}
                  <a href="#" className="underline">
                    terms and conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
