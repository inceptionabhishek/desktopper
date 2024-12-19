import React from "react";
import { Avatar, Badge } from "@mui/material";
import { blue } from "@mui/material/colors";
import { MdClear } from "react-icons/md";

const CustomAvatar = ({ member, taskMember, setTaskMember }) => {
  return (
    <div
      key={member?.id}

    className="bg-[#0096FB] rounded-3xl py-2 px-4 mx-0.5 text-white "
    >
      {member?.fullName?.charAt(0).toUpperCase()}

      <Badge
        className="bg-gray-200 rounded-full px-1 py-1 text-black text-xs flex items-center justify-center hover:bg-red-500"
        overlap="circular"
        style={{
          marginTop: "-18px",
          marginRight: "-16px",
          zIndex: 9,
          position: "absolute",
        }}
        onClick={() => {
          setTaskMember((prevMembers) =>
            prevMembers.filter(
              (prevMember) => prevMember.userId !== member.userId
            )
          );
        }}
      >
        <MdClear />
      </Badge>
    </div>
  );
};

export default CustomAvatar;
