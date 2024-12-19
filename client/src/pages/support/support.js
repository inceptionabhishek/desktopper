import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const Support = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col justify-center items-center mb-20">
        <div className="bg-[#36454F] text-white rounded-lg p-10 max-w-md mx-auto shadow-lg">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Need Help or Have Questions?
          </h1>
          <h3 className="text-base mb-6 text-center">
            If you require assistance or have any questions, please don't hesitate to
            contact our dedicated support team:
          </h3>
          <p className="text-xl text-center">
            Reach out via{" "}
            <a
              href="mailto:support@desktopper.com"
              className="text-blue-400 hover:underline transition-colors"
            >
              support@desktopper.com
            </a>{" "}
            for swift and helpful assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
