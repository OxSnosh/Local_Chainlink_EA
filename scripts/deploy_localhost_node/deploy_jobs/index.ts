console.log("hello world")
import { createJob } from "./src/create-job";
// import { createAirBattleJob } from "./src/create-airBattle-job";
import hre from "hardhat";
import { metadata } from "./metadata";

const deployTestJob : any = async () => {

    const createJobArgs = {
        oracleAddress: metadata.oracleAddress,
        jobType: "direct",
        authToken: metadata.authToken
    }
    
    createJob(createJobArgs)

}

deployTestJob()

// const deployAirBattleJob : any = async () => {

//     console.log(metadata)

//     const createJobArgs = {
//         oracleAddress: metadata.oracleAddress,
//         jobType: "direct",
//         authToken: metadata.authToken
//     }
    
//     createAirBattleJob(createJobArgs)

// }

// deployAirBattleJob()