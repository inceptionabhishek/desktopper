import React from "react";

const ProjectPage = () => {
  const numSkeletonRows = 5;

  const renderSkeletonRows = () => {
    const skeletonRows = [];

    for (let i = 0; i < numSkeletonRows; i++) {
      skeletonRows.push(
        <tr
          className="border-b-2 cursor-pointer hover:bg-[#e5e5e5]"
          key={`skeleton-row-${i}`}
        >
          <td className="tabletext py-4">
            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
          </td>
          <td className="text-start w-1/4 py-2">
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full">
                <span className="font-medium text-white cursor-pointer"></span>
              </div>
            </div>
          </td>
          <td className="tabletext w-1/4 py-6">
            <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
          </td>
          <td className="text-start flex space-x-4 py-6">
            <div className="w-20 h-8 bg-gray-300 animate-pulse"></div>
            <div className="w-20 h-8 bg-gray-300 animate-pulse"></div>
          </td>
        </tr>
      );
    }

    return skeletonRows;
  };

  return (
    <table className="table-fixed w-[100%]">
      <thead className="border-b-2]">
        <tr>
          <th className="text-start w-1/4 py-2">Name</th>
          <th className="text-start w-1/4 py-2">Members</th>
          <th className="text-start w-1/4 py-2">To Do's</th>
          <th className="text-start w-1/4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>{renderSkeletonRows()}</tbody>
    </table>
  );
};

export default ProjectPage;
