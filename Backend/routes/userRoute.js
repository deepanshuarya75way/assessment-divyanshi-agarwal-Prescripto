import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
} from "../controllers/userController.js";

import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// =====================================================
// REGISTER USER
// =====================================================

userRouter.post(
  "/register",
  registerUser
);

// =====================================================
// LOGIN USER
// =====================================================

userRouter.post(
  "/login",
  loginUser
);

// =====================================================
// GET PROFILE
// =====================================================

userRouter.get(
  "/get-profile",
  authUser,
  getProfile
);

// =====================================================
// UPDATE PROFILE
// =====================================================

userRouter.post(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateProfile
);

// =====================================================
// BOOK APPOINTMENT
// =====================================================

userRouter.post(
  "/book-appointment",
  authUser,
  bookAppointment
);

// =====================================================
// GET USER APPOINTMENTS
// =====================================================

userRouter.get(
  "/appointments",
  authUser,
  listAppointment
);

// =====================================================
// CANCEL APPOINTMENT
// =====================================================

userRouter.post(
  "/cancel-appointment",
  authUser,
  cancelAppointment
);

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

userRouter.post(
  "/payment-razorpay",
  authUser,
  paymentRazorpay
);

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

userRouter.post(
  "/verify-razorpay",
  authUser,
  verifyRazorpay
);

export default userRouter;