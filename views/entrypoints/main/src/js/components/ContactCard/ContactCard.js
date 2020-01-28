import React from 'react';
import PropTypes from 'prop-types';

import ButtonsContainer from './ButtonsContainer';
import Header from './Header';
import Body from './Body';

class ContactCard extends React.PureComponent {
  static get propTypes () {
    return {
      isOpenInPopup: PropTypes.bool,
      contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
      handleClose: PropTypes.func.isRequired,
      onClickEdit: PropTypes.func.isRequired,
      onClickRemove: PropTypes.func.isRequired,
    };
  }

  render () {
    return (
      <div className="contact-card">
        <ButtonsContainer
          handleClose={this.props.handleClose}
          onClickEdit={this.props.onClickEdit}
          onClickRemove={this.props.onClickRemove}
          isOpenInPopup={this.props.isOpenInPopup}
        />
        <Header contact={this.props.contact} />
        <Body contact={this.props.contact} />
      </div>
    );
  }
}

export default ContactCard;
