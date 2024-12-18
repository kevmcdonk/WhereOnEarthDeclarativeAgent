// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/// <reference path="types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />
import { post } from "axios";
import { DailyChallenge, DailyChallengeStatus } from "../models/dailyChallenge";
import { DailyChallengeEntriesStatus } from "../models/dailyChallengeEntriesStatus";
import { DailyChallengeInfo, ImageSource } from "../models/dailyChallengeInfo";
import { DailyChallengeImage } from "../models/dailyChallengeImage";
import { DailyChallengeTeam } from "../models/dailyChallengeTeam";
import { info } from "console";
import { getDailyChallengeImage } from "./cosmosService";
import { DailyChallengeEntry } from '../models/dailyChallengeEntry';
import 'bingmaps';

const bingMapsKey = process.env.BING_MAPS_KEY || "<Bing Maps Key>";
const openAIBase = process.env["AZURE_OPENAI_SERVICE"];
const openAIAPIKey = process.env["AZURE_OPENAI_KEY"];
const openAIDeployment = process.env["AZURE_OPENAI_CHATGPT_DEPLOYMENT"];

function defaultReviver(key, value) {
/*  if (value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
      return new Date(value);
  }*/

  if(typeof value === 'undefined') { return null; }
  //if(reviver !== undefined) { reviver(); }
}

export async function GetLocationDetails(locationQueryText:string): Promise<DailyChallengeEntry>
{
  let prompt = 'Show me the longitude, latitude and location name (as imageResponse) for "Meldon Hill, Dartmoor National Park, Devon"\nReturn the results in a JSON schema that looks like {id: string;objType: string;userId: string;userName: string;imageResponse: string;longitude: number;latitude: number;distanceFrom: number;challengeDate: Date;fromId: string;fromName: string;serviceUrl: string;channelId: string;conversationId: string;}';
  let openAIUrl = `https://${openAIBase}.openai.azure.com/openai/deployments/${openAIDeployment}/chat/completions?api-version=2023-03-15-preview`;

  const bingResponse = await post(`TEAMSFX_API_BINGAPI_ENDPOINT=http://www.bing.com/HPImageArchive.aspx`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": openAIAPIKey
    },
    body: JSON.stringify({
      n: 1,
      stop: ["\n"],
      messages:[
        {"role": "system", "content": "Return a JSON message based on the question asked by the user and using the schema {id: string;objType: string;userId: string;userName: string;imageResponse: string;longitude: number;latitude: number;distanceFrom: number;challengeDate: Date;fromId: string;fromName: string;serviceUrl: string;channelId: string;conversationId: string;}."},
        {"role": "user", "content": "Show me the longitude, latitude and location name (as imageResponse) for 'Meldon Hill, Dartmoor National Park, Devon'"},
        {"role": "assistant", "content": "{\"id\": \"\",\"objType\": \"DailyChallengeEntry\",\"userId\": \"\",\"userName\": \"\",\"imageResponse\": \"Meldon Hill, Devon\",\"longitude\": 50.732503,\"latitude\": -4.018769,\"distanceFrom\": 0,\"challengeDate\": \"2023-01-01\",\"fromId\": \"\",\"fromName\": \"\",\"serviceUrl\": \"\",\"channelId\": \"\",\"conversationId\": \"\"}"},
        {"role": "user", "content": locationQueryText}
      ]
    })
});

const completion: any = await bingResponse.json();
let responseJsonText: string = completion.choices[0].message.content.toString();
try {
  //let responseJSON = JSON.parse(responseJsonText);
  //responseJsonText = '{"id": "","objType": "DailyChallengeEntry","userId": "","userName": "","imageResponse": "Canoe paddling in Okefenokee National Wildlife Refuge, Georgia","longitude": 30.765076,"latitude": -82.115057,"distanceFrom": 0,"challengeDate": "2023-01-01","fromId": "","fromName": "","serviceUrl": "","channelId": "","conversationId": ""}';
  var responseJSON = JSON.parse(responseJsonText) as DailyChallengeEntry;

  return responseJSON;
} catch(e) {
  return null;
}

/*
  return {
    id: '',
    objType: 'DailyChallengeEntry',
    userId: '',
    userName: '',
    imageResponse: '',
    longitude: 0,
    latitude: 0,
    distanceFrom: 0,
    challengeDate: new Date(2023,1,1),
    fromId: '',
    fromName: completion.toString(),
    serviceUrl: '',
    channelId: '',
    conversationId: '',
  }
  */
}
