import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContactItem from '../ContactItem';

class ContactItemContainer extends Component {
    constructor(props) {
        super(props);
        this.handlerClickEditBtn = this.handlerClickEditBtn.bind(this);
        this.handlerClickRemoveBtn = this.handlerClickRemoveBtn.bind(this);
        this.handlerClickOnItem = this.handlerClickOnItem.bind(this);
        this.handlerClickCheckbox = this.handlerClickCheckbox.bind(this);
    }

    static get propTypes() {
        return {
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            birth: PropTypes.string,
            phone: PropTypes.string,
            openContactCard: PropTypes.func.isRequired,
            addItemToCheckedList: PropTypes.func.isRequired,
            rmItem: PropTypes.func.isRequired,
            openForm: PropTypes.func.isRequired
        };
    }

    shouldComponentUpdate(nextProps) {
        if (
            nextProps.name !== this.props.name ||
            nextProps.color !== this.props.color ||
            nextProps.birth !== this.props.birth ||
            nextProps.phone !== this.props.phone
        ) {
            return true;
        }
        return false;
    }

    handlerClickEditBtn(e) {
        e.stopPropagation();
        this.props.openForm(this.props.id);
    }

    handlerClickRemoveBtn(e) {
        e.stopPropagation();
        if (confirm('Delete this contact? Are you sure?')) {
            this.props.rmItem(this.props.id);
        }
    }

    handlerClickOnItem(e) {
        this.props.openContactCard(this.props.id);
    }

    handlerClickCheckbox(e) {
        this.props.addItemToCheckedList(this.props.id);
    }

    render() {
        return (
            <ContactItem
                {...this.props}
                handlerClickEditBtn={this.handlerClickEditBtn}
                handlerClickRemoveBtn={this.handlerClickRemoveBtn}
                handlerClickOnItem={this.handlerClickOnItem}
                handlerClickCheckbox={this.handlerClickCheckbox} />
        );
    }
}

export default ContactItemContainer;
