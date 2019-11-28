beforeEach(function () {
  jasmine.addMatchers({
    // sample matchers
    toAlwaysBeTrue: function () {
      return {
        compare: function (actual: any, expected: any) {
          return {
            pass: true
          }
        }
      };
    }
  });
});
