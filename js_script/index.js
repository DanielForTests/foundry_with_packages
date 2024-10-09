const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

(async () => {
  // Replace with your actual contract address
  const contractAddress = "0x2ba4394f93d457ccac3b36efc6af88fa594a76fa";
  const solFileName = "TestToken.sol";
  const contractName = "TestTokenForDeployment";

  const inputDir = "src";
  const outputDir = "out";

  const baseProjectDir = path.resolve(__dirname, "..");

  const apiUrl = `https://explorer.sandverse.oasys.games/api/v2/smart-contracts/${contractAddress}/verification/via/standard-input`;

  const artifactPath = path.join(
    baseProjectDir,
    outputDir,
    solFileName,
    contractName + ".json"
  );

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const metadata = JSON.parse(artifact.rawMetadata);

  const { sources } = metadata;
  const sourceKeys = Object.keys(sources);

  for (let i = 0; i < sourceKeys.length; i++) {
    const sourceFilePath = sourceKeys[i];

    const sourceContent = fs.readFileSync(
      path.join(baseProjectDir, sourceFilePath),
      "utf8"
    );

    sources[sourceFilePath] = {
      content: sourceContent,
    };
  }

  metadata.sources = sources;

  const compilerVersion = metadata.compiler.version;

  const fullContractName = `${path.join(
    inputDir,
    solFileName
  )}:${contractName}`;

  const formData = new FormData();

  // Append required fields
  formData.append("compiler_version", compilerVersion);
  formData.append("license_type", "UNLICENSED");
  formData.append("contract_name", fullContractName);

  // Append the metadata file as binary
  const metadataBuffer = Buffer.from(JSON.stringify(metadata));
  formData.append("files[0]", metadataBuffer, {
    filename: "metadata.json",
    contentType: "application/json",
  });

  formData.append("autodetect_constructor_args", "false");
  formData.append("constructor_args", "");

  // Save the final metadata in a json file
  const metadataOutputPath = path.join(
    baseProjectDir,
    outputDir,
    solFileName,
    contractName + ".metadata.json"
  );

  fs.writeFileSync(metadataOutputPath, JSON.stringify(metadata, null, 2));

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log("Verification response:", response.data);
  } catch (error) {
    console.error(
      "Error verifying contract:",
      error.response ? error.response.data : error.message
    );
  }
})();
