import axios from "axios";
import React, { createContext, useState } from "react";
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [allUserData, setallUserData] = useState([]);
  const [userProjectsMembersData, setUserProjectsMembersData] = useState([]);
  const [superAdmin, setSuperAdmin] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState(null);

  const getUser = (userId) => {
    setIsLoading(true);
    axios({
      url: `user/getuserData/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;

        setUserData([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setUserData([]);
        setIsLoading(false);
      });
  };

  const getAllUsers = (workspaceId) => {
    setIsLoading(true);
    axios({
      url: `user/getAllUserData/${workspaceId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;

        setallUserData([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setallUserData([]);
        setIsLoading(false);
      });
  };

  const getUserProjectsMembers = (userId) => {
    setIsLoading(true);
    axios({
      url: `user/getUserProjectsMembers/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;

        setUserProjectsMembersData([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setUserProjectsMembersData([]);
        setIsLoading(false);
      });
  };

  const getSuperAdmin = (userId) => {
    setIsLoading(true);
    axios({
      url: `user/getSuperAdmin/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setSuperAdmin(data[0]);
        setIsLoading(false);
      })
      .catch((e) => {
        setSuperAdmin({});
        setIsLoading(false);
      });
  };

  const updateSuperAdmin = ({ currentEmail, newEmail, workspaceId }) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `/chargebee/updateAccountDetails/${currentEmail}/${newEmail}/${workspaceId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const data = response.data;
          setSuperAdmin(data);
          setIsLoading(false);
          resolve(data);
        })
        .catch((e) => {
          setSuperAdmin({});
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const getUserLocation = () => {
    return new Promise(async (resolve, reject) => {
      const ipResponse = await fetch("https://api.ipify.org/?format=json");
      const ipData = await ipResponse.json();

      axios({
        url: `/user/task/fetchLocation/${ipData.ip}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          setCountry(response?.data?.result?.country);
          resolve(response);
        })
        .catch((e) => {
          setSuperAdmin({});
          reject(e);
        });
    });
  };

  const UserContextValue = {
    userData,
    allUserData,
    userProjectsMembersData,
    superAdmin,
    isLoading,
    country,
    setCountry,
    getUserLocation,
    getUser,
    getAllUsers,
    getUserProjectsMembers,
    getSuperAdmin,
    setSuperAdmin,
    updateSuperAdmin,
  };
  return (
    <UserContext.Provider value={UserContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
