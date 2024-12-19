import React, { useState, useEffect } from "react";
import desktopper from "../../assets/desktopper.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ThankYou = () => {
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        goToMyPlan();
      }
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      // Use navigate to redirect to the desired route
      navigate("/dashboard/subscription");
      clearInterval(timerInterval);
    }, 10000);

    return () => {
      clearInterval(timerInterval);
      clearTimeout(redirectTimeout);
    };
  }, [timer, navigate]); // Include navigate in the dependency array

  const goToDashboard = () => {
    // Use navigate to redirect to the desired route
    navigate("/dashboard/dashboardScreen");
  };

  const goToMyPlan = () => {
    // Use navigate to redirect to the desired route
    navigate("/dashboard/subscription");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={desktopper} alt="desktopper" className="mb-8 h-52 w-44" />

      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg mb-4">Your payment was successful.</p>
      <p>Redirecting in {timer} seconds...</p>
      <div className="mt-8 space-x-4">
        <button
          onClick={goToDashboard}
          className="bg-[#2F4C5F] hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard
        </button>
        <button
          onClick={goToMyPlan}
          className="bg-blue_rgba hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        >
          Go to MyPlan
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
