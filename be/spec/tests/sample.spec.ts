import {testBeforeAll} from "../helpers/test-helper";

describe("Player", function() {


  beforeAll(async () => {
      await testBeforeAll();
  });

  beforeEach(function() {
  });

  it("should be able to play a Song", function() {
      expect({}).toBeTruthy()
  });
});
