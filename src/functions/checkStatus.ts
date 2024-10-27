import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * This function handles the HTTP request and returns the repair information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the repair information.
 */

/*
  check entry exists
*/
export async function checkStatus(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing checkStatus function");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      status: 'alive',
    },
  };
  
  return res;
}

//TODO: make not anonymous with Bob Germain's magic
app.http("checkStatus", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: checkStatus,
});
