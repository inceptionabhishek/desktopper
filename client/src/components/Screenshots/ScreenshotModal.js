import { Dialog } from "@headlessui/react";
import React from "react";

function ScreenshotModal({ screenshotData, screenshot, setModal, modal }) {
  console.log(screenshotData);
  return (
    <Dialog open={modal} onClose={() => setModal(false)}>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="w-[140vh] h-[90vh] border-0 rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              <img
                src={screenshot}
                alt="screenshot"
                className="w-[130vh] h-[70vh]  shrink border-0 rounded-lg shadow-lg relative flex flex-col  bg-white outline-none focus:outline-none"
              />
            </div>
            <div className="flex justify-center items-center flex-shrink-0">
              <p className="text-gray-500 text-lg">
                {screenshotData?.projectName} at{" "}
                {screenshotData?.screenshotTime} ({screenshotData?.efficiency}%
                active )
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModal(false)}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </Dialog>
  );
}

export default ScreenshotModal;
