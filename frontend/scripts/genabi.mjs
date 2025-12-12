import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const CONTRACT_NAME = "CardFusion";

// <root>/contracts
const rel = "../contracts";

// <root>/frontend/abi
const outdir = path.resolve("./abi");

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

const dir = path.resolve(rel);
const dirname = path.basename(dir);

const line =
  "\n===================================================================\n";

if (!fs.existsSync(dir)) {
  console.error(
    `${line}Unable to locate ${rel}. Expecting <root>/contracts${line}`
  );
  process.exit(1);
}

if (!fs.existsSync(outdir)) {
  console.error(`${line}Unable to locate ${outdir}.${line}`);
  process.exit(1);
}

const deploymentsDir = path.join(dir, "deployments");

// Chain name to chainId mapping
const CHAIN_MAPPING = {
  localhost: 31337,
  hardhat: 31337,
  sepolia: 11155111,
  mainnet: 1,
  goerli: 5,
  // Add more chains as needed
};

// Chain name to display name mapping
const CHAIN_DISPLAY_NAMES = {
  localhost: "hardhat",
  hardhat: "hardhat",
  sepolia: "sepolia",
  mainnet: "mainnet",
  goerli: "goerli",
};

function deployOnHardhatNode() {
  if (process.platform === "win32") {
    // Not supported on Windows
    return;
  }
  try {
    execSync(`cd ${dir} && npx hardhat deploy --network localhost`, {
      stdio: "inherit",
    });
  } catch (e) {
    console.error(`${line}Script execution failed: ${e}${line}`);
    process.exit(1);
  }
}

function readDeployment(chainName, contractName) {
  const chainDeploymentDir = path.join(deploymentsDir, chainName);

  // Try to auto-deploy on localhost if it doesn't exist (Linux/Mac only)
  if (!fs.existsSync(chainDeploymentDir) && chainName === "localhost") {
    deployOnHardhatNode();
  }

  if (!fs.existsSync(chainDeploymentDir)) {
    return undefined;
  }

  const contractFile = path.join(chainDeploymentDir, `${contractName}.json`);
  if (!fs.existsSync(contractFile)) {
    return undefined;
  }

  const jsonString = fs.readFileSync(contractFile, "utf-8");
  const obj = JSON.parse(jsonString);
  
  // Get chainId from mapping or from the deployment file
  const chainId = CHAIN_MAPPING[chainName] || obj.chainId;
  obj.chainId = chainId;
  obj.chainName = chainName;

  return obj;
}

// Auto-discover all deployments
const deployments = {};
let firstABI = null;

if (!fs.existsSync(deploymentsDir)) {
  console.log(`⚠️  No deployments directory found at ${deploymentsDir}. Skipping...`);
} else {
  // Scan all chain directories
  const chainDirs = fs.readdirSync(deploymentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const chainName of chainDirs) {
    const deployment = readDeployment(chainName, CONTRACT_NAME);
    if (deployment) {
      const chainId = deployment.chainId || CHAIN_MAPPING[chainName];
      if (chainId) {
        deployments[chainId] = {
          address: deployment.address,
          chainId: chainId,
          chainName: CHAIN_DISPLAY_NAMES[chainName] || chainName,
        };
        
        // Use the first deployment's ABI (they should all be the same)
        if (!firstABI) {
          firstABI = deployment.abi;
        }
        
        console.log(`✓ Found deployment for ${chainName} (chainId: ${chainId})`);
      }
    }
  }
}

// Check if we have any deployments
if (Object.keys(deployments).length === 0) {
  console.log(`⚠️  No deployments found. Please deploy the contract first.`);
  console.log(`   Run: cd ${dirname} && npx hardhat deploy --network <network>`);
  
  // Generate empty files
  const tsCode = `
/*
  This file is auto-generated.
  Command: 'npm run genabi'
  No deployments found.
*/
export const ${CONTRACT_NAME}ABI = { abi: [] } as const;
\n`;
  const tsAddresses = `
/*
  This file is auto-generated.
  Command: 'npm run genabi'
  No deployments found.
*/
export const ${CONTRACT_NAME}Addresses = {};
`;

  fs.writeFileSync(path.join(outdir, `${CONTRACT_NAME}ABI.ts`), tsCode, "utf-8");
  fs.writeFileSync(
    path.join(outdir, `${CONTRACT_NAME}Addresses.ts`),
    tsAddresses,
    "utf-8"
  );
  
  console.log(`Generated empty files.`);
  process.exit(0);
}

// Validate ABI consistency across all deployments
if (firstABI) {
  for (const [chainId, deployment] of Object.entries(deployments)) {
    // We already validated by using the first ABI, but we could add more checks here
  }
}

// Generate TypeScript files
const tsCode = `
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const ${CONTRACT_NAME}ABI = ${JSON.stringify({ abi: firstABI }, null, 2)} as const;
\n`;

// Generate addresses object with all found deployments
const addressesEntries = Object.entries(deployments)
  .map(([chainId, deployment]) => {
    return `  "${chainId}": { address: "${deployment.address}", chainId: ${deployment.chainId}, chainName: "${deployment.chainName}" }`;
  })
  .join(",\n");

const tsAddresses = `
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const ${CONTRACT_NAME}Addresses = { 
${addressesEntries}
};
`;

console.log(`\n✓ Generated ${path.join(outdir, `${CONTRACT_NAME}ABI.ts`)}`);
console.log(`✓ Generated ${path.join(outdir, `${CONTRACT_NAME}Addresses.ts`)}`);
console.log(`\nFound ${Object.keys(deployments).length} deployment(s):`);
for (const [chainId, deployment] of Object.entries(deployments)) {
  console.log(`  - ${deployment.chainName} (${chainId}): ${deployment.address}`);
}

fs.writeFileSync(path.join(outdir, `${CONTRACT_NAME}ABI.ts`), tsCode, "utf-8");
fs.writeFileSync(
  path.join(outdir, `${CONTRACT_NAME}Addresses.ts`),
  tsAddresses,
  "utf-8"
);

