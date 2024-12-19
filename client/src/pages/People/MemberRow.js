import ChangeSuperAdmin from "../../components/PopUpBox/ChangeSuperAdmin";
import RemoveMembersFromWorkspacePopup from "../../components/PopUpBox/RemoveMembersFromWorkspacePopup.js";
import { AuthContext } from "../../context/AuthContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BsChevronDown } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function MemberRow({ member, memberId, superAdminEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [isChangeSuperAdmin, setIsChangeSuperAdmin] = useState(false);

  const [selectedOption, setselectedOption] = useState(() => {
    if (superAdminEmail === member?.email) {
      return "Super Admin";
    } else {
      return member?.userRole || null;
    }
  });

  const [removeMembersFromWorkspacePopup, setRemoveMembersFromWorkspacePopup] =
    useState(false);

  const {
    workspaceId,
    declineUserFromWorkspace,
    updateUserRole,
    getWorkSpaceInfo,
  } = useContext(WorkSpaceContext);

  const handleDeleteAccount = () => {
    declineUserFromWorkspace({ workspaceId, memberId })
      .then((data) => {
        toast.success("User is declined from the workspace!");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.err || "Member is not removed!");
      });
    setRemoveMembersFromWorkspacePopup(false);
  };

  return (
    <tr className="h-10  text-sm border-b-2 border-[#ebeaea]  hover:bg-gray-100 transition duration-200 ease-in-out ">
      <td className="py-2 cursor-pointer">
        {!(
          user.userRole === "user" ||
          (user.userRole === "manager" && member.userRole === "admin")
        ) ? (
          <Link to={`/dashboard/people/profile/${memberId}`}>
            <p className="flex justify-center">{member?.fullName}</p>
          </Link>
        ) : (
          <span>
            {" "}
            <p className="flex justify-center">{member?.fullName}</p>
          </span>
        )}
      </td>
      <td
        className=" py-2 break-all "
        style={{
          marginLeft: "10px",
        }}
      >
        <p className="flex justify-center">{member?.email}</p>
      </td>
      <td className="py-2">
        <p className="flex justify-center">Active</p>
      </td>
      <td className="py-2 ">
        <Menu as="div" className="relative  text-center  ">
          <div>
            <Menu.Button
              disabled={
                user.userRole === "user" ||
                (user.userRole === "manager" && member.userRole === "admin")
              }
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {selectedOption
                ? selectedOption.replace(/^\w/, (c) => c.toUpperCase())
                : "Options"}
              <BsChevronDown
                className="mr-1 mt-1 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <span
                      onClick={() => setselectedOption("Super Admin")}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Super Admin
                    </span>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <span
                      onClick={() => setselectedOption("user")}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      User
                    </span>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <span
                      onClick={() => setselectedOption("admin")}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Admin
                    </span>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <span
                      onClick={() => setselectedOption("manager")}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Manager
                    </span>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
      <td className="py-2 ">
        <p className="flex justify-center">
          {new Date(member?.dateAdded)
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")}
        </p>
      </td>

      <td className="py-2 ">
        <Menu as="div" className="relative  text-center  ">
          <div>
            <Menu.Button className="inline-flex w-32 justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ">
              <SlOptions
                fontSize={20}
                className="text-gray-400 cursor-pointer m-2"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className=" absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 flex flex-col ">
                <Menu.Item>
                  <span className="block px-2 py-2 text-md text-black text-left relative font-bold ">
                    Actions
                  </span>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => {
                      if (
                        user.userRole === "user" ||
                        (user.userRole === "manager" &&
                          member.userRole === "admin")
                      ) {
                        toast.error(
                          "Only Admin can change user permissions. Please contact the Admin of this workspace!"
                        );
                      }
                      if (
                        (member?.userRole === selectedOption &&
                          member?.email !== superAdminEmail) ||
                        (member?.email === superAdminEmail &&
                          selectedOption === "Super Admin")
                      ) {
                        toast.error(
                          `${member?.fullName} is already ${
                            selectedOption === "user" ||
                            selectedOption === "admin"
                              ? "an"
                              : "a"
                          } ${selectedOption}`
                        );
                      } else if (member?.email === superAdminEmail) {
                        if (user?.email === superAdminEmail) {
                          toast.error(
                            "Assign someone else as super admin to continue!"
                          );
                        } else {
                          toast.error(
                            `Only ${member?.fullName} can change Super Admin role!`
                          );
                        }
                      } else if (
                        selectedOption === "Super Admin" &&
                        user?.email !== superAdminEmail
                      ) {
                        toast.error("Only Super Admin can assign this role!");
                      } else {
                        if (selectedOption !== "Super Admin") {
                          updateUserRole({
                            memberId,
                            workspaceId,
                            selectedOption,
                          })
                            .then(() => {
                              toast.success(
                                `${member?.fullName}'s role changed successfully!`
                              );
                              const user = JSON.parse(
                                localStorage.getItem("team-hub-user")
                              );
                              if (memberId === user?.userId) {
                                user.userRole = selectedOption;
                                localStorage.setItem(
                                  "team-hub-user",
                                  JSON.stringify(user)
                                );
                              }
                              getWorkSpaceInfo(user?.workspaceId);
                            })
                            .catch((error) => {
                              console.error("Error changing user role:", error);
                              toast.error(
                                error?.response?.data?.err ||
                                  "User role is not changed!"
                              );
                            });
                        } else {
                          setIsChangeSuperAdmin(!isChangeSuperAdmin);
                        }
                      }
                    }}
                    className="py-2 px-2 text-md relative text-left hover:text-gray-500 hover:bg-gray-100"
                  >
                    Save
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => {
                      if (member?.userRole !== "admin") {
                        setRemoveMembersFromWorkspacePopup(true);
                      } else {
                        if (member?.email === superAdminEmail) {
                          toast.error("Super Admin can't be removed!");
                        } else {
                          toast.error("Admin can't be removed!");
                        }
                      }
                    }}
                    className="py-2 px-2 text-md relative text-left hover:text-gray-500 hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        {removeMembersFromWorkspacePopup && (
          <div>
            <RemoveMembersFromWorkspacePopup
              onDelete={handleDeleteAccount}
              setDeletePopUp={setRemoveMembersFromWorkspacePopup}
              deletePopUp={removeMembersFromWorkspacePopup}
              onCancel={() => {
                setRemoveMembersFromWorkspacePopup(false);
              }}
            />
          </div>
        )}
      </td>
      {isChangeSuperAdmin && (
        <ChangeSuperAdmin
          isOpen={isChangeSuperAdmin}
          setIsOpen={setIsChangeSuperAdmin}
          superAdminEmail={superAdminEmail}
          member={member}
          memberId={memberId}
          selectedOption={selectedOption}
        />
      )}
    </tr>
  );
}

export default MemberRow;
