import { handler as updateHandler } from '../../src/crud/lambda';
import * as auth from "../../src/utils/auth";
import * as graphqlClient from "../../src/crud/graphqlClient";

describe('Update Operation', () => {
    it('successfully updates an item', async () => {
      // Mock getUserByToken
      jest.spyOn(auth, "getUserByToken").mockImplementation(async (token) => ({
            id: 1,
            username: "testuser",
            email: "test@example.com",
            createdAt: "2021-01-01",
            updatedAt: "2021-01-01",
      }));
  
      // Mock the GraphQL client get method
      jest.spyOn(graphqlClient, "set").mockImplementation(async (token, key) => true);
      
      // Mock the event
      const mockEvent = {
        requestContext: { http: { method: 'PUT' } },
        body: JSON.stringify({ key: 'itemToUpdate', value: 'updatedValue' }),
        headers: {
          Authorization: 'Bearer valid.token.here',
        },
      };
  
      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify({ key: 'itemToUpdate', value: 'updatedValue' }),
      };
  
      const response = await updateHandler(mockEvent);
      expect(response).toEqual(expectedResponse);
    });

    it('successfully updates multiple items', async () => {
      // Mock getUserByToken
      jest.spyOn(auth, "getUserByToken").mockImplementation(async (token) => ({
            id: 1,
            username: "testuser",
            email: "test@example.com",
            createdAt: "2021-01-01",
            updatedAt: "2021-01-01",
      }));
  
      // Mock the GraphQL client get method
      jest.spyOn(graphqlClient, "set").mockImplementation(async (token, key) => true);
      
      // Mock the event
      const mockEvent = {
        requestContext: { http: { method: 'PUT' } },
        body: JSON.stringify([
          { key: 'itemToUpdate', value: 'updatedValue' },
          { key: 'itemToUpdate2', value: 'updatedValue2' },
          { key: 'itemToUpdate3', value: 'updatedValue3' },
        ]),
        headers: {
          Authorization: 'Bearer valid.token.here',
        },
      };
  
      const expectedResponse = {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
  
      const response = await updateHandler(mockEvent);
      expect(response).toEqual(expectedResponse);
    });
  });