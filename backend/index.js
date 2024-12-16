import express from 'express';
import http from 'http';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import connectMongo from "connect-mongodb-session"
import session from "express-session";
import passport from "passport";
import { buildContext } from "graphql-passport";
import cors from 'cors'
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from "./db/connectDB.js";
import { mergedResolvers } from "./resolvers/index.js";
import { mergedTypeDefs } from "./TypeDefs/index.js";
import { configurePassport } from './passport/passport.config.js';
import { cronJob } from './cron.js';

dotenv.config();
configurePassport();
cronJob.start();

const app = express();
const httpServer = http.createServer(app);
const __dirname = path.resolve();

// Session Auth Setup using 'session' middleware from 'express-session' with MongoDBStore
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
});
store.on("error", (err)=> console.log("MongoDBStore Error: ",err.message));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false, // this is depreciated, can be removed later
        cookie:{
            maxAge: 1000*60*60*24*7,
            httpOnly: true, // prevents cross-site scripting (XSS) attacks
        },
        store:store 
    })
);

// Add middlewares from 'passport' for validation of sessionIDs
app.use(passport.initialize());
app.use(passport.session());

const server=new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    introspection: process.env.NODE_ENV !== "production",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/graphql',
    cors({
        origin: "http://localhost:3000",
        credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({req, res}) => buildContext({req,res}),
    }),
);

// after the build there will be a dist folder which contains the frontend build
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*",(req, res)=>{
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
})

httpServer.listen({ port: 4000 });
await connectDB(); 

console.log(`Server is live`);