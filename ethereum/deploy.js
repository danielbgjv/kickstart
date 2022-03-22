const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

//const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'churn fan churn height decline pigeon adult toddler custom cruise expand age',
  'https://rinkeby.infura.io/v3/b6d82d0e191e41c992e81d4218212a3e'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Tentando implementar da conta', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  //console.log(interface);
  console.log('Contrato implementado para', result.options.address);
  provider.engine.stop();
};
deploy();