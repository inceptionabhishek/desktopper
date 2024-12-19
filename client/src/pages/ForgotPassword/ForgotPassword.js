import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, user, ForgotPassword, updatePassword } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailVerifed, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user?.workspaceId) {
      localStorage.setItem(
        "team-hub-workspace",
        JSON.stringify(user?.workspaceId)
      );
    }
    if (user) {
      navigate("/create-workspace");
    }
    return () => {};
  }, [user, isLoading, isLoggedIn]);

  // const otpGenerator = () => {
  //   return 1234
  // };

  const handler = async () => {
    if (showOtpVerification) {
      if (enteredOtp === otp) {
        toast.success("OTP verified successfully");
        setEmailVerified(true);
      } else {
        toast.error("Invalid OTP");
      }
    } else {
      toast.success("OTP sent successfully");
      const generatedOtp = 1234;
      await ForgotPassword({
        email: enteredEmail,
        otp: generatedOtp,
      });
      setOtp(generatedOtp);
      setShowOtpVerification(true);
    }
  };
  const checkPasswordRegex = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/.test(
      password
    );
  };
  const passwordHandler = () => {
    if (password === confirmpassword) {
      if (
        !checkPasswordRegex(password) ||
        !checkPasswordRegex(confirmpassword)
      ) {
        toast.error(
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase and 1 number"
        );
        return;
      }
      updatePassword({
        email: enteredEmail,
        password: password,
        confirmPassword: confirmpassword,
      });

      toast.success("Password changed successfully");
      navigate("/login");
    } else {
      toast.error("Password and Confirm Password should be same");
    }
  };
  return (
    <div>
      <img
        src={require("../../assets/Rectangle 1.png")}
        alt="Pink Layer Backgound"
        className="pink-backgound-layer"
      />
      <div className="signup-container">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <h1 className="form-title text-2xl font-semibold mb-6 text-white text-center">
            Forgot Password
          </h1>
          <div className="container mx-auto max-w-1.72xl">
            <div className="rounded-[40px] bg-white px-16.5 py-12.75 white-box">
              {emailVerifed ? (
                <>
                  <h1 className="text-xl font-medium mb-10 text-center prime_color_text">
                    Please Enter Your New Password
                  </h1>
                  <div className=" mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-1 ps-5 py-4.25 pe-15.25 border border-gray-300 rounded-xl focus:outline-none"
                        type={showPassword ? "text" : "password"}
                        id="password_first"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        value={password}
                        placeholder="Enter Password"
                      />
                      <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {/* {showPassword ? "hide" : "show"} */}
                        {showPassword ? (
                          <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                          <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                      </button>
                    </div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-1 ps-5 py-4.25 pe-15.25 border border-gray-300 rounded-xl focus:outline-none "
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_confirm"
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                        value={confirmpassword}
                        placeholder="Again enter Password"
                      />
                      <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {/* {showPassword ? "hide" : "show"} */}
                        {showConfirmPassword ? (
                          <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                        ) : (
                          <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        )}
                      </button>
                    </div>
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
                      className="Submit-btn w-full mt-4 text-white prime_color text-sm font-medium py-3 rounded-full transition duration-300"
                      onClick={passwordHandler}
                    >
                      Submit
                    </button>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-xl font-medium mb-10 text-center prime_color_text">
                    Please confirm Your Email
                  </h1>
                  <div className=" mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Email Address
                    </label>
                    <input
                      className="w-full h-1 ps-5 py-4.25 pe-15.25 border border-gray-300 rounded-xl focus:outline-none "
                      type="text"
                      id="email"
                      disabled={showOtpVerification ? true : false}
                      onChange={(e) => {
                        setEnteredEmail(e.target.value);
                      }}
                      placeholder="example@site.com"
                    />
                    {showOtpVerification && (
                      <div className="mt-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="name"
                        >
                          OTP
                        </label>
                        <input
                          className="w-full h-1 ps-5 py-4.25 pe-15.25 border border-gray-300 rounded-xl focus:outline-none "
                          type="text"
                          id="otp"
                          placeholder="Enter OTP"
                          onChange={(e) => {
                            setEnteredOtp(e.target.value);
                          }}
                        />
                      </div>
                    )}
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
                      className="Submit-btn w-full mt-4 text-white prime_color text-sm font-medium py-3 rounded-full transition duration-300"
                      onClick={handler}
                    >
                      {showOtpVerification ? "Verify" : "Send OTP"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="pt-6 text-footer font-medium text-center">
            Terms and Conditions / Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
