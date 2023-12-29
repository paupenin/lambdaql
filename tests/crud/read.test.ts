import { handler as readHandler } from "../../src/crud/lambda";
import * as auth from "../../src/utils/auth";
import * as graphqlClient from "../../src/crud/graphqlClient";

describe("Read Operation", () => {
  // beforeEach(() => {
  //   jest.spyOn(auth, "getData").mockReturnValue("mocked message");
  // });
  
  it("successfully retrieves an item", async () => {
    // Mock getUserByToken
    jest.spyOn(auth, "getUserByToken").mockImplementation(async (token) => ({
          id: 1,
          username: "testuser",
          email: "test@example.com",
          createdAt: "2021-01-01",
          updatedAt: "2021-01-01",
    }));

    // Mock the GraphQL client get method
    jest.spyOn(graphqlClient, "get").mockImplementation(async (token, key) => "valueOfItem");
    
    // Mock the event
    const mockEvent = {
      requestContext: { http: { method: "GET" } },
      queryStringParameters: { key: "itemToRead" },
      headers: {
        Authorization: "Bearer valid.token.here",
      },
    };

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ key: "itemToRead", value: "valueOfItem" }),
    };

    const response = await readHandler(mockEvent);
    expect(response).toEqual(expectedResponse);
  });

  // Additional tests for item not found, error handling, etc.
});
