import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
