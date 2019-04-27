import React from 'react';
import PropTypes from 'prop-types';

import ContactItem from '../ContactItem';

class ContactItemContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handlerClickEditBtn = this.handlerClickEditBtn.bind(this);
        this.handlerClickRemoveBtn = this.handlerClickRemoveBtn.bind(this);
        this.handlerClickOnItem = this.handlerClickOnItem.bind(this);
        this.handlerClickCheckbox = this.handlerClickCheckbox.bind(this);
    }

    static get propTypes() {
        return {
            contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
            openContactCard: PropTypes.func.isRequired,
            toggleMarkedItem: PropTypes.func.isRequired,
            rmItem: PropTypes.func.isRequired,
            openModalDialog: PropTypes.func.isRequired,
            openForm: PropTypes.func.isRequired
        };
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.contact !== this.props.contact ||
            nextProps.contact.name !== this.props.name ||
            nextProps.contact.isMarked !== this.props.isMarked ||
            nextProps.contact.color !== this.props.color ||
            nextProps.contact.birth !== this.props.birth ||
            nextProps.contact.phone !== this.props.phone
        ) {
            return true;
        }
        return false;
    }

    handlerClickEditBtn(e) {
        e.stopPropagation();
        this.props.openForm(this.props.contact.id);
    }

    handlerClickRemoveBtn(e) {
        e.stopPropagation();
        this.props.openModalDialog({
            header: 'Delete this contact? Are you sure?'
        }, (res) => {
            if (res) {
                this.props.rmItem(this.props.contact.id);
            }
        });
    }

    handlerClickOnItem(e) {
        this.props.openContactCard(this.props.contact.id);
    }

    handlerClickCheckbox(e) {
        this.props.toggleMarkedItem(this.props.contact);
    }

    render() {
        return (
            <ContactItem
                contact={this.props.contact}
                handlerClickEditBtn={this.handlerClickEditBtn}
                handlerClickRemoveBtn={this.handlerClickRemoveBtn}
                handlerClickOnItem={this.handlerClickOnItem}
                handlerClickCheckbox={this.handlerClickCheckbox} />
        );
    }
}

export default ContactItemContainer;
