import { Dialog } from "@headlessui/react";
import React from "react";

const RemoveMembersFromWorkspacePopup = ({
  deletePopUp,
  onDelete,
  onCancel,
  setDeletePopUp,
}) => {
  return (
    <Dialog
      open={deletePopUp}
      onClose={() => setDeletePopUp(false)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-[#FFFFFF] w-[421px] h-[243px] rounded-[20px] shadow-lg p-4 flex flex-col justify-evenly">
        <Dialog.Title className="text-[#36454F] text-center text-2xl font-semibold leading-6">
          Confirm Removal
        </Dialog.Title>
        <Dialog.Description className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto">
          Are you sure you want to remove this user from workspace?
        </Dialog.Description>
        <div className="flex justify-center">
          <button
            className="w-[127px] h-[48px] rounded-[16px] border border-[#4B4B4B] bg-[#FFFFFF] text-[#4B4B4B] hover:cursor-pointer px-4 py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="w-32 h-12 ml-5 rounded-[16px] bg-[#0096EB] text-white hover:cursor-pointer px-4 py-2"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default RemoveMembersFromWorkspacePopup;
