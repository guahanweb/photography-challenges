import React from 'react';
import { Link } from 'react-router-dom';

export default function Challenges() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Photography Challenges</h1>
        <Link to="/challenges/new" className="btn btn-primary">
          Create Challenge
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for challenge cards */}
        <div className="card p-4">
          <h3 className="text-xl font-semibold mb-2">Weekly Composition Challenge</h3>
          <p className="text-secondary mb-4">
            Practice your composition skills with this weekly challenge.
          </p>
          <Link to="/challenges/1" className="link">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
