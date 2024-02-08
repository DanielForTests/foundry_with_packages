const { execSync } = require("child_process");

const output = execSync("forge tree").toString();

const versions = output.split(" ").reduce((filteredVersions, word) => {
  const stripped = word.trim();
  if (/^\^\d+\.\d+\.\d+$/.test(stripped)) {
    filteredVersions.push(stripped);
  }
  return filteredVersions;
}, []);

// use a set to remove duplicates
const uniqueVersions = [...new Set(versions)];
console.log(uniqueVersions);
