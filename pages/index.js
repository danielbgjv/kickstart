import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Header, Button, Card } from 'semantic-ui-react';
//import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campanhas/${address}`}>
                        <a>Ver Campanha</a>
                    </Link>
                ),
                fluid: true

            };
        });

        return <Card.Group items={items} />;
    }


    render() {
        return <div>
            <Header as='h3' block style={{ marginTop: "50px" }}>
                Campanhas Abertas
            </Header>

            <Link route='/campanhas/nova'>
                <a>
                    <Button
                        floated='right'
                        content='Criar Campanha'
                        icon='add circle'
                        primary
                    />
                </a>
            </Link>
            {this.renderCampaigns()}


        </div>;

    }
}

//O <a> dentro do Link permite ao usuário clicar com o botão direito e abrir em nova aba.

export default CampaignIndex;

