import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
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

function TableRow({
  member,
  memberId,
  setSelectedMemberId,
  setSelectedRole,
  setApproveMembersFromWorkspacePopup,
}) {
  const userRole = JSON.parse(localStorage.getItem("team-hub-user")).userRole;

  const [selectedOption, setselectedOption] = useState(
    member?.userRole || null
  );

  const { approveUserToWorkspace, workspaceId, declineUserFromWorkspace } =
    useContext(WorkSpaceContext);

  const { user } = useContext(AuthContext);
  const { isSpaceAvailable, getIsSpaceAvailable } = useContext(PaymentContext);

  return (
    <tr className="h-20 border-b-2 border-[#ebeaea]">
      <td className="py-2 cursor-pointer">
        {userRole !== "user" ? (
          <Link to={`/dashboard/people/profile/${memberId}`}>
            <p className="flex justify-center">{member.fullName}</p>
          </Link>
        ) : (
          <p className="flex justify-center">{member.fullName}</p>
        )}
      </td>
      <td className="py-2">
        {" "}
        <p className="flex justify-center">{member.email}</p>
      </td>
      <td className="py-2">
        <Menu as="div" className="relative  text-center">
          <div>
            <Menu.Button
              className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50
            w-32
            "
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
              <div className="py-1">
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

      {userRole === "admin" && (
        <>
          <td className="py-2 items-center justify-center">
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
                        disabled={selectedOption === "pending"}
                        onClick={async () => {
                          await getIsSpaceAvailable(user?.email, user?.userId);
                          if (isSpaceAvailable) {
                            approveUserToWorkspace({
                              workspaceId,
                              userRole: selectedOption,
                              memberId,
                            });
                          } else {
                            setSelectedMemberId(memberId);
                            setSelectedRole(selectedOption);
                            setApproveMembersFromWorkspacePopup(true);
                          }
                        }}
                        className={`py-2 px-2 text-md relative text-left hover:text-gray-500 hover:bg-gray-100  ${
                          selectedOption === "pending" ? " disabled" : ""
                        }`}
                      >
                        Approve
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => {
                          declineUserFromWorkspace({ workspaceId, memberId })
                            .then((data) => {
                              toast.success(
                                "User is declined from the workspace!"
                              );
                            })
                            .catch((error) => {
                              toast.error(
                                error?.response?.data?.err ||
                                  "Member is not removed!"
                              );
                            });
                        }}
                        className="py-2 px-2 text-md relative text-left hover:text-gray-500 hover:bg-gray-100 "
                      >
                        Decline
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </td>
        </>
      )}
    </tr>
  );
}

export default TableRow;