import LogoBlack from "../../assets/LogoBlack.svg";
import LogoWhite from "../../assets/LogoWhite.svg";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ReportContext } from "../../context/ReportContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import DownloadDesktopAppPopup from "../PopUpBox/DownloadDesktopAppPopup";
import VerifyEmailPop from "../PopUpBox/VerifyEmailPop";
import { Menu, MenuItem } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, setUser, changeIsPopupShowedStatus } =
    useContext(AuthContext);
  const userMenuRef = useRef(null);
  const {
    changeWorkspace,
    workspaceId,
    setWorkspaceMember,
    setApprovalMember,
  } = useContext(WorkSpaceContext);
  const { setAllUserReports } = useContext(ReportContext);
  const { setSuperAdmin } = useContext(UserContext);
  const { setSubscription } = useContext(PaymentContext);

  const [isDownload, setIsDownload] = useState(false);
  const [VerifyEmailPopUp, setVerifyEmailPopUp] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleChangeWorkSpace = () => {
    changeWorkspace({
      workspaceId: workspaceId !== null ? workspaceId : user?.workspaceId,
      memberId: user?.userId,
    })
      .then(() => {
        localStorage.removeItem("team-hub-workspace");
        localStorage.setItem("team-hub-change-workspace", true);
        navigate("/create-workspace");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.err || "Member is not removed!");
      });
  };

  const handleOpenUserMenu = (event) => {
    setProfileClicked(true);
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setProfileClicked(false);
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (
      user?.isPopupShowed === false &&
      localStorage.getItem("team-hub-user")
    ) {
      const timeoutId = setTimeout(() => {
        setIsDownload(!isDownload);
        changeIsPopupShowedStatus(user?.email);
        clearInterval(intervalId);
      }, 300000);

      const intervalId = setInterval(() => {
        if (!localStorage.getItem("team-hub-user")) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
        }
      }, 200);

      // Set up the cleanup function to clear the interval when the component unmounts
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [localStorage.getItem("team-hub-user")]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorElUser && !anchorElUser.contains(event.target)) {
        setProfileClicked(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [anchorElUser]);

  let t = new URL(window.location.href);
  const leadOwner = t.searchParams.get("leadOwner");
  const leadSource = t.searchParams.get("leadSource");
  const mailId = t.searchParams.get("mailId");
  const email = t.searchParams.get("email");

  return (
    <>
      <div
        className={
          window.location.href.includes("dashboard") ||
          window.location.href.includes("success")
            ? `hidden`
            : ""
        }
      >
        <div className="navbar absolute w-full z-10 text-white">
          <div className="flex justify-between pt-15 px-16.125">
            <h1
              onClick={() => navigate("/")}
              className=" text-logo font-bold ml-10 cursor-pointer"
            >
              {window.location.href.includes("invite-workspace") ||
              window.location.href.includes("invite-screen") ? (
                <Link
                  to="https://www.desktopper.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  <img src={LogoBlack} alt="logo" />
                </Link>
              ) : (
                <Link
                  to={
                    user
                      ? "/dashboard/dashboardscreen"
                      : "https://www.desktopper.com/"
                  }
                  // target="_blank"
                  target={user ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                >
                  {" "}
                  <img src={LogoWhite} alt="logo" />
                </Link>
              )}
            </h1>
            <div className="flex flex-row items-start gap-5">
              {!user && (
                <NavLink
                  to={{
                    pathname: "/signup",
                    search: `${
                      leadOwner && leadSource && mailId && email
                        ? `?email=${email}&leadOwner=${leadOwner}&leadSource=${leadSource}&mailId=${mailId}`
                        : leadOwner && leadSource && mailId
                        ? `?leadOwner=${leadOwner}&leadSource=${leadSource}&mailId=${mailId}`
                        : ""
                    }`,
                  }}
                  className={({ isActive }) =>
                    `rounded-md ${isActive ? "bg-activenavbar" : ""} py-3 px-12`
                  }
                >
                  <button> Sign up</button>
                </NavLink>
              )}
              {!user && (
                <NavLink
                  to={{
                    pathname: "/login",
                    search: `${
                      leadOwner && leadSource && mailId && email
                        ? `?email=${email}&leadOwner=${leadOwner}&leadSource=${leadSource}&mailId=${mailId}`
                        : leadOwner && leadSource && mailId
                        ? `?leadOwner=${leadOwner}&leadSource=${leadSource}&mailId=${mailId}`
                        : ""
                    }`,
                  }}
                  className={({ isActive }) =>
                    `rounded-md ${
                      window.location.pathname === "/" || isActive
                        ? "bg-activenavbar"
                        : ""
                    } py-3 px-12`
                  }
                >
                  <button>Login</button>
                </NavLink>
              )}
              {user && window.location.href.includes("invite-screen") && (
                <button
                  className={`${
                    window.location.href.includes("invite-workspace") ||
                    window.location.href.includes("invite-screen")
                      ? "text-black"
                      : ""
                  } mt-3`}
                  onClick={handleChangeWorkSpace}
                >
                  Change Workspace
                </button>
              )}
              {user && (
                <div
                  onClick={() =>
                    logout()
                      .then(() => {
                        setAllUserReports([]);
                        setSuperAdmin({});
                        setWorkspaceMember([]);
                        setApprovalMember([]);
                        setSubscription([]);
                        navigate("/login");
                        setUser(null);
                      })
                      .catch((e) => {})
                  }
                  className={`rounded-md py-3 px-12`}
                >
                  <button
                    className={`${
                      window.location.href.includes("invite-workspace") ||
                      window.location.href.includes("invite-screen")
                        ? "text-black"
                        : ""
                    }`}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {user && (
        <div
          className={window.location.href.includes("dashboard") ? "" : "hidden"}
        >
          <div className="dashboard-navbar h-15 sticky">
            <div className="flex gap-1">
              {user &&
                JSON.parse(localStorage.getItem("team-hub-user"))
                  ?.accountStatus === null &&
                JSON.parse(localStorage.getItem("team-hub-user"))?.loginCount >=
                  2 && (
                  <button
                    className="w-[150px] border border-solid border-[rgba(149,149,149,1)] text-orange-500 px-4 py-2 rounded-lg mr-4 shadow-md transition-all duration-300 ease-in-out flex items-center justify-center"
                    style={{ backgroundColor: "white" }}
                    onClick={() => {
                      setVerifyEmailPopUp(true);
                    }}
                  >
                    Verify email
                  </button>
                )}

              <button
                // className="bg-gray-200 hover:bg-gray-300 border border-gray-300 text-[#333] px-4 py-2 rounded-lg mr-4 shadow-lg transition-all duration-300 ease-in-out"
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-300 hover:to-gray-400 border border-gray-300 text-[#333] px-4 py-2 rounded-lg mr-4 shadow-lg transition-all duration-300 ease-in-out"
                onClick={() => {
                  setIsDownload(!isDownload);
                }}
              >
                Download Desktop App
              </button>

              <span className="border"></span>

              <div
                className="avatar bg-[#2F4C5F] h-8 w-8 rounded-full flex justify-center items-center cursor-pointer text-white mt-1 ml-1"
                ref={userMenuRef}
                onClick={handleOpenUserMenu}
              >
                {user?.email[0].toUpperCase()}
              </div>
              <div
                className="user-name flex justify-center items-center cursor-pointer"
                ref={userMenuRef}
                onClick={handleOpenUserMenu}
              >
                <div className="relative inline-block">
                  <div className="relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40  focus:ring-blue-300  focus:ring   focus:outline-none">
                    <span>{user?.email}</span>
                  </div>
                </div>

                {profileClicked && (
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={profileClicked}
                    onClose={handleCloseUserMenu}
                  >
                    <div className="rounded-2xl shadow-sm py-2 top-[100%] overflow-hidden bg-white">
                      <Link to={`dashboard/profile/${user.userId}`}>
                        <MenuItem>
                          <div className="flex flex-row gap-5 py-2 text-sm text-gray-600 capitalize transition-colors duration-200 transform">
                            <img
                              src={require("../../assets/Icons/profile-Icon.png")}
                              alt="profile-icon"
                            />
                            My Account
                          </div>
                        </MenuItem>
                      </Link>
                      <Link to="/dashboard/support">
                        <MenuItem>
                          <div className="flex flex-row gap-5 py-2 text-sm text-gray-600 capitalize transition-colors duration-200 transform">
                            <img
                              src={require("../../assets/Icons/support-Icon.png")}
                              alt="support-icon"
                            />
                            Support
                          </div>
                        </MenuItem>
                      </Link>

                      {user?.userRole === "admin" && (
                        <Link to="/dashboard/subscription/">
                          <MenuItem>
                            <div className="flex flex-row gap-5 py-2 text-sm text-gray-600 capitalize transition-colors duration-200 transform cursor-pointer">
                              <img
                                src={require("../../assets/Icons/plan-Icon.png")}
                                alt="Plan Icon"
                              />
                              My Plan
                            </div>
                          </MenuItem>
                        </Link>
                      )}

                      <MenuItem
                        onClick={() =>
                          logout()
                            .then(() => {
                              setAllUserReports([]);
                              setSuperAdmin({});
                              setWorkspaceMember([]);
                              setApprovalMember([]);
                              setSubscription([]);
                              navigate("/login");
                              setUser(null);
                            })
                            .catch((e) => {})
                        }
                      >
                        <div className="flex flex-row gap-5 py-2 text-sm text-gray-600 capitalize transition-colors duration-200 transform cursor-pointer">
                          <img
                            src={require("../../assets/Icons/logout-Icon.png")}
                            alt="logout-icon"
                          />
                          Log Out
                        </div>
                      </MenuItem>
                    </div>
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isDownload && (
        <DownloadDesktopAppPopup
          isOpen={isDownload}
          setIsOpen={setIsDownload}
        />
      )}
      {VerifyEmailPopUp && (
        <VerifyEmailPop
          isOpen={VerifyEmailPopUp}
          setIsOpen={setVerifyEmailPopUp}
        />
      )}
    </>
  );
}

export default Navbar;
