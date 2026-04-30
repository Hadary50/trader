import React from 'react';

const LoadingSpinner = ({ fullPage = false, size = 'medium' }) => {
  const spinnerSize = {
    small: '24px',
    medium: '48px',
    large: '80px'
  }[size];

  const containerStyle = fullPage ? {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    width: '100%'
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  return (
    <div style={containerStyle} className="loading-spinner-container">
      <div className={`premium-spinner ${size}`}>
        <div className="inner-ring"></div>
        <div className="outer-ring"></div>
        <div className="pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
