import AddMemberIcon from "../../assets/Icons/addMember.svg";
import { Menu, Transition } from "@headlessui/react";
import { Avatar, AvatarGroup, Tooltip } from "@mui/material";
import React, { Fragment, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BsChevronDown } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { Link } from "react-router-dom";

function ProjectRow({
  projectName,
  projectMembers,
  projectTodos,
  project,
  user,
  EditAction,
  setDeletePopUp,
  setselectProjectId,
}) {
  return (
    <tr className="h-10  text-sm border-b-2 border-[#ebeaea]  hover:bg-gray-100 transition duration-200 ease-in-out ">
      <Link
        to={`/dashboard/projects/${project.projectId}`}
        key={project?.projectId}
        className="flex justify-center mt-2"
      >
        <td className="py-5 cursor-pointer ">
          <p
            className="flex justify-center w-[200px]"
            style={{ wordBreak: "break-word" }}
          >
            {projectName}
          </p>
        </td>
      </Link>

      <td className="py-2 cursor-pointer">
        <Link
          to={`/dashboard/projects/${project.projectId}`}
          key={project?.projectId}
        >
          <div className="flex justify-center">
            <div className="flex flex-col">
              <div className="text-start p-2">
                <div className="flex space-x-1">
                  <AvatarGroup max={4}>
                    {projectMembers?.map((member) => (
                      <Tooltip
                        key={member?.fullName}
                        title={member?.fullName}
                        arrow
                      >
                        <Avatar
                          key={member?.id}
                          style={{ background: "#0096EB" }}
                          alt={member?.fullName}
                        >
                          {member?.fullName?.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>

                  <div
                    className="cursor-pointer mt-1"
                    disabled
                    onClick={(e) => {
                      e.preventDefault();
                      if (user.userRole !== "user") {
                        EditAction(project);
                      }
                    }}
                  >
                    <img src={AddMemberIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </td>

      <Link
        to={`/dashboard/projects/${project.projectId}`}
        key={project?.projectId}
        className="flex justify-center"
      >
        <td className="py-5 cursor-pointer">
          <p> {projectTodos === 0 ? "No To Do’s" : projectTodos}</p>
        </td>
      </Link>

      <td>
        <Menu as="div" className="relative  text-center  ">
          <Link
            to={`/dashboard/projects/${project.projectId}`}
            key={project?.projectId}
            className="flex justify-center"
          >
            <div>
              <Menu.Button className="inline-flex w-16 justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ">
                <SlOptions
                  fontSize={20}
                  className="text-gray-400 cursor-pointer m-2"
                />
              </Menu.Button>
            </div>
          </Link>
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
                    className="py-2 px-2 text-md relative text-left hover:text-gray-500 hover:bg-gray-100 flex"
                    onClick={() => {
                      if (user.userRole === "user") {
                        toast.error("You are not authorized to edit a project");
                        return;
                      }
                      EditAction(project);
                    }}
                  >
                    <BsPencil
                      size={15}
                      style={{ marginRight: "5px", marginTop: "1px" }}
                    />
                    Edit
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    className="py-2 px-2 text-md relative text-left hover:text-gray-500 hover:bg-gray-100 flex"
                    onClick={() => {
                      if (user.userRole === "user") {
                        toast.error(
                          "You are not authorized to Delete a project"
                        );
                        return;
                      }
                      setDeletePopUp(true);
                      setselectProjectId(project.projectId);
                    }}
                  >
                    <MdDelete
                      size={15}
                      style={{ marginRight: "5px", marginTop: "1px" }}
                    />
                    Delete
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
    </tr>
  );
}

export default ProjectRow;
