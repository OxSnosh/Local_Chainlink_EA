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

export const createJob = async (taskArgs : any) => {
  const direct = "direct";
  const cron = "cron";

  const { oracleAddress, jobType } = taskArgs;

  const authenticationToken = await login();
  const externalID = uuidv4();


  const jobName = `Get > Uint256: ${new Date().getMilliseconds()}`;

        
  
  const defaultJob = `{    
          "operationName":"CreateJob",  "variables":{    "input":{  "TOML":"type = \\"directrequest\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\n# Optional External Job ID: Automatically generated if unspecified\\n externalJobID = \\"${externalID}\\"\\nmaxTaskDuration = \\"0s\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nobservationSource = \\"\\"\\"\\n    decode_log   [type=\\"ethabidecodelog\\"\\n                  abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n                  data=\\"$(jobRun.logData)\\"\\n                  topics=\\"$(jobRun.logTopics)\\"]\\n\\n    decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n    fetch        [type=\\"bridge\\" name=\\"multiply\\" requestData=\\"{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"numberToMultiply\\": $(decode_cbor.inputNumber)}}]\\n                                                          parse        [type=\\"jsonparse\\" path=\\"data,product\\" data=\\"$(fetch)\\"]\\n      encode_data  [type=\\"ethabiencode\\" abi=\\"(bytes32 requestId, uint256 value)\\" data=\\"{ \\"requestId\\": $(decode_log.requestId), \\"value\\": $(parse) }\\"]\\n                                               encode_tx    [type=\\"ethabiencode\\"\\n                  abi=\\"fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)\\"\\n                  data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n]\\n    submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n    decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx\\n\\"\\"\\"\\n"}},
          "query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
              

  const workingJobExample = `type = "directrequest"
  schemaVersion = 1
  name = "${jobName}"
  externalJobID = "${externalID}"
  maxTaskDuration = "0s"
  contractAddress = "${oracleAddress}"
  observationSource = """
    decode_log   [type="ethabidecodelog" abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)" data="$(jobRun.logData)" topics="$(jobRun.logTopics)"]   
    decode_cbor  [type="cborparse" data="$(decode_log.data)"]    
    fetch        [type="bridge" name="multiply" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": {\\"inputNumber\\": $(decode_cbor.inputNumber)}}"]                                                          
    parse        [type="jsonparse" path="data,product" data="$(fetch)"]    
    encode_data  [type="ethabiencode" abi="(bytes32 requestId, uint256 value)" data="{ \\"requestId\\": $(decode_log.requestId), \\"value\\": $(parse) }"]                                             
    encode_tx    [type="ethabiencode" abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)" data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"]  
    submit_tx    [type="ethtx" to="${oracleAddress}" data="$(encode_tx)"]   

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    """  `
  
    console.log(workingJobExample);

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

    const outputPath = path.join(__dirname, "..", 'jobMetadata.ts');

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
    console.error(e);
  }
};