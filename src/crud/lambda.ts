import { getUserByToken, verifyToken } from "../utils/auth";
import { batchDelete, batchUpdate, createItem, deleteItem, getItem, updateItem } from "./actions";

// Define an interface for the event parameter
interface LambdaEvent {
  headers: { Authorization?: string; authorization?: string };
  requestContext: { http: { method: string } };
  body?: string;
  queryStringParameters?: any;
}

// Main Lambda handler with type annotations
export const handler = async (
  event: LambdaEvent
): Promise<{ statusCode: number; body: string }> => {
  try {
    // Authenticate the request
    const token = verifyToken(event.headers.Authorization || event.headers.authorization);

    // If no token is found, return a 401
    if (!token) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    // Get the user from the database
    const user = await getUserByToken(token);

    // If no user is found, return a 401
    if (!user) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    // Get the query string parameters and body
    const params = event.queryStringParameters;
    const body = event.body ? JSON.parse(event.body) : null;

    // Determine and execute the CRUD operation based on HTTP method
    switch (event.requestContext.http.method) {
      // Create
      case "POST":
        if (!body?.key || !body?.value) {
          return { statusCode: 400, body: "Bad Request" };
        }

        const createdItem = await createItem(token, body.key, body.value);

        return { statusCode: 200, body: JSON.stringify(createdItem) };

      // Read
      case "GET":
        if (!params?.key) {
          return { statusCode: 400, body: "Bad Request" };
        }

        const item = await getItem(token, params.key);

        return { statusCode: 200, body: JSON.stringify(item) };

      // Update
      case "PUT":
        // Batch update
        if (body?.items) {
          const success = await batchUpdate(token, body.items);

          return { statusCode: 200, body: JSON.stringify({ success }) };
        }

        // Single update
        if (!body?.key || !body?.value) {
          return { statusCode: 400, body: "Bad Request" };
        }

        const updatedItem = await updateItem(token, body.key, body.value);

        return { statusCode: 200, body: JSON.stringify(updatedItem) };

      // Delete
      case "DELETE":
        // Batch delete
        if (params?.keys) {
          const keys = params.keys.split(",");
          const success = await batchDelete(token, keys);

          return { statusCode: 200, body: JSON.stringify({ success }) };
        }

        // Single delete
        if (!params?.key) {
          return { statusCode: 400, body: "Bad Request" };
        }

        const success = await deleteItem(token, params.key);

        return { statusCode: 200, body: JSON.stringify({ success }) };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (err as Error).message }),
    };
  }
};
