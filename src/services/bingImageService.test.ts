import {getBingImageUrl, getBingImageUrlById, getImageCodeById, getNextImageCodeById} from "./bingImageService";

describe("Bing image service test", () => {
  

  it("should get UK image code", async () => {
    const imageCode = getImageCodeById(0)
    const expectedCode = "en-UK";
    expect(imageCode).toEqual(expectedCode);
  });

});