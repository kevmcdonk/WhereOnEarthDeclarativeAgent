/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getDailyChallenge } from "../services/cosmosService";
import { DailyChallengeStatus } from "../models/dailyChallenge";

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
export async function selectImage(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing selectImage function");

  let dailyChallenge = await getDailyChallenge();
  dailyChallenge.currentStatus = DailyChallengeStatus.Guessing;
  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      dailyChallenge: dailyChallenge,
    },
  };
  
  return res;
}

//TODO: make not anonymous with Bob Germain's magic
app.http("selectImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: selectImage,
});
