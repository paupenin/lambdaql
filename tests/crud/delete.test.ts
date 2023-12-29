import { handler as deleteHandler } from "../../src/crud/lambda";
import * as auth from "../../src/utils/auth";
import * as graphqlClient from "../../src/crud/graphqlClient";

describe("Delete Operation", () => {
  it("successfully deletes an item", async () => {
    // Mock getUserByToken
    jest.spyOn(auth, "getUserByToken").mockImplementation(async (token) => ({
          id: 1,
          username: "testuser",
          email: "test@example.com",
          createdAt: "2021-01-01",
          updatedAt: "2021-01-01",
    }));

    // Mock the GraphQL client get method
    jest.spyOn(graphqlClient, "del").mockImplementation(async (token, key) => true);
    
    // Mock the event
    const mockEvent = {
      requestContext: { http: { method: "DELETE" } },
      queryStringParameters: { key: "itemToDelete" },
      headers: {
        Authorization: "Bearer valid.token.here",
      },
    };

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

    const response = await deleteHandler(mockEvent);
    expect(response).toEqual(expectedResponse);
  });

  it("successfully deletes multiple items", async () => {
    // Mock getUserByToken
    jest.spyOn(auth, "getUserByToken").mockImplementation(async (token) => ({
          id: 1,
          username: "testuser",
          email: "test@example.com",
          createdAt: "2021-01-01",
          updatedAt: "2021-01-01",
    }));

    // Mock the GraphQL client get method
    jest.spyOn(graphqlClient, "batchDel").mockImplementation(async (token, keys) => true);
    
    // Mock the event
    const mockEvent = {
      requestContext: { http: { method: "DELETE" } },
      queryStringParameters: { keys: "item1,item2,item3" },
      headers: {
        Authorization: "Bearer valid.token.here",
      },
    };

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

    const response = await deleteHandler(mockEvent);
    expect(response).toEqual(expectedResponse);
  });
});
