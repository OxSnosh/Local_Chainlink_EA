import * as fs from 'fs';
import * as path from 'path';

import { fundEth, fundLink } from "./functions/fund";
import { nodeInfo } from "./functions/node-info";
import { runNode } from "./functions/run-node";
import { createJob } from "./deploy_jobs/src/create-job";
import { deployLinkToken } from "./functions/deploy-link-token";
import { deployOracle } from "./functions/deploy-oracle";
import hre from "hardhat";
import { json } from 'stream/consumers';

const launchNode : any = async () => {

    const runNodeArgs = {
        restartOnly: false
    }

    await runNode(runNodeArgs);
}

launchNode()
