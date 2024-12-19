import { Dialog } from "@headlessui/react";
import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePasswordPopup = ({
  changePasswordPopup,
  onPasswordChange,
  onCancel,
  setChangePasswordPopup,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  currentPassword,
  setCurrentPassword,
}) => {
  const { user, login } = useContext(AuthContext);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = () => {
    login({
      email: user?.email,
      password: currentPassword,
    })
      .then((data) => {
        // You can add validation and password change logic here
        if (newPassword === confirmPassword) {
          // Call the onPasswordChange function with the new password
          onPasswordChange(newPassword);
          // Close the popup
          setChangePasswordPopup(false);
          setNewPassword(null);
          setConfirmPassword(null);
        } else {
          // Handle password mismatch or other validation error
          toast.error("Passwords do not match!");
        }
      })
      .catch((e) => {
        toast.error("Current password is wrong!");
      });
  };

  return (
    <Dialog
      open={changePasswordPopup}
      onClose={() => setChangePasswordPopup(true)}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white w-[30%] h-[80%] rounded-2xl shadow-lg p-4">
        <Dialog.Title className="text-[#36454F] text-center text-2xl font-semibold leading-6 mb-10">
          Change Password
        </Dialog.Title>
        <div className="w-[90%] h-[20%] mb-4 text-center mx-auto">
          <label
            htmlFor="currentPassword"
            className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto"
          >
            Current Password
          </label>
          <div className="flex justify-between">
            <input
              type={showCurrentPassword === false ? "password" : "text"}
              id="currentPassword"
              className="flex mt-3 ml-1 border rounded-2xl w-[90%] p-2 mb-4 focus:bg-gray-100 focus:outline-none focus:border-gray-300 focus:ring focus:ring-gray-200"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="flex justify-end show-password items-center"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {" "}
              {showCurrentPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </button>
          </div>
        </div>
        <div className="w-[90%] h-[20%] mb-4 text-center mx-auto">
          <label
            htmlFor="newPassword"
            className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto"          
            >
            New Password
          </label>
          <div className="flex justify-between">
            <input
              type={showNewPassword === false ? "password" : "text"}
              id="newPassword"
              className="flex mt-3 ml-1 border rounded-2xl w-[90%] p-2 mb-4 focus:bg-gray-100 focus:outline-none focus:border-gray-300 focus:ring focus:ring-gray-200"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="flex justify-end show-password items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {" "}
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </button>
          </div>
        </div>
        <div className="w-[90%] h-[20%] mb-4 mt-4 text-center mx-auto">
          <label
            htmlFor="confirmPassword"
            className="w-[298px] font-poppins font-normal text-base text-center text-[#4B4B4B] mx-auto"
          >
            Confirm Password
          </label>
          <div className="flex justify-between">
            <input
              type={showConfirmPassword === false ? "password" : "text"}
              id="confirmPassword"
              className="flex mt-3 ml-1 border rounded-2xl w-[90%] p-2 mb-4 focus:bg-gray-100 focus:outline-none focus:border-gray-300 focus:ring focus:ring-gray-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="flex justify-end show-password items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {" "}
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button
            className="w-[127px] h-[48px] rounded-[16px] border border-[#4B4B4B] bg-[#FFFFFF] text-[#4B4B4B] hover:cursor-pointer px-4 py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="w-32 h-12 ml-5 rounded-[16px] bg-[#0096EB] text-white hover:cursor-pointer px-4 "
            onClick={handlePasswordChange}
          >
            Update
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ChangePasswordPopup;
