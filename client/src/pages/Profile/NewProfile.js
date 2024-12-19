import { WorkSpaceContext } from "../../context/WorkspaceContext";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";
import ChangeWorkSpacePop from "../../components/PopUpBox/ChangeWorkSpacePop";
import ProfileChangePopup from "../../components/PopUpBox/ProfileChangePopup";
import ChangePasswordPopUp from "../../components/ProjectView/ChangePasswordPopup";
import DeletePopUp from "../../components/ProjectView/DeletePopUp";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ReportContext } from "../../context/ReportContext";
import { UserContext } from "../../context/UserContext";
import ProfileSkeleton from "../../skeletonUi/ProfileSkeleton";


function NewProfile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [profileChangePopup, setProfileChangePopup] = useState(false);
  const [changePasswordPopUp, setChangePasswordPopUp] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [isChangeWorkspace, setIsChangeWorkspace] = useState(false);
  const [memberProfile, setMemberProfile] = useState({});
  const [timeElapsedHours, setTimeElapsedHours] = useState(-1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const { user, deleteUser, logout, setUser, updatePassword } =
    useContext(AuthContext);
  const {
    getMemberProfile,
    getWorkSpaceInfo,
    workspaceId,
    setWorkspaceMember,
    setApprovalMember,
    handleUpdateProfile,
  } = useContext(WorkSpaceContext);

  const { setAllUserReports } = useContext(ReportContext);
  const { superAdmin, setSuperAdmin, updateSuperAdmin } =
    useContext(UserContext);
  const { setSubscription } = useContext(PaymentContext);

  const { allReports } = useContext(ReportContext);

  const handleChangePassword = () => {
    updatePassword({
      email: user?.email,
      password: newPassword,
      confirmPassword: confirmPassword,
    })
      .then((data) => {
        toast.success("Password changed successfully!");
      })
      .catch((err) => {
        toast.error("Password not changed!");
      });
    setChangePasswordPopUp(false);
  };

  const handleDeleteAccount = async () => {
    if (!superAdmin?.email) {
      toast.error("Please try again!");
    } else if (superAdmin?.email === user?.email) {
      toast.error("Assign someone else as super admin to continue!");
    } else {
      deleteUser({ userId: profileId, workspaceId })
        .then((data) => {})
        .catch((err) => {});
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
        .catch((e) => {});
    }
    setDeletePopUp(false);
  };

  const handleValueChange = (e) => {
    if (e.target.type === "checkbox") {
      setMemberProfile({
        ...memberProfile,
        [e.target.name]: e.target.checked,
      });
    } else {
      // setMemberProfile({ ...memberProfile, [e.target.name]: e.target.value });

      if (e.target.name === "fullName") {
        setFullName(e.target.value);
      } else if (e.target.name === "email") {
        setEmail(e.target.value);
      } else if (e.target.name === "employeeId") {
        setEmployeeId(e.target.value);
      }
    }
  };

  const handleGetProfile = () => {
    setIsLoading(true);
    getMemberProfile(profileId)
      .then((data) => {
        setMemberProfile(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const handleChangeProfile = async () => {
    if (fullName.trim() === "") {
      toast.error("Name cannot be empty");
    } else if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address");
    } else {
      if (!superAdmin?.email) {
        toast.error("Please try again!");
      } else if (superAdmin?.email === user?.email) {
        handleUpdateProfile({
          profileId: memberProfile.userId,
          fullName,
          email,
          employeeId,
        })
          .then((response) => {
            console.log("response", response);

            updateSuperAdmin({
              currentEmail: superAdmin?.email,
              newEmail: response?.data?.updatedUser?.data?.updatedData?.email,
              workspaceId: user?.workspaceId,
            })
              .then(async () => {
                setUser(response?.data?.updatedUser?.data?.updatedData);
                localStorage.setItem(
                  "team-hub-user",
                  JSON.stringify(response?.data?.updatedUser?.data?.updatedData)
                );
                // await updateUser();
                await getWorkSpaceInfo(user?.workspaceId);
                setProfileChangePopup(false);
                navigate("/dashboard/dashboardScreen");
                toast.success("Profile updated successfully!");
              })
              .catch(() => {
                toast.error("Error occured, please try again!");
              });
          })
          .catch((e) => {
            toast.error(e?.response?.data?.err);
          });
      } else {
        handleUpdateProfile({
          profileId: memberProfile.userId,
          fullName,
          email,
          employeeId,
        })
          .then(async (response) => {
            setUser(response?.data?.updatedUser?.data?.updatedData);
            localStorage.setItem(
              "team-hub-user",
              JSON.stringify(response?.data?.updatedUser?.data?.updatedData)
            );
            // await updateUser();
            await getWorkSpaceInfo(user?.workspaceId);
            setProfileChangePopup(false);
            navigate("/dashboard/dashboardScreen");
            toast.success("Profile updated successfully!");
          })
          .catch((e) => {
            toast.error(e?.response?.data?.err);
          });
      }
    }
  };

  useEffect(() => {
    handleGetProfile();
  }, [profileId]);

  useEffect(() => {
    setFullName(memberProfile.fullName);
    setEmail(memberProfile.email);
    setEmployeeId(memberProfile.employeeId);
  }, [memberProfile]);

  useEffect(() => {
    if (allReports[0]) {
      const firstReportEndTime = new Date(allReports[0]?.endTime);
      const currentTime = new Date();
      const timeElapsedMilliseconds = currentTime - firstReportEndTime;
      setTimeElapsedHours(
        Math.floor(timeElapsedMilliseconds / (1000 * 60 * 60))
      );
    }
  }, [allReports]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="flex">
          <div className="h-full w-[30%] bg-white">
            <div className="avatar mx-auto mt-15 bg-[#0096EB] h-24 w-24 rounded-full flex justify-center items-center cursor-pointer text-white text-4xl">
              {memberProfile?.fullName?.length > 0 && (
                <>
                  <span className="text-7xl">
                    {memberProfile?.fullName.charAt(0)?.toUpperCase()}
                  </span>
                </>
              )}
            </div>
            <p className="text-center mt-5 text-3xl font-medium text-gray-700 antialiased">
              {memberProfile?.fullName}
            </p>
            <div className="text-base text-[#808080] text-center mt-10">
              {memberProfile?.email}
            </div>
            <div className="text-base text-[#808080] text-center mt-8">
              Joined :{" "}
              {new Date(memberProfile?.dateAdded).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-base text-[#808080] text-center mt-8">
              {timeElapsedHours !== -1 &&
                `Last tracked time: ${timeElapsedHours} hours ago`}
            </div>
            {user?.userId === profileId && (
              <>
                <div className="flex justify-center mt-10">
                  <button
                    className="w-60 mt-6 pt-3 pb-3 pl-10 pr-10 bg-white border border-[#36454F] rounded-md text-base
                 text-[#36454F] hover:bg-[#36454F] hover:text-white"
                    onClick={() => {
                      setChangePasswordPopUp(true);
                    }}
                  >
                    Change Password
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="w-60 mt-6 pt-3 pb-3 pl-10 pr-10 bg-white border border-[#36454F] rounded-md text-base
                 text-[#36454F] hover:bg-red-700 hover:text-white"
                    onClick={() => {
                      setDeletePopUp(true);
                    }}
                  >
                    Delete Account
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="w-60 mt-6 pt-3 pb-3 pl-10 pr-10 bg-white border border-[#36454F] rounded-md text-base
                 text-[#36454F] hover:bg-yellow-500 hover:text-white"
                    onClick={() => {
                      setIsChangeWorkspace(!isChangeWorkspace);
                    }}
                  >
                    Change Workspace
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="w-60 mt-6 pt-3 pb-3 pl-10 pr-10 bg-white border border-[#36454F] rounded-md text-base
                 text-[#36454F] hover:bg-[#0096FB] hover:text-white"
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
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="h-full w-[70%] bg-[#F2F7FA] min-h-screen">
            <div className="mt-15 ml-20 bg-[#F2F7FA]">
              <div className="w-full flex items-center justify-start">
                <p className="text-sm text-[#4B4B4B] font-semibold">Role</p>
                <span className="bg-white ml-6 border border-gray-300 h-[45px]  inline-flex items-center justify-start px-2 mt-2 rounded-xl text-[#75869C]">
                  {superAdmin?.userId === profileId
                    ? "super admin"
                    : memberProfile.userRole}
                </span>
              </div>
              <div className="flex justify-between mt-10">
                <div className="flex flex-col gap-1 w-[98%]">
                  <label
                    htmlFor="project"
                    className="text-sm text-[#4B4B4B] font-semibold"
                  >
                    Projects
                  </label>
                  <div className="flex gap-1 flex-wrap mt-2 rounded-md">
                    {memberProfile?.projects?.map((data) => {
                      return (
                        <div
                          key={data.projectId}
                          className="bg-[#0096FB] h-[32px] p-2 text-white flex justify-center items-center gap-1 rounded-md"
                        >
                          <div>{data.projectName}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-[500px] mt-8 flex flex-col gap-1">
                    <label
                      htmlFor="fullName"
                      className="text-sm text-[#4b4b4b] font-semibold"
                    >
                      Name
                    </label>
                    <input
                      id="fullName"
                      className="w-[80%] outline-none rounded-2xl border border-gray-300 h-[56px] pt-4 pb-4 pl-5 pr-5"
                      name="fullName"
                      value={fullName}
                      onChange={handleValueChange}
                      disabled={user?.userId !== profileId}
                    />
                  </div>
                  <div className="w-[500px] mt-8 flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="text-sm text-[#4b4b4b] font-semibold"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-[80%] outline-none rounded-2xl border border-gray-300 h-[56px] pt-4 pb-4 pl-5 pr-5"
                      name="email"
                      value={email}
                      onChange={handleValueChange}
                      disabled={user?.userId !== profileId}
                    />
                  </div>
                  <div className="w-[500px] mt-8 flex flex-col gap-1">
                    <label
                      htmlFor="employeeId"
                      className="text-sm text-[#4b4b4b] font-semibold"
                    >
                      Employee ID
                    </label>
                    <input
                      id="employeeId"
                      className="w-[80%] outline-none rounded-2xl border border-gray-300 h-[56px] pt-4 pb-4 pl-5 pr-5"
                      placeholder={
                        user?.userId !== profileId ? "Not set!" : "Ex. 57GH77"
                      }
                      name="employeeId"
                      value={employeeId}
                      onChange={handleValueChange}
                      disabled={user?.userId !== profileId}
                    />
                  </div>
                    <div className="mt-16 flex justify-end">
                      {user?.userId === profileId && <button
                        className="text-base mr-4 pt-3 pb-3 px-12 rounded-2xl"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>}
                      {user?.userId === profileId && <button
                        className="pt-3 pb-3 pl-10 pr-10 rounded-2xl text-base bg-[#0096FB] text-white"
                        onClick={() => {
                          setProfileChangePopup(true);
                        }}
                      >
                        Save Changes
                      </button>}
                    </div>
                </div>
              </div>
            </div>
          </div>
          {deletePopUp && (
            <div>
              <DeletePopUp
                onDelete={handleDeleteAccount}
                setDeletePopUp={setDeletePopUp}
                deletePopUp={deletePopUp}
                onCancel={() => {
                  setDeletePopUp(false);
                }}
              />
            </div>
          )}
          {changePasswordPopUp && (
            <div>
              <ChangePasswordPopUp
                onPasswordChange={handleChangePassword}
                setChangePasswordPopup={setChangePasswordPopUp}
                changePasswordPopup={changePasswordPopUp}
                onCancel={() => {
                  setChangePasswordPopUp(false);
                }}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
              />
            </div>
          )}
        </div>
      )}
      {isChangeWorkspace && (
        <ChangeWorkSpacePop
          isOpen={isChangeWorkspace}
          setIsOpen={setIsChangeWorkspace}
        />
      )}
      {profileChangePopup && (
        <div>
          <ProfileChangePopup
            onChange={handleChangeProfile}
            setProfileChangePopup={setProfileChangePopup}
            profileChangePopup={profileChangePopup}
            onCancel={() => {
              setProfileChangePopup(false);
            }}
          />
        </div>
      )}
    </>
  );
}
export default NewProfile;