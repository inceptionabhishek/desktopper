const Chargebee = require("chargebee");
const express = require("express");
const axios = require("axios");

require("dotenv").config();

const { dbHandler } = require("../database/db");

const router = express.Router();
const chargebeeRouter = express.Router();
router.use("/chargebee", chargebeeRouter);

const siteName = process.env.CHARGEBEE_SITE_NAME;
const apiKey = process.env.CHARGEBEE_API_KEY;

Chargebee.configure({
  site: process.env.CHARGEBEE_SITE_NAME,
  api_key: process.env.CHARGEBEE_API_KEY,
});

// Set up the base URL for Chargebee API
const chargebeeBaseUrl = `https://${siteName}.chargebee.com/api/v2`;

router.get("/getCustomer/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  try {
    Chargebee.customer
      .list({ "email[is]": customerEmail })
      .request(function (error, result) {
        if (error) {
          console.log("Error: ", error);
          res.status(500).json({ error: "Failed to fetch customer" });
        } else {
          if (result.list.length > 0) {
            var entry = result.list;
            // var customer = entry.customer;
            // var card = entry.card;
            res.status(200).json(entry[0]);
          } else {
            console.log("No customer found with the specified email.");
          }
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get("/viewCustomer/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  try {
    Chargebee.customer
      .list({ "email[is]": customerEmail })
      .request(function (error, result) {
        if (error) {
          console.log("Error: ", error);
          res.status(500).json({ error: "Failed to fetch customer" });
        } else {
          if (result.list.length > 0) {
            var entry = result.list;
            // var customer = entry.customer;
            // var card = entry.card;
            res.status(200).json(entry);
          } else {
            console.log("No customer found with the specified email.");
          }
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get("/viewSubscription/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;

  try {
    Chargebee.customer
      .list({ "email[is]": customerEmail })
      .request(function (error, result) {
        if (error) {
          res.status(500).json({ error: "Failed to fetch customer" });
        } else {
          if (result.list.length > 0) {
            var customers = result.list;
            let processedCustomers = 0;
            const size = result.list.length;

            const activeSubscriptions = [];
            const inTrialSubscriptions = [];
            const cancelledSubscriptions = [];

            for (const customer of customers) {
              const customerId = customer.customer.id;

              console.log("customerId", customerId);

              try {
                Chargebee.subscription
                  .list({ "customer_id[is]": customerId })
                  .request(function (error, result) {
                    if (error) {
                      console.log("Error: ", error);
                      res
                        .status(500)
                        .json({ error: "Failed to fetch subscription" });
                    } else {
                      if (result.list.length > 0) {
                        var filteredEntry = result.list?.reduce(function (
                          accumulator,
                          currentEntry
                        ) {
                          // console.log(
                          //   "currentEntry?.customer?.email",
                          //   currentEntry?.customer?.email
                          // );
                          if (currentEntry?.customer?.email === customerEmail) {
                            accumulator.push(currentEntry);
                          }
                          return accumulator;
                        },
                        []);

                        filteredEntry.forEach(function (entry) {
                          const subscription = entry.subscription;

                          if (subscription.status === "active") {
                            activeSubscriptions.push(subscription);
                          } else if (subscription.status === "in_trial") {
                            inTrialSubscriptions.push(subscription);
                          } else if (subscription.status === "cancelled") {
                            cancelledSubscriptions.push(subscription);
                          }
                        });

                        processedCustomers++;

                        if (processedCustomers === size) {
                          res.status(200).json({
                            active: activeSubscriptions,
                            inTrial: inTrialSubscriptions,
                            cancelled: cancelledSubscriptions,
                          });
                        }
                      } else {
                        console.log("Something went wrong");
                        processedCustomers++;

                        if (processedCustomers === size) {
                          res.status(200).json({
                            active: activeSubscriptions,
                            inTrial: inTrialSubscriptions,
                            cancelled: cancelledSubscriptions,
                          });
                        }
                      }
                    }
                  });
              } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ error: "Failed to fetch subscription" });
              }
            }

            // res.status(200).json(entry);
          } else {
            console.log("No customer found with the specified email.");
          }
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get("/isSpaceAvailabe/:customerEmail/:customerId", async (req, res) => {
  const { customerEmail, customerId } = req.params;

  const user = await dbHandler("readUserByUserIdforArray", {
    userId: customerId,
  });
  if (!user.status) return res.status(401).json({ err: user.err });

  const workspaceId = user?.data[0]?.workspaceId;

  const workspace = await dbHandler("readWorkSpace", { workspaceId });
  if (!workspace.status) return res.status(401).json({ err: workspace.err });

  try {
    Chargebee.customer
      .list({ "email[is]": customerEmail })
      .request(function (error, result) {
        if (error) {
          console.log("Error: ", error);
          res.status(500).json({ error: "Failed to fetch customer" });
        } else {
          if (result.list.length > 0) {
            var customers = result.list;
            let processedCustomers = 0;
            const size = result.list.length;

            // console.log("result.list.length", result.list.length);
            const activeSubscriptions = [];
            const inTrialSubscriptions = [];
            const cancelledSubscriptions = [];

            // var customer = entry.customer;
            // var card = entry.card;

            for (const customer of customers) {
              const customerId = customer.customer.id;

              console.log("customerId", customerId);

              try {
                Chargebee.subscription
                  .list({ "customer_id[is]": customerId })
                  .request(function (error, result) {
                    if (error) {
                      console.log("Error: ", error);
                      res
                        .status(500)
                        .json({ error: "Failed to fetch subscription" });
                    } else {
                      if (result.list.length > 0) {
                        var filteredEntry = result.list?.reduce(function (
                          accumulator,
                          currentEntry
                        ) {
                          // console.log(
                          //   "currentEntry?.customer?.email",
                          //   currentEntry?.customer?.email
                          // );
                          if (currentEntry?.customer?.email === customerEmail) {
                            accumulator.push(currentEntry);
                          }
                          return accumulator;
                        },
                        []);

                        filteredEntry.forEach(function (entry) {
                          const subscription = entry.subscription;

                          if (subscription.status === "active") {
                            activeSubscriptions.push(subscription);
                          } else if (subscription.status === "in_trial") {
                            inTrialSubscriptions.push(subscription);
                          } else if (subscription.status === "cancelled") {
                            cancelledSubscriptions.push(subscription);
                          }
                        });

                        const MaximumUnit = activeSubscriptions[0]
                          ?.subscription_items[0]?.quantity
                          ? activeSubscriptions[0]?.subscription_items[0]
                              ?.quantity
                          : 0;

                        const isSpaceAvailable =
                          MaximumUnit == 0
                            ? true
                            : workspace.data.members.length < MaximumUnit;

                        // console.log("MaximumUnit", MaximumUnit);
                        // console.log(
                        //   "workspace.data.members.length",
                        //   workspace.data.members.length
                        // );
                        // console.log("isSpaceAvailable", isSpaceAvailable);

                        processedCustomers++;

                        if (processedCustomers === size) {
                          res
                            .status(200)
                            .json({ isSpaceAvailable: isSpaceAvailable });
                        }
                      } else {
                        console.log("Something went wrong");
                      }
                    }
                  });
              } catch (error) {
                console.error("Error:", error.message);
                res.status(500).json({ error: "Failed to fetch subscription" });
              }
            }

            // res.status(200).json(entry);
          } else {
            console.log("No customer found with the specified email.");
          }
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get("/getCustomer/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  try {
    Chargebee.customer
      .list({ "email[is]": customerEmail })
      .request(function (error, result) {
        if (error) {
          console.log("Error: ", error);
          res.status(500).json({ error: "Failed to fetch customer" });
        } else {
          if (result.list.length > 0) {
            var entry = result.list;
            console.log("Entry:", entry);
            var customer = entry.customer;
            var card = entry.card;
            res.status(200).json(entry);
          } else {
            console.log("No customer found with the specified email.");
          }
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.post("/signup/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const customerResult = await Chargebee.customer
      .create({
        email,
      })
      .request();
    const customer = customerResult.customer;

    Chargebee.subscription
      .create_with_items(customer.id, {
        subscription_items: [
          {
            item_price_id: "Trial-USD-Monthly",
            quantity: 1,
          },
        ],
      })
      .request(function (error, result) {
        if (error) {
          console.log(error);
          res.json({ message: "Signup not successful" });
        } else {
          console.log(result);
          var subscription = result.subscription;
          var customer = result.customer;
          var card = result.card;
          var invoice = result.invoice;
          var unbilled_charges = result.unbilled_charges;
          res.json({ message: "Signup successful!" });
        }
      });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Error creating subscription" });
  }
});

router.get("/getInvoiceByEmail/:customerEmail", async (req, res) => {
  const { customerEmail } = req.params;
  const Customer = await Chargebee.customer
    .list({ "email[is]": customerEmail })
    .request();

  // res.status(200).json(Customer?.list[0]?.customer?.id);

  Chargebee.invoice
    .list({
      "customer_id[is]": Customer?.list[0]?.customer?.id,
      limit: 1,
    })
    .request(function (error, result) {
      if (error) {
        //handle error
        console.log(error);
        res.status(500).json({ error: "Error downloading Invoice" });
      } else {
        console.log(result);
        // const invoiceIds = result.list.map((invoice) => invoice.id);
        // res.status(200).json(result.list[0].invoice.id);
        Chargebee.invoice
          .pdf(result?.list[0]?.invoice.id)
          .request(function (error, result) {
            if (error) {
              //handle error
              console.log(error);
              res.status(500).json({ error: "Error downloading Invoice" });
            } else {
              console.log(result);
              var download = result?.download;
              res.status(200).json(download);
            }
          });
      }
    });
});

router.get("/generatePortalSession/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const { portal_session } = await Chargebee.portal_session
      .create({
        customer: {
          id: customerId,
        },
      })
      .request();
    res.status(200).json(portal_session);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get("/generateCheckout/:planId/:emailId", async (req, res) => {
  const { planId, emailId } = req.params;

  try {
    const hostedPage = await Chargebee.hosted_page
      .checkout_new_for_items({
        subscription_items: [
          {
            item_price_id: planId,
            quantity: 1,
          },
        ],
        customer: {
          email: emailId,
        },
      })
      .request();

    res.status(200).json(hostedPage);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error generating checkout page!" });
  }
});

router.post(
  "/changeSuperAdmin/:superAdminEmail/:workspaceId",
  async (req, res) => {
    const { superAdminEmail, workspaceId } = req.params;
    const { userId } = req.cookies;

    try {
      if (!userId || !workspaceId || !superAdminEmail)
        return res.status(400).json({ err: "Missing Details" });

      const workspace = await dbHandler("readWorkSpace", { workspaceId });

      if (!workspace?.status)
        return res.status(404).json({ err: "Workspace does not exist" });

      const totalMembers = workspace?.data?.members.length;

      if (totalMembers == 1) {
        return res.status(401).json({
          error: "Workspace has only one member!",
        });
      }

      let currMembers = 0;

      for (const member of workspace?.data?.members) {
        customerEmail = member?.email;

        if (customerEmail != superAdminEmail) {
          Chargebee.customer
            .list({ "email[is]": customerEmail })
            .request(async function (error, result) {
              if (error) {
                console.log("Error: ", error);
                console.log("ErrorInside: ");

                return res
                  .status(500)
                  .json({ error: "Failed to fetch customer" });
              } else {
                if (result.list.length > 0) {
                  var entry = result.list;

                  const newSuperAdminEmail = entry[0]?.customer?.email;

                  const user = await dbHandler("readUserByEmail", {
                    email: newSuperAdminEmail,
                  });

                  if (newSuperAdminEmail !== superAdminEmail && !user?.status) {
                    return res.status(404).json({ err: "User does not exist" });
                  } else if (
                    newSuperAdminEmail !== superAdminEmail &&
                    user?.data?.userRole !== "admin"
                  ) {
                    return res.status(401).json({
                      error: `Make ${user?.data?.fullName} Admin First!`,
                    });
                  } else if (newSuperAdminEmail !== superAdminEmail) {
                    const SuperAdmin = await dbHandler("updateSuperAdmin", {
                      workspaceId,
                      userId: user?.data?.userId,
                      workspaceName: workspace?.data?.workspaceName,
                    });

                    if (!SuperAdmin?.status)
                      return res
                        .status(404)
                        .json({ error: "An error occurred. Please try again" });

                    return res.status(200).json(SuperAdmin?.updatedUser?.value);
                  }
                } else {
                  currMembers = currMembers + 1;
                  console.log("No customer found with the specified email.");
                  if (currMembers == totalMembers - 1) {
                    return res.status(404).json({
                      error:
                        "Either you does not assign any user Super Admin role or you Assigned any user Super Admin role outside from your workspace!",
                    });
                  }
                }
              }
            });
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ error: "Something went wrong, Please try again!" });
    }
  }
);

router.get("/generatePortalSession/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const newQuantity = 10;
  try {
    const { portal_session } = await Chargebee.portal_session
      .create({
        customer: {
          id: customerId,
        },
        custom_data: [
          {
            name: "quantity",
            value: newQuantity.toString(), // Convert to a string if it's not already
          },
        ],
      })
      .request();
    res.status(200).json(portal_session);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get("/generateBillingHistoryPage/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const { portal_session } = await Chargebee.portal_session
      .create({
        customer: {
          id: customerId,
        },
      })
      .request();

    fetch(portal_session?.access_url)
      .then((response) => {
        return response.text(); // or response.json() if the response is JSON
      })
      .then(() => {
        const portalToken = portal_session?.token;

        const billingHistoryURL = `https://${siteName}.chargebee.com/portal/v2/billing_history?token=${portalToken}`;

        res.status(200).json({
          status: true,
          billing_history_url: billingHistoryURL,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

router.get(
  "/subscription/:subscriptionId/:subscriptionItemId/:quantity",
  async (req, res) => {
    const { subscriptionId, subscriptionItemId, quantity } = req.params;

    try {
      const hostedPage = await Chargebee.subscription
        .update_for_items(subscriptionId, {
          subscription_items: [
            {
              id: subscriptionItemId,
              quantity: quantity,
              item_price_id: subscriptionItemId,
            },
          ],
        })
        .request();

      res.status(200).json(hostedPage);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Error generating checkout page!" });
    }
  }
);

router.get("/generateCheckout/:planId/:quantity/:emailId", async (req, res) => {
  const { planId, quantity, emailId } = req.params;

  try {
    const hostedPage = await Chargebee.hosted_page
      .checkout_new_for_items({
        subscription_items: [
          {
            item_price_id: planId,
            quantity: quantity,
          },
        ],
        customer: {
          email: emailId,
        },
      })
      .request();

    res.status(200).json(hostedPage);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error generating checkout page!" });
  }
});
router.post(
  "/updateAccountDetails/:customerEmail/:newEmail/:workspaceId",
  async (req, res) => {
    const { customerEmail, newEmail, workspaceId } = req.params;

    try {
      if (!customerEmail || !newEmail || !workspaceId)
        return res.status(400).json({ err: "Missing Details" });

      const workspace = await dbHandler("readWorkSpace", { workspaceId });

      if (!workspace?.status)
        return res.status(404).json({ err: "Workspace does not exist" });
      Chargebee.customer
        .list({ "email[is]": customerEmail })
        .request(async function (error, result) {
          if (error) {
            console.log("Error: ", error);
            res.status(500).json({ error: "Failed to fetch customer" });
          } else {
            if (result.list.length > 0) {
              var customers = result.list;

              for (const customer of customers) {
                const customerId = customer.customer.id;

                try {
                  Chargebee.customer
                    .update(customerId, {
                      email: newEmail,
                    })
                    .request(async function (error, result) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(result);
                      }
                    });
                } catch (error) {
                  console.error("Error:", error.message);
                  res
                    .status(500)
                    .json({ error: "Failed to update email address" });
                }
              }

              const user = await dbHandler("readUserByEmail", {
                email: newEmail,
              });

              const SuperAdmin = await dbHandler("updateSuperAdmin", {
                workspaceId,
                userId: user?.data?.userId,
                workspaceName: workspace?.data?.workspaceName,
              });

              if (!SuperAdmin?.status)
                return res
                  .status(404)
                  .json({ error: "An error occurred. Please try again" });

              return res.status(200).json(SuperAdmin?.updatedUser?.value);
            } else {
              console.log("No customer found with the specified email.");
            }
          }
        });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  }
);

module.exports = router;
