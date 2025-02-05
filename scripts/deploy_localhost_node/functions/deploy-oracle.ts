import { ActionType } from "hardhat/types";
import hre from "hardhat";

import OperatorArtifact from "../../../artifacts/contracts/tests/Operator.sol/Operator.json";

export const deployOracle = async (taskArgs : any) => {
  const { nodeAddress, linkAddress } = taskArgs;

  const signers : any = await hre.ethers.getSigners()
  const signer0 = signers[0]

  const Operator = await hre.ethers.getContractFactoryFromArtifact(
    OperatorArtifact
  );
  const operator = await Operator.deploy(linkAddress, signer0.address);

  await operator.deployed();

  const arr = []

  arr.push(nodeAddress)

  // Set Fulfillment on Oracle
  await operator.setAuthorizedSenders(arr);

  console.log(
    "All set on this end! If you've setup everything correctly, you can start getting external data from your smart contract"
  );

  console.table({ "Oracle Address": operator.address });
  return operator.address;
};