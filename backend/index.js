import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from 'express';
import cors from 'cors'
import http from 'http';

import { mergedResolvers } from "./resolvers/index.js";
import { mergedTypeDefs } from "./TypeDefs/index.js";

const app = express();
const httpServer = http.createServer(app);

const server=new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: async ({req}) => ({req}),
    }),
);

await httpServer.listen({port: 4000});

console.log(`Server is running at http://localhost:4000`);