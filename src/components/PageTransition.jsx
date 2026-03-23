import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('enter'); // 'enter' | 'exit'

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('exit');

      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setStage('enter');
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-all duration-200 ease-out ${
        stage === 'enter'
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
