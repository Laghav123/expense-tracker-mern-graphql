import passport from "passport";
import bcrypt from "bcryptjs"; // for hashing the passwords
import { GraphQLLocalStrategy } from "graphql-passport";

import User from "../models/users.model.js";

export const configurePassport = async()=>{
    passport.serializeUser((user, done) => {
        console.log("Serializing a user");
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        console.log("Deserializing User");
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(err);
        }
    });

    passport.use(
        new GraphQLLocalStrategy(async(userName, password, done)=>{
            try {
                const user = await User.findOne({ userName });
                if(!user){
                    throw new Error("Invalid username or password");
                }

                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword){
                    throw new Error("Invalid username or password");
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    )
}