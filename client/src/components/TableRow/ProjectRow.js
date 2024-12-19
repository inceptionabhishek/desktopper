import { UserContext } from "../../context/UserContext";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState, useContext } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProjectRow({ member, memberId }) {
  const userRole = JSON.parse(localStorage.getItem("team-hub-user")).userRole;
  const [selectedOption, setselectedOption] = useState(
    member?.userRole || null
  );

  const { superAdmin } = useContext(UserContext);

  return (
    <tr className="h-20 border-b-2 border-[#cacccb]">
      <td className="py-2 cursor-pointer text-start">
        {userRole !== "user" ? (
          <Link to={`/dashboard/people/profile/${memberId}`}>
            <p className="flex justify-center">{member.fullName}</p>
          </Link>
        ) : (
          <div>
            {" "}
            <p className="flex justify-center">{member.fullName}</p>
          </div>
        )}
      </td>
      <td className="py-2 text-center">
        {" "}
        <p className="flex justify-center">{member.email}</p>
      </td>
      <td className="py-2 text-center">
        <p className="flex justify-center">
          {superAdmin?.userId === member.userId
            ? "super admin"
            : member.userRole}
        </p>
      </td>
    </tr>
  );
}

export default ProjectRow;
