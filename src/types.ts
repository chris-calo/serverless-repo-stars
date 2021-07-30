type Err = {
  status?: Number;
  message: String;
  valid: (any) => Boolean;
};

type StarResponse = {
  ok: Boolean;
  status: Number;
  stars?: Number;
  err?: Err[];
};

enum Product {
  FRAMEWORK = "framework:stars",
  CLOUD = "cloud:stars",
};

export { Err, Product, StarResponse };
