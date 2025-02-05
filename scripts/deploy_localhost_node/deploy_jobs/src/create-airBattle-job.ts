import axios from "axios";
import { ActionType } from "hardhat/types";
import { v4 as uuidv4 } from "uuid";

import { login } from "../../helpers/login";

declare interface QueryResponse {
  errors?: Array<{
    message: string;
  }>;
  data: any;
}

export const createAirBattleJob = async (taskArgs : any) => {
  const direct = "direct";
  const cron = "cron";

  console.log("here1?")
  const { oracleAddress, jobType } = taskArgs;

  console.log(oracleAddress, jobType)

  const authenticationToken = await login();
  const externalID = uuidv4();

  const jobName = `Get > Uint256: ${new Date().getMilliseconds()}`;
  const defaultJob = `{"operationName":"CreateJob","variables":{"input":{"TOML":"type = \\"directrequest\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\n# Optional External Job ID: Automatically generated if unspecified\\n externalJobID = \\"${externalID}\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nmaxTaskDuration = \\"0s\\"\\nobservationSource = \\"\\"\\"\\n    decode_log   [type=\\"ethabidecodelog\\"\\n                  abi=\\"OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)\\"\\n                  data=\\"$(jobRun.logData)\\"\\n                  topics=\\"$(jobRun.logTopics)\\"]\\n\\n    decode_cbor  [type=\\"cborparse\\" data=\\"$(decode_log.data)\\"]\\n    fetch        [type=\\"http\\" method=GET url=\\"$(decode_cbor.get)\\" allowUnrestrictedNetworkAccess=\\"true\\"]\\n    parse        [type=\\"jsonparse\\" path=\\"$(decode_cbor.path)\\" data=\\"$(fetch)\\"]\\n    multiply     [type=\\"multiply\\" input=\\"$(parse)\\" times=100]\\n    encode_data  [type=\\"ethabiencode\\" abi=\\"(uint256 value)\\" data=\\"{ \\\\\\\\\\"value\\\\\\\\\\": $(multiply) }\\"]\\n    encode_tx    [type=\\"ethabiencode\\"\\n                  abi=\\"fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)\\"\\n                  data=\\"{\\\\\\\\\\"requestId\\\\\\\\\\": $(decode_log.requestId), \\\\\\\\\\"payment\\\\\\\\\\": $(decode_log.payment), \\\\\\\\\\"callbackAddress\\\\\\\\\\": $(decode_log.callbackAddr), \\\\\\\\\\"callbackFunctionId\\\\\\\\\\": $(decode_log.callbackFunctionId), \\\\\\\\\\"expiration\\\\\\\\\\": $(decode_log.cancelExpiration), \\\\\\\\\\"data\\\\\\\\\\": $(encode_data)}\\"\\n                 ]\\n    submit_tx    [type=\\"ethtx\\" to=\\"${oracleAddress}\\" data=\\"$(encode_tx)\\"]\\n\\n    decode_log -> decode_cbor -> fetch -> parse -> multiply -> encode_data -> encode_tx -> submit_tx\\n\\"\\"\\"\\n"}},"query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;

  let jobDesc;

    const airBattleJobSpec = `type = "directrequest"
    schemaVersion = 1
    name = "air-battle"
    maxTaskDuration = "0s"
    contractAddress = "0xA74F1E1Bb6204B9397Dac33AE970E68F8aBC7651"
    externalJobID = "5fbf3110-b27b-42bd-bb5b-3315101431fe"
    minContractPaymentLinkJuels = "0"
    observationSource = """
    
    decode_log [
    type = "ethabidecodelog"
    abi = "OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
    data = "$(jobRun.logData)"
    topics = "$(jobRun.logTopics)"]
    
    decode_cbor [
    type = "cborparse"
    data = "$(decode_log.data)"]
    
    fetch [
    type = "bridge"
    name = "bridge-1"
    requestData = 
    "{
        "id": $(jobSpec.externalJobID),
        "data": {
            "defenderFighters": $(decode_cbor.defenderFighters),
            "attackerFighters": $(decode_cbor.attackerFighters),
            "attackerBombers": $(decode_cbor.attackerBombers),
            "randomNumbers": $(decode_cbor.randomNumbers),
            "attackerId": $(decode_cbor.attackerId),
            "defenderId": $(decode_cbor.defenderId)
        }
    }"]
    
    parse [
    type = "jsonparse"
    path = "data,result"
    data = "$(fetch)"]
    
    encode_data [
    type = "ethabiencode"
    abi = "(bytes32 _requestId, bytes _attackerFighterCasualties, bytes _attackerBomberCasualties, bytes _defenderFighterCasualties, uint attackerId, uint256 defenderId, uint _infrastructureDamage, uint _tankDamage, uint256 cruiseMissileDamage, uint256 attackId)"
    data = 
    "{
        "_requestId": $(decode_log.requestId),
        "_attackerFighterCasualties": $(parse._attackerFighterCasualties),
        "_attackerBomberCasualties": $(parse._attackerBomberCasualties),
        "_defenderFighterCasualties": $(parse._defenderFighterCasualties),
        "_bomberDamage": $(parse._bomberDamage),
        "attackerId": $(parse.attackerId),
        "defenderId": $(parse.defenderId),
        "_infrastructureDamage": $(parse._infrastructureDamage),
        "_tankDamage": $(parse._tankDamage),
        "cruiseMissileDamage": $(parse.cruiseMissileDamage),
        "attackId": $(parse.attackId)
    }"]
    
    encode_tx [
    type = "ethabiencode"
    abi = "(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
    data = 
    "{
        "requestId": $(decode_log.requestId),
        "payment": $(decode_log.payment),
        "callbackAddress": $(decode_log.callbackAddr),
        "callbackFunctionId": $(decode_log.callbackFunctionId),
        "expiration": $(decode_log.cancelExpiration),
        "data": $(encode_data)
    }"]
    
    submit_tx [
    type = "ethtx"
    to = "${oracleAddress}"
    data = "$(encode_tx)"]
    
    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
    """
    `
        const TOML = `
        type = "directrequest"
        schemaVersion = 1
        name = "Soccer-Data-EA"
        contractAddress = "0xA74F1E1Bb6204B9397Dac33AE970E68F8aBC7651"
        maxTaskDuration = "0s"
        observationSource = """
        decode_log   [type="ethabidecodelog"
                    abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                    data="$(jobRun.logData)"
                    topics="$(jobRun.logTopics)"]

        decode_cbor [type="cborparse"
                    data="$(decode_log.cborPayload)"]

        // Then, we use the decoded request parameters to make an HTTP fetch
        fetch [type="http" method=GET url="$(decode_cbor.fetchURL)"]
        parse [type="jsonparse" path="$(decode_cbor.jsonPath)" data="$(fetch)"]

        // Finally, we send a response on-chain.
        // Note that single-word responses automatically populate
        // the requestId.
        encode_response [type="ethabiencode"
                        abi="(bytes data)"
                        data="{
                            \\"data\\": $(parse) }"]

        encode_tx       [type="ethabiencode"
                        abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes data)"
                        data="{
                            \\"requestId\\": $(decode_log.requestId), 
                            \\"payment\\": $(decode_log.payment), 
                            \\"callbackAddress\\": $(decode_log.callbackAddr), 
                            \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), 
                            \\"expiration\\": $(decode_log.cancelExpiration), 
                            \\"data\\": $(encode_response)}"
                        ]

        submit_tx  [type="ethtx" to="0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8" data="$(encode_tx)"]

        decode_log -> decode_cbor -> fetch -> parse -> encode_response -> encode_tx -> submit_tx
        """
        `

  switch (jobType) {
    case direct:
      jobDesc = TOML;
      break;
    case cron:
      jobDesc = `{"operationName":"CreateJob","variables":{"input":{"TOML":"type = \\"cron\\"\\nschemaVersion = 1\\nname = \\"${jobName}\\"\\nexternalJobID = \\"${externalID}\\"\\ncontractAddress = \\"${oracleAddress}\\"\\nmaxTaskDuration = \\"0s\\"\\nschedule = \\"CRON_TZ=UTC * */20 * * * *\\"\\nobservationSource = \\"\\"\\"\\n    fetch    [type=\\"http\\" method=GET url=\\"https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD\\"]\\n    parse    [type=\\"jsonparse\\" path=\\"RAW,ETH,USD,PRICE\\"]\\n    multiply [type=\\"multiply\\" times=100]\\n\\n    fetch -> parse -> multiply\\n\\"\\"\\""}},"query":"mutation CreateJob($input: CreateJobInput!) {\\n  createJob(input: $input) {\\n    ... on CreateJobSuccess {\\n      job {\\n        id\\n        __typename\\n      }\\n      __typename\\n    }\\n    ... on InputErrors {\\n      errors {\\n        path\\n        message\\n        code\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;
      break;
    default:
      jobDesc = TOML;
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
      data: TOML,
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