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

import { mergedResolvers } from "./resolvers/index.js";
import { mergedTypeDefs } from "./TypeDefs/index.js";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from './passport/passport.config.js';

dotenv.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app);

// Session Auth Setup using 'session' middleware from 'express-session' with MongoDBStore
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
    mongoUrl: process.env.MONGO_URI,
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

await httpServer.listen({port: 4000});
await connectDB(); 

console.log(`Server is running at http://localhost:4000`);