//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { expect } from "chai"
import { network } from "hardhat"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { Test } from "../typechain-types"
import { LinkToken } from '../typechain-types/@chainlink/contracts/src/v0.4/LinkToken';
import { link } from "fs"
import { metadata } from "../scripts/deploy_localhost_node/deploy_jobs/metadata";
import { jobId } from "../scripts/deploy_localhost_node/deploy_jobs/jobMetadata";
// import operatorArtifact from "../artifacts/contracts/tests/Operator.sol/Operator.json";
// import OracleArtifact from "../artifacts/@chainlink/contracts/src/v0.4/Oracle.sol/Oracle.json";
import LinkTokenArtifact from "../artifacts/@chainlink/contracts/src/v0.4/LinkToken.sol/LinkToken.json";

describe("Adapter Test", function () {
  
  // const oracleAbi = OracleArtifact.abi;
  // const linkTokenAbi = LinkTokenArtifact.abi;

  let testContract: Test

  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let signer2: SignerWithAddress
  let signers: SignerWithAddress[]

  let linkToken: LinkToken;

  beforeEach(async function () {

    console.log("hello world")

    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];
    signer2 = signers[2];
   
    console.log("is this the place 0")

    const contractABI = LinkTokenArtifact.abi;

    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    for (let i = 0; i < 50; i++) {
      await network.provider.send("evm_mine");
    }

    const contractAddress = metadata.linkAddress;

    linkToken = new ethers.Contract(contractAddress, contractABI, provider) as LinkToken;


    console.log("is this the place 1")
    console.log("address from metadata", metadata.linkAddress)
    console.log("address from test", linkToken.address)

    const TestContract = await ethers.getContractFactory(
        "Test"
    )
    testContract = await TestContract.deploy() as Test
    await testContract.deployed()

    console.log("isseus")

    console.log(linkToken.address, "LINK token")
    
    console.log("more issues")

    await linkToken.connect(signer0).transfer(testContract.address, BigInt(10000000000000000000))
    const linkBalanceTestContract = await linkToken.balanceOf(testContract.address)
    console.log("Test contract LINK Balance:", Number(linkBalanceTestContract));
    
    await linkToken.connect(signer0).transfer(signer0.address, BigInt(10000000000000000000))
    const linkBalanceSigner0 = await linkToken.balanceOf(signer0.address)
    console.log("Signer0 LINK Balance:", Number(linkBalanceSigner0));

    const nodeAddress = metadata.nodeAddress;

    await linkToken.connect(signer0).transfer(nodeAddress, BigInt(15000000000000000000))
    const linkBalanceNode = await linkToken.balanceOf(nodeAddress)
    console.log("Node LINK Balance:", Number(linkBalanceNode));

    const operatorAddress = metadata.oracleAddress

    await linkToken.connect(signer0).transfer(operatorAddress, BigInt(25000000000000000000))
    const linkBalanceOperator = await linkToken.balanceOf(operatorAddress)
    console.log("Operator LINK Balance:", Number(linkBalanceOperator));
    
    console.log("oracle address", metadata.oracleAddress);
    
    const jobIdToRaw : any = jobId
    
    const jobIdWithoutHyphens = jobIdToRaw.replace(/-/g, "");
    console.log("JobId", jobIdWithoutHyphens);
    
    const jobIdString = jobIdWithoutHyphens.toString()
    
    const jobIdBytes = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(jobIdString)
    );

    await testContract.updateLinkAddress(metadata.linkAddress)

    await testContract.updateOracleAddress(metadata.oracleAddress)
    
    await testContract.updateJobId(jobIdBytes)
    
    await testContract.updateFee(BigInt(1000000000000000000))

    console.log("maybe end of before each")

  });

  function delay(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const eventPromise = new Promise((resolve, reject) => {
    testContract.once("CallbackCompleted", (product : any) => {
      try {
        expect(product).to.equal(5000);
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  });

  describe("External Adapter", function () {
    it("Should send a request to the node", async function () {
      testContract.multiplyBy1000(5)

      const productUpdated = await testContract.getProduct();
      console.log(productUpdated.toNumber())
    });
  });
});