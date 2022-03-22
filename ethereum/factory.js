import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xA49AfdD4Bfd7F14eA8af071EC65BFC1408b9d921'//endereço do nosso contrato compilado anteriormente.
);

export default instance;