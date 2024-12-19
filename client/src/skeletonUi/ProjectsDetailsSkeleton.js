import React from "react";

const ProjectsDetailsSkeleton = () => {
  const numSkeletonTasks = 5;
  const numSkeletonColumns = 3;

  const renderSkeletonTasks = () => {
    const skeletonTasks = [];

    for (let i = 0; i < numSkeletonTasks; i++) {
      skeletonTasks.push(
        <div
          className="bg-white border-2 rounded px-2 py-1 mb-1 animate-pulse"
          key={`skeleton-task-${i}`}
        >
          <div className="h-10 bg-gray-300 mb-1 animate-pulse"></div>
        </div>
      );
    }

    return skeletonTasks;
  };

  const renderSkeletonColumns = () => {
    const skeletonColumns = [];

    for (let i = 0; i < numSkeletonColumns; i++) {
      skeletonColumns.push(
        <div
          className="w-1/2 mt-10 mx-2 border-2 animate-pulse"
          key={`skeleton-column-${i}`}
        >
          <div className="flex flex-row items-center space-x-4 text-lg font-bold mb-2 p-4 text-gray-600 flex-1">
            <div className="relative inline-flex w-5 h-5 overflow-hidden rounded-full bg-gray-300 animate-pulse"></div>
            <div className="h-4 bg-gray-300 w-20 animate-pulse"></div>
          </div>
          <div className="border rounded p-2 bg-gray-200">
            {renderSkeletonTasks()}
          </div>
        </div>
      );
    }
    return skeletonColumns;
  };
  const renderSkeletonTabs = () => {
    const skeletonTabs = [];

    for (let i = 0; i < 2; i++) {
      skeletonTabs.push(
        <div
          className="bg-gray-300 w-20 h-8 rounded-full mr-2 mb-2 animate-pulse"
          key={`skeleton-tab-${i}`}
        ></div>
      );
    }

    return skeletonTabs;
  };
  return (
    <>
      <div className="flex flex-row items-center space-x-4 text-lg font-bold mb-2 p-4 text-gray-600 flex-1">
        <div className="h-[20px] bg-gray-300 w-[200px] animate-pulse mt-20"></div>
      </div>
      <div className="flex space-x-2 mb-4 mt-[100px] ml-5">
        {renderSkeletonTabs()}
      </div>
      <div className="flex overflow-x-scroll mt-[100px]">
        {renderSkeletonColumns()}
      </div>
    </>
  );
};

export default ProjectsDetailsSkeleton;
