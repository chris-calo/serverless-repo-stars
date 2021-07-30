import { api, data, schedule } from "@serverless/cloud";
import type { Err, StarResponse } from "./types";
import { Product } from "./types";
import Errs from "./err";
import fetch from "node-fetch";

// Determines which repo to fetch data for
const acquireRepoPath = (product: Product): string => {
  switch (product) {
    case Product.FRAMEWORK:
      return "serverless/serverless";
      break;
    case Product.CLOUD:
      return "serverless/cloud";
      break;
    default:
      throw "Unknown Product";
      break;
  };
};

// Makes HTTP request to GitHub client API to acquire repo data
const acquireStars = async (product: Product): any => {
  const repoPath = acquireRepoPath(product);
  const endpoint = `https://api.github.com/repos/${repoPath}`;

  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  const clientReq = {
    method: "GET",
    mode: "no-cors",
    cache: "no-cache",
    redirect: "follow",
    headers,
  };

  const clientRes = await fetch(endpoint, clientReq);

  return clientRes.json();
};

// Attempts to locate errors in GitHub response data
const findErrs = (d?: any): Err[] => {
  return Object.keys(Errs).reduce((a, c) => {
    const err = Errs[c];
    if (err.valid(d)) a.push({ status: c.status, message: err.message });
    return a;
  }, []);
};

// Checks for and packages errors (if any) for client-side JSON parsing
const resolveErrs = (errs?: Err[]): StarResponse => {
  if (errs.length > 1) {
    const errsStripped = errs.map((err) => {
      if (err.status) delete err.status;
      if (err.valid) delete err.valid;
      return err;
    });

    return { ok: false, status: 500, err: errsStripped };
  }

  return { ok: false, ...errs[0] };
};

// Packages HTTP response for client-side JSON parsing
const responseObj = (d?: any): StarResponse => {
  const errs = findErrs(d);
  if (errs.length > 1) return resolveErrs(errs);

  const stars = d.stargazers_count;
  return { ok: true, status: 200, stars };
};

// Fetches both Framework and Cloud repo data and stores response, if valid
const acquireAllStars = async (): void => {
  console.log("Fetching stars for the Framework repo from GitHub");
  console.log("Fetching stars for the Cloud repo from GitHub");

  const fRes = await acquireStars(Product.FRAMEWORK);
  if (findErrs(fRes).length < 1) await data.set(Product.FRAMEWORK, fRes);

  const cRes = await acquireStars(Product.CLOUD);
  if (findErrs(cRes).length < 1) await data.set(Product.CLOUD, cRes);
};

// GitHub is rate-limited without OAuth; limits acquisition and caches
schedule.every("3 minutes", async () => {
  await acquireAllStars();
});

// API end-point for retrieving Framework GitHub repo star metadata
api.get("/framework/stars", async (req, res) => {
  const payload = await data.get(Product.FRAMEWORK);
  const response = responseObj(payload);

  res.json(response);
});

// API end-point for retrieving Cloud GitHub repo star metadata
api.get("/cloud/stars", async (req, res) => {
  const payload = await data.get(Product.CLOUD);
  const response = responseObj(payload);

  res.json(response);
});

// Bootstraps data when initialially running the application
acquireAllStars();
