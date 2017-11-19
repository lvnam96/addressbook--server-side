import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ButtonsContainer from './ButtonsContainer';
import Header from './Header';
import Body from './Body';

class ContactCard extends Component {
    constructor(props) {
        super(props);
    }

    static get propTypes() {
        return {
            contactIndex: PropTypes.number.isRequired,
            onClose: PropTypes.func.isRequired,
            onEditContact: PropTypes.func.isRequired,
            onRemoveContact: PropTypes.func.isRequired
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.contactIndex !== this.props.contactIndex) {
            return true;
        }
        if (
            nextProps.contactIndex !== this.props.name ||
            nextProps.contactIndex !== this.props.labels ||
            nextProps.contactIndex !== this.props.color ||
            nextProps.contactIndex !== this.props.phone ||
            nextProps.contactIndex !== this.props.birth ||
            nextProps.contactIndex !== this.props.email ||
            nextProps.contactIndex !== this.props.address ||
            nextProps.contactIndex !== this.props.website ||
            nextProps.contactIndex !== this.props.note
        ) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div className="overlay" onClick={this.props.onClose}>
                <div className="contact-card" onClick={e => e.stopPropagation()}>
                    <ButtonsContainer contactId={this.props.id} contactIndex={this.props.contactIndex} onClose={this.props.onClose} onEditContact={this.props.onEditContact} onRemoveContact={this.props.onRemoveContact} />
                    <Header name={this.props.name} labels={this.props.labels} color={this.props.color} />
                    <Body phone={this.props.phone} birth={this.props.birth} email={this.props.email} address={this.props.address} website={this.props.website} note={this.props.note} />
                </div>
            </div>
        );
    }
}

export default ContactCard;
