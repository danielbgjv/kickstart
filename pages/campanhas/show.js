import React, { Component } from 'react';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Header, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        //console.log(summary); *Para ver as informações no console

        return {
            address: props.query.address, 
            minimumContribution: summary[0], //zero, pq é a primeira informação do summary
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount,
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Endereço do Gerente',
                description: 'O gerente é o criador da campanha e pode solicitar autorização de gastos para seu projeto.',
                style: { overflowWrap: "break-word" },
            },
            {
                header: minimumContribution,
                meta: 'Contribuição mínima (wei)',
                description: 'Você precisa contribuir com esse valor mínimo para se tornar um participante.',
                style: { overflowWrap: "break-word" },
            },
            {
                header: requestsCount,
                meta: 'Número de solicitações de gastos',
                description: 'As solicitações são submetidas para aprovação dos participantes.',
                style: { overflowWrap: "break-word" },
            },
            {
                header: approversCount,
                meta: 'Número de participantes',
                description: 'Pessoas que já doaram para a campanha.',
                style: { overflowWrap: "break-word" },
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Balanço (ether)',
                description: 'Valor disponível no contrato.',
                style: { overflowWrap: "break-word" },
            },
        ];

        return <Card.Group items={items} />;
    }

    render() {
        
        return (
        <>
        <Link route={`/`}>
        <a>
            <Button secondary labelPosition='left' icon='left chevron' content='Voltar' />
        </a>
        </Link>
        
        <Header as='h3' block style={{marginBottom: "50px"}}>
        Detalhes da Campanha
        </Header>

        <Grid>
            <Grid.Row>
                <Grid.Column width={10}>
                    {this.renderCards()}
                </Grid.Column>
            
                <Grid.Column width={6}>
                    <ContributeForm address={this.props.address} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Link route={`/campanhas/${this.props.address}/gastos`}>
                        <a>
                            <Button primary>Ver solicitações de gastos</Button>
                        </a>
                    </Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </>
        );
    }
}

export default CampaignShow;