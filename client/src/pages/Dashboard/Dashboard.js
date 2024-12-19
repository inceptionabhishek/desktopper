import React, { useContext, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import DashboardScreen from "../DashboardScreen/DashboardScreen";
import MyTickets from "../MyTickets/MyTickets";
import People from "../People/People";
import NewProfile from "../Profile/NewProfile";
import Projects from "../Projects/Projects";
import ProjectsDetails from "../Projects/ProjectsDetails/ProjectsDetails";
import Reports from "../Reports/Reports";
import Setting from "../Setting/Setting";
import TimeSheets from "../TimeSheets/TimeSheets";
import Support from "../support/support";
import { Route, Routes, useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.userRole === "pending" || user.approvalStatus === false) {
      navigate("/invite-screen");
    }
  }, [user]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Sidebar />
      <div className="ml-[200px]">
        <Routes>
          <Route path="/dashboardScreen" Component={DashboardScreen} />
          <Route path="/people" Component={People} />
          <Route path="/setting" Component={Setting} />
          <Route path="/projects" Component={Projects} />
          <Route path="/timesheets" Component={TimeSheets} />
          <Route path="/projects/:projectid" Component={ProjectsDetails} />
          <Route path="/people/profile/:profileId" Component={NewProfile} />
          <Route path="/profile/:profileId" Component={NewProfile} />
          <Route path="/reports" Component={Reports} />
          <Route path="/my-tickets" Component={MyTickets} />
          <Route path="/support" Component={Support} />
        </Routes>
      </div>
    </>
  );
}

export default Dashboard;
