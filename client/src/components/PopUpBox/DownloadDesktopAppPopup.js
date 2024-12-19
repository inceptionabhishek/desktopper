import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { ColorRing } from "react-loader-spinner";

const DownloadDesktopAppPopup = ({ isOpen, setIsOpen }) => {
  const { isLoading } = useContext(WorkSpaceContext);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="rounded-3xl"
    >
      <div className="shadow-lg p-4">
        <DialogTitle className="text-[#36454F] text-center text-2xl font-semibold leading-6 mb-2">
          Download Desktop Application
        </DialogTitle>
        <DialogContent className="mb-4 font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto transition-transform transform hover:scale-105">
          To start tracking time, please install our desktop app
        </DialogContent>
        <div className="flex justify-center mt-4 mb-4 gap-5">
          <Link
            // className="px-6 py-4 rounded-3xl text-white bg-gradient-to-br from-[#e15b64] via-[#f47e60] to-[#f8b26a] rounded hover:bg-[#2F4C5F] hover:scale-105 transition-transform flex items-center"
            className="px-6 py-4 rounded-3xl text-white rounded hover:bg-[#2F4C5F] hover:scale-105 transition-transform flex items-center"
            style={{ background: "rgba(0, 150, 235, 1)" }}
            to="https://download.desktopper.com/files/prod/desktopper-windows-v1.11.11.zip"
          >
            <img
              src={require("../../assets/WindowsWhite.png")}
              alt="Windows"
              className="w-8 h-8 mr-2"
            />
            {isLoading ? (
              <ColorRing
                visible={true}
                height="52"
                width="52"
                ariaLabel="blocks-loading"
                wrapperclassName="mx-auto blocks-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : (
              "Download for Windows"
            )}
          </Link>
          <Link
            className="px-6 py-4 rounded-3xl text-white rounded hover:bg-[#2F4C5F] hover:scale-105 transition-transform flex items-center"
            style={{ background: "rgba(0, 150, 235, 1)" }}
            to="https://download.desktopper.com/files/prod/desktopper-mac-v1.11.11.zip"
          >
            <img
              src={require("../../assets/MACWhite.png")}
              alt="Windows"
              className="w-8 h-8 mr-2"
            />
            {isLoading ? (
              <ColorRing
                visible={true}
                height="52"
                width="52"
                ariaLabel="blocks-loading"
                wrapperclassName="mx-auto blocks-wrapper"
                colors={[
                  "#F5F5F5",
                  "#e15b64",
                  "#f47e60",
                  "#f8b26a",
                  "#abbd81",
                  "#849b87",
                ]}
              />
            ) : (
              "Download for MAC"
            )}
          </Link>
        </div>
      </div>
    </Dialog>
  );
};

export default DownloadDesktopAppPopup;
