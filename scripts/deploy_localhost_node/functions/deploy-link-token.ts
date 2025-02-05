import { ActionType } from "hardhat/types";
import hre from "hardhat";
import { LinkToken } from '../../../typechain-types/@chainlink/contracts/src/v0.4/LinkToken';

import LinkTokenArtifact from "../../../artifacts/@chainlink/contracts/src/v0.4/LinkToken.sol/LinkToken.json";

export const deployLinkToken = async () => {
  const LinkToken = await hre.ethers.getContractFactoryFromArtifact(
    LinkTokenArtifact
  );
  const linkToken = await LinkToken.deploy() as LinkToken;

  await linkToken.deployed();

  console.table({ "Link Token Address": linkToken.address });
  return linkToken.address;
};