import React from 'react';
import PropTypes from 'prop-types';

const ContactCardButtonsContainer = (props) => {
  return (
    <div className="contact-card__btns-ctnr">
      {props.isOpenInPopup && (
        <div
          className="contact-card__btn contact-card__close-btn"
          title="Close Contact Details"
          onClick={props.handleClose}>
          <i className="contact-card__btn-ico fas fa-chevron-left" />
        </div>
      )}
      <div className="contact-card__btn contact-card__edit-btn" title="Edit this contact" onClick={props.onClickEdit}>
        <i className="contact-card__btn-ico fas fa-pen" />
      </div>
      <div
        className="contact-card__btn contact-card__remove-btn"
        title="Delete this contact"
        onClick={props.onClickRemove}>
        <i className="contact-card__btn-ico fas fa-user-times" />
      </div>
    </div>
  );
};

ContactCardButtonsContainer.defaultProps = {
  isOpenInPopup: true
};

ContactCardButtonsContainer.propTypes = {
  handleClose: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  isOpenInPopup: PropTypes.bool,
};

export default ContactCardButtonsContainer;
