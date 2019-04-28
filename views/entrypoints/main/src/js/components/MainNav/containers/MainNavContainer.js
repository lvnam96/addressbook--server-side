import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import * as storeActions from '../../../storeActions';

import MainNav from '../MainNav';

let delAllPressTimer;
let isLongPressActivated;// there still a bug with this trick

class MainNavContainer extends React.Component {
    constructor(props) {
        super(props);
        this.delBtnRef = React.createRef();

        this.handlerAddNewContact = this.handlerAddNewContact.bind(this);
        this.setTimer = this.setTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.delAll = this.delAll.bind(this);
        this.handlerClickDeleteMenu = this.handlerClickDeleteMenu.bind(this);
    }

    static get propTypes() {
        return {
            openConfirmDialog: PropTypes.func.isRequired,
            onClickAddMenu: PropTypes.func.isRequired,
            totalContacts: PropTypes.number.isRequired,
            numOfCheckedItems: PropTypes.number.isRequired
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.totalContacts !== this.props.totalContacts) {
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

    handlerAddNewContact(e) {
        this.props.onClickAddMenu(-1);
    }

    delAll () {
        // if data is empty already, no need to do anything
        if (this.props.totalContacts === 0) {
            storeActions.showNoti('alert', 'There is no data left. Is it bad?');
            return;
        }

        this.props.openConfirmDialog({
            header: 'Confirm to delete all your data',
            body: 'This can not be undone. Please make sure you want to do it!'
        }, (res) => {
            if (res) {
                storeActions.asyncRemoveAllContacts(adbk.inst.adrsbook.id).then(json => {
                    if (json.isSuccess) {
                        storeActions.showNoti('success', 'All your contacts are deleted.');
                    } else {
                        storeActions.notifyServerFailed();
                    }
                });
                storeActions.changeStateToAll();
            }
        });
    }

    setTimer(e) {
        const handleLongPress = () => {
            this.delAll();
            isLongPressActivated = true;
        };
        delAllPressTimer = setTimeout(handleLongPress, 600);
    }

    clearTimer(e) {
        if (isLongPressActivated) {
            const captureClick = function (e) {
                e.stopPropagation();
                // cleanup
                this.removeEventListener('click', captureClick, true);// A BUG???
                isLongPressActivated = false;
            };
            this.delBtnRef.current.parentNode.addEventListener('click', captureClick, true);// listener for the capture phase instead of the bubbling phase
        }

        clearTimeout(delAllPressTimer);
    }

    handlerClickDeleteMenu (e) {
        if (this.props.numOfCheckedItems > 0) {
            this.props.openConfirmDialog(undefined, (res) => {
                if (res) {
                    storeActions.asyncRemoveMarkedContacts().then(json => {
                        if (json.isSuccess) {
                            storeActions.showNoti('success', 'Deleted marked contacts!');
                        } else {
                            storeActions.notifyServerFailed();
                        }
                    });
                }
            });
        } else {
            storeActions.showNoti('alert', 'Long-press to delete all contacts');
        }
    }

    render() {
        return (
            <MainNav
                handlerAddNewContact={this.handlerAddNewContact}
                openFilterSubNav={this.openFilterSubNav}
                setTimer={this.setTimer}
                clearTimer={this.clearTimer}
                delBtnRef={this.delBtnRef}
                onClickDelete={this.handlerClickDeleteMenu}
                onClickDisplayAll={storeActions.changeStateToAll}
                totalContacts={this.props.totalContacts}
                numOfCheckedItems={this.props.numOfCheckedItems} />
        );
    }
}

export default MainNavContainer;
