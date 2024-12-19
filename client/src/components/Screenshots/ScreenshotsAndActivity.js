import NoData from "../../assets/Icons/nodata.svg";
import { ReportContext } from "../../context/ReportContext";
import HourlyActivity from "./HourlyActivity";
import ScreenshotModal from "./ScreenshotModal";
import React, { useState, useContext } from "react";

function ScreenshotsAndActivity({
  date,
  reportsType,
  isLoading,
  reportLoading,
  workspaceLoading,
  paymentLoading,
  subscription,
  APIComplete,
}) {
  const [modal, setModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotData, setScreenshotData] = useState(null);
  const { memberReportsWithUserIdProjectId } = useContext(ReportContext);
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
  const getTotalReportTimeRecorded = () => {
    let totalMilliseconds = 0;
    memberReportsWithUserIdProjectId?.forEach((report) => {
      totalMilliseconds += report.timeTracked;
    });
    return formatTimeFromMilliseconds(totalMilliseconds);
  };

  const convertDate = (dateString) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const inputDate = new Date(dateString);

    const dayOfWeek = inputDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const month = months[inputDate.getMonth()];
    const day = inputDate.getDate();
    const year = inputDate.getFullYear();

    const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;
    return formattedDate;
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

  return (
    <div>
      {modal && (
        <ScreenshotModal
          screenshot={selectedScreenshot}
          setModal={setModal}
          modal={modal}
          screenshotData={screenshotData}
        />
      )}
      <div
        className="flex mt-6 space-x-4"
        style={{ color: "#4B4B4B", fontWeight: "600" }}
      >
        <h1 className="text">{convertDate(date)}</h1>
        {memberReportsWithUserIdProjectId?.length > 0 ? (
          <h1 className="text">
            Time recorded - {getTotalReportTimeRecorded()}
          </h1>
        ) : (
          <h1 className="text">Time recorded - 0:00:00</h1>
        )}
        {memberReportsWithUserIdProjectId?.length > 0 ? (
          <h1 className="text">
            Activity -{" "}
            {Math.max(
              calculateAverageEfficiency(memberReportsWithUserIdProjectId),
              0
            )}
            %
          </h1>
        ) : (
          <h1 className="text">Activity - 0%</h1>
        )}
      </div>
      {memberReportsWithUserIdProjectId?.length === 0 &&
        (!isLoading || !reportLoading || !workspaceLoading) && (
          <div className="w-full flex justify-center">
            <img
              src={NoData}
              style={{ width: "50%", height: "50%" }}
              alt="no data"
            />
          </div>
        )}
      <HourlyActivity
        date={date}
        reports={memberReportsWithUserIdProjectId}
        setModal={setModal}
        setSelectedScreenshot={setSelectedScreenshot}
        reportsType={reportsType}
        isLoading={isLoading}
        reportLoading={reportLoading}
        workspaceLoading={workspaceLoading}
        paymentLoading={paymentLoading}
        subscription={subscription}
        APIComplete={APIComplete}
        setScreenshotData={setScreenshotData}
      />
    </div>
  );
}

export default ScreenshotsAndActivity;
