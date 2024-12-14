import bcrypt from "bcryptjs"; // for hashing the passwords

import { User } from '../models/users.model.js';

export const userResolver = {
    Query: {
        user: async (_, {userId}) => {
            try {
                const user = await  User.findById(userId);
                return user;
            } catch (err) {
                console.error("Error in user query: ",err);
                throw new Error(err.message || "Error getting User");
            }
        },
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (err) {
                console.error("Error in authUser: ",err);
                throw new Error(err.message || "Error getting Auth User");
            }
        },
    },
    Mutation: {
        signUp: async(_, {input}, context) => {
            try {
                console.log("Sign up input:", input);
                const {username, name, password, gender} = input;
                if(!(username && name && password && gender)){
                    throw new Error("All Fields are mandatory");
                }

                const existingUser = await User.findOne({username});
                if(existingUser){
                    console.log("existingUser:",existingUser);
                    throw new Error("User Already Exist.");
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // https://avatar-placeholder.iran.liara.run/document/#username
                // API for generating random avatars
                const boyProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password:hashedPassword,
                    gender,
                    profilePicture: gender=="male" ? boyProfilePicture : girlProfilePicture,
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;
            } catch (err) {
                console.error("Error in SignUp", err);
                throw new Error(err.message || "Internal Server Error");
            }
        },

        login: async(_, {input}, context) => {
            try {
                const {username, password} = input;
                if(!username || !password) {
                    throw new Error("All fields are mandatory");
                }
                console.log("Input passed to authenticate:", { username, password });
                const {user} = await context.authenticate("graphql-local", {username, password});
                
                await context.login(user);
            } catch (err) {
                console.error("Error in Login", err);
                throw new Error(err.message || "Internal Server Error");
            }
        },

        logout: async(_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy((err)=>{
                    if(err) throw err;
                });
                context.res.clearCookie("connect.sid");
                return {message: "Logged Out Successfully"};
            } catch (err) {
                console.error("Error in Logout", err);
                throw new Error(err.message || "Internal Server Error");
            }
        },
    } 

    // TODO: add relationship between user and transaction
}