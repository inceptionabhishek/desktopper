import { Dialog } from "@headlessui/react";
import React, { useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { SupportContext } from "../../context/SupportContext";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../constants/fromateDate";

const RaiseTicketPopUp = ({ isOpen, setIsOpen }) => {
  const [raisedTicket, setRaisedTicket] = useState("");
  const { user } = useContext(AuthContext);

  const { createSupport } = useContext(SupportContext);

  const handleCreateSupport = () => {
    createSupport({
      userId: user?.userId,
      ticketDescription: raisedTicket,
      ticketStatus: "Under Review",
      ticketReply: "",
      date: formatDate(new Date()),
    });

    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto rounded-full"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="bg-white w-1/2 p-10 rounded shadow-lg z-20 rounded-3xl">
          <Dialog.Title className=" flex justify-between font-medium text-3xl text-[#36454F]">
            <p>Raise ticket</p>{" "}
            <RxCross2
              className="text-black-900 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </Dialog.Title>
          <Dialog.Description className="text[#4B4B4B] mt-6 font-medium text-sm font-semibold">
            Issue
          </Dialog.Description>
          <div className="my-4 w-full">
            <textarea
              className="px-40 py-10 border border-gray-300 rounded-lg"
              placeholder="Type something..."
              onChange={(e) => {
                setRaisedTicket(e.target.value);
              }}
            />
          </div>
          <div className="w-1/2 mx-auto">
            <button
              onClick={handleCreateSupport}
              className="bg-[#0096FB] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
            >
              Raise Ticket
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RaiseTicketPopUp;
