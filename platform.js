import inquirer from 'inquirer';
import Web3 from "web3";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const web3 = new Web3(`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`);
const contractABI = JSON.parse(fs.readFileSync("contracts-abi/PlatformContract.json"));
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);
const privateKey = '0x' + process.env.PRIVATE_KEY;

console.log("Contract Address:", contractAddress);

const promptUser = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'Please select an operation:',
            choices: [
                'addPlan',
                'removePlan',
                'getPlan',
                'getPlans',
                'exit'
            ]
        },
        {
            type: 'input',
            name: 'price',
            message: 'Enter the plan price (gwei):',
            when: (answers) => answers.operation === 'addPlan'
        },
        {
            type: 'input',
            name: 'duration',
            message: 'Enter the plan duration (days):',
            when: (answers) => answers.operation === 'addPlan'
        },
        {
            type: 'input',
            name: 'planId',
            message: 'Enter the plan ID:',
            when: (answers) => answers.operation === 'removePlan' || answers.operation === 'getPlan'
        }
    ]);

    switch (answers.operation) {
        case 'addPlan':
            web3.eth.accounts.privateKeyToAccount(privateKey);
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);
            contract.methods
            .addPlan(answers.price, answers.duration)
            .send({ from: account.address, gas: 1000000 })
            .on('transactionHash', (hash) => {
                console.log("Plan added successfully with transaction hash: ", hash);
            })
            .on('error', (err) => {
                console.log("Error removing plan: ", err);
            });
            break;
        case 'removePlan':
            web3.eth.accounts.privateKeyToAccount(privateKey);
            const account2 = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account2);
            contract.methods
        
            const getPlan = await contract.methods.getPlan(answers.planId).call();
            console.log("Removing plan of id:", answers.planId)
            console.log("Plan price:", getPlan.price)
            console.log("Plan duration:", getPlan.duration)
        
            contract.methods.removePlan(answers.planId)
            .send({ from: account2.address, gas: 1000000 })
            .on('transactionHash', (hash) => {
                console.log("Plan removed successfully with transaction hash: ", hash);
            })
            .on('error', (err) => {
                console.log("Error removing plan: ", err);
            });
            break;
        case 'getPlan':
            contract.methods.getPlan(answers.planId).call().then(console.log);
            break;
        case 'getPlans':
            contract.methods.getPlans().call().then(console.log);
            break;
        case 'exit':
            console.log('Exiting program');
            process.exit();
    }
};

promptUser();        
            
            
