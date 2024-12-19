import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { ReportContext } from "../../context/ReportContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { Dialog } from "@headlessui/react";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const ChangeWorkSpacePop = ({ isOpen, setIsOpen }) => {
  const { user, logout, setUser } = useContext(AuthContext);
  const {
    isLoading,
    workspaceId,
    changeWorkspace,
    setWorkspaceMember,
    setApprovalMember,
  } = useContext(WorkSpaceContext);

  const { setAllUserReports } = useContext(ReportContext);
  const { superAdmin, setSuperAdmin } = useContext(UserContext);
  const { setSubscription } = useContext(PaymentContext);

  const navigate = useNavigate();

  const handleRemoveWorkSpace = async () => {
    if (!superAdmin?.email) {
      toast.error("Please try again!");
    } else if (superAdmin?.email === user?.email) {
      toast.error("Assign someone else as super admin to continue!");
    } else {
      changeWorkspace({ workspaceId, memberId: user?.userId })
        .then((data) => {
          logout()
            .then(() => {
              setAllUserReports([]);
              setSuperAdmin({});
              setWorkspaceMember([]);
              setApprovalMember([]);
              setSubscription([]);
              navigate("/login");
              setUser(null);
            })
            .catch((e) => {});
        })
        .catch((error) => {
          toast.error(error?.response?.data?.err || "Member is not removed!");
        });
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-[#FFFFFF] w-[421px] h-[243px] rounded-[20px] shadow-lg p-4 flex flex-col justify-evenly">
        <Dialog.Title className="text-[#36454F] text-center text-2xl font-semibold leading-6">
          Change Workspace
        </Dialog.Title>
        <Dialog.Description className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto">
          Are you sure you want to change this workspace?
        </Dialog.Description>

        <div className="flex justify-center">
          <button
            className="w-[127px] h-[48px] rounded-[16px] border border-[#4B4B4B] bg-[#FFFFFF] text-[#4B4B4B] hover:cursor-pointer px-4 py-2"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="w-32 h-12 ml-5 rounded-[16px] bg-[#0096EB] text-white hover:cursor-pointer px-4 py-2"
            onClick={handleRemoveWorkSpace}
          >
            {isLoading ? (
              <ColorRing
                visible={true}
                height="32"
                width="32"
                ariaLabel="blocks-loading"
                wrapperclassName="mx-auto blocks-wrapper"
                colors={["#8ECDDD", "#AED2FF", "#E4F1FF"]}
              />
            ) : (
              "Proceed"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangeWorkSpacePop;
