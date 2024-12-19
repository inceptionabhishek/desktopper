import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { MdAttachEmail } from "react-icons/md";
function VerifyToken() {
  const navigate = useNavigate();
  const { VerifyTokenApi } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = window.location.pathname.split("/")[2];
    async function VerifyTokenApiFunc(token) {
      try {
        const res = await VerifyTokenApi(token);
        setMessage(res.data.msg || res.data.err || "Please try again!");
        toast.success(res.data.msg || res.data.err || "Please try again!", {
          toastId: "verifyToken",
        });
        const user = JSON.parse(localStorage.getItem("team-hub-user"));
        user.accountStatus = 1;
        localStorage.setItem("team-hub-user", JSON.stringify(user));
      } catch (error) {}
    }
    VerifyTokenApiFunc(token);
  }, []);

  return (
    <>
      <div className="signup-container reverse">
        <div
          className="flex flex-col justify-center items-center w-full h-full"
          style={{ paddingTop: "10rem" }}
        >
          <div className="rounded-[40px] bg-white px-14 py-10 max-w-3.70xl w-[50%] h-full flex flex-col white-box items-center gap-15 box_size ">
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <MdAttachEmail className="text-6xl text-default" />
            </div>
            <h1 className="text-2xl font-semibold text-default text-center">
              Hi, User We are verifying your account
            </h1>
            <p className="text-2xl font-semibold text-default text-center">
              {message || "Please wait for a while"}
            </p>
            <button
              className="bg-default text-white font-semibold text-lg rounded-[10px] px-10 py-2"
              onClick={() => navigate("/dashboard/dashboardScreen")}
            >
              Go To Dashboard
            </button>
          </div>
          <div className="text-footer pt-6 text-white font-medium text-center ">
            Terms and Conditions / Privacy Policy
          </div>
        </div>
      </div>
      <img
        src={require("../../assets/Rectangle 2.png")}
        alt="Pink Layer Backgound"
        className="pink-backgound-layer reverse"
      />
    </>
  );
}

export default VerifyToken;
