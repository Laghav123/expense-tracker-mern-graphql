import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
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

export const User = mongoose.model("User", userSchema); // now User is a mongoose model which have inherited functionalities like .save() .findById() .findOne() etc