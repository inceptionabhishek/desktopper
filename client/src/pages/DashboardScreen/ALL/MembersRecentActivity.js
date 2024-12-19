import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MembersRecentActivity = ({
  reportData,
  setModal,
  setSelectedScreenshot,
  setScreenshotData,
}) => {
  const [usersWithRecentScreenshots, setUsersWithRecentScreenshots] = useState(
    []
  );

  const imageUrl = require("../../../assets/Icons/UserIcon.png");

  function areAllScreenshotsEmpty(usersWithRecentScreenshots) {
    for (const user of usersWithRecentScreenshots) {
      if (user.screenshots.length !== 0) {
        return false; // If any user's screenshots array is not empty, return false
      }
    }
    return true; // If all users' screenshots arrays are empty, return true
  }

  useEffect(() => {
    const sortedReportData = reportData.sort((a, b) => {
      const aEndTime = new Date(a.endTime).getTime();
      const bEndTime = new Date(b.endTime).getTime();
      return bEndTime - aEndTime;
    });

    setUsersWithRecentScreenshots(getRecent3Screenshots(sortedReportData));
  }, []);

  const getRecent3Screenshots = (reports) => {
    const screenshotsPerUser = {};

    reports.forEach((report) => {
      console.log(report);
      const { userId, memberName, screenshot, efficiency, projectName } =
        report;

      if (!screenshotsPerUser[userId]) {
        screenshotsPerUser[userId] = {
          userId,
          memberName,
          screenshots: [],
        };
      }

      // for (let i = 0; i < Math.min(3, screenshot.length); i++) {
      //   screenshotsPerUser[userId].screenshots.push(screenshot[i]);
      // }

      for (let i = 0; i < Math.min(3, screenshot.length); i++) {
        const screenshotObj = {
          screenshot: screenshot[i],
          efficiency: efficiency,
          projectName: projectName,
        };

        screenshotsPerUser[userId].screenshots.push(screenshotObj);
      }
    });

    const usersWithRecentScreenshots = Object.values(screenshotsPerUser);

    return usersWithRecentScreenshots;
  };
  const getCircleColor = (efficiency) => {
    if (efficiency <= 20) {
      return "#FF6969";
    } else if (efficiency <= 70) {
      return "#EE9322";
    } else {
      return "#79AC78";
    }
  };
  return (
    <div
      className={`border h-[auto] ${
        areAllScreenshotsEmpty(usersWithRecentScreenshots)
          ? "lg-1400:h-auto"
          : "lg-1400:h-[65vh]"
      } sticky top-0 bg-white border-gray-400 border-opacity-50 rounded-lg overflow-auto scrollbar-hide mb-1 shadow-md w-full`}
    >
      <div className="flex sticky top-0 bg-white w-full h-20 z-[1] justify-between border-b border-gray-400 border-opacity-50">
        <p className="flex ml-4 justify-center items-center text-gray-500 font-medium">
          RECENT ACTIVITY
        </p>
        <Link
          to="/dashboard/reports"
          className="flex mr-4 justify-center items-center text-blue-400 cursor-pointer hover:text-blue-500 font-medium"
        >
          View Activity
        </Link>
      </div>
      {areAllScreenshotsEmpty(usersWithRecentScreenshots) ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">No recent activity</p>
        </div>
      ) : (
        <>
          {usersWithRecentScreenshots?.map(
            (user, index) =>
              user?.screenshots &&
              user?.screenshots?.length > 0 && (
                <div key={index} className="px-4">
                  <div className="flex flex-row items-center justify-between h-20">
                    <div
                      key={user?.userId}
                      className="flex flex-row items-center space-x-4"
                    >
                      <div className="rounded-full w-6 h-6">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Profile"
                            className="rounded-full"
                          />
                        ) : (
                          "Img"
                        )}
                      </div>
                      <h3 className="items-center timesheettext">
                        {user?.memberName}
                      </h3>
                    </div>
                    <Link
                      to="/dashboard/reports"
                      className="flex justify-center items-center text-blue-400 cursor-pointer hover:text-blue-500"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      view all
                    </Link>
                  </div>
                  <ul
                    className={`flex flex-row ${
                      user?.screenshots?.length > 3
                        ? "justify-between"
                        : "gap-6.5"
                    }`}
                  >
                    {user?.screenshots?.slice(0, 3).map(
                      (item, index) =>
                        item && ( // Add a check for a valid screenshot
                          <li key={index} className="w-[30%] p-2">
                            <div
                              className="relative overflow-visible hover:cursor-pointer"
                              onClick={() => {
                                setModal(true);
                                setSelectedScreenshot(
                                  item?.screenshot?.screenshotUrl
                                );
                                setScreenshotData({
                                  projectName: item?.screenshot?.projectName,
                                  screenshotTime:
                                    item?.screenshot?.screenshotTime,
                                  efficiency: item?.efficiency,
                                });
                              }}
                            >
                              <img
                                src={item?.screenshot?.screenshotUrl}
                                alt={`Screenshot ${index + 1}`}
                              />
                              <div
                                className="absolute  rounded-full w-6 h-6 text-white text-xs flex items-center justify-center"
                                style={{
                                  top: "-0.5rem",
                                  right: "-0.5rem",
                                  backgroundColor: getCircleColor(
                                    Math.floor(
                                      item?.efficiency > 0
                                        ? item?.efficiency
                                        : 0
                                    )
                                  ),
                                }}
                              >
                                {Math.floor(Math.max(item?.efficiency, 0))}
                              </div>
                            </div>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )
          )}
        </>
      )}
    </div>
  );
};

export default MembersRecentActivity;
