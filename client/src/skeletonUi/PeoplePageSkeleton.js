import React from "react";

const PeoplePageSkeleton = () => {
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
          <td className="text-start w-1/4 py-4">
            <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
          </td>
          <td className="tabletext w-1/4 py-4">
            <div className="w-20 h-4 bg-gray-300 animate-pulse"></div>
          </td>
          <td className="text-start w-1/4 py-4">
            <div className="w-20 h-8 bg-gray-300 animate-pulse"></div>
          </td>
        </tr>
      );
    }

    return skeletonRows;
  };

  return (
    <table className="table-fixed w-[100%]">
      <thead className="border-b-2">
        <tr>
          <th className="text-start w-1/4 py-2">Name</th>
          <th className="text-start w-1/4 py-2">Email</th>
          <th className="text-start w-1/4 py-2">Role</th>
          <th className="text-start w-1/4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>{renderSkeletonRows()}</tbody>
    </table>
  );
};

export default PeoplePageSkeleton;
