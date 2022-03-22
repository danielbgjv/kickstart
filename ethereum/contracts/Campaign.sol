// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.17;


//Contrato de Fábrica

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); //nessa função o sender é o usuário que está tentando criar a nova campanha
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}


//Contrato

contract Campaign{

//Structs   
    struct Request { //struct com as características do request de gastos
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; //contagem das aprovações de solicitações de gastos
        mapping (address => bool) approvals; //para mapear as aprovações
    }

//Variáveis

    address public manager; //gerente da Campanha
    uint public minimumContribution; // contribuição mínima para a campanha
    // address[] public approvers; //array dos partipantes que aprovarão os gastos // Vamos trocar pelo mapping
    Request[] public requests; //array de sruct Request.
    mapping (address => bool) public approvers; //para mapear se a pessoa contribuiu e pode votar nas solicitações de gastos
    uint public approversCount; //para contar a quantidade participantes

//Modificadores

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

//Funções

    //Iniciar campanha:
    function Campaign(uint minimum, address creator) public{
        manager = creator; //define o gerente da campanha como o criador do contrato. No contrato de fábrica definimos que é o msg.sender
        minimumContribution = minimum; 
    }
    
    //Contribuir para a campanha:
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        if(!approvers[msg.sender]) {
            approversCount++; //vai incrementar o contador de approversCount
            approvers[msg.sender]=true; //adiciona o contributor ao mapping
        } 
        
    }

    //Solicitar autorização de gastos:
    function createRequest(string description, uint value, address recipient) public restricted {

        require(value <=address(this).balance); //Assegura que o gerente não peça um valor maior do que o que tem no contrato.

        Request memory newRequest = Request({ //Request - prepara para criar uma nova variável que conterá uma "Request". newRequest é o nome da variável. = Request({}) cria uma nova instância de Request. Temos que colocar memory, se deixar em branco ou escrever storage vai dar erro/alerta.
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            
        });

        requests.push(newRequest);
    }

   

    //Aprovar gastos solicitados
    function approveRequest(uint index) public {
       Request storage request = requests[index]; //criamos um index para verificar se a pessoa já votou

       
        require(approvers[msg.sender]); //para o usuário votar, ele deve ter contribuído. Então aprrover para o endereço deve retornar true no mapping
        require(!request.approvals[msg.sender]); //O ponto de exclamação inverte as coisas. O contrato vai verificar se a pessoa votou. Se for o caso será true. Como tem o ponto de exclamação, ela não poderá votar novamente!

        request.approvals[msg.sender] = true; //Estamos definindo que se o participante votar, então requests[index].approvals[msg.sender] será verdadeiro
        request.approvalCount++;
    }

    //Finalizar solicitação de gastos
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount /2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    //Extrair sumário com informações da campanha

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager
        );
    }

    //Mostrar quantidade de solicitações de gastos  
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}

//funções a adicionar:
//As aprovações de gastos são finalizáveis? True or false:
/*function isFinalizable() public view returns (bool) {
    if (request.approvalCount > (approversCount /2)) {
        return true
    } return false
}*/
//OU a solicitação foi aprovada:
/*function hasApproved(uint index) public view returns (bool) {         
    return requests[index].approvals[msg.sender];     
}*/
//para chamar no web app: const hasApproved = await campaign.methods.hasApproved(this.props.id).call({ from: accounts[0] });