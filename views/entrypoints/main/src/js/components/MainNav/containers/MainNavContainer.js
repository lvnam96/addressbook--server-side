import React from 'react';
import PropTypes from 'prop-types';

import * as storeActions from '../../../storeActions';

import MainNav from '../MainNav';

let delAllPressTimer;
let isLongPressActivated; // there still a bug with this trick

class MainNavContainer extends React.Component {
  constructor (props) {
    super(props);
    this.delBtnRef = React.createRef();

    this.handlerAddNewContact = this.handlerAddNewContact.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.clearTimer = this.clearTimer.bind(this);
    this.delAll = this.delAll.bind(this);
    this.handlerClickDeleteMenu = this.handlerClickDeleteMenu.bind(this);
  }

  static get propTypes () {
    return {
      openConfirmDialog: PropTypes.func.isRequired,
      openForm: PropTypes.func.isRequired,
      totalContactsAmount: PropTypes.number.isRequired,
      numOfCheckedItems: PropTypes.number.isRequired,
    };
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.totalContactsAmount !== this.props.totalContactsAmount) {
      return true;
    }
    if (nextProps.numOfCheckedItems !== this.props.numOfCheckedItems) {
      return true;
    }
    return false;
  }

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

  handlerAddNewContact (e) {
    this.props.openForm(null);
  }

  delAll () {
    // if data is empty already, no need to do anything
    if (this.props.totalContactsAmount === 0) {
      storeActions.showNoti('alert', 'There is no data left. Is it bad?');
      return;
    }

    this.props.openConfirmDialog(
      {
        header: 'Confirm to delete all your data',
        body: 'This can not be undone. Please make sure you want to do it!',
      },
      (res) => {
        if (res) {
          storeActions.asyncRemoveAllContacts(adbk.inst.adrsbook.id).then((res) => {
            if (res.isSuccess) {
              storeActions.showNoti('success', 'All your contacts are deleted.');
            } else {
              storeActions.notifyServerFailed(res.errMsg);
            }
          });
          storeActions.changeStateToAll();
        }
      }
    );
  }

  setTimer (e) {
    const handleLongPress = () => {
      this.delAll();
      isLongPressActivated = true;
    };
    delAllPressTimer = setTimeout(handleLongPress, 600);
  }

  clearTimer (e) {
    if (isLongPressActivated) {
      const captureClick = function (e) {
        e.stopPropagation();
        // cleanup
        this.removeEventListener('click', captureClick, true); // A BUG???
        isLongPressActivated = false;
      };
      this.delBtnRef.current.parentNode.addEventListener('click', captureClick, true); // listener for the capture phase instead of the bubbling phase
    }

    clearTimeout(delAllPressTimer);
  }

  handlerClickDeleteMenu (e) {
    if (this.props.numOfCheckedItems > 0) {
      this.props.openConfirmDialog(undefined, (res) => {
        if (res) {
          storeActions.asyncRemoveMarkedContacts().then((res) => {
            if (res.isSuccess) {
              storeActions.showNoti('success', 'Deleted marked contacts!');
            } else {
              storeActions.notifyServerFailed(res.errMsg);
            }
          });
        }
      });
    } else {
      storeActions.showNoti('alert', 'Long-press to delete all contacts');
    }
  }

  render () {
    return (
      <MainNav
        handlerAddNewContact={this.handlerAddNewContact}
        openFilterSubNav={this.openFilterSubNav}
        setTimer={this.setTimer}
        clearTimer={this.clearTimer}
        delBtnRef={this.delBtnRef}
        onClickDelete={this.handlerClickDeleteMenu}
        onClickDisplayAll={storeActions.changeStateToAll}
        totalContactsAmount={this.props.totalContactsAmount}
        numOfCheckedItems={this.props.numOfCheckedItems}
      />
    );
  }
}

export default MainNavContainer;
