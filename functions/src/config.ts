import * as functions from "firebase-functions";
import * as fs from "fs";
import * as path from "path";

let config = functions.config().env;

if (process.env.NODE_ENV !== "production") {
  if (fs.existsSync(path.join(__dirname, "../env.json"))) {
    const env = require(path.join(__dirname, "../env.json"));
    config = env;
  }
}

export default config;
