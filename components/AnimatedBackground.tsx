import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(126,34,206,0.15),_transparent_70%)] opacity-70"></div>
    </div>
  );
};

export default AnimatedBackground;