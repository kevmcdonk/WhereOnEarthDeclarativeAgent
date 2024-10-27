/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getDailyChallenge, getLatestInfo, saveDailyChallenge } from "../services/cosmosService";
import {getBingImageUrl, getBingImageUrlById, getImageCodeById, getNextImageCodeById} from "../services/bingImageService";
import { ImageSource } from "../models/dailyChallengeInfo";
import { GetRandomLocation } from "../services/googleMapService";

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
export async function findImage(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing findImage function");

  let dailyChallenge = await getDailyChallenge();
  let dailyChallengeInfo = await getLatestInfo(dailyChallenge);

  if (req.query.get("imageSource") == "Bing") {
    dailyChallengeInfo.currentSource = ImageSource.Bing;
  }

  if (req.query.get("imageSource") == "Google") {
    dailyChallengeInfo.currentSource = ImageSource.Google;
  }

  if ((await dailyChallengeInfo).currentSource = ImageSource.Bing) {
    
    // Add check to see if they are asking for next Bing image
    if (req.query.get("nextImage")== "true") {
      dailyChallengeInfo.currentImageIndex = getNextImageCodeById(dailyChallengeInfo.currentImageIndex);
    }
    const imageInfo = await getBingImageUrlById(dailyChallengeInfo.currentImageIndex);
    dailyChallenge.imageInfo = imageInfo;
  }
  else if (dailyChallengeInfo.currentSource = ImageSource.Google)
  {
    const imageInfo = await GetRandomLocation();
    dailyChallenge.imageInfo = imageInfo;
  }

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
app.http("findImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: findImage,
});
