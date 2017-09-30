import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

import ContactsList from './ContactsList';

const MainContent = props => (
    <main className='main'>
        <header className='page-title'>
            <h1>Address Book</h1>
        </header>
        <ContactsList>
            {props.contactItems}
        </ContactsList>
    </main>
);

MainContent.propTypes = {
    contactItems: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default MainContent;
