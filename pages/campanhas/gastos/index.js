import React, { Component } from 'react';
import { Button, Table, Message, List } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestsCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestsCount)).fill().map((element, index) => { //parseInt = para passar o número e não um string.
                return campaign.methods.requests(index).call();
            })
        );

        return { address, requests, requestsCount, approversCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                <Link route={`/campanhas/${this.props.address}`}>
                    <a>
                        <Button secondary labelPosition='left' icon='left chevron' content='Voltar' />
                    </a>
                </Link>



                <h3>
                    Solicitações de Gasto Pendentes
                </h3>

                <Link route={`/campanhas/${this.props.address}/gastos/novo`}>
                    <a>
                        <Button primary floated='right' style={{ marginBottom: 10 }}>Solicitar autorização de gasto</Button>
                    </a>
                </Link>

                <Table striped color='blue'>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Descrição</HeaderCell>
                            <HeaderCell>Valor (eth)</HeaderCell>
                            <HeaderCell>Destinatário</HeaderCell>
                            <HeaderCell>Aprovações</HeaderCell>
                            <HeaderCell>Aprovar</HeaderCell>
                            <HeaderCell>Finalizar</HeaderCell>

                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>

                <div>Foram encontradas {this.props.requestsCount} solicitações.</div>

                <Message info>
                    <Message.Header>Observações</Message.Header>
                    <Message.List>

                        <Message.Item>
                            A aprovação pode demorar cerca de 15 segundos após a confirmação da transação no Metamask.
                        </Message.Item>


                        <Message.Item>
                            Somente o gerente da campanha pode finalizar as aprovações.
                        </Message.Item>

                        <Message.Item>
                            As aprovações podem ser finalizadas quando houver mais de 50% de aprovações.
                        </Message.Item>

                    </Message.List>
                </Message>
            </>
        );
    }
}

export default RequestIndex;