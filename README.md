#Local Chainlink External Adapter

This repo will allow you to
1- Deploy a local chainlink node
2- Deploy a local hardhat blockchain
3- Deploy a smart contract that tests and external adapter
4- Deploy a bridge to the chainlink node via API
5- Deploy a job to the chainlink node via API
6- Spin up a server that will allow the node to send back compute from off chain

Chainlink external adapters are useful for many reasons. In this case we are using the external adapter to multiply a number by 1000 and return it to the smart contract. Another useul use is to get an api call from any api and return it to the blockchain.

A quick overview of what a chainlink external adapter is:

A function gets called on a smart contract "Test.sol"->
A payload is sent to an oracle contract "Operator.sol"->
The oracle contract send the payload to the chainlink node->
The node sends the payload to the job identified->
The job forwards the request to the specified bridge. In this case it forwards the request to a local server on port 8081->
The compute occurs offchain and delivers the answer to the node->
The node sends the answer back to the operator->
The operator sends the answer to the smart contract

In order to use this repo you need to have Docker installed

To get started run

``` git clone https://github.com/OxSnosh/Local_Chainlink_EA.git```

then

``` yarn ```

then

``` yarn hardhat compile ```

then in your first terminal run

``` yarn hardhat node ```

you will be able to see the answer from the server/chalink node/oracle in this terminal

then start you server in a second terminal by running

```npx ts-node src/multiply.ts```

then in a third terminal run 

``` yarn hardhat run scripts/deploy_localhost_node/ --network localhost ```

you will need to wait about 30 seconds for the chainlink node to start. the interface for the node can be found at localhost:6688. type "localhost:6688" into the url bar of your browser.

To sign into the node the username is: user@hardhatchainlink.io and the password is: strongpassword777

Once you are able to see the interface you will be able to proceed.

Now you need to fund the node with ETH so it can make the callback.

run the follwoing.

``` yarn hardhat run scripts/deploy_localhost_node/node_setup --network localhost ```

In he terminal you will see the chainlink token address populate. Copy the chainlink token address. In the UI on the browser click on the Chains tab. Click on the newly created chain 31337. On the top an "update chain" button will appear. Scroll to the bottom and paste the address in for the chainlink token (without " marks). Hit submit on the bottom. The top of the page should turn green.

You will see the node funded if you click the ChainlinkOperator logo in the top left

then run

```yarn hardhat run scripts/deploy_localhost_node/deploy_bridge --network localhost```

then run

```yarn hardhat run scripts/deploy_localhost_node/deploy_jobs --network localhost  ```

you will need to check if the job uploaded to the node via API. I have not been able to debug this yet. But you can copy the job output from the terminal and paste it in. Go to the Job tab and cick New Job. In the CLI copy everything from "type" to the the """ at the end above creating job. Pate it into the JobSpec(TOML) field. You will need to go through the job spec and every time you see a backslash \ you need to change it to a double backslash \\. There will be 22 of them. Once entered correctly you will see the definitions of the Task List populate on the right and you can Create the job. If you get errors it may be because there is already a job created with that name. When you submit the top of the page should turn green.

Now the fun part. 

In a 4th terminal run the following.

```yarn hardhat test --network localhost```

You should see the activity in the server window and the node and the test result. I wasn't sure how to await the callback from the oracle in the test itself, but in the hardhat node window you should see the product of 5000 (or whatever number you multilpied) coming back from the node.