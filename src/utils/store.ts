import { ResultSetHeader } from "mysql2";
import db from "../db";

/**
 * Set a key-value pair in the database.
 */
export const storeSet = async (
  key: string,
  value: string
): Promise<boolean> => {
  try {
    // Update or create the key-value pair
    const [res] = await db.query<ResultSetHeader>(
      "INSERT INTO store (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value`=?",
      [key, value, value]
    );

    return res.affectedRows !== 0;
  } catch (err) {
    console.error(err);
  }

  return false;
};

/**
 * Get a value from the database.
 */
export const storeGet = async (key: string): Promise<string | null> => {
  // Get the value from the database
  const [rows] = await db.query(
    "SELECT value FROM store WHERE `key`=? LIMIT 1",
    key
  );

  // If there is no value, return null
  if (!Array.isArray(rows) || rows.length === 0) return null;

  // Return the value
  return (rows[0] as { value: string }).value;
};

/**
 * Delete a key-value pair from the database.
 */
export const storeDel = async (key: string): Promise<boolean> => {
  try {
    // Delete the key-value pair
    const [res] = await db.query<ResultSetHeader>(
      "DELETE FROM store WHERE `key`=?",
      key
    );

    return res.affectedRows !== 0;
  } catch (err) {
    console.error(err);
  }

  return false;
};
