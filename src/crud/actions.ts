import { batchDel, batchSet, del, get, set } from "./graphqlClient";


// Define an interface for the Item
interface Item {
  key: string;
  value: string;
}

/**
 * Create an item
 */
export async function createItem(token: string, key: string, value: string): Promise<Item> {
    const success = await set(token, key, value);
  
    if (!success) {
      throw new Error("Item could not be created.");
    }
  
    return { key, value };
}

/**
 * Get an item
 */
export async function getItem(token: string, key: string): Promise<Item> {
  const value = await get(token, key);

  return { key, value };
}

/**
 * Update an item
 */
export async function updateItem(token: string, key: string, value: string): Promise<Item> {
  const success = await set(token, key, value);

  if (!success) {
    throw new Error("Item could not be updated.");
  }

  return { key, value };
}

/**
 * Batch update items
 */
export async function batchUpdate(token: string, items: Item[]): Promise<boolean> {
    return await batchSet(token, items);
}

/**
 * Delete an item
 */
export async function deleteItem(token: string, key: string): Promise<boolean> {
  return await del(token, key);
}

/**
 * Batch delete items
 */
export async function batchDelete(token: string, keys: string[]): Promise<boolean> {
  return await batchDel(token, keys);
}
