import { gql, GraphQLClient } from "graphql-request";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const ENDPOINT = process.env.GRAPHQL_ENDPOINT || "";

interface SetResponse {
  set: boolean;
}

interface GetResponse {
  get: string;
}

interface DelResponse {
  delete: boolean;
}

interface ResponseError {
  response?: {
    errors: {
      message: string;
    }[];
  };
}

/**
 * Get a GraphQL client
 */
const getClient = (token: string): GraphQLClient => {
  return new GraphQLClient(ENDPOINT, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Get the error message from the GraphQL response
 */
const getErrorMessage = (err: ResponseError): string => {
  if (err.response && err.response.errors && err.response.errors.length > 0) {
    return err.response.errors.map((error) => error.message).join("; ");
  }

  return "Unknown error";
};

/**
 * GraphQL mutation to set a key-value pair
 */
const setMutation = gql`
  mutation Mutation($key: String!, $value: String!) {
    set(key: $key, value: $value)
  }
`;

/**
 * GraphQL mutation to delete a key-value pair
 */
const delMutation = gql`
  mutation Mutation($key: String!) {
    delete(key: $key)
  }
`;

/**
 * Set a key-value pair
 */
export const set = async (
  token: string,
  key: string,
  value: string
): Promise<boolean> => {
  try {
    const response = await getClient(token).request(setMutation, {
      key,
      value,
    });

    return (response as SetResponse).set;
  } catch (err) {
    console.log(err);
    throw new Error(getErrorMessage(err as ResponseError));
  }
};

/**
 * Set multiple key-value pairs
 */
export const batchSet = async (
  token: string,
  items: { key: string; value: string }[]
): Promise<boolean> => {
  try {
    const requests = items.map((item) => ({
      document: setMutation,
      variables: item,
    }));

    const response = await getClient(token).batchRequests(requests);

    return response.map(({ data }) => (data as SetResponse).set).every(Boolean);
  } catch (err) {
    console.log(err);
    throw new Error(getErrorMessage(err as ResponseError));
  }
};

/**
 * Get a value by key
 */
export const get = async (token: string, key: string): Promise<string> => {
  try {
    const query = gql`
      query Query($key: String!) {
        get(key: $key)
      }
    `;

    const response = await getClient(token).request(query, {
      key,
    });

    return (response as GetResponse).get;
  } catch (err) {
    console.log(err);
    throw new Error(getErrorMessage(err as ResponseError));
  }
};

/**
 * Delete a key-value pair
 */
export const del = async (token: string, key: string): Promise<boolean> => {
  try {
    const response = await getClient(token).request(delMutation, { key });

    return (response as DelResponse).delete;
  } catch (err) {
    console.log(err);
    throw new Error(getErrorMessage(err as ResponseError));
  }
};

/**
 * Delete multiple key-value pairs
 */
export const batchDel = async (
  token: string,
  keys: string[]
): Promise<boolean> => {
  try {
    const requests = keys.map((key) => ({
      document: delMutation,
      variables: { key },
    }));

    const response = await getClient(token).batchRequests(requests);

    return response.map(({ data }) => (data as DelResponse).delete).every(Boolean);
  } catch (err) {
    console.log(err);
    throw new Error(getErrorMessage(err as ResponseError));
  }
}