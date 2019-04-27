import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../HOCs/Popup';
import ButtonsContainer from './ButtonsContainer';
import Header from './Header';
import Body from './Body';

class ContactCard extends React.Component {
    static propTypes() {
        return {
            contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
            contactIndex: PropTypes.number.isRequired,
            onClose: PropTypes.func.isRequired,
            onEditContact: PropTypes.func.isRequired,
            openModalDialog: PropTypes.func.isRequired,
            onRemoveContact: PropTypes.func.isRequired
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.contactIndex !== this.props.contactIndex ||
            nextProps.contact.name !== this.props.name ||
            nextProps.contact.labels !== this.props.labels ||
            nextProps.contact.color !== this.props.color ||
            nextProps.contact.phone !== this.props.phone ||
            nextProps.contact.birth !== this.props.birth ||
            nextProps.contact.email !== this.props.email ||
            nextProps.contact.address !== this.props.address ||
            nextProps.contact.website !== this.props.website ||
            nextProps.contact.note !== this.props.note
        ) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <Popup onCloseHandler={this.props.onClose}>
                <div className="contact-card">
                    <ButtonsContainer
                        contactId={this.props.contact.id}
                        contactIndex={this.props.contactIndex}
                        onClose={this.props.onClose}
                        onEditContact={this.props.onEditContact}
                        openModalDialog={this.props.openModalDialog}
                        onRemoveContact={this.props.onRemoveContact} />
                    <Header contact={this.props.contact} />
                    <Body contact={this.props.contact} />
                </div>
            </Popup>
        );
    }
}

export default ContactCard;
