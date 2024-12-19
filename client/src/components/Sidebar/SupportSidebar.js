import React, { useState } from "react";
import { Link } from "react-router-dom";
import RaiseTicketPopUp from "../PopUpBox/RaiseTicketPopUp";

const SupportSidebar = () => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed top-20 bottom-0 lg:left-0 p-2 w-[250px] overflow-y-auto text-center shadow-xl bg-white">
      <div className="text-sm font-medium text-center text-gray-500  dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <Link
              to="/dashboard/support"
              className="inline-block p-4 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 text-blue-600 border-b-2"
            >
              FAQ'S
            </Link>
          </li>
          <li className="mr-4">
            <Link
              to="/dashboard/my-tickets"
              className="inline-block p-4 border-transparent"
            >
              MY TICKETS
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-2.5 mt-6 flex flex-col items-center justify-start rounded-md px-4  ">
        <h4 className="text-[18px] font-normal">Table of contents</h4>
        <ul className="space-y-4 flex flex-col text-left text-gray-500  dark:text-gray-400 mt-12">
          <li className="text-sm font-semibold text-[#36454F]">
            <Link>General</Link>
          </li>
          <li className="text-sm font-semibold text-[#36454F]">
            <Link to="/dashboard/projects">Projects</Link>
          </li>
          <li className="text-sm font-semibold text-[#36454F]">
            <Link to="/dashboard/timesheets">Timesheets</Link>
          </li>
          <li className="text-sm font-semibold text-[#36454F]">
            <Link>Activity</Link>
          </li>
        </ul>
      </div>
      <div className="p-2 mt-8 flex flex-col items-center justify-start rounded-md px-4  ">
        <h4 className="text-[14px] font-normal">Can’t find an answer?</h4>

        <button className=" mt-8 text-white bg-[#0096EB] text-sm font-bold py-2 px-8 rounded-lg">
          Contact us
        </button>

        <h4 className="p-2 mt-6 text-[14px] font-normal">or</h4>

        <button
          className="mt-6 text-white bg-[#0096EB] text-sm font-bold py-2 px-6 rounded-lg cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          Raise a ticket
        </button>
      </div>
      {isOpen && <RaiseTicketPopUp isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default SupportSidebar;
