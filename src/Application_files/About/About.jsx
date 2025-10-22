import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our App!</h1>
      <p className="text-lg mb-6 max-w-md">
        This is a public page. Please log in or sign up to access the full website.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</Link>
        <Link to="/signup" className="bg-gray-500 text-white px-4 py-2 rounded">Sign Up</Link>
      </div>
    </div>
  );
}
