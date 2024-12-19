import PlanDetails from "../../components/PopUpBox/PlanDetails";
import { AuthContext } from "../../context/AuthContext";
import { PaymentContext } from "../../context/PaymentContext";
import { UserContext } from "../../context/UserContext";
import SubscriptionSkeleton from "../../skeletonUi/SubscriptionSkeleton";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import { Link } from "react-router-dom";

const ManageSubscription = () => {
  const { user } = useContext(AuthContext);
  const {
    customerData,
    subscription,
    invoiceDownloadURL,
    generateBillingHistoryURL,
    getInvoiceDownloadURL,
    generatePortalSessionURL,
    isPlanDetailsVisible,
    setIsPlanDetailsVisible,
    APIComplete,
    isInvoiceLoading,
    isPortalLoading,
  } = useContext(PaymentContext);

  const { superAdmin } = useContext(UserContext);

  const [createdAt, setCreatedAt] = useState(false);
  const [trialEnd, setTrialEnd] = useState(false);

  const handleInvoiceDownload = () => {
    if (invoiceDownloadURL && invoiceDownloadURL[0]) {
      window.open(invoiceDownloadURL[0], "_self");
    } else {
      toast.error("Please try again!");
    }
  };

  useEffect(() => {
    setIsPlanDetailsVisible(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (subscription[1]?.length > 0)
        setTrialEnd(new Date(subscription[1][0]?.trial_end * 1000));

      if (subscription[0]?.length > 0) {
        await getInvoiceDownloadURL(superAdmin?.email);
      }
    };

    fetchData();
  }, [subscription]);

  useEffect(() => {
    setCreatedAt(new Date(customerData[0]?.created_at * 1000));
  }, [customerData]);

  return (
    <>
      {!APIComplete ? (
        <SubscriptionSkeleton />
      ) : (
        <>
          <div className={`p-14 ${isPlanDetailsVisible ? "blur" : ""}`}>
            <div>
              <div className="flex justify-between ">
                <div className="flex flex-row items-center pb-12 gap-7">
                  <div className="avatar bg-[#2F4C5F] h-14 w-14 rounded-full flex justify-center items-center cursor-pointer text-white text-4xl">
                    {user?.fullName?.length > 0 &&
                      user?.fullName.charAt(0)?.toUpperCase()}
                  </div>
                  <h2 className="dashboard-container-heading">
                    {user?.fullName}
                  </h2>
                </div>

                <Link to="/dashboard/dashboardScreen">
                  {" "}
                  <button className="px-4 py-2 mt-0 text-white bg-[#526D82] rounded cursor-pointer hover:bg-[#27374D] transition duration-300">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
              <div className="text-gray-600 bg-[#F4FBFF] p-4 rounded-lg shadow-md">
                <div className="flex gap-8">
                  <p className="font-semibold underline flex items-end">
                    Super Admin details
                  </p>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="text-base text-[#808080]">
                    <span className="font-semibold text-gray-600">Email:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;{superAdmin?.email}
                  </div>
                  <div className="text-base text-[#808080]">
                    <span className="font-semibold text-gray-600">Id:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;{customerData[0]?.id}
                  </div>
                  <div className="text-base text-[#808080]">
                    <span className="font-semibold text-gray-600">Joined:</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {` ${createdAt && createdAt.toLocaleDateString()}`}
                  </div>
                </div>
              </div>
            </div>

            <br />

            {subscription[0] &&
            (subscription[0][0]?.activated_at ||
              subscription[0][0]?.updated_at) ? (
              <div className="mt-4 flex text-gray-600 bg-[#F4FBFF] p-4 rounded-lg shadow-md">
                <div className="w-[80%]">
                  <div className="flex justify-between mt-4 mb-4">
                    <p className="font-semibold mb-2 underline">My plan</p>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex">
                      <div>
                        <span className="font-semibold text-gray-600">
                          Plan type:
                        </span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {(subscription[0] &&
                          subscription[0][0] &&
                          subscription[0][0]?.subscription_items[0] &&
                          subscription[0][0]?.subscription_items[0]
                            ?.item_price_id === "Starter-USD-Monthly") ||
                        subscription[0][0]?.subscription_items[0]
                          ?.item_price_id === "Starter-INR-Monthly" ||
                        subscription[0][0]?.subscription_items[0]
                          ?.item_price_id === "Starter-USD-Yearly" ||
                        subscription[0][0]?.subscription_items[0]
                          ?.item_price_id === "Starter-INR-Yearly"
                          ? "Starter plan"
                          : "Pro Plan"}
                      </div>

                      <div>
                        <span
                          className={`font-semibold ${
                            (subscription[0] &&
                              subscription[0][0] &&
                              subscription[0][0]?.subscription_items[0] &&
                              subscription[0][0]?.subscription_items[0]
                                ?.item_price_id === "Starter-USD-Monthly") ||
                            subscription[0][0]?.subscription_items[0]
                              ?.item_price_id === "Starter-INR-Monthly" ||
                            subscription[0][0]?.subscription_items[0]
                              ?.item_price_id === "Starter-USD-Yearly" ||
                            subscription[0][0]?.subscription_items[0]
                              ?.item_price_id === "Starter-INR-Yearly"
                              ? "ml-[275px]"
                              : "ml-[310px]"
                          }`}
                        >
                          Plan Id:{" "}
                        </span>
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {subscription[0] &&
                            subscription[0][0] &&
                            subscription[0][0]?.subscription_items[0] &&
                            subscription[0][0]?.subscription_items[0]
                              ?.item_price_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex mb-4">
                      <div>
                        <span className="font-semibold">Limit of User: </span>
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {subscription[0] &&
                            subscription[0][0] &&
                            subscription[0][0]?.subscription_items[0] &&
                            subscription[0][0]?.subscription_items[0]?.quantity}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold  ml-[335px]">
                          Amount paid:{" "}
                        </span>
                        <span>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {subscription[0] &&
                            subscription[0][0] &&
                            subscription[0][0]?.subscription_items[0] &&
                            subscription[0][0]?.subscription_items[0]?.amount /
                              100}
                        </span>
                        <span>
                          &nbsp;&nbsp;
                          {subscription[0] &&
                            subscription[0][0] &&
                            subscription[0][0]?.currency_code}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-[20%] flex flex-col justify-start items-center gap-4">
                  {customerData[0]?.id && (
                    <>
                      <a
                        onClick={() =>
                          generatePortalSessionURL(customerData[0]?.id)
                        }
                        className="flex justify-center px-4 py-2 text-white bg-[#0096EB] w-[80%] rounded cursor-pointer hover:bg-yellow-600 transition duration-300"
                      >
                        {isPortalLoading ? (
                          <ColorRing
                            visible={true}
                            height="32"
                            width="32"
                            ariaLabel="blocks-loading"
                            wrapperclassName="mx-auto blocks-wrapper"
                            colors={["#8ECDDD, #AED2FF", "#E4F1FF"]}
                          />
                        ) : (
                          "Manage Subscription"
                        )}
                      </a>

                      <button
                        className="flex justify-center px-4 py-2 text-white bg-[#36454F] w-[80%] rounded cursor-pointer hover:bg-[#526D82] transition duration-300"
                        onClick={() => {
                          handleInvoiceDownload();
                        }}
                      >
                        {isInvoiceLoading ? (
                          <ColorRing
                            visible={true}
                            height="32"
                            width="32"
                            ariaLabel="blocks-loading"
                            wrapperclassName="mx-auto blocks-wrapper"
                            colors={["#8ECDDD, #AED2FF", "#E4F1FF"]}
                          />
                        ) : (
                          "Download Latest Invoice"
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-gray-600 bg-[#F4FBFF] p-4 rounded-lg shadow-md">
                <div className="flex justify-between mb-4">
                  <p className="font-semibold mb-2 underline">My plan</p>
                  {subscription[0]?.length === 0 && (
                    <div>
                      <div className="">
                        <button
                          onClick={() => {
                            setIsPlanDetailsVisible(!isPlanDetailsVisible);
                          }}
                          className="px-4 py-2 text-white bg-[#0096EB] rounded cursor-pointer hover:bg-yellow-600 transition duration-300"
                        >
                          Upgrade plan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-5">
                  {!(subscription[0] && subscription[0][0]?.activated_at) && (
                    <div>
                      <span className="font-semibold text-gray-600">
                        Plan type:
                      </span>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="text-[#808080]">
                        {subscription[1]?.length ? "Trial plan" : "No plan"}
                      </span>
                    </div>
                  )}

                  {subscription[1] &&
                    subscription[1][0]?.trial_end &&
                    !(
                      subscription[0] &&
                      subscription[0][0] &&
                      subscription[0][0]?.activated_at
                    ) && (
                      <div className="text-base text-[#808080]">
                        <span className="font-semibold text-gray-600">
                          Trial end:
                        </span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        {` ${trialEnd && trialEnd.toLocaleDateString()}`}
                      </div>
                    )}
                </div>
              </div>
            )}

            <br />

            {subscription[0] &&
              (subscription[0][0]?.activated_at ||
                subscription[0][0]?.updated_at) && (
                <div className="mt-4 text-gray-600 bg-[#F4FBFF] p-4 rounded-lg shadow-md">
                  <p className="font-semibold mb-6 underline">
                    Subscription Details
                  </p>
                  <div className="flex">
                    {subscription[0] && subscription[0][0]?.activated_at && (
                      <div className="text-base text-[#808080]">
                        <span className="font-semibold text-gray-600">
                          Activated At:
                        </span>{" "}
                        {new Date(
                          subscription[0][0]?.activated_at * 1000
                        ).toLocaleDateString()}
                      </div>
                    )}
                    {subscription[0] && subscription[0][0]?.updated_at && (
                      <div className="text-base text-[#808080] ml-[272px]">
                        <span className="font-semibold text-gray-600">
                          Updated At:
                        </span>{" "}
                        {new Date(
                          subscription[0][0]?.updated_at * 1000
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <br />
                  <div className="flex">
                    {subscription[0] &&
                      subscription[0][0]?.current_term_start && (
                        <div className="text-base text-[#808080]">
                          <span className="font-semibold text-gray-600">
                            Current Term Start:
                          </span>{" "}
                          {new Date(
                            subscription[0][0]?.current_term_start * 1000
                          ).toLocaleDateString()}
                        </div>
                      )}
                    {subscription[0] &&
                      subscription[0][0]?.current_term_end && (
                        <div className="text-base text-[#808080] ml-[220px]">
                          <span className="font-semibold text-gray-600">
                            Current Term End:
                          </span>{" "}
                          {new Date(
                            subscription[0][0]?.current_term_end * 1000
                          ).toLocaleDateString()}
                        </div>
                      )}
                  </div>
                </div>
              )}
          </div>
          {isPlanDetailsVisible && (
            <PlanDetails
              setIsPlanDetailsVisible={setIsPlanDetailsVisible}
              isfromHome={false}
            />
          )}
        </>
      )}
    </>
  );
};

export default ManageSubscription;
