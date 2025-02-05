import { metadata } from '../metadata';

let oracleAddress = metadata.oracleAddress
let externalId
let jobName

export const airBattleJobSpec = `type = "directrequest"
schemaVersion = 1
name = "air-battle"
maxTaskDuration = "0s"
contractAddress = ${oracleAddress}
externalJobID = ${externalId}
minContractPaymentLinkJuels = "0"
observationSource = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type=cborparse data="$(decode_log.data)"]
    fetch        [type=bridge name="bridge-1" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"defenderFighters\\": $(decode_cbor.defenderFighters) , \\"attackerFighters\\": $(decode_cbor.attackerFighters), \\"attackerBombers\\": $(decode_cbor.attackerBombers), \\"randomNumbers\\": $(decode_cbor.randomNumbers) \\"attackerId\\": $(decode_cbor.attackerId) \\"defenderId\\": $(decode_cbor.defenderId)}}"]
    parse        [type=jsonparse path="data,result" data="$(fetch)"]
    encode_data  [type=ethabiencode 
                  abi="(bytes32 _requestId,bytes _attackerFighterCasualties, bytes _attackerBomberCasualties, bytes _defenderFighterCasualties, uint attackerId, uint256 defenderId, uint _infrastructureDamage, uint _tankDamage, uint256 cruiseMissileDamage, uint256 attackId)" 
                  data="{\\"_requestId\\": $(decode_log.requestId),\\"_attackerFighterCasualties\\": $(parse._attackerFighterCasualties), \\"_attackerBomberCasualties\\": $(parse._attackerBomberCasualties), \\"_defenderFighterCasualties\\": $(parse._defenderFighterCasualties), \\"_bomberDamage\\": $(parse._bomberDamage),\\"attackerId\\": $(parse.attackerId),\\"defenderId\\": $(parse.defenderId),\\"_infrastructureDamage\\": $(parse._infrastructureDamage),\\"_tankDamage\\": $(parse._tankDamage)\\"cruiseMissileDamage\\": $(parse.cruiseMissileDamage),\\"attackId\\": $(parse.attackId)}"]
    encode_tx    [type=ethabiencode
                  abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"]
    submit_tx    [type=ethtx to=${oracleAddress} data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
`