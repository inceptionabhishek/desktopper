import PlanDetails from "../../components/PopUpBox/PlanDetails";
import TrialEndModal from "../../components/PopUpBox/TrialEndPopUp";
import ScreenshotModal from "../../components/Screenshots/ScreenshotModal";
import TextBox from "../../components/TextBox/TextBox";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ReportContext } from "../../context/ReportContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import DashboardSkeleton from "../../skeletonUi/DashboardSkeleton";
import Members from "./ALL/Members";
import MembersRecentActivity from "./ALL/MembersRecentActivity";
import RecentActivity from "./Me/RecentActivity";
import TimeSheet from "./Me/TimeSheet";
import Todo from "./Me/Todo";
import React, { useContext, useState, useEffect } from "react";

const DashboardScreen = () => {
  const { isPlanDetailsVisible, setIsPlanDetailsVisible } =
    useContext(PaymentContext);
  const [activeTab, setactiveTab] = useState(true);
  const [totalTimeWorkedToday, setTotalTimeWorkedToday] = useState("00:00:00");
  const [totalTimeWorkedThisWeek, setTotalTimeWorkedThisWeek] =
    useState("00:00:00");
  const [averageEfficiencyToday, setAverageEfficiencyToday] = useState(0);
  const [averageEfficiencyThisWeek, setAverageEfficiencyThisWeek] = useState(0);

  const [totalTimeWorkedTodayByAll, setTotalTimeWorkedTodayByAll] =
    useState("00:00:00");
  const [totalTimeWorkedThisWeekByAll, setTotalTimeWorkedThisWeekByAll] =
    useState("00:00:00");
  const [averageEfficiencyTodayByAll, setAverageEfficiencyTodayByAll] =
    useState(0);
  const [averageEfficiencyThisWeekByAll, setAverageEfficiencyThisWeekByAll] =
    useState(0);

  const [modal, setModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [screenshotData, setScreenshotData] = useState(null);
  const { user } = useContext(AuthContext);

  const {
    allUserReports,
    getAllUserReports,
    membersReports,
    getMembersReports,
  } = useContext(ReportContext);

  const {
    allUserData,
    userProjectsMembersData,
    getAllUsers,
    getUserProjectsMembers,
    superAdmin,
  } = useContext(UserContext);

  const {
    subscription,
    isLoading,
    APIComplete,
    isMembersPossible,
    showTrialEndModal,
    setShowTrialEndModal,
    viewSubscription,
  } = useContext(PaymentContext);

  const { workspaceMembers } = useContext(WorkSpaceContext);

  useEffect(() => {
    setIsPlanDetailsVisible(false);

    if (user.userRole === "admin") {
      getAllUsers(user?.workspaceId);
    } else if (user.userRole === "manager") {
      getUserProjectsMembers(user?.userId);
    }
    getAllUserReports(user?.workspaceId);
    if (superAdmin?.email && workspaceMembers.length > 0) {
      viewSubscription(superAdmin?.email, workspaceMembers);
    }
  }, []);

  useEffect(() => {
    getMembersReports(user?.userId);
  }, [userProjectsMembersData]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <div className="p-6 px-10">
        {modal && (
          <ScreenshotModal
            screenshot={selectedScreenshot}
            setModal={setModal}
            modal={modal}
            screenshotData={screenshotData}
          />
        )}

        <div
          className={
            showTrialEndModal || isPlanDetailsVisible || !isMembersPossible
              ? "blur"
              : ""
          }
        >
          {isLoading || subscription?.length === 0 || APIComplete === false ? (
            <DashboardSkeleton />
          ) : (
            <>
              <div className="flex flex-row">
                <button
                  onClick={() => setactiveTab(true)}
                  className={`tab ${activeTab === true ? "tab-active" : ""}`}
                >
                  ME
                </button>
                {user.userRole !== "user" && (
                  <button
                    onClick={() => setactiveTab(false)}
                    className={`tab ${activeTab === false ? "tab-active" : ""}`}
                  >
                    ALL
                  </button>
                )}
              </div>
              {activeTab && (
                <div className="flex flex-col">
                  <div className="relative flex flex-col md:flex-row lg-1400:space-x-6 pt-10 pb-10 justify-between items-start">
                    <TextBox
                      textColor="text-[#36454F]"
                      topLeftText="WORKED THIS WEEK"
                      middleText={totalTimeWorkedThisWeek}
                    />
                    <div className="ml-2 mr-2" />
                    <TextBox
                      textColor="text-[#36454F]"
                      topLeftText="WORKED TODAY"
                      middleText={totalTimeWorkedToday}
                    />
                    <div className="ml-2 mr-2" />
                    <TextBox
                      textColor="text-[#23AF00]"
                      topLeftText="WEEKLY ACTIVITY"
                      middleText={`${
                        averageEfficiencyThisWeek > 0
                          ? averageEfficiencyThisWeek
                          : 0
                      }`}
                    />
                    <div className="ml-2 mr-2" />
                    <TextBox
                      textColor="text-[#FC8800]"
                      topLeftText="TODAY'S ACTIVITY"
                      middleText={`${
                        averageEfficiencyToday > 0 ? averageEfficiencyToday : 0
                      }`}
                    />
                  </div>

                  <div className="flex flex-col lg-1400:flex-row lg-1400:justify-between lg-1400:space-x-10 items-start lg-1400:h-screen w-full">
                    <div className="flex w-full">
                      <TimeSheet
                        setTotalTimeWorkedToday={setTotalTimeWorkedToday}
                        setTotalTimeWorkedThisWeek={setTotalTimeWorkedThisWeek}
                        totalTimeWorkedToday={totalTimeWorkedToday}
                        totalTimeWorkedThisWeek={totalTimeWorkedThisWeek}
                        averageEfficiencyToday={averageEfficiencyToday}
                        setAverageEfficiencyToday={setAverageEfficiencyToday}
                        averageEfficiencyThisWeek={averageEfficiencyThisWeek}
                        setAverageEfficiencyThisWeek={
                          setAverageEfficiencyThisWeek
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-8 w-full mt-6 lg-1400:mt-0">
                      <RecentActivity
                        setModal={setModal}
                        setSelectedScreenshot={setSelectedScreenshot}
                        setScreenshotData={setScreenshotData}
                      />
                      <Todo />
                    </div>
                  </div>
                </div>
              )}
              {!activeTab && user.userRole !== "user" && (
                <div className="">
                  <div className="relative flex flex-col md:flex-row lg-1400:space-x-6 pt-10 pb-10 justify-between items-start">
                    <TextBox
                      textColor="text-[#36454F]"
                      topLeftText="WORKED THIS WEEK"
                      middleText={totalTimeWorkedThisWeekByAll}
                    />
                    <div className="ml-2 mr-2" />
                    <TextBox
                      textColor="text-[#36454F]"
                      topLeftText="WORKED TODAY"
                      middleText={totalTimeWorkedTodayByAll}
                    />
                    <div className="ml-2 mr-2" />
                    <TextBox
                      textColor="text-[#23AF00]"
                      topLeftText="WEEKLY ACTIVITY"
                      middleText={`${
                        averageEfficiencyThisWeekByAll > 0
                          ? averageEfficiencyThisWeekByAll
                          : 0
                      }`}
                    />
                    <div className="ml-2 mr-2" />
                    <TextBox
                      textColor="text-[#FC8800]"
                      topLeftText="TODAY'S ACTIVITY"
                      middleText={`${
                        averageEfficiencyTodayByAll > 0
                          ? averageEfficiencyTodayByAll
                          : 0
                      }`}
                    />
                  </div>
                  <div className="flex flex-col lg-1400:flex-row lg-1400:justify-between lg-1400:space-x-10 items-start lg-1400:h-screen w-full">
                    <div className="flex w-full">
                      <MembersRecentActivity
                        userData={
                          user.userRole === "admin"
                            ? allUserData
                            : userProjectsMembersData
                        }
                        reportData={
                          user.userRole === "admin"
                            ? allUserReports
                            : membersReports
                        }
                        setModal={setModal}
                        setSelectedScreenshot={setSelectedScreenshot}
                        setScreenshotData={setScreenshotData}
                      />
                    </div>
                    <div className="flex w-full mt-6 lg-1400:mt-0">
                      <Members
                        setTotalTimeWorkedTodayByAll={
                          setTotalTimeWorkedTodayByAll
                        }
                        setTotalTimeWorkedThisWeekByAll={
                          setTotalTimeWorkedThisWeekByAll
                        }
                        totalTimeWorkedTodayByAll={totalTimeWorkedTodayByAll}
                        totalTimeWorkedThisWeekByAll={
                          totalTimeWorkedThisWeekByAll
                        }
                        averageEfficiencyTodayByAll={
                          averageEfficiencyTodayByAll
                        }
                        setAverageEfficiencyTodayByAll={
                          setAverageEfficiencyTodayByAll
                        }
                        averageEfficiencyThisWeekByAll={
                          averageEfficiencyThisWeekByAll
                        }
                        setAverageEfficiencyThisWeekByAll={
                          setAverageEfficiencyThisWeekByAll
                        }
                        userData={
                          user.userRole === "admin"
                            ? allUserData
                            : userProjectsMembersData
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
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
};

export default DashboardScreen;
