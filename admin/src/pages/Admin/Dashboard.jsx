import React from 'react'

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Doctors</p>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Appointments</p>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Patients</p>
          <p className="text-2xl font-semibold mt-2">0</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <p className="text-gray-500">Earnings</p>
          <p className="text-2xl font-semibold mt-2">₹0</p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard