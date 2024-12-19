import React from "react";
import TaskListDropdown from "../TaskListDropdown/TaskListDropdown";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

function ListView({
  listOpen,
  setListOpen,
  setListModal,
  projectStatus,
  projectId,
}) {
  return (
    <div>
      <div
        className="flex flex-row items-center space-x-4 cursor-pointer"
        onClick={() => {
          setListOpen(!listOpen);
        }}
      >
        <h1 className="text-md font-bold text-black ml-5">List</h1>
        {listOpen === false ? (
          <BsCaretDownFill style={{ color: "#545454" }} />
        ) : (
          <BsCaretUpFill style={{ color: "#545454" }} />
        )}
      </div>
      {listOpen && (
        <div className="ml-5 mt-4">
          {projectStatus?.map((status) => (
            <TaskListDropdown status={status} />
          ))}
        </div>
      )}
      {/* <div
        className="border border-primary mt-2 rounded-md ml-5  p-4 flex cursor-pointer"
        onClick={() => {
          setListModal(true);
        }}
      >
        <img src={require("../../assets/Icons/plus-black.png")} alt="" />
        <h1 className=" text-gray-500 ml-2">Add a new list</h1>
      </div> */}
    </div>
  );
}

export default ListView;
