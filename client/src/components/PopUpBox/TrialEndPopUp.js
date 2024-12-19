import React, { useContext } from "react";
import { PaymentContext } from "../../context/PaymentContext";
import { AuthContext } from "../../context/AuthContext";
import { ColorRing } from "react-loader-spinner";

const TrialEndModal = ({
  setShowTrialEndModal,
  isMembersPossible,
  setIsPlanDetailsVisible,
}) => {
  const { customerData, generatePortalSessionURL, isLoading } =
    useContext(PaymentContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col gap-4 modal-container bg-white w-full max-w-md p-4 rounded-lg shadow-md">
        <h2 className="flex mt-5 text-2xl font-semibold justify-center text-[#36454F]">
          Hi {user?.fullName},
        </h2>
        <p className="flex justify-center text-[#36454F]">
          {isMembersPossible
            ? "Your plan has ended"
            : "Workspace has more members than active plan"}
        </p>
        {user.userRole === "admin" ? (
          <p className="flex justify-center text-center text-[#0096EB]">
            {isMembersPossible
              ? "Subscribe to continue using desktopper"
              : "Upgrade or remove some members from your workspace to continue using desktopper"}
          </p>
        ) : (
          <p className="flex justify-center text-[#0096EB]">
            Please contact the Admin to continue the service
          </p>
        )}
        {user.userRole === "admin" && (
          <button
            className="flex justify-center mt-4 px-4 py-2 bg-[#0096EB] hover:bg-yellow-500 w-[70%] mx-auto text-white rounded-lg mb-5"
            onClick={() => {
              if (isMembersPossible) {
                setShowTrialEndModal(false);
                setIsPlanDetailsVisible(true);
              } else {
                generatePortalSessionURL(customerData[0]?.id);
              }
            }}
            disabled={isLoading}
          >
            {!isMembersPossible ? (
              isLoading ? (
                <ColorRing
                  visible={true}
                  height="32"
                  width="32"
                  ariaLabel="blocks-loading"
                  wrapperclassName="mx-auto blocks-wrapper"
                  colors={["#1AACAC", "#64CCC5", "#2E97A7"]}
                />
              ) : (
                "Upgrade Now"
              )
            ) : (
              "Subscribe Now"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrialEndModal;
