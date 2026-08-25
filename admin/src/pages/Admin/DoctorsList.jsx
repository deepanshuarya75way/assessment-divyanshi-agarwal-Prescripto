import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors,changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium mb-5">
        All Doctors
      </h1>

     <div className="grid grid-cols-4 gap-5">
  {doctors.map((item, index) => (
    <div
      key={index}
      className="border rounded-xl overflow-hidden group cursor-pointer"
    >
      <div className="bg-indigo-50">
        <img
          src={item.image}
          alt=""
          className="w-full h-60 object-contain group-hover:bg-primary transition-all duration-500"
        />
      </div>

      <div className="p-4">
        <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>

        <p className='text-zinc-600 text-sm'>{item.speciality}</p>

        <div className="flex items-center gap-2 mt-2">
          <input onChange={()=>changeAvailability(item._id)}
            type="checkbox"
            checked={item.available}
            className="accent-blue-500"
            readOnly
          />

          <p>Available</p>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default DoctorsList;