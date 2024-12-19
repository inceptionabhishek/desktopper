import React from "react";
import cardVetcor from "../../assets/cardVector.svg";
const TextBox = ({ textColor, topLeftText, middleText }) => {
  return (
    <div
      className="w-full z-[-1]  bg-white rounded-lg py-6 pl-6  border border-gray-400 border-opacity-50 bg-gradient-to-b from-[#FFFFFF] to-[#F1F7FF]"
      style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.10)" }}
    >
      {/* Top Left Text */}
      <div className="text-sm font-semibold text-[#36454F]">{topLeftText}</div>

      {/* Middle Text */}
      <div className="relative pb-6">
        <img src={cardVetcor} alt="card vetcor" style={{ float: "right" }} />
        <div
          className={`flex justify-start pt-8 pb-8 text-4xl ${textColor}`}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",

            transform: "translate(-50%, -50%)",
            textAlign: "left",
            width: "100%",
          }}
        >
          <span className="text-4xl text-center font-bold pt-10">
            {middleText}

            {topLeftText === "TODAY'S ACTIVITY" ||
            topLeftText === "WEEKLY ACTIVITY" ? (
              <span className="text-lg">%</span>
            ) : (
              ""
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextBox;
