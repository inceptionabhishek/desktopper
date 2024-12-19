import React, { useContext, useEffect, useState } from "react";
import "./Workspace.css";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";

function CreateWorkspace() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { createWorkSpace, isLoading, joinWorkspace } =
    useContext(WorkSpaceContext);

  const { createCustomer } = useContext(PaymentContext);

  const [workspaceId, setWorkspaceId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [joinWorkspaceButton, setJoinWorkspaceButton] = useState(false);
  const [createWorkspaceButton, setCreateWorkspaceButton] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("team-hub-change-workspace")) {
      if (
        localStorage.getItem("team-hub-workspace") ||
        user?.workspaceId?.length > 0
      ) {
        navigate("/dashboard/dashboardScreen");
      }
    }
    return () => {};
  }, [isLoading, user]);

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
            Join or Create a New Workspace
          </h1>
          <div className="rounded-[40px] bg-white px-16.5 py-12.75 white-box max-w-1.72xl w-full">
            {createWorkspaceButton ? (
              <>
                <div className="w-full flex  text-center border rounded-3xl shadow py-12.25">
                  <input
                    className="w-full border-0 text-center px-10 focus:outline-none "
                    type="text"
                    id="CompanyName"
                    autoFocus
                    name="CompanyName"
                    placeholder="Enter your workspace name"
                    value={companyName}
                    onBlur={() =>
                      companyName.length === 0 &&
                      setCreateWorkspaceButton(false)
                    }
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                {isLoading ? (
                  <ColorRing
                    visible={true}
                    height="52"
                    width="52"
                    ariaLabel="blocks-loading"
                    wrapperclassName="mx-auto blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : (
                  <button
                    className="Submit-btn w-full mt-6 text-white prime_color text-base font-medium py-4 rounded-full transition duration-300"
                    type="button"
                    onClick={() => {
                      createWorkSpace({
                        screenshotStatus: false,
                        workspaceName: companyName,
                      })
                        .then((data) => {
                          localStorage.removeItem("team-hub-change-workspace");
                          createCustomer(user?.email);
                          navigate("/invite-workspace");
                        })
                        .catch((e) => {});
                    }}
                  >
                    Start Inviting People
                  </button>
                )}
              </>
            ) : (
              <div
                className="w-full text-center border rounded-3xl shadow py-12.25 cursor-pointer"
                onClick={() => setCreateWorkspaceButton(true)}
              >
                Create Workspace
              </div>
            )}
            <h4 className="text-center my-3">Or</h4>
            {joinWorkspaceButton ? (
              <>
                <div className="w-full flex  text-center border rounded-3xl shadow py-12.25">
                  <input
                    className="w-full border-0 text-center px-10 focus:outline-none "
                    type="text"
                    id="WorkspaceId"
                    autoFocus
                    name="WorkspaceId"
                    placeholder="Enter Workspace ID"
                    value={workspaceId}
                    onBlur={() =>
                      workspaceId.length === 0 && setJoinWorkspaceButton(false)
                    }
                    onChange={(e) => setWorkspaceId(e.target.value)}
                  />
                </div>
                {isLoading ? (
                  <ColorRing
                    visible={true}
                    height="52"
                    width="52"
                    ariaLabel="blocks-loading"
                    wrapperclassName="mx-auto blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : (
                  <button
                    onClick={() => {
                      localStorage.removeItem("team-hub-change-workspace");
                      joinWorkspace(workspaceId);
                      navigate("/invite-screen");
                    }}
                    className="Submit-btn w-full mt-6 text-white prime_color text-base font-medium py-4 rounded-full transition duration-300"
                    type="submit"
                  >
                    Join
                  </button>
                )}
              </>
            ) : (
              <div
                className="w-full text-center border rounded-3xl shadow py-12.25 cursor-pointer"
                onClick={() => setJoinWorkspaceButton(true)}
              >
                Join a Workspace
              </div>
            )}
          </div>
          <div className="text-footer pt-6 font-medium text-center">
            Terms and Conditions / Privacy Policy
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateWorkspace;
