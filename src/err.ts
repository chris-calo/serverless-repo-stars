const Errs = {
  NO_DATA: {
    status: 500,
    message: "GitHub returned an empty or invalid response",
    valid: (data?: any): Boolean => !data,
  },
  NO_STARS: {
    status: 503,
    message: "GitHub wasn't able to return proper star count",
    valid: (data?: any): Boolean => !data.stargazers_count,
  },
};

export default Errs;
