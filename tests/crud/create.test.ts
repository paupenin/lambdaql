import { handler as createHandler } from "../../src/crud/lambda";
import * as auth from "../../src/utils/auth";
import * as graphqlClient from "../../src/crud/graphqlClient";

describe("Create Operation", () => {
  it("successfully creates an item", async () => {
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
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify({ key: "newItem", value: "newValue" }),
      headers: {
        Authorization: "Bearer valid.token.here", // Mock valid token if needed
      },
    };

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ key: "newItem", value: "newValue" }),
    };

    const response = await createHandler(mockEvent);
    expect(response).toEqual(expectedResponse);
  });

  // Add more test cases as needed, e.g., handling errors, validation failures, etc.
});
