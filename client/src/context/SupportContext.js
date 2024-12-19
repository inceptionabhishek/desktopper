import axios from "axios";
import React, { createContext, useState } from "react";

const SupportContext = createContext();

const SupportProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [supports, setSupports] = useState([]);

  const createSupport = (support) => {
    setIsLoading(true);
    axios({
      url: `/support/createSupport`,
      method: "POST",
      data: support,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setSupports([...supports, data]);

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const fetchSupportsByUserId = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios({
        url: `/support/getSupportByUserId/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      });
      const data = response.data.supportTickets;
      setSupports(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const SupportContextValue = {
    isLoading,
    createSupport,
    fetchSupportsByUserId,
    supports,
    setSupports,
  };
  return (
    <SupportContext.Provider value={SupportContextValue}>
      {children}
    </SupportContext.Provider>
  );
};

export { SupportContext, SupportProvider };
