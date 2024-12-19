import React from "react";

function ActivitySkeleton() {
  const cardsData = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {cardsData.map((card) => (
        <div
          key={card}
          className="bg-[#d1d5db] p-4 rounded-lg shadow-md animate-pulse mb-10"
        >
          <div className="text-xl font-semibold mb-6 bg-gray-300 h-6 w-3/4"></div>
          <p className="bg-gray-200 h-4 w-1/3 mb-4"></p>
          <div className="bg-gray-200 h-4 w-1/3"></div>
        </div>
      ))}
    </div>
  );
}

export default ActivitySkeleton;
