import React, { useContext, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { AuthContext } from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { login, isLoading, isLoggedIn, user } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // go to top
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    login({
      email: data.email,
      password: data.password,
    })
      .then((data) => {
        if (data?.data?.data?.workspaceId) {
          navigate("/dashboard/dashboardScreen");
        }
      })
      .catch((e) => {
        if (e?.response?.data?.err === "Please verify your email address") {
          toast.error("Please verify your email address");
          navigate("/verifyemail");
        } else if (e?.response?.data.err === "Wrong credentials") {
          toast.error("Either email or password is wrong!");
        } else if (e?.response?.data.err === "User is not Present") {
          toast.error("User is not Present with this credentials!");
        } else {
          toast.error(e?.response?.data?.err || "Something went wrong!");
        }
      });
  };

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

  const validatePasswordFormat = (value) => {
    return true;
  };

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
    <div>
      <img
        src={require("../../assets/Rectangle 1.png")}
        alt="Pink Layer Backgound"
        className="pink-backgound-layer"
      />
      <div className="signup-container">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <h1 className="form-title text-2xl font-semibold mb-6 text-white text-center">
            Welcome back, Login
          </h1>
          <div className="container mx-auto max-w-1.72xl">
            <form
              className="rounded-[40px] bg-white px-10 py-12 white-box"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="text-2xl font-medium mb-10 text-center prime_color_text">
                Let's Go
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
                  placeholder="example@site.com"
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <ErrorMessage
                  error={errors.email}
                  message={errors.email?.message}
                />
              </div>
              <div className="mb-6 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
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
                      validate: validatePasswordFormat,
                    })}
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {" "}
                    {/* {showPassword ? "Hide" : "Show"} */}
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
              <Link className="forgot-password" to={"/forgotPassword"}>
                Forgot Password ?
              </Link>
              <br />
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
                  type="submit"
                >
                  Log in
                </button>
              )}
            </form>
          </div>
          <div
            className="pt-6 text-footer font-medium text-center cursor-pointer"
            onClick={redirectTermandCondition}
          >
            Terms and Conditions / Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
