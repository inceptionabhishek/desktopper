import React, { Fragment, useContext, useState, useEffect } from "react";
import { BsDownload } from "react-icons/bs";
import "./TimeSheets.css";
import NoData from "../../assets/Icons/nodata.svg";
import Calender from "../../components/Calender/Calender";
import DropDownDynamic from "../../components/DropDown/DropDownDynamic";
import PlanDetails from "../../components/PopUpBox/PlanDetails";
import TrialEndModal from "../../components/PopUpBox/TrialEndPopUp";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ProjectContext } from "../../context/ProjectContext";
import { ReportContext } from "../../context/ReportContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import TableSheetSkeleton from "../../skeletonUi/TableSheetSkeleton";
import moment from "moment";

function generateDateDifference() {
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  const currentDate = new Date();
  const previousDate = new Date(currentDate.getTime() - millisecondsPerWeek);

  return [previousDate, currentDate];
}

function formatDate(inputDateString) {
  let date = new Date(inputDateString);

  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
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

  let dayOfWeek = weekdays[date.getDay()];
  let month = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;

  let formattedDate = `${dayOfWeek}, ${month} ${day}, ${year} ${hour}:${minute}:${second} ${ampm}`;
  return formattedDate;
}

function TimeSheets() {
  const [date, setDate] = useState(generateDateDifference());

  const { user } = useContext(AuthContext);
  const [selectedOptionForUser, setSelectedOptionForUser] = useState(user);
  const { projects, viewAllprojects, emptyProject } =
    useContext(ProjectContext);
  const [selectedOptionForProject, setSelectedOptionorProject] = useState("");

  const [isDownloading, setIsDownloading] = useState(false);
  const [hasMultipleDates, setHasMultipleDates] = useState(false);
  const [filteredReports, setFilteredReports] = useState([]);
  const { reports, getReports, isLoading, getAllWeeklyReports } =
    useContext(ReportContext);

  const {
    userData,
    allUserData,
    userProjectsMembersData,
    getUser,
    getAllUsers,
    getUserProjectsMembers,
    superAdmin,
  } = useContext(UserContext);

  const {
    APIComplete,
    isMembersPossible,
    showTrialEndModal,
    isPlanDetailsVisible,
    setIsPlanDetailsVisible,
    setShowTrialEndModal,
    viewSubscription,
  } = useContext(PaymentContext);

  const { workspaceMembers } = useContext(WorkSpaceContext);

  useEffect(() => {
    emptyProject();
    setIsPlanDetailsVisible(false);

    if (user.userRole === "admin") {
      getAllUsers(user?.workspaceId);
    } else if (user.userRole === "user") {
      getUser(user?.userId);
    } else {
      getUserProjectsMembers(user?.userId, user?.workspaceId);
    }

    if (superAdmin?.email && workspaceMembers.length > 0) {
      viewSubscription(superAdmin?.email, workspaceMembers);
    }
  }, []);

  useEffect(() => {
    // if manager login then there projects only able to view, else in admin/user case corresponding selected user project view
    viewAllprojects(selectedOptionForUser?.userId, user?.userId);
  }, [selectedOptionForUser]);

  useEffect(() => {
    if (
      selectedOptionForProject === "" ||
      selectedOptionForProject?.id === "all"
    ) {
      getAllWeeklyReports(
        selectedOptionForUser?.userId,
        user?.userId,
        formatDate(date[0]),
        formatDate(date[1])
      );
    } else {
      getReports(selectedOptionForProject?.projectId);
    }
  }, [selectedOptionForProject, date, selectedOptionForUser]);

  useEffect(() => {
    if (selectedOptionForProject !== null) {
      const filtered = reports.filter((report) => {
        const reportDate = new Date(report.startTime);
        return (
          reportDate >= date[0] &&
          reportDate <= date[1] &&
          selectedOptionForUser?.userId === report?.userId
        );
      });

      setFilteredReports(filtered);
    } else {
      const filtered = reports;
      setFilteredReports(filtered);
    }

    const dayOfMonthStart = date[0].getDate();
    const monthIndexStart = date[0].getMonth();
    const yearStart = date[0].getFullYear();

    const dayOfMonthEnd = date[1].getDate();
    const monthIndexEnd = date[1].getMonth();
    const yearEnd = date[1].getFullYear();

    if (
      dayOfMonthStart !== dayOfMonthEnd ||
      monthIndexStart !== monthIndexEnd ||
      yearStart !== yearEnd
    ) {
      setHasMultipleDates(true);
    } else {
      setHasMultipleDates(false);
    }
  }, [date, reports]);

  function formatTime(timeString) {
    const dateObj = new Date(timeString);
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${amPm}`;
  }

  function getTimeRange(startTime, endTime) {
    const formattedStartTime = formatTime(startTime);
    const formattedendTime = formatTime(endTime);

    return `${formattedStartTime} - ${formattedendTime}`;
  }

  function calculateDuration(startTimes, endTimes) {
    const startTime = moment(startTimes, "dddd, MMM D, YYYY, h:mm:ss A");
    const endTime = moment(endTimes, "dddd, MMM D, YYYY, h:mm:ss A");

    const duration = moment.duration(endTime.diff(startTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return `${hours}:${minutes}:${seconds}`;
  }

  function downloadCSV() {
    setIsDownloading(true);
    let csvContent = "Date,Project,Task,Activity,Duration,Time\n"; // Header row

    filteredReports.forEach((report) => {
      const { date, projectName, taskName, efficiency, startTime, endTime } =
        report;
      const duration = calculateDuration(startTime, endTime);
      const timeRange = getTimeRange(startTime, endTime);
      csvContent += `"${date}","${projectName}","${taskName}","${efficiency}","${duration}","${timeRange}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "timesheets.csv");
    document.body.appendChild(link);
    link.click();
    setIsDownloading(false);
  }

  function isLastElement(index, array) {
    return index === array.length - 1;
  }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div
        className={`px-14 py-10 ${
          showTrialEndModal || isPlanDetailsVisible || !isMembersPossible
            ? "blur"
            : ""
        }`}
      >
        <Fragment>
          <h2 className="relative z-[-1] dashboard-container-heading pb-12">
            Timesheet
          </h2>
          <div className="relative z-[0] grid md-1084:grid-cols-2 grid-cols-1 md-1084:gap-0 gap-10 justify-start items-end">
            <Fragment>
              <div className="calendar-container w">
                <Fragment>
                  <Calender date={date} setDate={setDate} />
                </Fragment>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 md:gap-60 sm:gap-10 gap-10 justify-self-center items-end w-full md-1084:mr-20">
                <DropDownDynamic
                  data={
                    user?.userRole === "admin"
                      ? allUserData
                      : user?.userRole === "user"
                      ? userData
                      : userProjectsMembersData
                  }
                  selectedOption={selectedOptionForUser}
                  setSelectedOption={setSelectedOptionForUser}
                  option={selectedOptionForUser?.fullName}
                  placeholder={"Select"}
                  displayKey="fullName"
                />
                <DropDownDynamic
                  data={projects}
                  selectedOption={selectedOptionForProject}
                  setSelectedOption={setSelectedOptionorProject}
                  option={selectedOptionForProject?.projectName}
                  placeholder={"All"}
                  displayKey="projectName"
                  check="project"
                />

                <BsDownload
                  size={25}
                  className={`${
                    isDownloading ? "text-gray-500" : "text-blue-400"
                  } cursor-pointer md:justify-self-end justify-self-center mb-2 ml-2`}
                  onClick={downloadCSV}
                />
              </div>
            </Fragment>
          </div>
        </Fragment>
        {isLoading || APIComplete === false ? (
          <TableSheetSkeleton />
        ) : (
          <table className="table-fixed w-[100%] mt-10">
            <thead className="border-b-2 border-gray-500 border-opacity-40">
              <tr>
                {hasMultipleDates && (
                  <th className="text-start w-1/6 py-2">Date</th>
                )}
                <th className="text-start w-1/3 py-2">Project & Task</th>
                <th className="text-start w-1/6 py-2">Activity</th>
                <th className="text-start w-1/6 py-2">Duration</th>
                <th className="text-start w-1/6 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports?.reverse().map((report, index) => {
                if (selectedOptionForUser?.userId === report?.userId) {
                  return (
                    <tr
                      key={report._id}
                      className={`h-20 border-b ${
                        isLastElement(index, filteredReports)
                          ? "border-white"
                          : "border-gray-400 border-opacity-50"
                      }`}
                    >
                      {hasMultipleDates && (
                        <th className="text-start text-gray-500 font-thin w-1/6 py-2">
                          {report?.date}
                        </th>
                      )}
                      <th className="text-start w-1/3 py-2 overflow-auto scrollbar-hide">
                        <div>
                          <span className="text-md font-thin">
                            {report?.projectName}
                          </span>
                          <br />
                          <span className="text-gray-500 text-sm font-thin">
                            {report?.taskName}
                          </span>
                        </div>
                      </th>

                      <th className="text-start text-gray-500 font-thin w-1/6 py-2">
                        {Math.floor(
                          report?.efficiency
                            ? Math.max(report?.efficiency, 0)
                            : 0
                        )}
                        %
                      </th>
                      <th className="text-start text-gray-500 font-thin w-1/6 py-2">
                        {calculateDuration(report?.startTime, report?.endTime)}
                      </th>
                      <th className="text-start text-gray-500 font-thin w-1/6 py-2">
                        {getTimeRange(report?.startTime, report?.endTime)}
                      </th>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        )}
        {filteredReports.length === 0 && !isLoading && (
          <div className="w-full flex justify-center">
            <img
              src={NoData}
              style={{ width: "50%", height: "50%" }}
              alt="no data"
            />
          </div>
        )}
      </div>
      {showTrialEndModal && (
        <TrialEndModal
          setShowTrialEndModal={setShowTrialEndModal}
          isMembersPossible={isMembersPossible}
          setIsPlanDetailsVisible={setIsPlanDetailsVisible}
        />
      )}
      {isPlanDetailsVisible && (
        <PlanDetails
          setIsPlanDetailsVisible={setIsPlanDetailsVisible}
          isfromHome={true}
          setShowTrialEndModal={setShowTrialEndModal}
        />
      )}
    </>
  );
}

export default TimeSheets;
