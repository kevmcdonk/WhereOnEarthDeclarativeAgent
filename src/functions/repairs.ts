/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * This function handles the HTTP request and returns the repair information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the repair information.
 */
export async function repairs(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  const repairRecords = [
    {
      "id": "1",
      "title": "Oil change",
      "description": "Need to drain the old engine oil and replace it with fresh oil to keep the engine lubricated and running smoothly.",
      "assignedTo": "Bob McBobbyface",
      "date": "2023-05-23",
      "image": "https://www.howmuchisit.org/wp-content/uploads/2011/01/oil-change.jpg"
    },
    {
      "id": "2",
      "title": "Brake repairs",
      "description": "Conduct brake repairs, including replacing worn brake pads, resurfacing or replacing brake rotors, and repairing or replacing other components of the brake system.",
      "assignedTo": "Issac Fielder",
      "date": "2023-05-24",
      "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/Disk_brake_dsc03680.jpg"
    }]
  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      results: repairRecords,
    },
  };

  // Get the assignedTo query parameter.
  const assignedTo = req.query.get("assignedTo");

  // If the assignedTo query parameter is not provided, return the response.
  if (!assignedTo) {
    return res;
  }

  // Filter the repair information by the assignedTo query parameter.
  const repairs = repairRecords.filter((item) => {
    const fullName = item.assignedTo.toLowerCase();
    const query = assignedTo.trim().toLowerCase();
    const [firstName, lastName] = fullName.split(" ");
    return fullName === query || firstName === query || lastName === query;
  });

  // Return filtered repair records, or an empty array if no records were found.
  res.jsonBody.results = repairs ?? [];
  return res;
}

app.http("repairs", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: repairs,
});
