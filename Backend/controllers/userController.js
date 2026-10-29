import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import Razorpay from "razorpay";

import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// =====================================================
// RAZORPAY INSTANCE
// =====================================================

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a Valid Email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a Strong Password",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    return res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    return res.json({
      success: true,
      token,
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userData = await userModel
      .findById(userId)
      .select("-password");

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      userData,
    });

  } catch (error) {
    console.log("GET PROFILE ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      name,
      phone,
      address,
      dob,
      gender,
    } = req.body;

    const imageFile = req.file;

    let parsedAddress = address;

    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch {
        parsedAddress = address;
      }
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload =
        await cloudinary.uploader.upload(
          imageFile.path,
          {
            resource_type: "image",
          }
        );

      await userModel.findByIdAndUpdate(userId, {
        image: imageUpload.secure_url,
      });
    }

    return res.json({
      success: true,
      message: "Profile Updated",
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// BOOK APPOINTMENT
// =====================================================

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      docId,
      slotDate,
      slotTime,
    } = req.body;

    if (
      !userId ||
      !docId ||
      !slotDate ||
      !slotTime
    ) {
      return res.json({
        success: false,
        message: "Missing appointment details",
      });
    }

    const doctor = await doctorModel
      .findById(docId)
      .lean();

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!doctor.available) {
      return res.json({
        success: false,
        message: "Doctor not Available",
      });
    }

    const slots_booked =
      doctor.slots_booked || {};

    if (slots_booked[slotDate]) {

      if (
        slots_booked[slotDate].includes(slotTime)
      ) {
        return res.json({
          success: false,
          message: "Slot not Available",
        });
      }

      slots_booked[slotDate].push(slotTime);

    } else {

      slots_booked[slotDate] = [slotTime];

    }

    const userData = await userModel
      .findById(userId)
      .select("-password")
      .lean();

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    delete doctor.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: doctor,
      amount: doctor.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment =
      new appointmentModel(appointmentData);

    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(
      docId,
      {
        slots_booked,
      }
    );

    return res.json({
      success: true,
      message: "Appointment Booked",
    });

  } catch (error) {
    console.log(
      "BOOK APPOINTMENT ERROR:",
      error
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET USER APPOINTMENTS
// =====================================================

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const appointments =
      await appointmentModel
        .find({ userId })
        .sort({ date: -1 });

    return res.json({
      success: true,
      appointments,
    });

  } catch (error) {
    console.log(
      "LIST APPOINTMENTS ERROR:",
      error
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CANCEL APPOINTMENT
// =====================================================

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;

    const { appointmentId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointmentData =
      await appointmentModel.findById(
        appointmentId
      );

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      String(appointmentData.userId) !==
      String(userId)
    ) {
      return res.json({
        success: false,
        message: "Unauthorized action",
      });
    }

    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    const {
      docId,
      slotDate,
      slotTime,
    } = appointmentData;

    const doctorData =
      await doctorModel.findById(docId);

    if (!doctorData) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    const slots_booked =
      doctorData.slots_booked || {};

    if (slots_booked[slotDate]) {

      slots_booked[slotDate] =
        slots_booked[slotDate].filter(
          (time) => time !== slotTime
        );

      if (
        slots_booked[slotDate].length === 0
      ) {
        delete slots_booked[slotDate];
      }
    }

    await doctorModel.findByIdAndUpdate(
      docId,
      {
        slots_booked,
      }
    );

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        cancelled: true,
      }
    );

    return res.json({
      success: true,
      message: "Appointment Cancelled",
    });

  } catch (error) {
    console.log(
      "CANCEL APPOINTMENT ERROR:",
      error
    );

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

const paymentRazorpay = async (req, res) => {
  try {

  const { appointmentId } = req.body;
  const {userId} =req.body



    const appointmentData =
      await appointmentModel.findById(
        appointmentId
      );

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointmentData.userId.toString()!== userId.toString() && appointmentData.userId.toString()!== req.body.userId?.toString()){

    }
    if(appointmentData.userId.toString()!== userId && appointmentData.userId.toString()!== (req.userId || "")){
      const tokenUserId= req.userId|| userId;
      if(appointmentData.userId.toString()!==tokenUserId.toString()){
        return res.json({
        success: false,
        message: "Unauthorized action -Appointment ownership failed",
      });
      }
    }

    if (appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment is cancelled",
      });
    }
  if(appointmentData.payment){
    return res.json({success:false,message:"Already Paid"})
  }
    
    const options = {
      amount: Math.round(
        appointmentData.amount * 100
      ),

      currency: "INR",

      receipt: String(appointmentId),

      notes: {
        appointmentId: String(appointmentId),
        userId: String(userId),
      },
    };

    console.log(
      "RAZORPAY ORDER OPTIONS:",
      options
    );

    const order =
      await razorpayInstance.orders.create(
        options
      );

    console.log(
      "RAZORPAY ORDER CREATED:",
      order
    );

    return res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.log(
      "RAZORPAY PAYMENT ERROR:",
      error
    );

    return res.json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        "Unable to create payment",
    });
  }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyRazorpay = async (req, res) => {
  try {
   const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId,
    } = req.body;

   

   await appointmentModel.findByIdAndUpdate(appointmentId ,{payment:true})
   res.json({sucess:true, message:"Payment SucessFul"})}
   catch(error){
    console.log(error)
    res.json({success:false, message:error.message})}}

    const appointmentData =
      await appointmentModel.findById(
        appointmentId
      );

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      String(appointmentData.userId) !==
      String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // Razorpay signature verification
    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      console.log(
        "INVALID RAZORPAY SIGNATURE"
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Payment successful
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        payment: true,
        razorpayOrderId:
          razorpay_order_id,
        razorpayPaymentId:
          razorpay_payment_id,
      }
    );

    console.log(
      "PAYMENT VERIFIED SUCCESSFULLY"
    );

    return res.json({
      success: true,
      message: "Payment Verified Successfully",
    });
   } catch (error) {

    console.log(
      "VERIFY RAZORPAY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Payment verification failed",
    });
  }

// =====================================================
// EXPORT
// =====================================================

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};