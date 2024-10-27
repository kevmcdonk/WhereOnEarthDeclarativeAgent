import * as cosmosService from "./cosmosService";

describe("cosmos service test", () => {
  

  it("should get daily challenge", async () => {
    const actualDailyChallenge = await cosmosService.getDailyChallenge();
    const expectedDailyChallenge = {};
    expect(expectedDailyChallenge).toEqual(actualDailyChallenge);
  });

});