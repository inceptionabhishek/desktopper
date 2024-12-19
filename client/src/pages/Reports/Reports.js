import React, { useContext, useEffect, useState } from "react";
import "./Reports.css";
import PlanDetails from "../../components/PopUpBox/PlanDetails";
import TrialEndModal from "../../components/PopUpBox/TrialEndPopUp";
import ScreenshotsAndActivity from "../../components/Screenshots/ScreenshotsAndActivity";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ProjectContext } from "../../context/ProjectContext";
import { ReportContext } from "../../context/ReportContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Select from "react-select";

function Reports() {
  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState("");
  const [localUser, setLocalUser] = useState("");
  const [selectedMember, setSelectedMember] = useState("");

  const [loader, setLoader] = useState(false);
  const [reportsType, setReportsType] = useState("10min");

  const handleDateChange = (daysToAdd) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  const { workspaceMembers, isLoading: workspaceLoading } =
    useContext(WorkSpaceContext);
  const { projects, viewAllprojects, isLoading } = useContext(ProjectContext);
  const {
    getReportsWithDateAndUserIDandProjectId,
    getReportsByUserID,
    isLoading: reportLoading,
  } = useContext(ReportContext);

  const { getUserProjectsMembers, userProjectsMembersData, superAdmin } =
    useContext(UserContext);

  const {
    subscription,
    APIComplete,
    isMembersPossible,
    showTrialEndModal,
    isPlanDetailsVisible,
    setIsPlanDetailsVisible,
    setShowTrialEndModal,
    isLoading: paymentLoading,
    viewSubscription,
  } = useContext(PaymentContext);

  useEffect(() => {
    setIsPlanDetailsVisible(false);

    setLocalUser(user);
    setSelectedMember(user?.userId);
    getUserProjectsMembers(user?.userId, user?.workspaceId);

    if (superAdmin?.email && workspaceMembers.length > 0) {
      viewSubscription(superAdmin?.email, workspaceMembers);
    }
  }, []);

  useEffect(() => {
    if (selectedMember) {
      viewAllprojects(selectedMember, user?.userId);
    }
  }, [selectedMember]);
  const getOptionsForProject = (project) => {
    const options = [];
    for (var i = 0; i < project.length; i++) {
      options.push({
        value: project[i].projectId,
        label: project[i].projectName,
      });
    }
    console.log("options", options);
    return options;
  };
  useEffect(() => {
    if (selectedMember && selectedProject !== "" && selectedDate) {
      getReportsWithDateAndUserIDandProjectId(
        selectedDate.toISOString().slice(0, 10),
        selectedMember,
        selectedProject
      );
    } else {
      if (selectedMember) {
        getReportsByUserID(
          selectedMember,
          user?.userId,
          selectedDate.toISOString().slice(0, 10)
        );
      }
    }
  }, [loader, projects, selectedProject, userProjectsMembersData]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="px-14 py-10">
        <div
          className={
            showTrialEndModal || isPlanDetailsVisible || !isMembersPossible
              ? "blur"
              : ""
          }
        >
          <h2 className="dashboard-container-heading pb-12">
            Screenshots and Activity
          </h2>
          <div className="flex space-x-4">
            <button
              className="p-2 border rounded border-gray-300 hover:bg-gray-200 focus:outline-none"
              onClick={() => {
                handleDateChange(-1);
                setLoader(!loader);
              }}
            >
              <BsChevronLeft />
            </button>
            <div className="relative">
              <input
                type="date"
                className="px-4 py-2 text-placeholder border rounded border-gray-300 focus:outline-none cursor-pointer"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  setLoader(!loader);
                }}
              />
            </div>
            <button
              className="p-2 border rounded border-gray-300 hover:bg-gray-200 focus:outline-none"
              onClick={() => {
                handleDateChange(1);
                setLoader(!loader);
              }}
            >
              <BsChevronRight />
            </button>
            <div className="flex-grow"></div>
            <div className="px-2 text-placeholder rounded-md  focus:outline-none border">
              <select
                className="px-2 py-2"
                onChange={(e) => {
                  setReportsType(e.target.value);
                }}
              >
                <option value="10min" selected>
                  Every 10 Min
                </option>
                <option value="all">All Reports</option>
              </select>
            </div>
            <div className="w-[20%] px-2 text-placeholder rounded-md  focus:outline-none border">
              <select
                style={{
                  width: "200px",
                }}
                className="px-2 py-2"
                onChange={(e) => {
                  setSelectedMember(e.target.value);
                  setLoader(!loader);
                }}
              >
                {localUser?.userRole === "admin" ? (
                  <>
                    {workspaceMembers?.map((member) => (
                      <option value={member.userId} key={member.userId}>
                        {member.fullName}
                      </option>
                    ))}
                  </>
                ) : localUser?.userRole === "user" ? (
                  <option
                    value={localUser?.userId}
                    defaultValue={localUser?.userId}
                  >
                    {localUser?.fullName}
                  </option>
                ) : (
                  <>
                    {userProjectsMembersData?.map((member) => (
                      <option value={member.userId} key={member.userId}>
                        {member.fullName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="w-[20%] px-2 text-placeholder rounded-md  focus:outline-none border">
              <select
                style={{
                  width: "200px",
                }}
                className="px-4 py-2"
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  setLoader(!loader);
                }}
              >
                <option value="" selected>
                  All
                </option>
                {projects?.map((project) => (
                  <option value={project.projectId} key={project.projectId}>
                    {project?.projectName?.length > 20
                      ? project?.projectName?.slice(0, 20) + "..."
                      : project?.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ScreenshotsAndActivity
            date={selectedDate}
            reportsType={reportsType}
            isLoading={isLoading}
            reportLoading={reportLoading}
            workspaceLoading={workspaceLoading}
            paymentLoading={paymentLoading}
            subscription={subscription}
            APIComplete={APIComplete}
          />
        </div>
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

export default Reports;
