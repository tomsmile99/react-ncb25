import React from 'react';


const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${
            index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
          }`}
        >
          {index < currentStep ? (
            <span className="icon">&#10003;</span>
          ) : (
            <span className="number">{index + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;