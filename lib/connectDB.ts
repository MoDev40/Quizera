import mongoose from "mongoose";
import { uri } from "../app/config/config";

export const connectDB = async()=>{
    mongoose.connect(uri).then(()=>{
        console.log("connection success");
    }).catch(()=>{
        console.log("connection failed");
    })
}