import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { displayDate } from '../../helpers/timeHelper';
import { stopEventBubbling } from '../../helpers/DOMHelper';
import AsyncCcardPopup from '../ContactCard/AsyncCcardPopup.jsx';
import AsyncCFormPopup from '../ContactForm/AsyncCFormPopup.jsx';
import { extractCallingCode } from '../../helpers/phoneHelper';

const ContactItem = (props) => {
  const openCcard = () => {
    props.openCcard();
  };
  const onClickItem = (e) => {
    openCcard();
  };
  const onKeypressEnterOrSpace = (e) => {
    if (e.keyCode === 32 || e.keyCode === 13) {
      openCcard();
    }
  };
  const callingCodeNumb = extractCallingCode(props.contact.phone.callingCode).numb;
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className={classNames('contact-item', {
          'contact-item--hpbd': !!props.contact.hpbd,
          faded: !!props.isFaded,
        })}
        onKeyUp={onKeypressEnterOrSpace}
        onClick={onClickItem}
        style={props.contact.hpbd ? { color: props.contact.color } : undefined}
        role="listitem"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex="0">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div className="contact-item__avt" onClick={stopEventBubbling}>
          <input
            className="contact-item__checkbox"
            type="checkbox"
            id={props.contact.id}
            checked={props.contact.isMarked}
            onChange={props.handleClickCheckbox}
          />
          <label className="contact-item__checkbox-label" htmlFor={props.contact.id} />
          <div className="contact-item__avt__first-letter" style={{ backgroundColor: props.contact.color }}>
            {props.contact.name[0].toUpperCase()}
          </div>
        </div>
        <div className="contact-item__name">
          <span>{props.contact.name}</span>
        </div>
        <div className="contact-item__birth">
          <span>{props.contact.birth && displayDate(props.contact.birth)}</span>
        </div>
        <div className="contact-item__phone">
          <span>{props.contact.phone.phoneNumb && '+' + callingCodeNumb + props.contact.phone.phoneNumb}</span>
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div className="contact-item__btns-container" onClick={stopEventBubbling}>
          <button className="contact-item__btn" onClick={props.onClickEdit} title="Edit this contact">
            <i className="fas fa-pen" />
          </button>
          <button className="contact-item__btn" onClick={props.onClickRemove} title="Delete this contact">
            <i className="fas fa-user-times" />
          </button>
        </div>
      </div>
      <AsyncCcardPopup
        modalProps={{
          isOpen: props.isOpenCcard,
          handleClose: props.closeCcard,
        }}
        contact={props.contact}
        onClickEdit={props.onClickEdit}
        onClickRemove={props.onClickRemove}
      />
      <AsyncCFormPopup
        modalProps={{
          isOpen: props.isOpenCForm,
          handleClose: props.closeCForm,
        }}
        title="Edit contact"
        contact={props.contact}
      />
    </>
  );
};

ContactItem.propTypes = {
  isFaded: PropTypes.bool.isRequired,
  isOpenCForm: PropTypes.bool.isRequired,
  closeCForm: PropTypes.func.isRequired,
  contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  openCcard: PropTypes.func.isRequired,
  closeCcard: PropTypes.func.isRequired,
  isOpenCcard: PropTypes.bool.isRequired,
  handleClickCheckbox: PropTypes.func.isRequired,
};

export default ContactItem;
