import axios from "axios";
import { ActionType } from "hardhat/types";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs"; 

import { login } from "../../helpers/login";

declare interface QueryResponse {
  errors?: Array<{
    message: string;
  }>;
  data: any;
}

// export const createJob = async (taskArgs: any) => {
//   const direct = "direct";
//   const cron = "cron";

//   const { oracleAddress, jobType } = taskArgs;

//   const authenticationToken = await login();
//   const externalID = uuidv4();

//   const jobName = `Get > Uint256: ${new Date().getMilliseconds()}`;

//   const defaultJob = {
//     operationName: "CreateJob",
//     variables: {
//       input: {
//         TOML: `
//           type = "directrequest"
//           schemaVersion = 1
//           name = "${jobName}"
//           # Optional External Job ID: Automatically generated if unspecified
//           externalJobID = "${externalID}"
//           contractAddress = "${oracleAddress}"
//           maxTaskDuration = "0s"
//           observationSource = """
//             decode_log   [type="ethabidecodelog"
//                           abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
//                           data="$(jobRun.logData)"
//                           topics="$(jobRun.logTopics)"]

//             decode_cbor  [type="cborparse" data="$(decode_log.data)"]
//             fetch        [type="http" method=GET url="$(decode_cbor.get)" allowUnrestrictedNetworkAccess="true"]
//             parse        [type="jsonparse" path="$(decode_cbor.path)" data="$(fetch)"]
//             multiply     [type="multiply" input="$(parse)" times=100]
//             encode_data  [type="ethabiencode" abi="(uint256 value)" data="{ \\"value\\": $(multiply) }"]
//             encode_tx    [type="ethabiencode"
//                           abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
//                           data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
//                           ]
//             submit_tx    [type="ethtx" to="${oracleAddress}" data="$(encode_tx)"]

//             decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx
//           """
//         `,
//       },
//     },
//     query: `
//       mutation CreateJob($input: CreateJobInput!) {
//         createJob(input: $input) {
//           ... on CreateJobSuccess {
//             job {
//               id
//               __typename
//             }
//           }
//           ... on InputErrors {
//             errors {
//               path
//               message
//               code
//               __typename
//             }
//           }
//         }
//       }
//     `,
//   };

//   let jobDesc;

//   switch (jobType) {
//     case direct:
//       jobDesc = defaultJob;
//       break;
//     case cron:
//       jobDesc = {
//         operationName: "CreateJob",
//         variables: {
//           input: {
//             TOML: `
//               type = "cron"
//               schemaVersion = 1
//               name = "${jobName}"
//               externalJobID = "${externalID}"
//               contractAddress = "${oracleAddress}"
//               maxTaskDuration = "0s"
//               schedule = "CRON_TZ=UTC * */20 * * * *"
//               observationSource = """
//                 fetch    [type="http" method=GET url="https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"]
//                 parse    [type="jsonparse" path="RAW,ETH,USD,PRICE"]
//                 multiply [type="multiply" times=100]

//                 fetch -> parse -> multiply
//               """
//             `,
//           },
//         },
//         query: `
//           mutation CreateJob($input: CreateJobInput!) {
//             createJob(input: $input) {
//               ... on CreateJobSuccess {
//                 job {
//                   id
//                   __typename
//                 }
//               }
//               ... on InputErrors {
//                 errors {
//                   path
//                   message
//                   code
//                   __typename
//                 }
//               }
//             }
//           }
//         `,
//       };
//       break;
//     default:
//       jobDesc = defaultJob;
//   }

//   try {
//     console.info("\nCreating Job...\n");

//     const response = await axios.request<any>({
//       url: "http://127.0.0.1:6688/query",
//       headers: {
//         "Content-Type": "application/json",
//         cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authenticationToken}`,
//         Referer: "http://127.0.0.1:6688/jobs/new",
//       },
//       method: "POST",
//       data: jobDesc,
//     });

//     const dataToWrite = `export const jobId = "${externalID}";\n`;

//     // Define the path
//     const outputPath = path.join(__dirname, "..", "jobMetadata.ts");

//     // Writing to the file
//     fs.writeFileSync(outputPath, dataToWrite);

//     console.log(
//       "Response", response.data?.data?.data?.createJob
//     )

//     console.table({
//       Status: "Success",
//       Error: response.data.errors != null ? response.data.errors[0].message : null,
//       JobID: response.data?.data?.data?.createJob?.job?.id,
//       ExternalID: externalID,
//     });
//   } catch (e) {
//     console.log("Could not create job");
//     console.error(e);
//   }
// };


export const createJob = async (taskArgs : any) => {
  const direct = "direct";
  const cron = "cron";

  const { oracleAddress, jobType } = taskArgs;

  const authenticationToken = await login();
  const externalID = uuidv4();
  const airBattleExternalID = uuidv4();
  const senateExternalID = uuidv4();
  const groundBattleExternalID = uuidv4();
  const navalAttackExternalID = uuidv4();

  const jobName = `Get > Uint256: ${new Date().getMilliseconds()}`;
  const jobNameAirBattle = `Get > Uint256: ${new Date().getMilliseconds()}`;
  const jobNameSenate = `Get > Uint256: ${new Date().getMilliseconds()}`;
  const groundBattleName = `Get > Uint256: ${new Date().getMilliseconds()}`;
  const navalAttackName = `Get > Uint256: ${new Date().getMilliseconds()}`;
        
  
  // const defaultJob = `{    
  //         "operationName":"CreateJob",    
  //         "variables":{      
  //         "input":{        
  //         "TOML":"type = \\"directrequest\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\n# Optional External Job ID: Automatically generated if unspecified\\n externalJobID = \\"${externalID}\\"\\nmaxTaskDuration = \\"0s\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nobservationSource = \\"\\"\\"\\n    decode_log   [type=\\"ethabidecodelog\\"\\n                  abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n                  data=\\"$(jobRun.logData)\\"\\n                  topics=\\"$(jobRun.logTopics)\\"]\\n\\n    decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n    fetch        [type=\\"http\\" method=GET url=\\"$(decode_cbor.get)\\" allowUnrestrictedNetworkAccess=\\"true\\"]\\n                                                                parse        [type=\\"jsonparse\\" path=\\"$(decode_cbor.path)\\" data=\\"$(fetch)\\"]\\n    multiply     [type=\\"multiply\\" input=\\"$(parse)\\" times=100]\\n    encode_data  [type=\\"ethabiencode\\" abi=\\"(uint256 value)\\" data=\\"{ \\\\\\\\\\"value\\\\\\\\\\": $(multiply) }\\"]\\n                                               encode_tx    [type=\\"ethabiencode\\"\\n                  abi=\\"fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)\\"\\n                  data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n]\\n    submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n    decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx\\n\\"\\"\\"\\n"}},
  //         "query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
              
    const defaultJob = `{    
      "operationName":"CreateJob",
      "variables":{
      "input":{        
      "TOML":
      
      "type = \\"directrequest\\"
      \\nschemaVersion = 1\\n
      name = \\"${jobName}\\"\\n 
       externalJobID = \\"${externalID}\\"\\n
       maxTaskDuration = \\"0s\\"\\n
       contractAddress = \\"${oracleAddress}\\"\\n
       observationSource = \\"\\"\\"\\n    
       decode_log   [type=\\"ethabidecodelog\\"\\n                  
       abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n                  
       data=\\"$(jobRun.logData)\\"\\n                  
       topics=\\"$(jobRun.logTopics)\\"]\\n\\n    
       decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n    
       fetch        [type=\\"bridge\\" name=\\"multiply\\" requestData=\\"{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"numberToMultiply\\": $(decode_cbor.inputNumber)}}]\\n     
       parse        [type=\\"jsonparse\\" path=\\"data,product\\" data=\\"$(fetch)\\"]\\n                                                                                   
       encode_data  [type=\\"ethabiencode\\" abi=\\"(bytes32 requestId, uint256 value)\\" data=\\"{ \\"requestId\\": $(decode_log.requestId), \\"value\\": $(parse) }\\"]\\n     
       encode_tx    [type=\\"ethabiencode\\"\\n                  abi=\\"fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)\\"\\n          data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n]\\n    
       submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n    
       
       decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx            \\n\\"\\"\\"\\n"}},
      
       "query":"mutation 
      CreateJob($input: CreateJobInput!) 
      {\\n  createJob(input: $input) 
      {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
    
 console.log(defaultJob);

  let jobDesc

  switch (jobType) {
    case direct:
      jobDesc = defaultJob;
      break;
    case cron:
      jobDesc = `{"operationName":"CreateJob","variables":{"input":{"TOML":"type = \\"cron\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\nexternalJobID = \\"${externalID}\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nmaxTaskDuration = \\"0s\\"\\nschedule = \\"CRON_TZ=UTC * */20 * * * *\\"\\nobservationSource = \\"\\"\\"\\n    fetch    [type=\\"http\\" method=GET url=\\"https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD\\"]\\n    parse    [type=\\"jsonparse\\" path=\\"RAW,ETH,USD,PRICE\\"]\\n    multiply [type=\\"multiply\\" times=100]\\n\\n    fetch -> parse -> multiply\\n\\"\\"\\""}},"query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
      break;
    default:
      jobDesc = defaultJob;
  }

  try {
    console.info("\nCreating Job...\n");

    const data = await axios.request<any, QueryResponse>({
      url: "http://127.0.0.1:6688/query",
      headers: {
        "content-type": "application/json",
        cookie: `blocalauth=localapibe315fd0c14b5e47:; isNotIncognito=true; _ga=GA1.1.2055974768.1644792885; ${authenticationToken}`,
        Referer: "http://127.0.0.1:6688/jobs/new",
      },
      method: "POST",
      data: jobDesc,
    });

    const dataToWrite = `export const jobId = "${externalID}";\n`;
    // const dataToWrite = `export const jobId = "${airBattleExternalID}";\n`;
    // const dataToWrite = `export const jobId = "${senateExternalID}";\n`;
    // const dataToWrite = `export const jobId = "${navalAttackExternalID}";\n`;
    // const dataToWrite = `export const jobId = "${groundBattleExternalID}";\n`;

    // Define the path
    const outputPath = path.join(__dirname, "..", 'jobMetadata.ts');

    // Writing to the file
    fs.writeFile(outputPath, dataToWrite, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log(`Data successfully written to ${outputPath}`);
        }
    });

    console.table({
      Status: "Success",
      Error: data.errors != null ? data?.errors[0]?.message : null,
      JobID: data?.data?.data?.createJob?.job?.id,
      ExternalID: externalID,
    });
  } catch (e) {
    console.log("Could not create job");
    // console.error(e);
  }
};