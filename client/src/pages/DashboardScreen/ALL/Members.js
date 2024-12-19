import React, { useEffect } from "react";

const Members = ({
  setTotalTimeWorkedTodayByAll,
  setTotalTimeWorkedThisWeekByAll,
  setAverageEfficiencyTodayByAll,
  setAverageEfficiencyThisWeekByAll,
  userData,
}) => {
  const imageUrl = require("../../../assets/Icons/UserIcon.png");

  useEffect(() => {
    const totalToday = userData.reduce((acc, userData) => {
      return acc + convertTimeToMilliseconds(userData?.totalTimeToday);
    }, 0);

    const totalThisWeek = userData.reduce((acc, userData) => {
      return acc + convertTimeToMilliseconds(userData?.totalTimeThisWeek);
    }, 0);

    const totalTrackedTimeInMillisToday = userData.reduce((acc, user) => {
      return acc + parseFloat(user?.totalTimeTrackedToday);
    }, 0);

    const totalIdleTimeInSecondsToday = userData.reduce((acc, user) => {
      return acc + parseFloat(user?.totalIdleTimeToday);
    }, 0);

    const totalTrackedTimeInMillisInThisWeek = userData.reduce((acc, user) => {
      return acc + parseFloat(user?.totalTimeTrackedThisWeek);
    }, 0);

    const totalIdleTimeInSecondsInThisWeek = userData.reduce((acc, user) => {
      return acc + parseFloat(user?.totalIdleTimeThisWeek);
    }, 0);

    const averageEfficiencyToday =
      totalTrackedTimeInMillisToday !== 0
        ? ((totalTrackedTimeInMillisToday -
            totalIdleTimeInSecondsToday * 1000) /
            totalTrackedTimeInMillisToday) *
          100
        : 0;

    const averageEfficiencyThisWeek =
      totalTrackedTimeInMillisInThisWeek !== 0
        ? ((totalTrackedTimeInMillisInThisWeek -
            totalIdleTimeInSecondsInThisWeek * 1000) /
            totalTrackedTimeInMillisInThisWeek) *
          100
        : 0;

    setTotalTimeWorkedTodayByAll(formatTime(totalToday));
    setTotalTimeWorkedThisWeekByAll(formatTime(totalThisWeek));
    setAverageEfficiencyTodayByAll(Math.floor(averageEfficiencyToday));
    setAverageEfficiencyThisWeekByAll(Math.floor(averageEfficiencyThisWeek));
  }, [userData]);

  function convertTimeToMilliseconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600000 + minutes * 60000 + seconds * 1000;
  }

  function formatTime(totalTimeInMilliseconds) {
    const totalSeconds = totalTimeInMilliseconds / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  function isLastElement(index, array) {
    return index === array.length - 1;
  }

  return (
    <div
      className={`lg-1400:h-${userData?.length < 4 ? "auto" : "[65vh]"} ${
        userData?.length === 1 ? "pb-3" : ""
      } border border-gray-400 border-opacity-50 rounded-lg overflow-auto scrollbar-hide mb-20 lg-1400:mb-1 shadow-md w-full`}
    >
      <div
        className={`w-full ${
          userData?.length > 1
            ? "border-b border-gray-400 border-opacity-50"
            : ""
        } `}
      >
        <div className="flex sticky top-0 bg-white w-full h-20 justify-between  border-b border-gray-400 border-opacity-50">
          <p className="flex ml-4 justify-center items-center text-gray-500">
            MEMBERS
          </p>
        </div>
        {userData?.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-lg">No members found</p>
          </div>
        ) : (
          <table className="table-fixed w-[95%] mx-auto">
            <thead className="border-b sticky top-20 bg-white border-gray-400 border-opacity-50 h-16">
              <tr>
                <th className="text-left timesheettitle">Members info</th>
                <th className="text-center timesheettitle">Today</th>
                <th className="text-center timesheettitle">This week</th>
              </tr>
            </thead>

            <tbody>
              {userData?.map((userDataItem, index) => (
                <tr
                  key={userDataItem._id}
                  className={`border-b ${
                    isLastElement(index, userData)
                      ? "border-white"
                      : "border-gray-400 border-opacity-50"
                  }`}
                >
                  <th className="flex space-x-3 items-center text-gray-700 font-thin h-16 overflow-auto">
                    <span
                      className={`rounded-full w-6 h-6 ${"hidden md-850:block"}`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Profile"
                          className="rounded-full w-full h-full"
                        />
                      ) : (
                        "Img"
                      )}
                    </span>
                    <span className="text-center timesheettext">
                      {userDataItem?.fullName}
                    </span>
                  </th>

                  <th className="space-x-3 text-center timesheettext">
                    <span className="">{userDataItem?.totalTimeToday}</span>
                    <span className=" text-[#7FCD91]">
                      {Math.max(userDataItem?.totalEfficiencyToday, 0)}%
                    </span>
                  </th>
                  <th className="space-x-3 text-center timesheettext">
                    <span className="">{userDataItem?.totalTimeThisWeek}</span>
                    <span className=" text-[#7FCD91]">
                      {Math.max(userDataItem?.totalEfficiencyThisWeek, 0)}%
                    </span>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Members;
