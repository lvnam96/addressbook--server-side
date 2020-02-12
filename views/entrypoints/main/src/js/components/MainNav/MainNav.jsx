import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import NavBtn from './NavBtn.jsx';
import AsyncCbookSwitcherModal from '../CbookSwitcher/AsyncCbookSwitcherModal.jsx';
import AsyncCFormPopup from '../ContactForm/AsyncCFormPopup.jsx';

const MainNav = (props) => {
  return (
    <nav className="sticky-nav">
      <nav className="main-nav">
        <NavBtn
          label={`Contacts Books (${props.totalContactsAmount})`}
          icon="fas fa-address-book"
          onClick={props.onClickCbookSwitcher}
        />
        <AsyncCbookSwitcherModal
          modalProps={{
            isOpen: props.isShowCbookSwitcher,
            handleClose: props.closeCbookSwitcherModal,
          }}
        />
        <NavBtn
          moreClass={classNames('trash-btn', {
            lighter: props.numOfCheckedItems > 0,
          })}
          title="Long-press this button to delete all contacts"
          label={`Delete ${props.numOfCheckedItems > 0 ? 'contact(s)' : 'all contacts'}`}
          icon="fas fa-trash"
          btnRef={props.delBtnRef}
          onMouseDown={props.setTimer}
          onMouseUp={props.clearTimer}
          onClick={props.onClickDelete}
        />
        {/* <input type="checkbox" id="bckp-rstr-toggle" style={{ display: 'none' }} />
        <NavBtn
          isDropdownBtn
          inputId="bckp-rstr-toggle"
          label="Backup / Restore"
          icon="fas fa-save"
          onClick={props.openBackupRestoreSubNav}
        />
        <NavBtn moreClass="backup-btn" label="Backup" icon="fas fa-download" onClick={props.handlerBackupData} />
        <NavBtn moreClass="restore-btn" label="Restore" icon="fas fa-upload" onClick={props.handlerRestoreData} /> */}
        <NavBtn
          moreClass={classNames({
            'color-blink': props.totalContactsAmount === 0,
          })}
          label="Add new contact"
          icon={classNames('fas fa-plus-circle', {
            jump: props.totalContactsAmount === 0,
            'scale-bigger': props.totalContactsAmount === 0,
          })}
          onClick={props.onClickAddNewContact}
        />
      </nav>
      <AsyncCFormPopup
        modalProps={{
          isOpen: props.isOpenCreateContactForm,
          handleClose: props.closeCreateContactForm,
        }}
        title="Add new contact"
      />
    </nav>
  );
};

MainNav.propTypes = {
  setTimer: PropTypes.func.isRequired,
  clearTimer: PropTypes.func.isRequired,
  delBtnRef: PropTypes.object.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  totalContactsAmount: PropTypes.number.isRequired,
  numOfCheckedItems: PropTypes.number.isRequired,

  isShowCbookSwitcher: PropTypes.bool.isRequired,
  onClickCbookSwitcher: PropTypes.func.isRequired,
  closeCbookSwitcherModal: PropTypes.func.isRequired,

  isOpenCreateContactForm: PropTypes.bool.isRequired,
  closeCreateContactForm: PropTypes.func.isRequired,
  onClickAddNewContact: PropTypes.func.isRequired,
};

export default MainNav;
