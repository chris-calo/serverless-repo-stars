const { schedule } = require("@serverless/cloud");

const log = jest.spyOn(console, "log");

test("fetches from github", async () => {
  await schedule.every("3 minutes").invoke();

  expect(log).toBeCalledWith("Fetching stars for the Framework repo from GitHub");
  expect(log).toBeCalledWith("Fetching stars for the Cloud repo from GitHub");
});
