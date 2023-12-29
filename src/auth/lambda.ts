import { generateToken, getUserByUsernameAndPassword } from "../utils/auth";

// Define an interface for the event parameter
interface LambdaEvent {
  headers: { Authorization?: string; authorization?: string };
  body?: string;
}

export const handler = async (
  event: LambdaEvent
): Promise<{ statusCode: number; body: string }> => {
  try {
    // Authenticate the user
    const body = event.body ? JSON.parse(event.body) : {};
  
    // If no username or password is provided, return a 400
    if (!body.username || !body.password) {
        return { statusCode: 400, body: "Bad Request" };
    }

    // Get the user from the database
    const user = await getUserByUsernameAndPassword(body.username, body.password);

    // If a user is found, return a 200 with the token
    if (user) {
        return { statusCode: 200, body: JSON.stringify({ token: await generateToken(user) }) };
    }

    // Otherwise, return a 401
    return { statusCode: 401, body: "Unauthorized" };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: "Could not authenticate." };
  }
};
