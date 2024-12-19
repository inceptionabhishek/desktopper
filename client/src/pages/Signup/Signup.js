import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Signup.css";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { AuthContext } from "../../context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
  const navigate = useNavigate();
  const { isLoading, user, signup, captchaVerify } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const captchaRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const onSubmit = (userData) => {
    const token = captchaRef.current.getValue();
    captchaRef.current.reset();
    captchaVerify({
      token: token,
    })
      .then((data) => {
        if (data.data === "Human") {
          if (
            phoneNumber === null ||
            phoneNumber === "" ||
            phoneNumber?.length <= 4
          ) {
            toast.error("Please enter a valid phone number!");
            return;
          }
          signup({
            email: userData?.email,
            password: userData?.password,
            confirmPassword: userData?.password,
            fullName: userData?.name,
            companyName: "",
            phoneNumber: phoneNumber,
          })
            .then((resData) => {
              if (resData?.data?.data?.workspaceId) {
                navigate("/dashboard/dashboardScreen");
              }
            })
            .catch((e) => {
              if (e?.response?.data.err === "User already Present") {
                toast.error("User already Present!");
                navigate("/login");
              }
            });
        } else {
          toast.error("Please correctly verify captcha!");
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (user) {
      navigate("/create-workspace");
    }

    return () => {};
  }, [isLoading, user]);

  useEffect(() => {
    // window.callAdsTag();

    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");

    if (emailParam) {
      setValue("email", emailParam);
    }
  }, []);

  const redirectTermandCondition = () => {
    let t = new URL(window.location.href),
      a = t.searchParams.get("leadOwner"),
      o = t.searchParams.get("utm_source") || t.searchParams.get("leadSource"),
      e = t.searchParams.get("mailId");

    if (a === null || o === null || e === null) {
      window.open("https://www.desktopper.com/terms.html", "_blank", "noopener");
    } else {
      window.open(
        `https://www.desktopper.com/terms.html?leadOwner=${a}&leadSource=${o}&mailId=${e}`,
        "_blank",
        "noopener"
      );
    }
  };

  return (
    <>
      <img
        src={require("../../assets/Rectangle 1.png")}
        alt="Pink Layer Backgound"
        className="pink-backgound-layer"
      />
      <div className="signup-container">
        <div className="flex flex-col justify-center items-center w-full h-full ">
          <h1 className="form-title text-2xl font-semibold mb-6 text-white text-center">
            Sign up and start using desktopper
          </h1>
          <div className="container mx-auto max-w-1.72xl">
            <form
              className="rounded-[40px] bg-white px-10 py-12 white-box"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="text-2xl font-medium mb-10 text-center prime_color_text">
                Let's Go
              </h1>
              <div className="mb-6 flex flex-col gap-2.5 ">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  className="w-full h-1 ps-5 py-4.25 pe-15.25 border border-gray-300 rounded-2xl focus:outline-none "
                  type="text"
                  id="name"
                  placeholder="Eg.John Doe"
                  {...register("name", {
                    required: "This field is required",
                  })}
                />
                <ErrorMessage
                  error={errors?.name}
                  message={errors?.name?.message}
                />
              </div>

              <div className="mb-6 flex flex-col gap-2.5 ">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full h-1 ps-5 py-4.25 pe-15.25 border border-gray-300 rounded-2xl focus:outline-none "
                  type="email"
                  id="email"
                  placeholder="example@site.com"
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value:
                        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                <ErrorMessage
                  error={errors.email}
                  message={errors.email?.message}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block mb-4 text-gray-700 text-sm font-bold"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                </label>
                <PhoneInput
                  country="us"
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  inputProps={{
                    className:
                      "w-full h-1 ps-12 py-4.25 pe-15.25 border border-gray-300 rounded-2xl focus:outline-none",
                  }}
                />
                {/* <ErrorMessage
                  error={errors.phoneNumber}
                  message={errors.phoneNumber?.message}
                /> */}
              </div>
              <div className=" mb-8 flex flex-col gap-2.5 ">
                <label
                  className="block text-gray-700 text-sm font-bold"
                  htmlFor="password"
                >
                  Password
                </label>

                <div className="border h-1 border-gray-300 ps-5 py-4.25 pe-5.5 rounded-2xl flex flex-row items-center">
                  <input
                    className="w-full p-0 focus:outline-none "
                    type={showPassword === false ? "password" : "text"}
                    id="password"
                    placeholder="Enter Password"
                    {...register("password", {
                      required: "This field is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {" "}
                    {showPassword ? (
                      <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                      <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  error={errors.password}
                  message={errors.password?.message}
                />
              </div>
              <ReCAPTCHA
                sitekey="6LcM2FwoAAAAAKn2wUUbsIFqm_V5b_gU1ijulDFc"
                ref={captchaRef}
              />

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
                  className="Submit-btn w-full mt-2 text-white prime_color text-sm font-medium py-3 rounded-full transition duration-300"
                  type="submit"
                >
                  Signup
                </button>
              )}
            </form>
          </div>
          <div
            className="text-footer pt-6 font-medium text-center cursor-pointer"
            onClick={redirectTermandCondition}
          >
            Terms and Conditions / Privacy Policy
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
