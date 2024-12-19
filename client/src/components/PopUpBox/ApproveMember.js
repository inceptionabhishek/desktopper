import { PaymentContext } from "../../context/PaymentContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { Dialog } from "@headlessui/react";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

const ApproveMember = ({
  deletePopUp,
  setDeletePopUp,
  selectedMemberId,
  selectedRole,
}) => {
  const { subscription, updateSubscription, isLoading } =
    useContext(PaymentContext);

  const {
    approveUserToWorkspace,
    workspaceId,
    isLoading: workspaceLoading,
  } = useContext(WorkSpaceContext);

  const [isClicked, setIsClicked] = useState(false);

  const IncreaseMember = () => {
    setIsClicked(true);

    const subscriptionId = subscription[0][0]?.id;
    const subscriptionItemId =
      subscription[0][0]?.subscription_items[0]?.item_price_id;
    const updateQuantity =
      Number(subscription[0][0]?.subscription_items[0]?.quantity) + 1;

    if (subscriptionId && subscriptionItemId && updateQuantity) {
      updateSubscription(subscriptionId, subscriptionItemId, updateQuantity)
        .then(() => {
          approveUserToWorkspace({
            workspaceId,
            userRole: selectedRole,
            memberId: selectedMemberId,
          });
          setIsClicked(false);
          setDeletePopUp(false);
        })
        .catch((e) => {
          toast.error("There is some issue, please contact to support team.");
          setIsClicked(false);
          setDeletePopUp(false);
        });
    } else {
      toast.error("There is some issue, please contact to support team.");
      setIsClicked(false);
      setDeletePopUp(false);
    }
  };

  return (
    <Dialog
      open={deletePopUp}
      onClose={() => setDeletePopUp(false)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-[#FFFFFF] w-[421px] h-[243px] rounded-[20px] shadow-lg p-4 flex flex-col justify-evenly">
        <Dialog.Title className="text-[#36454F] text-center text-2xl font-semibold leading-6">
          Information
        </Dialog.Title>
        <Dialog.Description className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto">
          You will be charged extra on prorated basis for adding this additional
          member. Are you sure you want to continue?
        </Dialog.Description>
        <div className="flex justify-center">
          <button
            className="w-[127px] h-[48px] rounded-[16px] border border-[#4B4B4B] bg-[#FFFFFF] text-[#4B4B4B] hover:cursor-pointer px-4 py-2"
            onClick={() => setDeletePopUp(false)}
          >
            Cancel
          </button>
          <button
            className="w-32 h-12 ml-5 rounded-[16px] bg-[#0096EB] text-white hover:cursor-pointer px-4 py-2"
            onClick={IncreaseMember}
          >
            {(isLoading || workspaceLoading) && isClicked ? (
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

export default ApproveMember;
