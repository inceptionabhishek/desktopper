import Activity from "../../assets/Icons/Activity.svg";
import Clipboard from "../../assets/Icons/Clipboard.svg";
import Dashboard from "../../assets/Icons/Dashboard.svg";
import DashboardBlue from "../../assets/Icons/DashboardBlue.svg";
import People from "../../assets/Icons/People.svg";
import PeopleBlue from "../../assets/Icons/PeopleBlue.svg";
import ProejctBlue from "../../assets/Icons/ProejctBlue.svg";
import Project from "../../assets/Icons/Project.svg";
import ReportsBlue from "../../assets/Icons/ReportsBlue.svg";
import TimesheetBlue from "../../assets/Icons/TimesheetBlue.svg";
import LogoWhite from "../../assets/LogoWhite.svg";
import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const activeLinkStyles = "text-[#2F4C5F] bg-white";

  const isPathActive = (path) => location.pathname.startsWith(path);

  const sidebarArray = [
    {
      link: "/dashboard/dashboardScreen",
      image: Dashboard,
      title: "Dashboard",
    },
    {
      link: "/dashboard/timesheets",
      image: Clipboard,
      title: "Timesheets",
    },
    {
      link: "/dashboard/reports",
      image: Activity,
      title: "Activity",
    },
    {
      link: "/dashboard/projects",
      image: Project,
      title: "Projects",
    },
    {
      link: "/dashboard/people",
      image: People,
      title: "People",
    },
  ];

  return (
    <div className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[200px] overflow-y-auto text-center">
      <Link to="/dashboard/dashboardScreen">
        <div className="text-gray-100 text-xl mb-[3rem]">
          <div className="p-2.5 mt-1 flex items-center justify-center">
            <h1 className="text-2xl font-semibold text-center text-white logo">
              <img src={LogoWhite} alt="logo" className="w-[150px]" />
            </h1>
          </div>
        </div>
      </Link>

      {sidebarArray.map((item, index) => (
        <Link to={item?.link} key={index}>
          <div
            className={`${
              isPathActive(item?.link) ? activeLinkStyles : "text-white"
            } p-2.5 mt-3 flex items-center justify-start rounded-md px-4 duration-300 cursor-pointer navactive hover:bg-white hover:text-[#2F4C5F]`}
          >
            <img
              src={
                isPathActive(item?.link)
                  ? item?.image === Dashboard
                    ? DashboardBlue
                    : item?.image === Project
                    ? ProejctBlue
                    : item?.image === People
                    ? PeopleBlue
                    : item?.image === Activity
                    ? ReportsBlue
                    : item?.image === Clipboard
                    ? TimesheetBlue
                    : ""
                  : item?.image
              }
              className={`mr-[28px] `}
              alt="dashboard-icon"
            />
            <span className="text-[12px] font-bold">{item?.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;
