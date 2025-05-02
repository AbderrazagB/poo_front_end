import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const spinnerSizes = {
    small: '24px',
    medium: '40px',
    large: '56px'
  };

  const spinnerStyle = {
    width: spinnerSizes[size],
    height: spinnerSizes[size]
  };

  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999
  } : {};

  return (
    <div style={containerStyle}>
      <motion.div
        className="loading-spinner"
        style={spinnerStyle}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner; 