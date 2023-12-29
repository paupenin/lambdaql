/**
 * This is the schema definition for the GraphQL API
 */
export const typeDefs = `#graphql
  type Query {
    get(key: String!): String
  }

  type Mutation {
    set(key: String!, value: String!): Boolean

    delete(key: String!): Boolean
  }
`;