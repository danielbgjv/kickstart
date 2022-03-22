const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build"); //vamos apagar a pasta build
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) { 
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"), // vamos criar a pasta build e inserir os contratos gerador (vamos substituir o ":" criado para não dar conflito no windows)
    output[contract]
  );
}
