import bcrypt from "bcryptjs"; // for hashing the passwords

import { User } from '../models/users.model.js';

export const userResolver = {
    Query: {
        user: async (_, {userId}) => {
            try {
                const user = await  User.findById(userId);
                return user;
            } catch (err) {
                console.log("Error in user query: ",err);
                throw new Error(err.message || "Error getting User");
            }
        },
        authUser: async (_, _, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (err) {
                console.log("Error in authUser: ",err);
                throw new Error(err.message || "Error getting Auth User");
            }
        },
    },
    Mutation: {
        signUp: async(_, {input}, context) => {
            try {
                const {userName, name, password, gender} = input;
                if(!(userName && name && password && gender)){
                    throw new Error("All Fields are mandatory");
                }

                const existingUser = User.findOne({userName});
                if(existingUser){
                    throw new Error("User Already Exist.");
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // https://avatar-placeholder.iran.liara.run/document/#username
                // API for generating random avatars
                const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
                const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

                const newUser = new User({
                    userName,
                    name,
                    password:hashedPassword,
                    gender,
                    profilePicture: gender=="male" ? boyProfilePicture : girlProfilePicture,
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;
            } catch (err) {
                console.log("Error in SignUp", err);
                throw new Error(err.message || "Internal Server Error");
            }
        },

        login: async(_, {input}, context) => {
            try {
                const {userName, password} = input;
                const {user} = await context.authenticate("graphql-local", {userName, password});
                
                await context.login(user);
            } catch (err) {
                console.log("Error in Login", err);
                throw new Error(err.message || "Internal Server Error");
            }
        },

        logout: async(_, _, context) => {
            const {login, authenticate} = context;
            try {
                await context.logout();
                req.session.destroy((err)=>{
                    if(err) throw err;
                });
                res.clearCookie("connect.sid");
                return {message: "Logged Out Successfully"};
            } catch (err) {
                console.log("Error in Logout", err);
                throw new Error(err.message || "Internal Server Error");
            }
        },
    } 
}