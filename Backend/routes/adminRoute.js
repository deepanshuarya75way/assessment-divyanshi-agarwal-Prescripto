import express from "express";

import {
  addDoctor,
  changeAvailability,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  resetDoctorPassword,
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// Admin login
adminRouter.post("/login", loginAdmin);

// Add doctor
adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.single("image"),
  addDoctor
);

// Get all doctors
adminRouter.post(
  "/all-doctors",
  authAdmin,
  allDoctors
);

// Change doctor availability
adminRouter.post(
  "/change-availability",
  authAdmin,
  changeAvailability
);

// Get all appointments
adminRouter.get(
  "/appointments",
  authAdmin,
  appointmentsAdmin
);

// Reset doctor password
adminRouter.post(
  "/reset-doctor-password",
  authAdmin,
  resetDoctorPassword
);

export default adminRouter;