import React from "react";

const TableSheetSkeleton = () => {
  const numRows = 10; // Number of rows you want to render

  return (
    <div className="relative z-[-1] p-6 bg-white shadow-md rounded-md">
      <div className="border-b mb-4 pb-2">
        <div className="h-4 w-20 bg-gray-300 animate-pulse"></div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 py-2 px-4 text-left font-semibold text-gray-700">
              Project & Task
            </th>
            <th className="w-1/4 py-2 px-4 text-left font-semibold text-gray-700">
              Activity
            </th>
            <th className="w-1/4 py-2 px-4 text-left font-semibold text-gray-700">
              Duration
            </th>
            <th className="w-1/4 py-2 px-4 text-left font-semibold text-gray-700">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: numRows }, (_, index) => (
            <tr key={index}>
              <td className="py-4 px-4">
                <div className="h-4 w-1/2 bg-gray-300 animate-pulse"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-1/2 bg-gray-300 animate-pulse"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-1/2 bg-gray-300 animate-pulse"></div>
              </td>
              <td className="py-4 px-4">
                <div className="h-4 w-1/2 bg-gray-300 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSheetSkeleton;
