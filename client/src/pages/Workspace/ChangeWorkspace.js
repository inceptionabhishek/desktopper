import React, { useContext, useState } from "react";
import { WorkSpaceContext } from "../../context/WorkspaceContext";

const ChangeWorkspace = () => {
  const [workspaceId, setWorkspaceId] = useState("");

  const { joinWorkspace } = useContext(WorkSpaceContext);

  return (
    <>
      <img
        src={require("../../assets/Rectangle 1.png")}
        alt="Pink Layer Backgound"
        className="pink-backgound-layer"
      />
      <div className="signup-container workspace">
        <div className="flex flex-col justify-center items-center w-full h-full ">
          <h1 className="form-title text-2xl font-semibold mb-6 text-white text-center mt-10p">
            Change Workspace
          </h1>
          <div className="rounded-[40px] bg-white px-16.5 py-12.75 white-box max-w-1.72xl w-full">
            <div className="w-full flex  text-center border rounded-3xl shadow py-12.25">
              <input
                className="w-full border-0 text-center px-10 focus:outline-none "
                type="text"
                id="WorkspaceId"
                autoFocus
                name="WorkspaceId"
                placeholder="Enter Workspace ID"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                // localStorage.removeItem("team-hub-workspace");
                joinWorkspace(workspaceId);
                // handleUpdateProfile(profileId, {
                //   workspaceId,
                //   userRole,
                //   approvalStatus,
                // })
                //   .then((data) => {
                //     navigate("/invite-screen");
                //   })
                //   .catch((e) => {
                //
                //   });
              }}
              className="Submit-btn w-full mt-6 text-white prime_color text-base font-medium py-4 rounded-full transition duration-300"
              type="submit"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeWorkspace;
