// import React from 'react';
import PropTypes from 'prop-types';

import ContactsList from './ContactsList/ContactsList';

const MainContent = props => (
    <main className="main">
        <header className="page-header">
            <h1 className="page-title">Address Book</h1>
        </header>
        <ContactsList
            data={props.contactsList}
            openContactCard={props.openContactCard}
            rmItem={props.rmItem}
            openForm={props.openForm}
            toggleMarkedItem={props.toggleMarkedItem} />
    </main>
);

MainContent.propTypes = {
    openContactCard: PropTypes.func.isRequired,
    rmItem: PropTypes.func.isRequired,
    openForm: PropTypes.func.isRequired,
    toggleMarkedItem: PropTypes.func.isRequired,
    contactsList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default MainContent;
