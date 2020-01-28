import React from 'react';
import PropTypes from 'prop-types';

import ContactItem from '../ContactItem.jsx';

class ContactItemContainer extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      isOpenCcard: false,
      isOpenCForm: false,
      isFaded: false,
    };
    this.onClickRemove = this.onClickRemove.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    // this.handleClickOnItem = this.handleClickOnItem.bind(this);
    this.handleClickCheckbox = this.handleClickCheckbox.bind(this);
    this.openCcard = this.openCcard.bind(this);
    this.closeCcard = this.closeCcard.bind(this);
    this.openCForm = this.openCForm.bind(this);
    this.closeCForm = this.closeCForm.bind(this);
  }

  static get propTypes () {
    return {
      contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
    };
  }

  openCForm () {
    this.setState({
      isOpenCForm: true,
    });
  }

  closeCForm () {
    this.setState({
      isOpenCForm: false,
    });
  }

  openCcard () {
    this.setState({
      isOpenCcard: true,
    });
  }

  closeCcard () {
    this.setState({
      isOpenCcard: false,
    });
  }

  toggleFadedItem () {
    this.setState((prevState) => ({
      isFaded: !prevState.isFaded,
    }));
  }

  onClickRemove (e) {
    // e.stopPropagation();
    adbk.openConfirmDialog(
      (ans) => {
        if (ans) adbk.deleteContact(this.props.contact);
        this.toggleFadedItem();// there must be away to turn this back incase the AJAX request fails, see issue #10
        adbk.closeConfirmDialog();
        if (this.state.isOpenCcard) this.closeCcard();
      },
      {
        header: 'Delete this contact? Are you sure?',
      }
    );
  }

  onClickEdit (e) {
    // e.stopPropagation();
    this.openCForm();
  }

  // handleClickOnItem (e) {
  //   this.props.openContactCard(this.props.contact.id);
  // }

  handleClickCheckbox (e) {
    adbk.redux.action.contacts.toggleMarkedItem(this.props.contact);
  }

  render () {
    return (
      <ContactItem
        isFaded={this.state.isFaded}
        isOpenCForm={this.state.isOpenCForm}
        onClickEdit={this.onClickEdit}
        closeCForm={this.closeCForm}
        contact={this.props.contact}
        onClickRemove={this.onClickRemove}
        closeCcard={this.closeCcard}
        openCcard={this.openCcard}
        isOpenCcard={this.state.isOpenCcard}
        handleClickCheckbox={this.handleClickCheckbox}
      />
    );
  }
}

export default ContactItemContainer;
