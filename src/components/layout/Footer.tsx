
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <p className="text-gray-500 text-sm">
            Powered by <Link to="/" className="font-medium hover:text-gray-700">NeighBoardHood</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
