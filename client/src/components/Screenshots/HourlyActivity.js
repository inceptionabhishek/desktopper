import ActivitySkeleton from "../../skeletonUi/ActivitySkeleton";
import React, { useState, useEffect } from "react";


const construDate = (date, timeString) => {
  // Parse the given date string
  const parsedDate = new Date(date);

  // Parse the given time string
  const [hours, minutes] = timeString.split(":");
  const isAM = timeString.endsWith("AM");

  // Convert hours to 24-hour format
  let parsedHours = parseInt(hours, 10);
  if (!isAM && parsedHours !== 12) {
    parsedHours += 12;
  }

  // Set the time components in the current date
  parsedDate.setHours(parsedHours);
  parsedDate.setMinutes(parseInt(minutes, 10));
  parsedDate.setSeconds(0); // You can set seconds as needed

  // Format the date in the desired format (24-hour time)
  const formattedDate =
    parsedDate.toDateString() +
    " " +
    parsedDate.getHours().toString().padStart(2, "0") +
    ":" +
    parsedDate.getMinutes().toString().padStart(2, "0");

  return formattedDate;
};
const formatTime = (timeString) => {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes
    .toString()
    .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
  return formattedTime;
};
const formatTimeFromMilliseconds = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
function convertTo24HourFormat(time12) {
  const [time, period] = time12.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let hours24 = hours;
  if (period === "PM" && hours !== 12) {
    hours24 += 12;
  } else if (period === "AM" && hours === 12) {
    hours24 = 0;
  }

  return new Date(0, 0, 0, hours24, minutes);
}
function generateSixIntervals(interval) {
  const [startStr] = interval.split(" - ");
  const startTime = convertTo24HourFormat(startStr);
  const intervals = [];
  const intervalDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

  for (let i = 0; i < 6; i++) {
    const intervalStart = new Date(startTime.getTime() + i * intervalDuration);
    const intervalEnd = new Date(intervalStart.getTime() + intervalDuration);
    intervals.push(`${formatTime(intervalStart)} - ${formatTime(intervalEnd)}`);
  }
  return intervals;
}

const HourlyActivity = ({
  date,
  reports,
  setModal,
  setSelectedScreenshot,
  reportsType,
  isLoading,
  reportLoading,
  workspaceLoading,
  paymentLoading,
  subscription,
  APIComplete,
  setScreenshotData,
}) => {
  const [newArray, setnewArray] = useState([]);

  const [formatedDate, setFormatedDate] = useState([]);

  useEffect(() => {
    const data = [];
    reports.forEach((report) => {
      if (report?.screenshot.length === 0) {
        data.push({
          screenshotUrl: null,
          screenshotTime: report.startTime,
          taskName: report.taskName,
          projectName: report.projectName,
          efficiency: report.efficiency,
        });
      } else {
        report.screenshot.forEach((screenshotObj) => {
          data.push({
            screenshotUrl: screenshotObj.screenshotUrl,
            screenshotTime: screenshotObj.screenshotTime,
            taskName: report.taskName,
            projectName: report.projectName,
            efficiency: report.efficiency,
          });
        });
      }
    });
    setnewArray(data);
  }, [reports]);

  useEffect(() => {
    if (newArray.length > 0) {
      const formattedTimePeriods = newArray.map((obj) => {
        const screenshotTime = new Date(obj.screenshotTime);
        const hour = screenshotTime.getHours();
        const periodStart = new Date(obj.screenshotTime);
        periodStart.setHours(hour, 0, 0, 0);

        const formattedStart = periodStart.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        periodStart.setHours(hour + 1, 0, 0, 0);
        const formattedEnd = periodStart.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return `${formattedStart} - ${formattedEnd}`;
      });

      // Create a Set to store unique formatted time periods
      const uniqueFormattedTimePeriodsSet = new Set(formattedTimePeriods);

      setFormatedDate([...uniqueFormattedTimePeriodsSet]);
    } else {
      setFormatedDate([]);
    }
  }, [newArray]);

  return (
    <>
      {reportsType === "all" ? (
        <>
          {isLoading ||
          reportLoading ||
          workspaceLoading ||
          paymentLoading ||
          subscription?.length === 0 ||
          APIComplete === false ? (
            <ActivitySkeleton />
          ) : (
            <div className="mt-4">
              {reports?.map((report) => {
                return (
                  <>
                    <div className="relative sm:pl-2 py-6 group">
                      <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[0.5em] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[0.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                        <div className="text-xl font-bold text-slate-900">
                          <div className="flex ">
                            <h1 className="text-sm mx-4 mt-1 text-gray-800">
                              {formatTime(report.startTime)}-
                              {formatTime(report.endTime)}
                            </h1>
                            <h1 className="text-sm mx-4 mt-1 text-gray-800">
                              Time worked -
                              {formatTimeFromMilliseconds(report.timeTracked)}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {report?.screenshot.length > 0 ? (
                          report?.screenshot?.map((screenshot) => {
                            return (
                              <div
                                className="card"
                                key={screenshot?._id}
                                style={{ width: "200px" }}
                              >
                                <div className="flex flex-col gap-3 justify-center align-top w-full">
                                  <div
                                    className="relative flex items-center justify-center w-fit text-center mx-auto h-4 rounded-[4px] bg-[#234B870D] overflow-hidden whitespace-nowrap text-ellipsis"
                                    style={{
                                      height: "24px",
                                      padding: "4px",
                                    }}
                                  >
                                    {report.projectName}
                                  </div>
                                  <div
                                    className="flex items-center justify-center mb-2 overflow-hidden whitespace-nowrap text-ellipsis"
                                    style={{
                                      color: "#808080",
                                      fontSize: "11px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {report.taskName}
                                  </div>
                                </div>
                                <img
                                  src={screenshot?.screenshotUrl}
                                  alt="sample"
                                  onClick={() => {
                                    setModal(true);
                                    setSelectedScreenshot(
                                      screenshot?.screenshotUrl
                                    );
                                    setScreenshotData({
                                      projectName: report.projectName,
                                      screenshotTime:
                                        screenshot?.screenshotTime,
                                      efficiency: report.efficiency,
                                    });
                                  }}
                                />
                                <div className="content">
                                  <div className="left-text">
                                    {formatTime(report.startTime)}-
                                    {formatTime(report.endTime)}
                                  </div>
                                  <div
                                    className={`${
                                      report?.efficiency < 20
                                        ? "text-red-500"
                                        : report?.efficiency < 70
                                        ? "text-orange-500"
                                        : "text-green-500"
                                    } right-text`}
                                  >
                                    {Math.max(report?.efficiency, 0)}%
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="card" style={{ width: "200px" }}>
                            <div className="flex flex-col gap-3 justify-center align-top w-full">
                              <div
                                className="relative flex items-center justify-center w-fit text-center mx-auto h-4 rounded-[4px] bg-[#234B870D] overflow-hidden whitespace-nowrap text-ellipsis"
                                style={{
                                  height: "24px",
                                  padding: "4px",
                                }}
                              >
                                {report.projectName}
                              </div>
                              <div
                                className="items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                style={{
                                  color: "#808080",
                                  fontSize: "11px",
                                  fontWeight: "500",
                                }}
                              >
                                {report.taskName}
                              </div>
                            </div>
                            <div className="noascreenshotcard">
                              <p>No Screenshot</p>
                            </div>
                            <div className="content">
                              <div className="left-text">
                                {formatTime(report.startTime)}-
                                {formatTime(report.endTime)}
                              </div>
                              <div
                                className={`${
                                  report?.efficiency < 20
                                    ? "text-red-500"
                                    : report?.efficiency < 70
                                    ? "text-orange-500"
                                    : "text-green-500"
                                } right-text`}
                              >
                                {Math.max(report?.efficiency, 0)}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          {isLoading ||
          paymentLoading ||
          subscription?.length === 0 ||
          APIComplete === false ? (
            <ActivitySkeleton />
          ) : (
            <div className="mt-4">
              {formatedDate.length > 0 &&
                formatedDate.map((hourRange) => (
                  <div key={hourRange} className="relative sm:pl-2 py-6 group">
                    <div className="flex flex-col sm:flex-row  mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[0.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[0.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                      <div className="text-xl font-bold text-slate-900">
                        <div className="flex">
                          <h1 className="text-sm mx-4 mt-1 text-gray-800">
                            {hourRange}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {newArray.length > 0 &&
                        generateSixIntervals(hourRange).map((interval) => {
                          const intervalParts = interval.split(" - ");
                          const intervalStart = new Date(
                            construDate(date, intervalParts[0])
                          );
                          const intervalEnd = new Date(
                            construDate(date, intervalParts[1])
                          );
                          let screenshotsInInterval = newArray.find(
                            (report) => {
                              if (report?.screenshotTime) {
                                const screenShotTiming = new Date(
                                  report?.screenshotTime
                                );
                                if (
                                  screenShotTiming >= intervalStart &&
                                  screenShotTiming <= intervalEnd
                                ) {
                                  return report;
                                }
                              }
                            }
                          );

                          return (
                            <>
                              {screenshotsInInterval ? (
                                <div
                                  className="card"
                                  key={interval}
                                  style={{ width: "100%" }}
                                >
                                  <div className="flex flex-col gap-3 justify-center align-top w-full my-2">
                                    <div
                                      className="relative flex items-center justify-center w-fit text-center mx-auto h-4 rounded-[4px] bg-[#234B870D] overflow-hidden whitespace-nowrap text-ellipsis"
                                      style={{
                                        height: "24px",
                                        padding: "4px",
                                      }}
                                    >
                                      {screenshotsInInterval?.projectName}
                                    </div>
                                    <div
                                      className="flex justify-center items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                      style={{
                                        color: "#808080",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {screenshotsInInterval?.taskName}
                                    </div>
                                  </div>
                                  <div>
                                    {screenshotsInInterval?.screenshotUrl !==
                                    null ? (
                                      <img
                                        className="px-1"
                                        src={
                                          screenshotsInInterval?.screenshotUrl
                                        }
                                        alt={`Screenshot`}
                                        onClick={() => {
                                          setModal(true);
                                          setSelectedScreenshot(
                                            screenshotsInInterval?.screenshotUrl
                                          );
                                          setScreenshotData({
                                            projectName:
                                              screenshotsInInterval?.projectName,
                                            screenshotTime:
                                              screenshotsInInterval?.screenshotTime,
                                            efficiency:
                                              screenshotsInInterval?.efficiency,
                                          });
                                        }}
                                      />
                                    ) : (
                                      <div className="noascreenshotcard">
                                        <p>No Screenshot</p>
                                      </div>
                                    )}

                                    <div className="content">
                                      <div className="left-text">
                                        {interval}
                                      </div>
                                      <div
                                        className={`${
                                          screenshotsInInterval?.efficiency < 20
                                            ? "text-red-500"
                                            : screenshotsInInterval?.efficiency <
                                              70
                                            ? "text-orange-500"
                                            : "text-green-500"
                                        } right-text`}
                                      >
                                        {Math.max(
                                          screenshotsInInterval?.efficiency,
                                          0
                                        )}
                                        %
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="noactivitycard">
                                  <p>No Activity</p>
                                </div>
                              )}
                            </>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HourlyActivity;