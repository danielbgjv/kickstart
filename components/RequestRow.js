import React, { Component } from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router} from '../routes';

class RequestRow extends Component {

    state = {
       loading: false,
      
    };

    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({loading: true});
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]});
            
            alert("Aprovação confirmada!");
            Router.replaceRoute(`/campanhas/${this.props.address}/gastos`) //atualiza a página após a aprovação
        } catch (err) {
            
            alert("Houve um problema com sua aprovação. Verifique se está logado no Matamask e certifique-se de aceitar a transação.");
        }

        this.setState({loading: false});
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);
        this.setState({ loading:true });

        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]});
            
            alert("Finalização confirmada!");
            Router.replaceRoute(`/campanhas/${this.props.address}/gastos`) //atualiza a página após a aprovação
        } catch (err) {
            alert("Houve um problema com a finalização. Verifique se você é o gerente, se está logado no Matamask e certifique-se de aceitar a transação.")
        }
        this.setState({loading: false});
    };

    render() {

        const { Row, Cell } = Table;
        const {id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        
        const percentual = parseFloat((this.props.request.approvalCount / this.props.approversCount) * 100).toFixed(2);

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{approversCount} ({percentual}%)</Cell>
                <Cell>
                    {request.complete ? (
                    <Button disabled color='green' onClick={this.onApprove}>Aprovar</Button>
                    ) : (
                    <Button loading={this.state.loading} color='green' onClick={this.onApprove}>Aprovar</Button>
                    )}
                </Cell>
                <Cell>
                    {!readyToFinalize || request.complete ? (<Button disabled color='red' onClick={this.onFinalize}>Finalizar</Button>) : (
                    <Button loading={this.state.loading} color='red' onClick={this.onFinalize}>Finalizar</Button>
                    )}
                </Cell>

            </Row>
        );
    }
}

export default RequestRow;