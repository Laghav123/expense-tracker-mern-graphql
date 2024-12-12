import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum:["male", "female"],
    },
    profilePicture: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);