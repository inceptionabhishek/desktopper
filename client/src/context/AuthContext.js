import axios from "axios";
import React, { createContext, useState } from "react";


const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("team-hub-user");
    return userData ? JSON.parse(userData) : null;
  });
  const [error, setError] = useState(null);

  axios.defaults.baseURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_TESTING_BASE_URL
      : process.env.REACT_APP_TESTING_BASE_URL;

  const login = (data) => {
    setIsLoading(true);

    return new Promise((resolve, reject) => {
      axios({
        url: "/auth/login",
        method: "POST",
        data: data,
      })
        .then((response) => {
          const user = response.data.data;
          const token = response.data.token;
          localStorage.setItem("team-hub-user", JSON.stringify(user));
          localStorage.setItem("team-hub-token", JSON.stringify(token));
          setUser(user);
          setIsLoading(false);
          setIsLoggedIn(true);
          resolve(response);
        })
        .catch((error) => {
          setIsLoading(false);
          setIsLoggedIn(false);
          reject(error);
        });
    });
  };

  const signup = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      axios({
        url: "auth/register",
        method: "POST",
        data: data,
      })
        .then((response) => {
          if (response?.status === 200) {
            const user = response.data.data;
            const token = response.data.token;
            localStorage.setItem("team-hub-user", JSON.stringify(user));
            localStorage.setItem("team-hub-token", JSON.stringify(token));
            setUser(user);
            setIsLoggedIn(true);
            resolve(response);
            setIsLoading(false);
          }
        })
        .catch((e) => {
          reject(e);
          setIsLoading(false);
        });
    });
  };

  const logout = () => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem("team-hub-user");
        localStorage.removeItem("team-hub-token");
        localStorage.removeItem("team-hub-workspace");
        localStorage.removeItem("team-hub-change-workspace");
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const updateUser = () => {
    return new Promise((resolve, reject) => {
      axios({
        url: "user/task/userData",
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(response.data);
          localStorage.setItem("team-hub-user", JSON.stringify(response.data));
          resolve(response.data);
        })
        .catch((e) => {
          setIsLoggedIn(false);
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const changeIsPopupShowedStatus = (email) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `user/updatePopupStatus/${email}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          setUser(response.data);
          localStorage.setItem("team-hub-user", JSON.stringify(response.data));
          setIsLoading(false);
          resolve(response.data);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const deleteUser = ({ userId, workspaceId }) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `auth/delete/${userId}/${workspaceId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          setIsLoading(false);
          resolve();
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const ForgotPassword = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: "auth/forgotpassword",
        method: "POST",
        data: data,
      })
        .then((response) => {
          setIsLoading(false);
          resolve(response);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const verifyEmailLink = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: "auth/verifyemail",
        method: "POST",
        data: data,
      })
        .then((response) => {
          setIsLoading(false);
          resolve(response);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const updatePassword = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: "auth/updatepassword",
        method: "POST",
        data: data,
      })
        .then((response) => {
          setIsLoading(false);
          resolve(response);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const VerifyTokenApi = (data) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `auth/verify/${data}`,
        method: "GET",
      })
        .then((response) => {
          setIsLoading(false);
          resolve(response);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const captchaVerify = ({ token }) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `auth/verifyCaptchaToken`,
        method: "POST",
        data: { token },
      })
        .then((response) => {
          setIsLoading(false);
          resolve(response);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const authContextValue = {
    isLoading,
    isLoggedIn,
    user,
    error,
    setError,
    login,
    logout,
    signup,
    setUser,
    updateUser,
    deleteUser,
    changeIsPopupShowedStatus,
    ForgotPassword,
    updatePassword,
    verifyEmailLink,
    VerifyTokenApi,
    captchaVerify,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };