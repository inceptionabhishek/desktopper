import React, { useContext, useRef } from "react";
import "./Workspace.css";
import { useNavigate } from "react-router-dom";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { toast } from "react-hot-toast";

function InviteWorkspace() {
  const navigate = useNavigate();

  const { workspaceId } = useContext(WorkSpaceContext);
  const codeRef = useRef(null);
  const handleCopyCode = async () => {
    try {
      if (codeRef.current) {
        await navigator.clipboard.writeText(codeRef.current.textContent);
        toast.success("Text copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  return (
    <>
      <div className="signup-container reverse">
        <div
          className="flex flex-col justify-center items-center w-full h-full"
          style={{ paddingTop: "10rem" }}
        >
          <h1 className="form-title text-2xl font-semibold mb-6 text-black text-center">
            Invite People to your Workspace
          </h1>
          <div className="rounded-[40px] bg-white px-16.5 py-12.75 max-w-3.71xl w-full flex flex-col white-box  items-center gap-15">
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <h3 className=" text-default font-medium text-xl">
                Your Workspace ID
              </h3>
              <div className=" text-default">
                Share below Id with team members.
              </div>
              <div className="flex w-full items-center justify-center">
                <div className="border rounded-lg flex py-3 items-center justify-evenly w-full max-w-md-40">
                  <h2
                    ref={codeRef}
                    className="font-medium text-xl overflow-x-auto"
                  >
                    {workspaceId}
                  </h2>
                  <img
                    src={require("../../assets/Icons/copy-Icon.png")}
                    alt="Copy"
                    className="m-4 w-5 h-6 cursor-pointer"
                    onClick={handleCopyCode}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/dashboardScreen")}
              className="Submit-btn w-full text-white prime_color text-base font-medium py-4 rounded-full max-w-lg transition duration-300"
              type="button"
            >
              Start your Journey with desktopper
            </button>
          </div>
          {/* <div className="text-footer pt-6 text-white font-medium text-center absolute bottom-(-20) mt-10">
            Terms and Conditions / Privacy Policy
          </div> */}
        </div>
        <img
          src={require("../../assets/Rectangle 2.png")}
          alt="Pink Layer Backgound"
          className="pink-backgound-layer reverse"
        />
      </div>
    </>
  );
}

export default InviteWorkspace;
