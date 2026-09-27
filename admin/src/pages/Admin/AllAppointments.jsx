import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
  } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Calculate Age
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const month =
      today.getMonth() -
      birthDate.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format Date
  // 21_9_2026 -> 21 Sept 2026
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parts = date.split("_");

    if (parts.length !== 3) {
      return date;
    }

    const day = parts[0];
    const month = Number(parts[1]);
    const year = parts[2];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day} ${months[month - 1]} ${year}`;
  };

  return (
    <div className="w-full max-w-6xl m-5">

      {/* Heading */}
      <p className="mb-3 text-lg font-medium">
        All Appointments
      </p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-auto">

        {/* Table Heading */}

        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b font-medium text-gray-700">

          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>

        </div>


        {/* Appointments */}

        {appointments &&
          appointments.map((item, index) => (

            <div
              key={item._id || index}
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b"
            >

              {/* Number */}

              <p>
                {index + 1}
              </p>


              {/* Patient */}

              <div className="flex items-center gap-2">

                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.userData?.image}
                  alt=""
                />

                <p>
                  {item.userData?.name}
                </p>

              </div>


              {/* Age */}

              <p>
                {item.userData?.dob
                  ? calculateAge(item.userData.dob)
                  : "N/A"}
              </p>


              {/* Date & Time */}

              <p>
                {formatDate(item.slotDate)}
                {" • "}
                {item.slotTime}
              </p>


              {/* Doctor */}

              <div className="flex items-center gap-2">

                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={item.docData?.image}
                  alt=""
                />

                <p>
                  {item.docData?.name}
                </p>

              </div>


              {/* Fees */}

              <p>
                ₹{item.amount}
              </p>


              {/* STATUS */}

              {item.cancelled ? (

                <p className="text-red-500">
                  Cancelled
                </p>

              ) : (

                <p className="text-green-500">
                  Booked
                </p>

              )}

            </div>

          ))}

      </div>

    </div>
  );
};

export default AllAppointments;