import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContactItem from '../ContactItem';

class ContactItemContainer extends Component {
    constructor(props) {
        super(props);
        this.handlerEditContactOnItem = this.handlerEditContactOnItem.bind(this);
        this.handlerRmContactOnItem = this.handlerRmContactOnItem.bind(this);
    }

    static get propTypes() {
        return {
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            birth: PropTypes.string,
            phone: PropTypes.string,
            onClickOnItem: PropTypes.func.isRequired,
            onClickCheckbox: PropTypes.func.isRequired,
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

    handlerEditContactOnItem(e) {
        e.stopPropagation();
        this.props.openForm(this.props.id);
    }

    handlerRmContactOnItem(e) {
        e.stopPropagation();
        if (confirm('Delete this contact? Are you sure?')) {
            this.props.rmItem(this.props.id);
        }
    }

    render() {
        return (
            <ContactItem
                {...this.props}
                handlerEditContactOnItem={this.handlerEditContactOnItem}
                handlerRmContactOnItem={this.handlerRmContactOnItem} />
        );
    }
}

export default ContactItemContainer;
