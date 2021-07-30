const { api } = require("@serverless/cloud");

test("should fetch Serverless Framework repo stars", async () => {
  const { body } = await api.get("/framework/stars").invoke();
  expect(body).toEqual({ ok: true, status: 200, stars: 0 });
});
