import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getDailyChallenge, saveDailyChallenge } from "../services/cosmosService";
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
export async function startGame(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing startGame function");

  let dailyChallenge = await getDailyChallenge();

  dailyChallenge.currentStatus = DailyChallengeStatus.Choosing;
  await saveDailyChallenge(dailyChallenge);
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
app.http("startGame", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: startGame,
});
