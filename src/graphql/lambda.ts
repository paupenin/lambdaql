import { ApolloServer } from "@apollo/server";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { GraphQLError } from "graphql";
import { getUserByToken, verifyToken } from "../utils/auth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: false,
  allowBatchedHttpRequests: true,
});

// Define an interface for the event parameter
interface LambdaEvent {
  headers: { Authorization?: string; authorization?: string };
}

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event }: { event: LambdaEvent }) => {
      // Authenticate the request
      const token = verifyToken(event.headers.Authorization || event.headers.authorization);
  
      // If no token is found, return a 401
      if (!token) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
  
      // Get the user from the database
      const user = await getUserByToken(token);

      // If no user is found, return a 401
      if (!user) {
        throw new GraphQLError("User is not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
    },
  }
);
