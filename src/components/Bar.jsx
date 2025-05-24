import React from 'react';

function Bar({ height, isComparing, isSorted }) {
  const getBarColor = () => {
    if (isSorted) return 'bg-emerald-500';
    if (isComparing) return 'bg-rose-500';
    return 'bg-sky-500';
  };

  return (
    <div 
      className={`array-bar ${getBarColor()}`}
      style={{ height: `${height}px` }}
    />
  );
}

export default Bar; 