import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '20px' }}>
            <Link route="/">
                <a className='item'>CrowdCoin</a>
            </Link>
            <Menu.Menu position='right'>

                <Link route="/">
                    <a className='item'>Campanhas</a>
                </Link>

                <Link route="/campanhas/nova">
                    <a className='item'>+</a>
                </Link>

            </Menu.Menu>
        </Menu>
    );
};