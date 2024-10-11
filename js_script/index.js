const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

(async () => {
  const contractAddress = process.argv[2].toLowerCase();
  const solFileName = process.argv[3];
  const contractName = process.argv[4];

  // TODO: Fetch these programatically, or read them from the arguments
  // We're already getting them when compiling, so we can reuse either those values or that code to fetch them here again
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

  let licenseType;

  for (let i = 0; i < sourceKeys.length; i++) {
    const sourceFilePath = sourceKeys[i];

    if (sourceFilePath === path.join(inputDir, solFileName)) {
      const oldSource = sources[sourceFilePath];
      licenseType = oldSource.license;
      console.log("License type:", licenseType);
    }

    const sourceContent = fs.readFileSync(
      path.join(baseProjectDir, sourceFilePath),
      "utf8"
    );

    sources[sourceFilePath] = {
      content: sourceContent,
    };
  }

  metadata.sources = sources;

  let compilerVersion = metadata.compiler.version;
  if (!compilerVersion.startsWith("v")) {
    compilerVersion = "v" + compilerVersion;
  }

  const formData = new FormData();

  formData.append("compiler_version", compilerVersion);
  formData.append("license_type", licenseType);
  formData.append("contract_name", "undefined");

  const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));
  formData.append("files[0]", metadataBuffer, {
    filename: "TestTokenForDeployment.metadata.json",
    contentType: "application/json",
  });

  formData.append("autodetect_constructor_args", "false");
  formData.append("constructor_args", "");

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
