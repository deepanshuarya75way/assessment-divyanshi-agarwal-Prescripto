import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const Dashboard = () => {
  const {
    aToken,
    doctors,
    appointments,
    getAllDoctors,
    getAllAppointments,
  } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAllAppointments();
    }
  }, [aToken]);

  // --------------------------------
  // Format Date
  // 27_8_2026 -> 27 Aug 2026
  // --------------------------------
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
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${day} ${months[month - 1]} ${year}`;
  };

  // --------------------------------
  // Get Doctor Initial
  // --------------------------------
  const getInitial = (name) => {
    if (!name) return "D";

    return name.charAt(0).toUpperCase();
  };

  // --------------------------------
  // Unique Patients
  // --------------------------------
  const uniquePatients = appointments
    ? new Set(
        appointments.map(
          (item) => item.userId || item.userData?._id
        )
      ).size
    : 0;

  // --------------------------------
  // Latest 5 Appointments
  // --------------------------------
  const latestAppointments = appointments
    ? appointments.slice(0, 5)
    : [];

  return (
    <div className="w-full m-5">

      {/* =========================
          STATISTICS CARDS
      ========================== */}

      <div className="flex flex-wrap gap-4 mb-8">

        {/* Doctors */}
        <div className="bg-white border rounded-lg p-5 flex items-center gap-4 min-w-[220px] shadow-sm">

          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-2xl">👨‍⚕️</span>
          </div>

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {doctors ? doctors.length : 0}
            </p>

            <p className="text-gray-500">
              Doctors
            </p>
          </div>

        </div>


        {/* Appointments */}
        <div className="bg-white border rounded-lg p-5 flex items-center gap-4 min-w-[220px] shadow-sm">

          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {appointments ? appointments.length : 0}
            </p>

            <p className="text-gray-500">
              Appointments
            </p>
          </div>

        </div>


        {/* Patients */}
        <div className="bg-white border rounded-lg p-5 flex items-center gap-4 min-w-[220px] shadow-sm">

          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>

          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {uniquePatients}
            </p>

            <p className="text-gray-500">
              Patients
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          LATEST APPOINTMENTS
      ========================== */}

      <div className="bg-white border rounded-lg shadow-sm">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>

            <p className="text-lg font-semibold text-gray-700">
              Latest Appointments
            </p>

          </div>

          <p className="text-gray-400">
            {appointments ? appointments.length : 0} Total
          </p>

        </div>


        {/* Appointment List */}

        {latestAppointments.length > 0 ? (

          latestAppointments.map((item, index) => {

            // Doctor information
            const doctorName =
              item.docData?.name || "Doctor";

            const doctorImage =
              item.docData?.image;

            return (

              <div
                key={item._id || index}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >

                {/* LEFT SIDE */}

                <div className="flex items-center gap-4">

                  {/* Doctor Image */}

                  {doctorImage ? (

                    <img
                      src={doctorImage}
                      alt={doctorName}
                      className="w-11 h-11 rounded-full object-cover border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";

                        if (
                          e.currentTarget.nextElementSibling
                        ) {
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }
                      }}
                    />

                  ) : null}


                  {/* Fallback Initial */}

                  <div
                    style={{
                      display: doctorImage ? "none" : "flex",
                    }}
                    className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center text-primary font-semibold text-lg"
                  >
                    {getInitial(doctorName)}
                  </div>


                  {/* Doctor Name + Date */}

                  <div>

                    <p className="font-medium text-gray-700">
                      {doctorName}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">

                      {formatDate(item.slotDate)}

                      {" • "}

                      {item.slotTime}

                    </p>

                  </div>

                </div>


                {/* RIGHT SIDE - STATUS */}

                <p
                  className={
                    item.cancelled
                      ? "text-red-500 text-sm"
                      : "text-green-500 text-sm"
                  }
                >

                  {item.cancelled
                    ? "Cancelled"
                    : "Booked"}

                </p>

              </div>

            );
          })

        ) : (

          <div className="p-8 text-center text-gray-400">
            No appointments found
          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;