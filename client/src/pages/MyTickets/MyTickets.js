import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { SupportContext } from "../../context/SupportContext";
import { AuthContext } from "../../context/AuthContext";

const MyTickets = () => {
  const { supports, fetchSupportsByUserId, setSupports } =
    useContext(SupportContext);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    fetchSupportsByUserId(user?.userId);
  }, [setSupports]);
  return (
    <div className="w-full px-16 pt-6">
      {" "}
      <div className="text-sm font-medium text-center text-gray-500  dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <Link
              to="/dashboard/support"
              className="inline-block p-4 border-transparent"
            >
              FAQ'S
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href="/dashboard/my-tickets"
              className="inline-block p-4 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 text-blue-600 border-b-2"
            >
              MY TICKETS
            </Link>
          </li>
        </ul>
      </div>
      <div className="mx-auto w-full rounded-2xl ">
        {supports?.data?.map((data) => (
          <div
            key={data?.supportId}
            className="shadow-lg p-6 rounded-lg  overflow-hidden 
            bg-[#f3f4f6]
             mt-8"
          >
            <div className="flex justify-between">
              <p className="text-xs font-normal text-[#36454F]">{data?.date}</p>
              <button className="text-xs font-semibold text-[#205FDC] rounded-full bg-[#E9EFFC] py-2 px-4">
                {data?.ticketStatus}
              </button>
            </div>
            <div>
              <h3 className="text-md font-semibold text-[#2F4C5F] py-4">
                Ticket Description
              </h3>
              <p>{data?.ticketDescription}</p>
            </div>
            <div>
              {data?.ticketReply !== "" && (
                <h3 className="text-md font-semibold text-[#2F4C5F] pt-4">
                  {" "}
                  Reply
                </h3>
              )}

              <p className="text-md font-normal text-[#292C33] py-4">
                {data?.ticketReply}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
