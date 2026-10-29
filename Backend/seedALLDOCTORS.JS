import mongoose from "mongoose"
import doctorModel from "./models/doctorModel.js"
import dotenv from "dotenv"
dotenv.config()
const doctors= [{
  name:"Dr.Richard James",
  email:"richard@gmail.com",
  password:"password123",
  image:"https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc1.png",
  speciality:"General Physician",
  degree:"MBBS",
  exprience: "4 years",
  about:" Dr Richard has a strong commitment top delievering comprehensive medical care.",
  fees :1000,
  address:{line1:"17th Cross, Richmond",line2 :"Circle,Ring Road, London"},
  available:true,slots_booked: {},date:Date.now()


},
] 
const uri=process.env.MONGODB_URI ||"mongodb://127.0.0.1:27017/prescripto"
mongoose.connect(uri).then(async()=>{
  console.log("Mongo Connected")
await doctorModel.deleteMany(doctors)
await doctorModel.insertMany(doctors)
console.log(`${doctors.length}Doctors added succesfully!`)
process.exit()

}).catch(e=> console.log(e))