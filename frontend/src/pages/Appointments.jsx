import React, {
  useContext,
  useEffect,
  useState
} from 'react'

import {
  useNavigate,
  useParams
} from 'react-router-dom'

import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'


const Appointments = () => {

  const { docID } = useParams()

  const {
    doctors,
    backendUrl,
    token
  } = useContext(AppContext)

  const navigate = useNavigate()


  // =========================
  // DAYS
  // =========================

  const daysOfWeek = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
  ]


  // =========================
  // STATES
  // =========================

  const [docInfo, setDocInfo] = useState(null)

  const [docSlots, setDocSlots] = useState([])

  const [slotIndex, setSlotIndex] = useState(0)

  const [slotTime, setSlotTime] = useState('')


  // =========================
  // FIND DOCTOR
  // =========================

  const fetchDocInfo = () => {

    const doctor = doctors.find(
      (doc) =>
        String(doc._id) === String(docID)
    )

    setDocInfo(doctor || null)
  }


  // =========================
  // GENERATE AVAILABLE SLOTS
  // =========================

  const getAvailableSlots = () => {

    if (!docInfo) {
      return
    }

    const today = new Date()

    const newSlots = []


    // Generate next 7 days

    for (let i = 0; i < 7; i++) {

      const currentDate = new Date(today)

      currentDate.setDate(
        today.getDate() + i
      )


      const endTime = new Date(currentDate)

      endTime.setHours(
        21,
        0,
        0,
        0
      )


      // =========================
      // TODAY
      // =========================

      if (i === 0) {

        let startHour =
          currentDate.getHours()

        let startMinute =
          currentDate.getMinutes()


        if (startHour < 10) {

          startHour = 10
          startMinute = 0

        } else {

          startHour = startHour + 1

          if (startMinute > 30) {
            startMinute = 30
          } else {
            startMinute = 0
          }

        }


        currentDate.setHours(
          startHour,
          startMinute,
          0,
          0
        )

      }


      // =========================
      // FUTURE DAYS
      // =========================

      else {

        currentDate.setHours(
          10,
          0,
          0,
          0
        )

      }


      const timeSlots = []


      // =========================
      // CREATE TIME SLOTS
      // =========================

      while (currentDate < endTime) {

        const formattedTime =
          currentDate.toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit'
            }
          )


        // =========================
        // SLOT DATE
        // Example: 23_8_2026
        // =========================

        const day =
          currentDate.getDate()

        const month =
          currentDate.getMonth() + 1

        const year =
          currentDate.getFullYear()


        const slotDate =
          `${day}_${month}_${year}`


        // =========================
        // CHECK BOOKED SLOT
        // =========================

        const bookedSlots =
          docInfo.slots_booked?.[slotDate] || []


        const isSlotAvailable =
          !bookedSlots.includes(
            formattedTime
          )


        // =========================
        // ADD AVAILABLE SLOT
        // =========================

        if (isSlotAvailable) {

          timeSlots.push({

            datetime:
              new Date(currentDate),

            time:
              formattedTime

          })

        }


        // Next 30 minutes

        currentDate.setMinutes(
          currentDate.getMinutes() + 30
        )

      }


      // =========================
      // ADD DAY
      // =========================

      if (timeSlots.length > 0) {

        newSlots.push(timeSlots)

      }

    }


    setDocSlots(newSlots)

    setSlotIndex(0)

    setSlotTime('')
  }


  // =========================
  // BOOK APPOINTMENT
  // =========================

  const bookAppointment = async () => {

    try {

      // =========================
      // LOGIN CHECK
      // =========================

      if (!token) {

        toast.warn(
          'Login to book appointment'
        )

        return navigate('/login')
      }


      // =========================
      // TIME CHECK
      // =========================

      if (!slotTime) {

        toast.warn(
          'Please select a time slot'
        )

        return
      }


      // =========================
      // SELECTED SLOT
      // =========================

      const selectedSlot =
        docSlots[slotIndex]?.find(
          (slot) =>
            slot.time === slotTime
        )


      if (!selectedSlot) {

        toast.warn(
          'Please select a valid time slot'
        )

        return
      }


      // =========================
      // CREATE SLOT DATE
      // IMPORTANT
      // Format: 23_8_2026
      // =========================

      const date =
        selectedSlot.datetime


      const day =
        date.getDate()

      const month =
        date.getMonth() + 1

      const year =
        date.getFullYear()


      const slotDate =
        `${day}_${month}_${year}`


      console.log(
        'Booking Data:',
        {
          docId: docID,
          slotDate,
          slotTime
        }
      )


      // =========================
      // API CALL
      // =========================

      const { data } =
        await axios.post(

          backendUrl +
          '/api/user/book-appointment',

          {
            docId: docID,
            slotDate: slotDate,
            slotTime: slotTime
          },

          {
            headers: {
              token: token
            }
          }

        )


      // =========================
      // SUCCESS
      // =========================

      if (data.success) {

        toast.success(
          data.message ||
          'Appointment Booked'
        )


        // =========================
        // IMPORTANT:
        // Immediately remove booked
        // slot from UI
        // =========================

        const updatedSlots =
          docSlots.map(
            (daySlots, index) => {

              if (
                index !== slotIndex
              ) {
                return daySlots
              }

              return daySlots.filter(
                (slot) =>
                  slot.time !== slotTime
              )

            }
          )


        // Remove empty days

        const finalSlots =
          updatedSlots.filter(
            (daySlots) =>
              daySlots.length > 0
          )


        setDocSlots(finalSlots)

        setSlotIndex(0)

        setSlotTime('')


      } else {

        toast.error(
          data.message ||
          'Unable to book appointment'
        )

      }

    } catch (error) {

      console.log(
        'BOOK APPOINTMENT ERROR:',
        error
      )


      toast.error(

        error.response?.data?.message ||

        error.message ||

        'Something went wrong'

      )

    }

  }


  // =========================
  // FIND DOCTOR
  // =========================

  useEffect(() => {

    if (
      doctors &&
      doctors.length > 0
    ) {

      fetchDocInfo()

    }

  }, [
    doctors,
    docID
  ])


  // =========================
  // GENERATE SLOTS
  // =========================

  useEffect(() => {

    if (docInfo) {

      getAvailableSlots()

    }

  }, [docInfo])


  // =========================
  // DOCTOR NOT FOUND
  // =========================

  if (!docInfo) {

    return (

      <div className="text-center mt-20 text-red-500">

        Doctor Not Found

        <br />

        ID: {docID}

      </div>

    )

  }


  // =========================
  // UI
  // =========================

  return (

    <div>


      {/* =========================
          DOCTOR DETAILS
      ========================= */}

      <div className="flex flex-col sm:flex-row gap-4">


        {/* IMAGE */}

        <div>

          <img
            className="
              bg-primary
              w-full
              sm:max-w-72
              rounded-lg
            "
            src={docInfo.image}
            alt={docInfo.name}
          />

        </div>


        {/* DETAILS */}

        <div
          className="
            flex-1
            border
            border-gray-400
            rounded-lg
            p-8
            py-7
            bg-white
            mx-2
            sm:mx-0
            mt-[-80px]
            sm:mt-0
          "
        >

          {/* NAME */}

          <p
            className="
              flex
              items-center
              gap-2
              text-2xl
              font-medium
              text-gray-900
            "
          >

            {docInfo.name}

            <img
              className="w-5"
              src={assets.verified_icon}
              alt="verified"
            />

          </p>


          {/* DEGREE */}

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              mt-1
              text-gray-600
            "
          >

            <p>

              {docInfo.degree}

              {' - '}

              {docInfo.speciality}

            </p>


            <button
              className="
                py-0.5
                px-2
                border
                text-xs
                rounded-full
              "
            >

              {docInfo.experience}

            </button>

          </div>


          {/* ABOUT */}

          <p
            className="
              flex
              items-center
              gap-1
              text-sm
              font-medium
              text-gray-900
              mt-3
            "
          >

            About

            <img
              src={assets.info_icon}
              alt="info"
            />

          </p>


          <p
            className="
              text-sm
              text-gray-500
              max-w-[700px]
              mt-4
            "
          >

            {docInfo.about}

          </p>


          {/* FEE */}

          <p
            className="
              text-gray-700
              font-medium
              mt-4
            "
          >

            Appointment fee:

            <span
              className="
                text-gray-900
                font-semibold
              "
            >

              {' '}₹{docInfo.fees}

            </span>

          </p>

        </div>

      </div>


      {/* =========================
          BOOKING
      ========================= */}

      <div
        className="
          sm:ml-72
          sm:pl-4
          mt-4
          font-medium
          text-gray-700
        "
      >

        <p>
          Booking Slots
        </p>


        {/* =========================
            DATES
        ========================= */}

        <div
          className="
            flex
            gap-3
            items-center
            w-full
            overflow-x-auto
            mt-4
            pb-2
          "
        >

          {docSlots.map(
            (item, index) => {

              const date =
                item[0]?.datetime


              return (

                <div
                  key={index}

                  onClick={() => {

                    setSlotIndex(index)

                    setSlotTime('')

                  }}

                  className={`
                    text-center
                    py-6
                    min-w-16
                    rounded-full
                    cursor-pointer
                    flex-shrink-0

                    ${
                      slotIndex === index
                        ? 'bg-primary text-white'
                        : 'border border-gray-200'
                    }
                  `}
                >

                  <p>

                    {date
                      ? daysOfWeek[
                          date.getDay()
                        ]
                      : ''
                    }

                  </p>


                  <p>

                    {date
                      ? date.getDate()
                      : ''
                    }

                  </p>

                </div>

              )

            }
          )}

        </div>


        {/* =========================
            TIME
        ========================= */}

        <div
          className="
            flex
            items-center
            gap-3
            w-full
            overflow-x-auto
            mt-4
            pb-2
          "
        >

          {docSlots[slotIndex]?.map(
            (item, index) => (

              <p
                key={index}

                onClick={() =>
                  setSlotTime(item.time)
                }

                className={`
                  text-sm
                  font-light
                  flex-shrink-0
                  px-5
                  py-2
                  rounded-full
                  cursor-pointer

                  ${
                    item.time === slotTime
                      ? 'bg-primary text-white'
                      : 'text-gray-400 border border-gray-300'
                  }
                `}
              >

                {item.time.toLowerCase()}

              </p>

            )
          )}

        </div>


        {/* =========================
            BOOK BUTTON
        ========================= */}

        <button
          onClick={bookAppointment}

          className="
            bg-primary
            text-white
            text-sm
            font-light
            px-14
            py-3
            rounded-full
            my-6
          "
        >

          Book an appointment

        </button>

      </div>


      {/* =========================
          RELATED DOCTORS
      ========================= */}

      <RelatedDoctors
        docID={docID}
        speciality={docInfo.speciality}
      />

    </div>

  )

}


export default Appointments