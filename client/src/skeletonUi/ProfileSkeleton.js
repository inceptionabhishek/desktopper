import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="p-14 bg-[#f3f4f6] animate-pulse">
      <div>
        <div className="flex flex-row items-center pb-12 gap-7">
          <div className="avatar bg-[#d1d5db] h-14 w-14 rounded-full flex justify-center items-center cursor-pointer text-white text-4xl"></div>
          <div className="w-40 h-6 bg-gray-300 animate-pulse"></div>
        </div>
      
        <div className="flex flex-row flex-wrap gap-14 pb-12">
          <div className="w-40 h-4 bg-gray-300 animate-pulse"></div>
          <div className="w-40 h-4 bg-gray-300 animate-pulse"></div>
          <div className="w-40 h-4 bg-gray-300 animate-pulse"></div>
        </div>
        <div className="flex flex-row flex-wrap gap-14 pb-12">
          <div className="w-40 h-4 bg-gray-300 animate-pulse"></div>
          <div className="w-40 h-4 bg-gray-300 animate-pulse"></div>
          <div className="w-40 h-4 bg-gray-300 animate-pulse"></div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="w-[500px] flex flex-col gap-1">
            <p className="w-24 h-8 bg-gray-300 animate-pulse"></p>
            <div className="w-full flex items-center justify-start">
              <span className="bg-gray-300 h-[32px] w-14 mt-4 inline-flex items-center justify-center px-2 rounded-full text-white animate-pulse"></span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 w-[40%]">
              <p className="w-24 h-8 bg-gray-300 animate-pulse"></p>

              <div className="flex gap-1 flex-wrap mt-2 rounded-md"></div>
            </div>
            <div>
              <button className="text-base mr-4 pt-6 pb-6 px-16 border-2 border-[#d1d5db] rounded-2xl animate-pulse"></button>
              <button className="pt-6 pb-6 px-16 bg-[#d1d5db] rounded-2xl text-base text-white animate-pulse"></button>
              <div className="flex justify-end">
                <button className="mt-6 pt-6 pb-6 px-16 bg-[#d1d5db] rounded-2xl text-base text-white ml-auto animate-pulse"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
