import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const {
    doctors,
    aToken,
    getAllDoctors,
    changeAvailability,
    resetDoctorPassword,
  } = useContext(AdminContext);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const success = await resetDoctorPassword(
      selectedDoctor._id,
      newPassword
    );

    setLoading(false);

    if (success) {
      setSelectedDoctor(null);
      setNewPassword("");
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium mb-5">
        All Doctors
      </h1>

      <div className="grid grid-cols-4 gap-5">

        {doctors.map((item, index) => (
          <div
            key={item._id || index}
            className="border rounded-xl overflow-hidden group"
          >
            {/* Doctor Image */}
            <div className="bg-indigo-50">
              <img
                src={item.image}
                alt=""
                className="w-full h-60 object-contain group-hover:bg-primary transition-all duration-500"
              />
            </div>

            {/* Doctor Details */}
            <div className="p-4">

              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>

              <p className="text-zinc-600 text-sm">
                {item.speciality}
              </p>

              {/* Availability */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  onChange={() =>
                    changeAvailability(item._id)
                  }
                  type="checkbox"
                  checked={item.available}
                  className="accent-blue-500"
                  readOnly
                />

                <p>Available</p>
              </div>

              {/* Reset Password Button */}
              <button
                onClick={() => {
                  setSelectedDoctor(item);
                  setNewPassword("");
                }}
                className="mt-3 w-full bg-primary text-white py-2 rounded-md text-sm hover:opacity-90"
              >
                Reset Password
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* RESET PASSWORD POPUP */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">

            <h2 className="text-xl font-semibold text-gray-800">
              Reset Doctor Password
            </h2>

            <p className="text-gray-700 mt-3">
              {selectedDoctor.name}
            </p>

            <p className="text-gray-500 text-sm mb-5">
              {selectedDoctor.email}
            </p>

            <label className="text-sm text-gray-600">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
              className="border border-gray-300 rounded-md w-full p-2 mt-1"
            />

            <p className="text-xs text-gray-400 mt-1">
              Minimum 8 characters
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setNewPassword("");
                }}
                className="border border-gray-300 px-4 py-2 rounded-md text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;