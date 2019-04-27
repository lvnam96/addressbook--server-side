import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getRandomColor } from './helpers/utilsHelper';
import { timeObj as t, rangeOfWeek, getBirthsInWeek, getBirthsInMonth, getListOfBirthsToday, filterBirthsToday } from './helpers/timeHelper';
import { sortByDay, sortByName } from './helpers/sortHelper';

import ContactCard from './components/ContactCard/ContactCard';
import MainNavContainer from './components/MainNav/containers/MainNavContainer';
import NotiBar from './components/NotiBar';
import MainContent from './components/MainContent';
import WorkingForm from './components/Form/WorkingForm';
// import ConfirmDialog from './components/Modals/ConfirmDialog';
import ModalDialog from './components/Modals/ModalDialog';
// import Popup from './components/HOCs/Popup';

const bodyElem = document.body;

class App extends React.Component {
    constructor (props) {
        super(props);
        this.boundActions = adbk.redux.action;
        this.state = {
            contactIndex: 0,
            isShowCC: false,
            isConfirming: false,
            dialogContent: null,
            isShowForm: false
        };
        this.checkedItemsCounter = 0;

        // this.filterBirthsToday = this.filterBirthsToday.bind(this);
        this.showNoti = this.showNoti.bind(this);
        this.rmContact = this.rmContact.bind(this);
        this.delAll = this.delAll.bind(this);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.openModalDialog = this.openModalDialog.bind(this);
        this.closeModalDialog = this.closeModalDialog.bind(this);
        this.openContactCard = this.openContactCard.bind(this);
        this.closeContactCard = this.closeContactCard.bind(this);
        this.handlerClickDeleteMenu = this.handlerClickDeleteMenu.bind(this);
        this.changeContactIndex = this.changeContactIndex.bind(this);
        this.notifyServerFailed = this.notifyServerFailed.bind(this);
    }

    static get propTypes () {
        return {
            dispatch: PropTypes.func.isRequired,
            filterState: PropTypes.number.isRequired,
            notiList: PropTypes.arrayOf(PropTypes.object).isRequired,
            // contactIndex: PropTypes.number.isRequired,
            // isShowCC: PropTypes.bool.isRequired,
            // isShowForm: PropTypes.bool.isRequired,
            contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact)).isRequired
        };
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.contacts !== this.props.contacts) {
    //         return true;
    //     }
    //     if (nextProps.filterState !== this.props.filterState) {
    //         return true;
    //     }
    //     return false;
    // }// should extends PureComponent

    // componentWillMount () {
    //     this.init();
    // }

    componentDidMount () {
        (() => {
            const birthsToday = getListOfBirthsToday(this.props.contacts);

            if (birthsToday.length > 0) {
                let contactsNames = birthsToday[0].name;

                this.showNoti('alert', prepBirthNoti());

                function prepBirthNoti () {
                    birthsToday.forEach((contact, idx) => {
                        if (idx === 0) { return; }
                        contactsNames += ` & ${contact.name}`;
                    });
                    return `Today is ${contactsNames}'s birthday!! Wish ${birthsToday.length > 1 ? 'them' : 'him/her'} a happy birthday!`;
                }
            }
        })();
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.contacts !== this.props.contacts) {
    //
    //     }
    // }

    // filterBirthsToday () {// re-update happy-birthday list
    //     const newData = filterBirthsToday(this.props.contacts);
    //     console.log('filterBirthsToday', newData);
    //     this.boundActions.contacts.replaceAllContacts(newData);
    // }

    delAll () {
        // if data is empty already, no need to do anything
        if (this.props.contacts.length === 0) {
            this.showNoti('alert', 'There is no data left. Is it bad?');
            return;
        }

        this.openModalDialog({
            // labelYES: 'OK',
            // labelNO: 'Cancel',
            header: 'Confirm to delete all your data',
            body: 'This can not be undone. Please make sure you want to do it!'
        }, (res) => {
            if (res) {
                this.boundActions.contacts.asyncRemoveAllContacts(adbk.inst.adrsbook.id).then(json => {
                    if (json.isSuccess) {
                        this.showNoti('success', 'All your contacts are deleted.');
                    } else {
                        this.notifyServerFailed();
                    }
                });
                this.boundActions.filterState.changeStateToAll();
            }
        });
    }

    rmContact (contactId) {
        const contact = this.findContact(contactId);
        this.boundActions.contacts.asyncRemoveContact(contact);
    }

    findContact (contactId) {
        return this.props.contacts.find(contact => contact.id === contactId);
    }

    findContactIndex (contactId) {
        return this.props.contacts.findIndex(contact => contact.id === contactId);
    }

    changeContactIndex (contactId) {
        this.setState({ contactIndex: this.findContactIndex(contactId) });
    }

    showNoti (type, msg) {
        this.boundActions.notifications.pushNoti({
            type,
            msg,
            id: Math.random()
        });
    }

    openContactCard (contactId) {
        this.setState({
            contactIndex: this.findContactIndex(contactId),
            isShowCC: true
        });

        bodyElem.classList.add('body--no-scroll');
    }

    closeContactCard () {
        this.setState({
            isShowCC: false
        });

        bodyElem.classList.remove('body--no-scroll');
    }

    openForm (contactId) {
        let contactIndex;
        if (contactId !== -1) {
            contactIndex = this.findContactIndex(contactId);
        }

        this.setState({
            contactIndex,
            isShowForm: true
        });

        bodyElem.classList.add('body--no-scroll');
    }

    closeForm (contactId) {
        if (!this.state.isShowCC) {
            bodyElem.classList.remove('body--no-scroll');
        }
        const contactIndex = this.findContactIndex(contactId);
        this.setState((typeof contactId === 'string' ? {
            contactIndex,
            isShowForm: false
        } : { isShowForm: false }));
    }

    openModalDialog (content, cb) {
        if (!cb) {
            throw new Error('Callback is not provided! Check openModalDialog method in App.js');
            return;
        }
        this.handleAfterConfirming = cb;
        this.setState({
            dialogContent: content,
            isConfirming: true
        });
        bodyElem.classList.add('body--no-scroll');
    }

    closeModalDialog (response) {
        if (this.state.isConfirming) {
            this.setState({
                dialogContent: null,
                isConfirming: false
            }, () => {
                if (this.handleAfterConfirming) {
                    this.handleAfterConfirming(response);
                    this.handleAfterConfirming = null;
                }
            });
        }
        bodyElem.classList.remove('body--no-scroll');
    }

    notifyServerFailed (customMsg) {
        this.showNoti('alert', customMsg || 'Sorry! Something is wrong on our server :(');
    }

    handlerClickDeleteMenu (e) {
        if (this.checkedItemsCounter > 0) {
            this.openModalDialog(undefined, (res) => {
                if (res) {
                    this.boundActions.contacts.asyncRemoveMarkedContacts().then(json => {
                        if (!json.isSuccess) {
                            this.notifyServerFailed();
                        }
                    });
                }
            });
        } else {
            this.showNoti('alert', 'Long-press to delete all contacts');
        }
    }

    render () {
        const notifications = this.props.notiList.map(notiObj => (
            <NotiBar type={notiObj.type} msg={notiObj.msg} key={notiObj.id} />
        ));
        this.checkedItemsCounter = this.props.contacts.filter(contact => contact.isMarked).length;

        let filteredContacts;
        switch (this.props.filterState) {
            case 1:
                filteredContacts = getBirthsInWeek(this.props.contacts);
                break;
            case 2:
                filteredContacts = getBirthsInMonth(this.props.contacts);
                break;
            default:
                filteredContacts = sortByName(this.props.contacts);
        }

        return (
            <div>
                <MainContent
                    contactsList={filteredContacts}
                    openContactCard={this.openContactCard}
                    rmItem={this.rmContact}
                    openModalDialog={this.openModalDialog}
                    openForm={this.openForm}
                    toggleMarkedItem={this.boundActions.contacts.toggleMarkedItem} />
                {notifications}
                <MainNavContainer
                    totalContacts={this.props.contacts.length}
                    onClickDisplayAll={this.boundActions.filterState.changeStateToAll}
                    onFilterBirthsInWeek={this.boundActions.filterState.changeStateToWeek}
                    onFilterBirthsInMonth={this.boundActions.filterState.changeStateToMonth}
                    onClickAddMenu={this.openForm}
                    onClickDelAll={this.delAll}
                    showNoti={this.showNoti}
                    onClickDelete={this.handlerClickDeleteMenu}
                    replaceData={this.boundActions.contacts.asyncReplaceAllContacts}
                    numOfCheckedItems={this.checkedItemsCounter} />
                {this.state.isShowCC &&
                    <ContactCard
                        contact={filteredContacts[this.state.contactIndex]}
                        contactIndex={this.state.contactIndex}
                        onClose={this.closeContactCard}
                        onEditContact={this.openForm}
                        openModalDialog={this.openModalDialog}
                        onRemoveContact={this.rmContact} />
                }
                {this.state.isShowForm &&
                    <WorkingForm
                        isEditing={this.state.contactIndex > -1}
                        contact={this.state.contactIndex > -1 ? filteredContacts[this.state.contactIndex] : adbk.classes.Contact.fromScratch()}
                        closeForm={this.closeForm}
                        addContact={this.boundActions.contacts.asyncAddContact}
                        editContact={this.boundActions.contacts.asyncEditContact}
                        changeContactIndex={this.changeContactIndex}
                        showNoti={this.showNoti} />
                }
                {this.state.isConfirming &&
                    <ModalDialog
                        isConfirming={this.state.isConfirming}
                        closeModalDialog={this.closeModalDialog}
                        {...this.state.dialogContent} />
                }
                {/* <ConfirmDialog
                    isConfirming={this.state.isConfirming}
                    closeModalDialog={this.closeModalDialog}
                    handleAfterYes={() => {}}
                    handleAfterNo={() => {}}
                    data={{}} />
                */}
            </div>
        );
    }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(App);
