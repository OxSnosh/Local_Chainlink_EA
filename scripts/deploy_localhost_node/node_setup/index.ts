import * as fs from 'fs';
import * as path from 'path';

import { fundEth, fundLink } from "../functions/fund";
import { nodeInfo } from "../functions/node-info";
import { runNode } from "../functions/run-node";
import { createJob } from "../deploy_jobs/src/create-job";
import { deployLinkToken } from "../functions/deploy-link-token";
import { deployOracle } from "../functions/deploy-oracle";
import hre from "hardhat";
import { json } from 'stream/consumers';

const setupNode : any = async () => {

    // const runNodeArgs = {
    //     restartOnly: true
    // }

    // await runNode(runNodeArgs);

    let dataFromNode : any = await nodeInfo()
    console.log(dataFromNode[0])
    console.log(dataFromNode[1])

    const fundEthArgs = {
        nodeAddress: dataFromNode[0],
        amount: "20"
    }

    await fundEth(fundEthArgs)

    const linkTokenAddress = await deployLinkToken()

    const deployOracleArgs = {
        nodeAddress: dataFromNode[0],
        linkAddress: linkTokenAddress
    }

    const oracleAddress = await deployOracle(deployOracleArgs)

    const jobMetadata = {
        "authToken" : dataFromNode[1],
        "oracleAddress" : oracleAddress,
        "nodeAddress" : dataFromNode[0],
        "linkAddress" : linkTokenAddress
    }

    const jsonMetadata = JSON.stringify(jobMetadata)

    const dataToWrite = `export const metadata = ${jsonMetadata};\n`;

    // Define the path
    const outputPath = path.join(__dirname, "..", "deploy_jobs",'metadata.ts');

    // Writing to the file
    fs.writeFile(outputPath, dataToWrite, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Data successfully written to ${outputPath}`);
        }
    });
}

setupNode()