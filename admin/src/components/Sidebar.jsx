import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'

const Sidebar = () => {

  const { aToken } = useContext(AdminContext)

  return (
    <div className="w-64 min-h-screen bg-white border-r">

      {aToken && (
        <ul className="text-gray-700">

          {/* Dashboard */}
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-4 px-6 cursor-pointer
              ${isActive
                ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]'
                : ''
              }`
            }
          >
            <img className="w-5" src={assets.home_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>


          {/* Appointments */}
          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-4 px-6 cursor-pointer
              ${isActive
                ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]'
                : ''
              }`
            }
          >
            <img className="w-5" src={assets.appointment_icon} alt="" />
            <p>Appointments</p>
          </NavLink>


          {/* Add Doctor */}
          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-4 px-6 cursor-pointer
              ${isActive
                ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]'
                : ''
              }`
            }
          >
            <img className="w-5" src={assets.add_icon} alt="" />
            <p>Add Doctor</p>
          </NavLink>


          {/* Doctors List */}
          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 py-4 px-6 cursor-pointer
              ${isActive
                ? 'bg-[#F2F3FF] border-r-4 border-[#5F6FFF]'
                : ''
              }`
            }
          >
            <img className="w-5" src={assets.people_icon} alt="" />
            <p>Doctors List</p>
          </NavLink>

        </ul>
      )}

    </div>
  )
}

export default Sidebar