import React from 'react';
import PropTypes from 'prop-types';

import ContactsList from './ContactsList';

const MainContent = props => (
    <main className='main'>
        <header className='page-title'>
            <h1>Address Book</h1>
        </header>
        <ContactsList>
            {props.children}
        </ContactsList>
    </main>
);

MainContent.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default MainContent;
