import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SubscriptionSkeleton = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-14">
      <div>
        <div className="flex justify-between ">
          <div className="flex flex-row items-center pb-12 gap-7">
            <div className="avatar bg-[#2F4C5F] h-14 w-14 rounded-full flex justify-center items-center cursor-pointer text-white text-4xl">
              {user?.fullName?.length > 0 &&
                user?.fullName.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="dashboard-container-heading">{user?.fullName}</h2>
          </div>

          <Link to="/dashboard/dashboardScreen">
            <button className="px-4 py-2 mt-0 text-white bg-[#526D82] rounded cursor-pointer hover:bg-[#27374D] transition duration-300">
              Go to Dashboard
            </button>
          </Link>
        </div>
        <div className="h-12 bg-gray-300 animate-pulse"></div>
        <div className="mt-15 h-40 bg-gray-300 animate-pulse"></div>
        <div className="mt-15 h-40 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
