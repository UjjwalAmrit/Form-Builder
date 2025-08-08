import React from 'react';
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="loading">
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
        style={{
          animation: 'spin 1s linear infinite'
        }}
      ></div>
      {text && <p style={{ marginTop: '10px', color: '#666' }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
