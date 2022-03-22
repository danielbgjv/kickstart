const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { isTypedArray } = require('util/types');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send ({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('implementa a fábrica e a campanha', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });


    it("marca o caller como o gerente da campanha", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it("permite as pessoas contribuírem e as marca como approvers", async () => {
        await campaign.methods.contribute().send({
        value: "200",
        from: accounts[1],
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it("exige um mínimo de contribuição", async () => {
        try{
            await campaign.methods.contribute().send({
                value: "5",
                from: accounts[1],
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it("permite ao gerente fazer uma solicitação de pagamento", async () => {
        await campaign.methods.createRequest('Comprar baterias', '100', accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();

        assert.equal('Comprar baterias', request.description);
    });

    it("processa a solicitação", async () => {
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei("10", "ether"),
        });
    
        await campaign.methods
          .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
          .send({ from: accounts[0], gas: "1000000" });
    
        await campaign.methods.approveRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        await campaign.methods.finalizeRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
      });

      it('O teste garantiu que apenas o Gerente poderá solicitar autorização de gastos', async () => {
        try {
            await campaign.methods.createRequest().send({
            from:accounts[1] //somente a conta 0 poderá solicitar autorização, por isso o resultado deve ser "falso"
            });
            assert(false);
        } catch (err){
            assert(err);
        }
    });

    it('O teste verificou que apenas o Gerente poderá finalizar a solicitação', async () => {
        try {
            await campaign.methods.finalizeRequest().send({
            from:accounts[1] 
            });
            assert(false);
        } catch (err){
            assert(err);
        }
    });


});