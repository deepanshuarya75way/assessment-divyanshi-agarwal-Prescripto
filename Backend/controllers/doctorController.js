import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address ||
      !imageFile
    ) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(
      imageFile.path,
      {
        resource_type: "image",
      }
    );

    const doctorData = {
      name,
      email,
      image: imageUpload.secure_url,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      available: true,
      fees: Number(fees),
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);

    await newDoctor.save();

    console.log("Doctor Saved Successfully");
    console.log(
      "Database Name:",
      mongoose.connection.name
    );
    console.log(
      "Collection Name:",
      doctorModel.collection.name
    );

    res.json({
      success: true,
      message: "Doctor Added",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API for changing doctor availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctorData =
      await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctorData.available,
    });

    res.json({
      success: true,
      message: "Availability Changed",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
const doctorList= async(req,res) =>{
  try{
     const doctors= await doctorModel.find({}).select(['-password' ,'-email'])
     res.json({success:true,doctors})
  }catch(error){
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
}
//API for doctor login 
const loginDoctor = async(req,res)=>{
  try{
     const{email, password} =req.body
     const doctor =await doctorModel.findOne({email})
     if(!doctor) {
      return res.json({success:false, message:'Invalid Credentials'})
     }
      const isMatch =await bcrypt.compare(password,doctor.password)
      if(isMatch) {
          const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
          res.json({success:true, token})
      }  else{
         res.json({success:false, message:'Invalid Credentials'})
      }
  }catch(error){
     console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
}

export { addDoctor, changeAvailability,doctorList , loginDoctor };