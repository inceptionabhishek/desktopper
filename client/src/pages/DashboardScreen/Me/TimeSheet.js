import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { ReportContext } from "../../../context/ReportContext";
import "../DashboardScreen.css";

const TimeSheet = ({
  setTotalTimeWorkedToday,
  setTotalTimeWorkedThisWeek,
  setAverageEfficiencyToday,
  setAverageEfficiencyThisWeek,
}) => {
  const { allReports } = useContext(ReportContext);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const difference = dayOfWeek === 0 ? -6 : 1; // If Sunday, go back 6 days to get to Monday; otherwise, go back 1 day.

    thisWeekStart.setDate(today.getDate() - dayOfWeek + difference);

    const todayReports = allReports.filter(
      (report) => new Date(report?.date) >= today
    );

    const thisWeekReports = allReports.filter(
      (report) => new Date(report?.date) >= thisWeekStart
    );

    setTotalTimeWorkedToday(calculateTotalDuration(todayReports));
    setTotalTimeWorkedThisWeek(calculateTotalDuration(thisWeekReports));

    setAverageEfficiencyToday(calculateAverageEfficiency(todayReports));
    setAverageEfficiencyThisWeek(calculateAverageEfficiency(thisWeekReports));
  }, [allReports]);

  const calculateTotalDuration = (reports) => {
    const totalSeconds = reports.reduce((total, report) => {
      const startTime = moment(
        report?.startTime,
        "dddd, MMM D, YYYY, h:mm:ss A"
      );
      const endTime = moment(report?.endTime, "dddd, MMM D, YYYY, h:mm:ss A");

      const duration = moment.duration(endTime.diff(startTime));
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      return total + hours * 3600 + minutes * 60 + seconds;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const calculateAverageEfficiency = (reports) => {
    if (reports.length === 0) return 0;

    let totalTimeTrackedInMillis = 0;
    let totalIdleTimeInSeconds = 0;

    reports.forEach((report) => {
      totalTimeTrackedInMillis += parseFloat(
        report?.timeTracked ? report.timeTracked : 0
      );
      totalIdleTimeInSeconds += parseFloat(
        report?.idleTime ? report.idleTime : 0
      );
    });

    const totalEfficiencyValue =
      totalTimeTrackedInMillis !== 0
        ? ((totalTimeTrackedInMillis - totalIdleTimeInSeconds * 1000) /
            totalTimeTrackedInMillis) *
          100
        : 0;

    return Math.floor(totalEfficiencyValue);
  };

  function calculateDuration(startTimes, endTimes) {
    const startTime = moment(startTimes, "dddd, MMM D, YYYY, h:mm:ss A");
    const endTime = moment(endTimes, "dddd, MMM D, YYYY, h:mm:ss A");

    const duration = moment.duration(endTime.diff(startTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${hours}:${minutes}:${seconds}`;
  }

  function isLastElement(index, array) {
    return index === array.length - 1;
  }

  return (
    <>
      <div
        className={`w-full ${
          allReports?.length < 9 ? "lg-1400:h-auto" : "lg-1400:h-[100vh]"
        } ${
          allReports?.length < 5 ? "h-auto" : "h-[80vh]"
        } border border-gray-400 border-opacity-50 rounded-lg overflow-scroll scrollbar-hide mb-2 lg-1400:mb-1 shadow-md`}
      >
        <div className=" flex sticky z-[0] top-0 bg-white w-full h-20 justify-between border-b border-gray-400 border-opacity-50">
          <p className="flex ml-4  justify-center items-center text-gray-500 font-medium">
            TIMESHEETS
          </p>
          <Link
            to="/dashboard/timesheets"
            className="flex mr-4 justify-center items-center text-blue-400 cursor-pointer hover:text-blue-500 font-medium"
          >
            View Timesheet
          </Link>
        </div>

        {allReports?.length === 0 ? (
          <div className="w-full h-40 flex justify-center items-center">
            <p className="text-gray-500 text-lg">No records found</p>
          </div>
        ) : (
          <table className="table-fixed w-[95%] mx-auto">
            <thead className="sm:text-md sticky top-20 bg-white w-full h-16 border-b border-gray-400 border-opacity-50">
              <tr>
                <th className="text-center timesheettitle">Project</th>
                <th className="text-center timesheettitle">Date</th>
                <th className="text-center timesheettitle">Start Time</th>
                <th className="text-center timesheettitle">Stop Time</th>
                <th className="text-center timesheettitle">Duration</th>
              </tr>
            </thead>

            <tbody>
              {allReports?.slice(0, 15).map((report, index) => (
                <tr
                  key={report._id}
                  className={`h-16 border-b ${
                    isLastElement(index, allReports)
                      ? "border-white"
                      : "border-gray-400 border-opacity-50"
                  }`}
                >
                  <th className="text-center timesheettext overflow-auto scrollbar-hide">
                    {report?.projectName}
                  </th>

                  <th className="text-center timesheettext">
                    {moment(report?.date).format("ddd, MMMM D, YYYY")}
                  </th>
                  <th className="text-center timesheettext">
                    {moment(report?.startTime).format("h.mm a")}
                  </th>
                  <th className="text-center timesheettext">
                    {moment(report?.endTime).format("h.mm a")}
                  </th>
                  <th className="text-center timesheettext">
                    {calculateDuration(report?.startTime, report?.endTime)}
                    {/* {moment.duration(report?.endTime.diff(report?.startTime))} */}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TimeSheet;
