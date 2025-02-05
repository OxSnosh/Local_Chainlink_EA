//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

///@title Test contract for testing external adpaters
///@author OxSnosh
///@dev this contact inherits from openzeppelin's ownable contract
///@dev this contract inherits from chanlinks VRF contract
contract Test is Ownable, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint product;

    bytes32 jobId;
    address oracleAddress;
    uint256 fee;

    function updateJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        setChainlinkOracle(_oracleAddress);
        oracleAddress = _oracleAddress;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateLinkAddress(address _linkAddress) public onlyOwner {
        setChainlinkToken(_linkAddress);
    }

    function multiplyBy1000(
        uint256 inputNumber
    ) public {
        console.log(fee, "fee");
        // string memory jobIdDecoded = abi.decode(bytes(jobId), (string));
        console.log("oracle address", oracleAddress);
        Chainlink.Request memory req = buildOperatorRequest(
            jobId,
            this.returnProduct.selector
        );
        req.addUint("inputNumber", inputNumber);
        console.log("maybe, maybe");
        sendOperatorRequest(req, fee);
        console.log("completed operator request");
    }

    event CallbackCompleted(uint256 product);

    function returnProduct(bytes32 _requestId, uint256 _product) public recordChainlinkFulfillment(_requestId) {
    	console.log(_product, "poduct");
        product = _product;
        console.log(product, "product after");
        uint256 productForConsole = getProduct();
        console.log(productForConsole, "product for console from formula");
        emit CallbackCompleted(product);
    }

    function getProduct() public view returns (uint256) {
        console.log(product, "fulfilled product");
        return product;
    }

    struct Army {
        uint256 troops;
        uint256 tanks;
    }

    mapping (uint256 => Army) battleIdToArmy;

    function testStruct(uint256 battleId, uint256 troops, uint256 tanks) public {
        Army storage newArmy = battleIdToArmy[battleId];
        newArmy.tanks = tanks;
        newArmy.troops = troops;
    }

    function returnArmy(uint256 battleId) public view returns (uint256, uint256) {
        uint256 tanks = battleIdToArmy[battleId].tanks;
        uint256 troops = battleIdToArmy[battleId].troops;
        return(troops, tanks);
    }
}