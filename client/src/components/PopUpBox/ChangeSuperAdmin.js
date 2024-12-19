import { AuthContext } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { Dialog } from "@headlessui/react";
import React, { useContext } from "react";
import { toast } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

const ChangeSuperAdmin = ({
  isOpen,
  setIsOpen,
  superAdminEmail,
  member,
  memberId,
  selectedOption,
}) => {
  const { user } = useContext(AuthContext);
  const { isLoading, workspaceId, updateUserRole, getWorkSpaceInfo } =
    useContext(WorkSpaceContext);

  const { updateSuperAdmin } = useContext(UserContext);

  const handleChangeSuperAdmin = async () => {
    if (!superAdminEmail || !workspaceId) {
      toast.error("Please try again!");
    } else {
      updateSuperAdmin({
        currentEmail: superAdminEmail,
        newEmail: member?.email,
        workspaceId: user?.workspaceId,
      })
        .then(() => {
          updateUserRole({
            memberId,
            workspaceId,
            selectedOption:
              selectedOption !== "Super Admin" ? selectedOption : "admin",
          })
            .then(() => {
              toast.success(`${member?.fullName}'s role changed successfully!`);
              getWorkSpaceInfo(user?.workspaceId);
            })
            .catch((error) => {
              toast.error(
                error?.response?.data?.err || "User role is not changed!"
              );
            });
        })
        .catch(() => {
          toast.error("Error occured, please try again!");
        });
    }
  };
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-[#FFFFFF] w-[421px] h-[400px] rounded-[20px] shadow-lg p-4 flex flex-col justify-evenly">
        <Dialog.Title className="text-[#36454F] text-center text-2xl font-semibold leading-6">
          Change Super Admin
        </Dialog.Title>
        <Dialog.Description className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto">
          {`If you make ${member?.fullName} super admin then your plan details i.e. account information, billing & shipping address, payment methods and billing history will be transferred to ${member?.fullName}`}
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
            onClick={handleChangeSuperAdmin}
          >
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
              "Proceed"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangeSuperAdmin;
