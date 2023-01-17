import inquirer from 'inquirer';
import Web3 from "web3";
import fs from "fs";

const web3 = new Web3("https://goerli.infura.io/v3/4196ca09011945d78096f0cea0b02800");
const contractABI = JSON.parse(fs.readFileSync("contracts-abi/ParentContract.json"));
const contractAddress = "0xE135a1f80Eec74fE3cea8484A2FE1B942762E4C3";
const contract = new web3.eth.Contract(contractABI, contractAddress);
const privateKey = fs.readFileSync("private-key.txt", "utf8").trim();

console.log("Contract Address:", contractAddress);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'Please select an operation:',
            choices: [
                'createPlatform',
                'exit'
            ]
        },
        {
            type: 'input',
            name: 'details',
            message: 'Please enter the platform details:',
            when: (answers) => answers.operation === 'createPlatform'
        }
    ])
    .then((answers) => {
        if (answers.operation === 'createPlatform') {
            web3.eth.accounts.privateKeyToAccount(privateKey);
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);
            contract.methods
            .createPlatform(answers.details)
            .send({ from: account.address, gas: 1000000 })
            .then((tx) => {
                contract.methods.platforms(tx.events.PlatformCreated.returnValues.index).call().then(console.log);
            });
        } else if (answers.operation === 'exit') {
            console.log('Exiting program');
            process.exit();
        }
    });
