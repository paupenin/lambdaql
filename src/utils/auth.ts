import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined!");
}

interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get a user by their username and password
 */
export const getUserByUsernameAndPassword = async (
  username: string,
  password: string
): Promise<User | null> => {
  // Get the user from the database
  const [rows] = await db.query(
    "SELECT * FROM users WHERE `username` = ? LIMIT 1",
    [username]
  );

  // If there is no value, return null
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const user = rows[0] as User;

  // Check the password matches
  const match = await bcrypt.compare(password, user.password as string);

  if (!match) return null;

  // Return the value (without the password)
  return {
    ...user,
    password: undefined,
  };
};

/**
 * Get a user by their token
 */
export const getUserByToken = async (token: string): Promise<User | null> => {
  // Decode the token (thows an error if invalid)
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

  // Get the user from the database
  const [rows] = await db.query(
    "SELECT * FROM users WHERE `id` = ? LIMIT 1",
    [decoded.userId]
  );

  // If there is no value, return null
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const user = rows[0] as User;

  // Return the value (without the password)
  return {
    ...user,
    password: undefined,
  };
}

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Generate a JWT token
 */
export const generateToken = async (user: { id: number}): Promise<string> => {
  return await jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Clean the token by removing the "Bearer " prefix and returning null if the token is empty
 */
export const verifyToken = (token: string | undefined): string | null => {
  if (!token) return null;

  if (token.startsWith("Bearer ")) {
    let segmentedToken = token.split(" ")[1];

    return segmentedToken !== "" ? segmentedToken : null;
  }

  return token !== "" ? token : null;
}