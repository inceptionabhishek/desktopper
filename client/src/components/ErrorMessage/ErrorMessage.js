import React from "react";

const ErrorMessage = ({ error, message }) => {
  return (
    <>
        {error && <span className="text-sm text-red-600">{message}</span>}
    </>
    
  );
};

export default ErrorMessage;
