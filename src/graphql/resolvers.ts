import { storeDel, storeGet, storeSet } from "../utils/store";

/**
 * This file contains the resolvers for the GraphQL schema.
 */
export const resolvers = {
  Query: {
    get: async (
      _parent: any,
      args: { key: string }
    ): Promise<string | null> => {
      // Validate the key
      if (args.key.length < 3) {
        throw new Error("Key must be at least 3 characters long.");
      }
      
      // Get the value from the store
      return await storeGet(args.key);
    },
  },
  Mutation: {
    set: async (
      _parent: any,
      args: { key: string; value: string }
    ): Promise<boolean> => {
      // Validate the key
      if (args.key.length < 3) {
        throw new Error("Key must be at least 3 characters long.");
      }

      // Validate the value
      if (args.value.length < 3) {
        throw new Error("Value must be at least 3 characters long.");
      }

      // Set the key-value pair in store
      return await storeSet(args.key, args.value);
    },

    delete: async (
      _parent: any,
      args: { key: string }
    ): Promise<boolean> => {
      // Validate the key
      if (args.key.length < 3) {
        throw new Error("Key must be at least 3 characters long.");
      }

      // Delete the key-value pair from store
      return await storeDel(args.key);
    },
  },
};
