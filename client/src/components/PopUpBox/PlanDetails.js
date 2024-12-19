import React, { useContext, useState, useEffect } from "react";
import { PaymentContext } from "../../context/PaymentContext";
import { UserContext } from "../../context/UserContext";
import { WorkSpaceContext } from "../../context/WorkspaceContext";
import { BiMinus, BiPlus } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

const PlanDetails = ({
  setIsPlanDetailsVisible,
  isfromHome,
  setShowTrialEndModal,
}) => {
  const { generateCheckoutSessionURL, isLoading } = useContext(PaymentContext);
  const { superAdmin, country } = useContext(UserContext);
  const { workspaceMembers } = useContext(WorkSpaceContext);
  const [selectedSubscription, setSelectedSubscription] = useState("Monthly");
  const [selectedPlan, setSelectedPlan] = useState("Starter"); // Initialize with "Starter" for monthly
  const [quantity, setQuantity] = useState(1); // Initialize with a minimum limit of 5

  useEffect(() => {
    if (workspaceMembers.length > 0) {
      setQuantity(workspaceMembers.length);
    }
  }, [workspaceMembers]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (workspaceMembers.length > 0) {
      if (quantity > workspaceMembers.length) {
        setQuantity(quantity - 1);
      } else {
        toast.error(
          "Quantity cannot be less than total number of members in workspace!"
        );
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      } else {
        toast.error("Quantity cannot be less than 1");
      }
    }
  };

  const onSubscribe = () => {
    let productIdentifier =
      country === "India"
        ? `${selectedPlan}-INR-${selectedSubscription}`
        : `${selectedPlan}-USD-${selectedSubscription}`;

    if (selectedPlan === "Starter" || selectedPlan === "Pro") {
      generateCheckoutSessionURL(
        productIdentifier,
        quantity,
        superAdmin?.email
      );
    }
  };

  // Define the plans array with updated descriptions
  const plans = [
    {
      id: "monthly",
      name: "Starter",
      description: [
        "Time Tracking",
        "Timesheets",
        "Screenshots",
        "Efficiency Insights",
        "Project Management",
        "Limited Support",
      ],
      monthlyPrice: country === "India" ? 167 : 2,
      yearlyPrice: country === "India" ? 84 : 1,
    },
    {
      id: "yearly",
      name: "Pro",
      description: [
        "Everything in Starter",
        "Auto discard idle time",
        "Weekly reports",
        "Custom notifications",
        "Logs & efficiency reminders",
        "Premium support",
      ],
      monthlyPrice: country === "India" ? 333 : 4,
      yearlyPrice: country === "India" ? 250 : 3,
    },
  ];

  // Function to handle plan selection
  const handlePlanSelection = (planName) => {
    setSelectedPlan(planName);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto z-[2]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
        <button
          className="bg-gray-200  hover:bg-red-500 text-blacl rounded-full w-8 h-8 absolute top-2 right-2 flex items-center justify-center cursor-pointer"
          onClick={() => {
            if (isfromHome) {
              setIsPlanDetailsVisible(false);
              setShowTrialEndModal(true);
            } else {
              setIsPlanDetailsVisible(false);
            }
          }}
        >
          X
        </button>
        <div className="mb-4 text-center">
          <div className="flex justify-center">
            <button
              className={`${
                selectedSubscription === "Monthly"
                  ? "bg-[#2F4C5F] text-white cursor-pointer w-32"
                  : "bg-gray-100 cursor-pointer w-32"
              } p-2 rounded-md transition-colors duration-300 mr-2`}
              onClick={() => setSelectedSubscription("Monthly")}
            >
              Monthly
            </button>
            <button
              className={`${
                selectedSubscription === "Yearly"
                  ? "bg-[#2F4C5F] text-white cursor-pointer w-24"
                  : "bg-gray-100 cursor-pointer w-24"
              } p-2 rounded-md transition-colors duration-300 ml-2`}
              onClick={() => setSelectedSubscription("Yearly")}
            >
              Yearly
            </button>
          </div>
        </div>
        <div>
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelection(plan.name)}
              className={`${
                plan.name === selectedPlan
                  ? "border-2 border-[#2F4C5F] cursor-pointer"
                  : "cursor-pointer border border-gray-300"
              } flex justify-between mb-4 items-center p-4 rounded-md transition-colors duration-300`}
            >
              <div>
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <ul className="list-disc list-inside text-xs mt-2">
                  {plan.description.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="flex">
                <h5 className="text-xl font-semibold mr-2">
                  {selectedSubscription === "Monthly"
                    ? `${country === "India" ? "₹" : "$"}${plan.monthlyPrice}`
                    : `${country === "India" ? "₹" : "$"}${plan.yearlyPrice}`}
                </h5>
                <div>
                  <p className="text-sm">/per user</p>
                  <p className="text-sm"> per month</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center my-10">
          <div>
            <label htmlFor="quantity" className="font-semibold">
              Member:
            </label>
            <p className="text-xs mt-1">
              Total number of members in your workspace
            </p>
          </div>
          <div>
            <button
              className="bg-[#2F4C5F] text-white p-2 focus:outline-none"
              onClick={handleDecrement}
            >
              <BiMinus />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              className="bg-[#2F4C5F] text-white p-2 focus:outline-none"
              onClick={handleIncrement}
            >
              <BiPlus />
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-[#2F4C5F] font-semibold">
            Total:
            <span className="text-xl ml-2">
              {selectedSubscription === "Monthly"
                ? `${country === "India" ? "₹" : "$"}${(
                    plans.find((plan) => plan.name === selectedPlan)
                      ?.monthlyPrice * quantity || 0
                  ).toFixed(2)}`
                : `${country === "India" ? "₹" : "$"}${(
                    plans.find((plan) => plan.name === selectedPlan)
                      ?.yearlyPrice *
                      quantity *
                      12 || 0
                  ).toFixed(2)}`}
            </span>
          </div>
          <button
            className="bg-[#0096FB] text-white py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors duration-300"
            onClick={onSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ColorRing
                visible={true}
                height="32"
                width="32"
                ariaLabel="blocks-loading"
                wrapperclassName="mx-auto blocks-wrapper"
                colors={["#1AACAC", "#64CCC5", "#2E97A7"]}
              />
            ) : (
              "Checkout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
