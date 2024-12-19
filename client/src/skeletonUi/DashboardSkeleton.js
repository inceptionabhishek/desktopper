import React from "react";

const DashboardSkeleton = () => {
  return (
    <>
      <div className="p-6 px-10">
        <div className="flex flex-row">
          <button className="tab tab-active">ME</button>
          <button className="tab">ALL</button>
        </div>
        <div>
          {/* Placeholder for main content */}
          <div className="flex flex-col">
            <div className="relative flex flex-col md:flex-row space-x-6 pt-10 pb-10 justify-between items-start">
              <div className="w-[250px] h-40 bg-gray-300 animate-pulse rounded-xl"></div>
              <div className="w-[250px] h-40 bg-gray-300 animate-pulse rounded-xl"></div>
              <div className="w-[250px] h-40 bg-gray-300 animate-pulse rounded-xl"></div>
              <div className="w-[250px] h-40 bg-gray-300 animate-pulse rounded-xl"></div>
            </div>

            <div className="flex flex-col lg-1400:flex-row lg-1400:justify-between space-x-6 items-start lg-1400:h-screen h-[200vh] w-full">
              <div className="flex w-full">
                <div className="w-full h-[830px] bg-gray-300 animate-pulse rounded-xl"></div>
              </div>
              <div className="flex flex-col gap-8 w-full">
                <div className="w-full h-[400px] bg-gray-300 animate-pulse rounded-xl"></div>

                <div className="w-full h-[400px] bg-gray-300 animate-pulse rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSkeleton;
