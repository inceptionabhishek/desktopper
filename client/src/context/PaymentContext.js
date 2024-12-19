import axios from "axios";
import React, { createContext, useState } from "react";

const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [invoiceDownloadURL, setInvoiceDownloadURL] = useState([]);
  const [isSpaceAvailable, setIsSpaceAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const [APIComplete, setAPIComplete] = useState(false);
  const [isMembersPossible, setIsMembersPossible] = useState(true);
  const [showTrialEndModal, setShowTrialEndModal] = useState(false);
  const [isPlanDetailsVisible, setIsPlanDetailsVisible] = useState(false);

  const getIsSpaceAvailable = (userEmail, userId) => {
    setIsLoading(true);
    axios({
      url: `chargebee/isSpaceAvailabe/${userEmail}/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setIsSpaceAvailable(...Object.values(data));
        setIsLoading(false);
      })
      .catch((e) => {
        setIsSpaceAvailable([]);
        setIsLoading(false);
      });
  };

  const getCustomer = (userEmail) => {
    setIsLoading(true);
    axios({
      url: `chargebee/getCustomer/${userEmail}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setCustomerData([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setCustomerData([]);
        setIsLoading(false);
      });
  };

  const createCustomer = (userEmail) => {
    setIsLoading(true);
    axios({
      url: `chargebee/signup/${userEmail}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        setCustomerData([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setCustomerData([]);
        setIsLoading(false);
      });
  };

  const viewSubscription = (userEmail, workspaceMembers) => {
    setIsLoading(true);
    axios({
      url: `chargebee/viewSubscription/${userEmail}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;
        const subscriptionObject = [...Object.values(data)];
        setSubscription([...Object.values(data)]);
        if (
          subscriptionObject[0]?.length > 0 ||
          subscriptionObject[1]?.length > 0 ||
          subscriptionObject[2]?.length > 0
        ) {
          if (subscriptionObject[0]?.length > 0) {
            setIsMembersPossible(
              subscriptionObject[0][0]?.subscription_items[0]?.quantity >=
                workspaceMembers.length
            );
          }
          const currentDate = new Date();

          if (
            (subscriptionObject[1]?.length > 0 &&
              new Date(subscriptionObject[1][0]?.trial_end * 1000) <=
                currentDate) ||
            (subscriptionObject[1]?.length === 0 &&
              subscriptionObject[0]?.length === 0) ||
            subscriptionObject[0][0]?.subscription_items[0]?.quantity <
              workspaceMembers.length
          ) {
            setShowTrialEndModal(true);
          } else {
            setShowTrialEndModal(false);
          }
          setAPIComplete(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getInvoiceDownloadURL = (userEmail) => {
    setIsLoading(true);
    axios({
      url: `chargebee/getInvoiceByEmail/${userEmail}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const data = response.data;

        setInvoiceDownloadURL([...Object.values(data)]);
        setIsLoading(false);
      })
      .catch((e) => {
        setInvoiceDownloadURL([]);
        setIsLoading(false);
      });
  };

  const generatePortalSessionURL = (customerId) => {
    setIsLoading(true);
    setIsPortalLoading(true);
    axios({
      url: `/chargebee/generatePortalSession/${customerId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const val = response?.data;
        window.location.href = val?.access_url;
        setIsLoading(false);
        setIsPortalLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setIsPortalLoading(false);
      });
  };

  const generateCheckoutSessionURL = (planId, quantity, adminEmailId) => {
    setIsLoading(true);
    axios({
      url: `/chargebee/generateCheckout/${planId}/${quantity}/${adminEmailId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const val = response?.data;
        window.location.href = val?.hosted_page?.url;
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const generateBillingHistoryURL = (customerId) => {
    setIsLoading(true);
    setIsInvoiceLoading(true);
    axios({
      url: `/chargebee/generatePortalSession/${customerId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("team-hub-token")
        )}`,
      },
    })
      .then((response) => {
        const val = response?.data;
        const newTab = window.open(val?.access_url, "_blank");
        setTimeout(() => {
          // Close the new tab
          newTab.close();
          window.open(
            `https://desktopper-test.chargebee.com/portal/v2/billing_history?token=${val?.token}`,
            "_self"
          );
          setIsLoading(false);
          setIsInvoiceLoading(false);
        }, 1500);
      })
      .catch((e) => {
        setIsLoading(false);
        setIsInvoiceLoading(false);
      });
  };

  const updateSubscription = (subsciptionId, subsciptionItemId, quantity) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      axios({
        url: `/chargebee/subscription/${subsciptionId}/${subsciptionItemId}/${quantity}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("team-hub-token")
          )}`,
        },
      })
        .then((response) => {
          const val = response?.data;
          setIsLoading(false);
          resolve(val);
        })
        .catch((e) => {
          setIsLoading(false);
          reject(e);
        });
    });
  };

  const PaymentContextValue = {
    isLoading,
    isInvoiceLoading,
    isPortalLoading,
    customerData,
    setCustomerData,
    isSpaceAvailable,
    invoiceDownloadURL,
    APIComplete,
    isMembersPossible,
    getIsSpaceAvailable,
    showTrialEndModal,
    setShowTrialEndModal,
    subscription,
    setSubscription,
    isPlanDetailsVisible,
    setIsPlanDetailsVisible,
    getCustomer,
    viewSubscription,
    createCustomer,
    getInvoiceDownloadURL,
    generatePortalSessionURL,
    generateCheckoutSessionURL,
    generateBillingHistoryURL,
    updateSubscription,
  };
  return (
    <PaymentContext.Provider value={PaymentContextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentContext, PaymentProvider };
