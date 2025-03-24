import React from 'react';
import { useParams } from 'react-router-dom';

export default function ChallengeDetail() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Challenge Info */}
      <div className="card p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">Weekly Composition Challenge</h1>
        <p className="text-secondary mb-4">
          Practice your composition skills with this weekly challenge. Focus on the rule of thirds
          and leading lines.
        </p>
        <div className="flex items-center gap-4 text-secondary">
          <span>Due: March 31, 2024</span>
          <span>•</span>
          <span>12 participants</span>
        </div>
      </div>

      {/* Your Submission */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Submission</h2>
        <p className="text-secondary">No submission yet</p>
      </div>

      {/* Other Submissions */}
      <div className="card p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Other Submissions</h2>
        <p className="text-secondary">No submissions yet</p>
      </div>
    </div>
  );
}
