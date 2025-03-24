import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Photography Challenges</h1>
      <p className="text-lg mb-8">
        Join our community of photographers and take on exciting challenges to improve your skills.
      </p>
      <div className="space-x-4">
        <Link
          to="/challenges"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          View Challenges
        </Link>
        <Link
          to="/login"
          className="inline-block bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
