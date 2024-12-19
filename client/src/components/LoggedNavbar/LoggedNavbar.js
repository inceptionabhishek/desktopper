import React from "react";

function LoggedNavbar() {
  return (
    <>
      <nav className="bg-white  fixed w-full z-20 top-0 left-0 border-b shadow-md ">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex md:order-2">
            <div>
              <img
                src={require("../../assets/Icons/notify.png")}
                alt="notify"
                className="w-8 h-8 mr-3 mt-1"
              />
            </div>
            <div className="h-10 w-[0.10rem] bg-gray-200 border-b shadow-md ml-1 mr-2"></div>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-cyan-500 rounded-full">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                C
              </span>
            </div>
            <div className="h-10 w-[0.10rem] bg-gray-200 border-b shadow-md ml-1 mr-2"></div>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-default rounded-full ">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                U
              </span>
            </div>

            <div>
              <h2
                type="button"
                className="text-black focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 "
              >
                user@gmail.com
              </h2>
            </div>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                ></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default LoggedNavbar;
