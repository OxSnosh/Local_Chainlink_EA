console.log("hello world")
import { createBridge } from "../functions/create-bridge";
import hre from "hardhat";


const deployTestBridge : any = async () => {
    
    await createBridge(
        "multiply",
        "http://host.docker.internal:8081",
        "0",
        0
    )

}

deployTestBridge()