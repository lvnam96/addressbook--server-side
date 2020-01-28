import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MainNav from '../MainNav';

class MainNavContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpenCreateContactForm: false,
      isShowCbookSwitcher: false,
    };
    this.delBtnRef = React.createRef();
    // this.isLongPressActivated = null;// WHY THIS SHOULD BE IMPLEMENTED????? WHAT IS THE POINT?
    this.pressDelAllTimer = null;

    this.onClickAddNewContact = this.onClickAddNewContact.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.delAllContacts = this.delAllContacts.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);

    this.onClickCbookSwitcher = this.onClickCbookSwitcher.bind(this);
    this.closeCbookSwitcherModal = this.closeCbookSwitcherModal.bind(this);

    this.openCreateContactForm = this.openCreateContactForm.bind(this);
    this.closeCreateContactForm = this.closeCreateContactForm.bind(this);
  }

  static get propTypes () {
    return {
      contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact).isRequired).isRequired,
    };
  }

  // shouldComponentUpdate (nextProps) {}

  // openBackupRestoreSubNav(e) {
  //     // const filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0];
  //     const backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
  //     // filterBtnGroup.classList.add('translatedDown200');
  //     backupBtnGroup.classList.toggle('translatedDown100');
  // }
  //
  // openFilterSubNav(e) {
  //     // const filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0];
  //     const backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
  //     backupBtnGroup.classList.add('translatedDown100');
  //     // filterBtnGroup.classList.toggle('translatedDown200');
  // }

  onClickCbookSwitcher (e) {
    this.openCbookSwitcherModal();
  }

  openCbookSwitcherModal () {
    this.setState({
      isShowCbookSwitcher: true,
    });
  }

  closeCbookSwitcherModal (e) {
    this.setState({
      isShowCbookSwitcher: false,
    });
  }

  onClickAddNewContact (e) {
    this.openCreateContactForm();
  }

  delAllContacts () {
    // if data is empty already, no need to do anything
    if (this.props.contacts.length === 0) {
      adbk.showNoti('alert', 'There is no data left. Is it bad?');
      return;
    }

    adbk.openConfirmDialog(
      (res) => {
        if (res) adbk.deleteAllContacts();
        adbk.closeConfirmDialog();
      },
      {
        header: 'Confirm to delete ALL contacts in current Contacts Book',
        body: 'This can not be undone. Please make sure you want to do it!',
      }
    );
  }

  setTimer (e) {
    const handleLongPress = () => {
      this.delAllContacts();
      // this.isLongPressActivated = true;// DEAR PAST ME: WHY THIS SHOULD BE IMPLEMENTED????? WHAT IS THE POINT?
    };
    this.pressDelAllTimer = setTimeout(handleLongPress, 600);
  }

  clearTimer (e) {
    // DEAR PAST ME: WHY THIS SHOULD BE IMPLEMENTED????? WHAT IS THE POINT?
    // if (this.isLongPressActivated) {
    //   const captureClick = (e) => {
    //     e.stopPropagation();
    //     // cleanup
    //     this.delBtnRef.current.parentNode.removeEventListener('click', captureClick, true); // A BUG???
    //     this.isLongPressActivated = false;
    //   };
    //   this.delBtnRef.current.parentNode.addEventListener('click', captureClick, true); // listener for the capture phase instead of the bubbling phase
    // }

    clearTimeout(this.pressDelAllTimer);
    this.pressDelAllTimer = null;
  }

  onClickDelete (e) {
    const numOfCheckedItems = this.props.contacts.filter((contact) => contact.isMarked).length;
    if (numOfCheckedItems > 0) {
      adbk.openConfirmDialog((res) => {
        if (res) adbk.deleteSelectedContacts();
        adbk.closeConfirmDialog();
      });
    } else {
      adbk.showNoti('alert', 'Long-press to delete all contacts');
    }
  }

  openCreateContactForm () {
    this.setState({
      isOpenCreateContactForm: true,
    });
  }

  closeCreateContactForm () {
    this.setState({
      isOpenCreateContactForm: false,
    });
  }

  render () {
    const numOfCheckedItems = this.props.contacts.filter((contact) => contact.isMarked).length;
    return (
      <MainNav
        onClickAddNewContact={this.onClickAddNewContact}
        openFilterSubNav={this.openFilterSubNav}
        setTimer={this.setTimer}
        clearTimer={this.clearTimer}
        delBtnRef={this.delBtnRef}
        onClickDelete={this.onClickDelete}
        totalContactsAmount={this.props.contacts.length}
        numOfCheckedItems={numOfCheckedItems}
        isShowCbookSwitcher={this.state.isShowCbookSwitcher}
        onClickCbookSwitcher={this.onClickCbookSwitcher}
        closeCbookSwitcherModal={this.closeCbookSwitcherModal}
        isOpenCreateContactForm={this.state.isOpenCreateContactForm}
        closeCreateContactForm={this.closeCreateContactForm}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({ contacts: state.contacts, ...ownProps });
export default connect(mapStateToProps)(MainNavContainer); // export default MainNavContainer;
// export default MainNavContainer;
