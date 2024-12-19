import React, { useContext, useEffect, useState } from "react";
import "./verifyemail.css";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

function VerifyEmail() {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn, user, verifyEmailLink } =
    useContext(AuthContext);
  const [enteredEmail, setEnteredEmail] = useState("");

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
  }, [user, isLoading, isLoggedIn, navigate]);

  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const handler = async () => {
    if (!regexEmail.test(enteredEmail))
      return toast.error("Please enter valid email");
    if (!enteredEmail) return toast.error("Please enter email");
    const res = await verifyEmailLink({
      email: enteredEmail,
    });
    toast.success(res?.data?.err || "Email sent successfully");
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
            Verify Your Email
          </h1>
          <div className="container mx-auto max-w-1.72xl">
            <div className="rounded-[40px] bg-white px-16.5 py-12.75 white-box">
              <>
                <h1 className="text-sn font-medium mb-10 text-center prime_color_text">
                  Please check your email and complete the verification process.
                  If you haven’t yet received the verification mail, please
                  check in spam or click on the resend button.
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
                    type="email"
                    id="email"
                    onChange={(e) => {
                      setEnteredEmail(e.target.value);
                    }}
                    placeholder="example@site.com"
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
                    className="Submit-btn w-full mt-4 text-white prime_color text-sm font-medium py-3 rounded-full transition duration-300"
                    onClick={handler}
                  >
                    Resend Mail
                  </button>
                )}
              </>
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

export default VerifyEmail;
