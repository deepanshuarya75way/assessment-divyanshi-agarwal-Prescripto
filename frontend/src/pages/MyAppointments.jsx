import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const {
    backendUrl,
    token,
    getDoctorsData,
  } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Example: 27_8_2026
    if (slotDate.includes("_")) {
      const dateArray = slotDate.split("_");

      if (dateArray.length === 3) {
        const day = dateArray[0];
        const monthIndex = Number(dateArray[1]) - 1;
        const year = dateArray[2];

        return `${day} ${months[monthIndex]} ${year}`;
      }
    }

    // Example: 2026-08-27
    if (slotDate.includes("-")) {
      const dateArray = slotDate.split("-");

      if (dateArray.length === 3) {
        const year = dateArray[0];
        const monthIndex = Number(dateArray[1]) - 1;
        const day = Number(dateArray[2]);

        return `${day} ${months[monthIndex]} ${year}`;
      }
    }

    return slotDate;
  };

  // =====================================================
  // GET USER APPOINTMENTS
  // =====================================================

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/appointments",
        {
          headers: {
            token,
          },
        }
      );

      console.log("APPOINTMENTS RESPONSE:", data);

      if (data.success) {
        setAppointments(
          [...data.appointments].reverse()
        );
      } else {
        toast.error(
          data.message ||
            "Unable to fetch appointments"
        );
      }
    } catch (error) {
      console.log(
        "GET APPOINTMENTS ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  // =====================================================
  // CANCEL APPOINTMENT
  // =====================================================

  const cancelAppointment = async (
    appointmentId
  ) => {
    try {
      const { data } = await axios.post(
        backendUrl +
          "/api/user/cancel-appointment",
        {
          appointmentId,
        },
        {
          headers: {
            token,
          },
        }
      );

      console.log(
        "CANCEL RESPONSE:",
        data
      );

      if (data.success) {
        toast.success(
          data.message ||
            "Appointment Cancelled"
        );

        await getUserAppointments();

        if (getDoctorsData) {
          await getDoctorsData();
        }
      } else {
        toast.error(
          data.message ||
            "Unable to cancel appointment"
        );
      }
    } catch (error) {
      console.log(
        "CANCEL APPOINTMENT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  // =====================================================
  // RAZORPAY PAYMENT
  // =====================================================

  const initPay = (
    order,
    appointmentId
  ) => {
    if (!window.Razorpay) {
      toast.error(
        "Razorpay SDK is not loaded"
      );
      return;
    }

    console.log(
      "OPENING RAZORPAY:",
      order
    );

    // =================================================
    // RAZORPAY OPTIONS
    // =================================================

    const options = {
      key: import.meta.env
        .VITE_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency:
        order.currency || "INR",

      name: "Prescripto",

      description:
        "Doctor Appointment Payment",

      order_id: order.id,

      // =================================================
      // PAYMENT METHODS
      // UPI FIRST
      // =================================================

      config: {
        display: {
          blocks: {
            payment_methods: {
              name: "Payment Methods",

              instruments: [
                {
                  method: "upi",
                },

                {
                  method: "card",
                },

                {
                  method: "netbanking",
                },

                {
                  method: "wallet",
                },

                {
                  method: "paylater",
                },
              ],
            },
          },

          sequence: [
            "block.payment_methods",
          ],

          preferences: {
            show_default_blocks: false,
          },
        },
      },

      // =================================================
      // SUCCESS HANDLER
      // =================================================

      handler: async (response) => {
        console.log(
          "RAZORPAY PAYMENT RESPONSE:",
          response
        );

        try {
          const { data } =
            await axios.post(
              backendUrl +
                "/api/user/verify-razorpay",

              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                appointmentId,
              },

              {
                headers: {
                  token,
                },
              }
            );

          console.log(
            "VERIFY PAYMENT RESPONSE:",
            data
          );

          if (data.success) {
            toast.success(
              "Payment Successful 🎉"
            );

            await getUserAppointments();

            if (getDoctorsData) {
              await getDoctorsData();
            }
          } else {
            toast.error(
              data.message ||
                "Payment verification failed"
            );
          }
        } catch (error) {
          console.log(
            "PAYMENT VERIFY ERROR:",
            error
          );

          toast.error(
            error.response?.data
              ?.message ||
              error.message ||
              "Payment verification failed"
          );
        }
      },

      // =================================================
      // USER DETAILS
      // =================================================

      prefill: {
        name: "",
        email: "",
        contact: "",
      },

      // =================================================
      // THEME
      // =================================================

      theme: {
        color: "#5f6fff",
      },

      // =================================================
      // MODAL
      // =================================================

      modal: {
        ondismiss: () => {
          console.log(
            "Razorpay popup closed"
          );
        },
      },
    };

    console.log(
      "RAZORPAY OPTIONS:",
      options
    );

    // =================================================
    // CREATE RAZORPAY INSTANCE
    // =================================================

    const rzp =
      new window.Razorpay(options);

    // =================================================
    // PAYMENT FAILED
    // =================================================

    rzp.on(
      "payment.failed",
      (response) => {
        console.log(
          "RAZORPAY PAYMENT FAILED:",
          response
        );

        console.log(
          "ERROR CODE:",
          response.error?.code
        );

        console.log(
          "ERROR DESCRIPTION:",
          response.error?.description
        );

        toast.error(
          response.error
            ?.description ||
            "Payment failed"
        );
      }
    );

    // =================================================
    // OPEN RAZORPAY
    // =================================================

    rzp.open();
  };

  // =====================================================
  // CREATE RAZORPAY ORDER
  // =====================================================

  const appointmentRazorpay = async (
    appointmentId
  ) => {
    try {
      console.log(
        "CREATING RAZORPAY ORDER FOR:",
        appointmentId
      );

      const { data } =
        await axios.post(
          backendUrl +
            "/api/user/payment-razorpay",

          {
            appointmentId,
          },

          {
            headers: {
              token,
            },
          }
        );

      console.log(
        "RAZORPAY ORDER RESPONSE:",
        data
      );

      if (data.success) {
        initPay(
          data.order,
          appointmentId
        );
      } else {
        toast.error(
          data.message ||
            "Unable to create payment"
        );
      }
    } catch (error) {
      console.log(
        "RAZORPAY ORDER ERROR:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          error.response?.data
            ?.error ||
          error.message ||
          "Unable to create payment"
      );
    }
  };

  // =====================================================
  // FETCH APPOINTMENTS
  // =====================================================

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>

      <div>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-sm py-8">
            No appointments found.
          </p>
        ) : (
          appointments.map(
            (item, index) => (
              <div
                key={
                  item._id || index
                }
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 border-b"
              >
                {/* ============================= */}
                {/* DOCTOR IMAGE */}
                {/* ============================= */}

                <div>
                  <img
                    className="w-32 h-32 object-cover bg-indigo-50 rounded"
                    src={
                      item.docData?.image
                    }
                    alt={
                      item.docData?.name ||
                      "Doctor"
                    }
                  />
                </div>

                {/* ============================= */}
                {/* DOCTOR DETAILS */}
                {/* ============================= */}

                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">
                    {
                      item.docData
                        ?.name
                    }
                  </p>

                  <p>
                    {
                      item.docData
                        ?.speciality
                    }
                  </p>

                  <p className="text-zinc-700 font-medium mt-2">
                    Address:
                  </p>

                  <p className="text-xs">
                    {
                      item.docData
                        ?.address
                        ?.line1
                    }
                  </p>

                  <p className="text-xs">
                    {
                      item.docData
                        ?.address
                        ?.line2
                    }
                  </p>

                  <p className="text-xs mt-2">
                    <span className="text-sm text-neutral-700 font-medium">
                      Date & Time:
                    </span>

                    {" "}

                    {slotDateFormat(
                      item.slotDate
                    )}

                    {" | "}

                    {
                      item.slotTime
                    }
                  </p>
                </div>

                {/* ============================= */}
                {/* BUTTONS */}
                {/* ============================= */}

                <div className="flex flex-col gap-2 justify-end">

                  {/* ========================= */}
                  {/* PAY ONLINE */}
                  {/* ========================= */}

                  {!item.cancelled &&
                    !item.payment && (
                      <button
                        onClick={() =>
                          appointmentRazorpay(
                            item._id
                          )
                        }
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                    )}

                  {/* ========================= */}
                  {/* PAID */}
                  {/* ========================= */}

                  {item.payment && (
                    <button
                      disabled
                      className="text-sm text-green-600 bg-green-50 text-center sm:min-w-48 py-2 border rounded cursor-not-allowed"
                    >
                      Payment Done ✓
                    </button>
                  )}

                  {/* ========================= */}
                  {/* CANCEL */}
                  {/* ========================= */}

                  <button
                    onClick={() => {
                      if (
                        !item.cancelled
                      ) {
                        cancelAppointment(
                          item._id
                        );
                      }
                    }}
                    disabled={
                      item.cancelled
                    }
                    className={`text-sm text-center sm:min-w-48 py-2 border rounded transition-all duration-300 ${
                      item.cancelled
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-stone-500 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {item.cancelled
                      ? "Appointment Cancelled"
                      : "Cancel Appointment"}
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default MyAppointments;