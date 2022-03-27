import React, { Component } from 'react';
import { Button, Form, Input, Header, Message, Container, Dimmer, Loader, Grid, Sticky } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false,
        //waitMessage: '',
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });


        try {
            const accounts = await web3.eth.getAccounts();

            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0],
                });
            alert("Transação confirmada! Você será redirecionado para a página das campanhas.");
            /*<Message positive><Message.Header>Sua transação foi confirmada!</Message.Header><p>Você será redirecionado para a página das campanhas.</p></Message>*/
            Router.pushRoute('/'); //aqui definimos uma rota no aplicativo
        } catch (err) {
            this.setState({ errorMessage: err.message });
            alert("Houve um problema com sua transação. Verifique se está logado no Matamask, se apenas digitou números e certifique-se de aceitar a transação.");
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <>
                <Link route={`/`}>
                    <a>
                        <Button secondary labelPosition='left' icon='left chevron' content='Voltar' />
                    </a>
                </Link>

                <Header as='h3' block style={{ marginBottom: "50px" }}>
                    Criar uma Campanha
                </Header>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field inline>
                        <label>Contribuição Mínima:</label>
                        <Input
                            label='wei'
                            labelPosition='right'
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({ minimumContribution: event.target.value })}

                        />
                    </Form.Field>

                    <Message info><Message.Header>Transação em andamento...</Message.Header><p>Após a confirmação, você será redirecionado para a página das campanhas. A transação demora cerca de 15 segundos para ser efetivada após a confirmação. Certifique-se de digitar apenas números (wei).</p></Message>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Criar!</Button>
                </Form>
            </>
        );

    }
}
//os dois pontos de exclamação em this.state.errorMessage converte o string em um valor booleano.
export default CampaignNew;