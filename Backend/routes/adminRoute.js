import express from "express";

import {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";

import authAdmin from "../middlewares/authAdmin.js";

import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// Add Doctor
adminRouter.post(
    "/add-doctor",
    authAdmin,
    upload.single("image"),
    addDoctor
);

// Admin Login
adminRouter.post(
    "/login",
    loginAdmin
);

// All Doctors
adminRouter.post(
    "/all-doctors",
    authAdmin,
    allDoctors
);

// Change Doctor Availability
adminRouter.post(
    "/change-availability",
    authAdmin,
    changeAvailability
);

// All Appointments
adminRouter.get(
    "/appointments",
    authAdmin,
    appointmentsAdmin
);

export default adminRouter;