const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const output = execSync("forge remappings").toString();

const remappings = output.split("\n").filter(Boolean);

fs.writeFileSync(
  path.resolve(__dirname, "remappings.json"),
  JSON.stringify({ remappings }, null, 2)
);
