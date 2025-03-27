import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Photography Projects</h1>
        <p className="text-xl text-secondary mb-8">
          Join our community of photographers and take on exciting projects to improve your skills.
        </p>
        <Link to="/projects" className="btn btn-primary">
          View Projects
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Learn & Grow</h2>
          <p className="text-secondary">
            Take on structured projects designed to help you develop your photography skills.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Share & Connect</h2>
          <p className="text-secondary">
            Share your work with the community and get valuable feedback from fellow photographers.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Track Progress</h2>
          <p className="text-secondary">
            Monitor your improvement over time with our project-based learning system.
          </p>
        </div>
      </div>
    </div>
  );
}
