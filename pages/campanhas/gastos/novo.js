import React, { Component } from 'react';
import { Button, Form, Message, Input, Header } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';


class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        loading: false,
    };

    static async getInitialProps(props) {
        const { address } = props.query;

        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({
                    from: accounts[0],
                });
            alert("Transação confirmada! Você será redirecionado para a página de solicitações de gastos.");
            Router.pushRoute(`/campanhas/${this.props.address}/gastos`); //aqui definimos uma rota no aplicativo
        } catch (err) {
            this.setState({ errorMessage: err.message });
            alert("Houve um problema com sua transação. Verifique se está logado no Matamask, se apenas digitou números e certifique-se de aceitar a transação.");
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <>
                <Link route={`/campanhas/${this.props.address}/gastos`}>
                    <a>
                        <Button secondary labelPosition='left' icon='left chevron' content='Voltar' />
                    </a>
                </Link>

                <Header as='h3' block style={{ marginBottom: "50px" }}>
                    Criar Solicitação de Gasto
                </Header>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Descrição:</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Valor (ether):</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Destinatário:</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value })}
                        />
                    </Form.Field>

                    <Message info>
                        <Message.Header>Observações</Message.Header>
                        <Message.List>

                            <Message.Item>
                                A transação pode demorar cerca de 15 segundos após a confirmação no Metamask.
                            </Message.Item>

                            <Message.Item>
                                Somente o gerente da campanha pode criar solicitação de gasto.
                            </Message.Item>

                            <Message.Item>
                                Após a confirmação, você será redirecionado para a página de solicitações.
                            </Message.Item>

                        </Message.List>
                    </Message>


                    <Message error header="Oops!" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} primary>Criar!</Button>

                </Form>
            </>
        );
    }
}

export default RequestNew;