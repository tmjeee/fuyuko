import {recreateDatabase, setupTestDatabase} from "../helpers/test-helper";

describe("Player", function() {


  beforeAll(async () => {
      await setupTestDatabase();
  });

  beforeEach(function() {
  });

  it("should be able to play a Song", function() {
      expect({}).toBeTruthy()
  });
});
