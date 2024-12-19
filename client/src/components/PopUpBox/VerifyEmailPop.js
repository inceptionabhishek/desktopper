import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-hot-toast";
import { MdMarkEmailRead } from "react-icons/md";

const VerifyEmailPop = ({ isOpen, setIsOpen }) => {
  const { user, logout, setUser, verifyEmailLink } = useContext(AuthContext);
  const { isLoading, workspaceId, changeWorkspace } =
    useContext(WorkSpaceContext);
  const [resendButton, setResendButton] = useState(false); // Initially, allow resending
  const [timer, setTimer] = useState(60);

  const handler = async () => {
    const res = await verifyEmailLink({
      email: user.email,
    });
    toast.success(res?.data?.err || "Email sent successfully");
    setResendButton(true);
  };
  useEffect(() => {
    if (timer > 0 && resendButton) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setResendButton(false);
      setTimer(60);
    }
  }, [timer, resendButton]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="rounded-4xl"
    >
      <div className="shadow-lg p-4">
        <DialogTitle className="text-lg font-bold mb-2 text-center text-[#2F4C5F] flex">
          <MdMarkEmailRead className="text-[#2F4C5F] text-2xl mr-2 mt-2" />
          Verify email
        </DialogTitle>
        <DialogContent className="mb-4 text-lg font-bold text-[#9BABB8]">
          <div className="container mx-auto max-w-1.72xl">
            <>
              <div className=" mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Email Address
                </label>
                <input
                  className="w-[400px] p-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none"
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                />
              </div>
              {resendButton && (
                <>
                   <p class="text-base font-inter font-semibold text-center text-[#9BABB8]">

                  Verification mail sent, please check your inbox. If you
                  haven't received the mail please check spam box or resend the
                  verification mail.
                  </p>
                  <br />
                  <p className="text-sm text-center text-[#9BABB8]">
                    Resend after {timer} seconds
                  </p>
                </>
              )}
              <button
                className="Submit-btn w-full mt-4 text-white prime_color text-sm font-medium py-3 rounded-full transition duration-300"
                onClick={handler}
                disabled={resendButton}
                style={{
                  backgroundColor: resendButton ? "#E4E7EB" : "#2F4C5F",
                }}
              >
                Send Verification Mail
              </button>
            </>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};
export default VerifyEmailPop;
