import React, { useContext, useEffect } from "react";
import "./InviteScreen.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Waiting from "../../assets/waiting.svg";
import Navbar from "../../components/Navbar/Navbar";

function InviteScreen() {
  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    updateUser()
      .then((data) => {
        if (data.userRole !== "pending" && data.approvalStatus === true) {
          navigate("/dashboard/dashboardScreen");
        }
      })
      .catch((e) => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="background"></div>
      <div className="signup-container reverse">
        <div
          className="flex flex-col justify-center items-center w-full h-full"
          style={{ paddingTop: "10rem" }}
        >
          <div className="rounded-[40px] bg-white px-14 py-10 max-w-3.70xl w-[50%] h-full flex flex-col white-box items-center gap-15 box_size ">
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <img
                src={Waiting}
                alt="Invite People"
                style={{ height: "200px" }}
              />
            </div>
            <h1 className="text-2xl font-semibold text-default text-center">
              Join request sent, Wait for approval
            </h1>
            <p className="text-gray text-center w-[600px] gray-text">
              Invite Sent! We have sent an invitation to join the workspace you
              requested. Please note that your access will be granted once the
              admin approves your invite
            </p>
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

export default InviteScreen;
