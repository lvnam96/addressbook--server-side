// import API from './API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getRandomColor } from './helpers/utilsHelper';
import { timeObj as t, rangeOfWeek } from './helpers/timeHelper';
import { sortByDay, sortByName } from './helpers/sortHelper';

import * as contactsListActions from './actions/contactsListActions';
import * as filterStateActions from './actions/filterStateActions';
import * as notiListActions from './actions/notiListActions';

import ContactCard from './components/ContactCard/ContactCard';
import MainNavContainer from './components/MainNav/containers/MainNavContainer';
import NotiBar from './components/NotiBar';
import MainContent from './components/MainContent';
import WorkingForm from './components/Form/WorkingForm';

const bodyElem = document.body,
    newContactObj = {
        name: '',
        id: 'example id',
        labels: [],
    };

class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.boundActions = {
            contacts: bindActionCreators(contactsListActions, props.dispatch),
            notifications: bindActionCreators(notiListActions, props.dispatch),
            filterState: bindActionCreators(filterStateActions, props.dispatch)
        };
        this.state = {
            contactIndex: 0,
            isShowCC: false,
            isShowForm: false
        };
        this.checkedItemsCounter = 0;

        this.getBirthsInMonth = this.getBirthsInMonth.bind(this);
        this.getBirthsInWeek = this.getBirthsInWeek.bind(this);
        this.getListOfBirthsToday = this.getListOfBirthsToday.bind(this);
        this.showNoti = this.showNoti.bind(this);
        this.delAll = this.delAll.bind(this);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.openContactCard = this.openContactCard.bind(this);
        this.closeContactCard = this.closeContactCard.bind(this);
        this.handlerClickDeleteMenu = this.handlerClickDeleteMenu.bind(this);
        // this.refresh = this.refresh.bind(this);
        this.changeContactIndex = this.changeContactIndex.bind(this);
    }

    static get propTypes() {
        return {
            dispatch: PropTypes.func.isRequired,
            filterState: PropTypes.number.isRequired,
            notiList: PropTypes.arrayOf(PropTypes.object).isRequired,
            // contactIndex: PropTypes.number.isRequired,
            // isShowCC: PropTypes.bool.isRequired,
            // isShowForm: PropTypes.bool.isRequired,
            contacts: PropTypes.arrayOf(PropTypes.object).isRequired
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

    componentWillMount() {
        this.filterBirthsToday();
    }

    componentDidMount() {
        const birthsToday = this.getListOfBirthsToday();

        if (birthsToday.length > 0) {
            let contacts = birthsToday[0].name;

            birthsToday.forEach((contact, idx) => {
                if (idx === 0) { return; }
                contacts += ` & ${contact.name}`;
            });

            this.showNoti('alert', `Today is ${contacts}'s birthday!! Wish ${birthsToday.length > 1 ? 'them' : 'him/her'} a happy birthday!`);
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.contacts !== this.props.contacts) {
            
    //     }
    // }

    getBirthsInMonth(month = t.curMonth) {
        const contactsList = this.props.contacts;
        return sortByDay(contactsList.filter((contact) => parseInt(contact.birth.split('-')[1], 10) === month));
    }

    getBirthsInWeek(dayInWeekArr = rangeOfWeek()) {
        const curDay = t.curDay,
            curMonth = t.curMonth,
            // curYear = t.curYear,
            birthsInLastMonth = this.getBirthsInMonth((curMonth - 1) === 0 ? 12 : (curMonth - 1)),
            birthsInCurrentMonth = this.getBirthsInMonth(curMonth),
            birthsInNextMonth = this.getBirthsInMonth((curMonth + 1) === 13 ? 1 : (curMonth + 1));

        if (Array.isArray(dayInWeekArr[0])) {// if we have array, it means that we have a transforming-week: a week have days in current month & previous/next month
            let arr1, arr2;

            if (curDay > 15) {// we're in last days of the current month

                arr1 = sortByDay(birthsInCurrentMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[0].indexOf(birth) !== -1;
                }));

                arr2 = sortByDay(birthsInNextMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[1].indexOf(birth) !== -1;
                }));

            } else {// we're in first days of the current month

                arr1 = sortByDay(birthsInLastMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[0].indexOf(birth) !== -1;
                }));

                arr2 = sortByDay(birthsInCurrentMonth.filter((contact) => {
                    const birth = parseInt(contact.birth.split('-')[2], 10);
                    return dayInWeekArr[1].indexOf(birth) !== -1;
                }));

            }

            return arr1.concat(arr2);

        } else {// we're in the middle of the current month

            return sortByDay(birthsInCurrentMonth.filter((contact) => {
                const birth = parseInt(contact.birth.split('-')[2], 10);
                return dayInWeekArr.indexOf(birth) !== -1;
            }));

        }
    }

    getListOfBirthsToday() {
        const today = t.curDay;
        return this.getBirthsInMonth().filter(contact => parseInt(contact.birth.split('-')[2], 10) === today);
    }

    filterBirthsToday() {
        // re-update happy-birthday list
        // let birthsToday;

        // if (needToBeReSorted) {
        //     birthsToday = this.getListOfBirthsToday();
        //     localStorage.birthsToday = JSON.stringify(birthsToday);

        // } else if (localStorage.lastVisited === `${t.curDay}/${t.curMonth}`) {
        //     // Memoization technique: no need to do the job if the func is called more than two times a day
        //     birthsToday = JSON.parse(localStorage.birthsToday);

        // } else {
        //     birthsToday = this.getListOfBirthsToday();
        //     localStorage.birthsToday = JSON.stringify(birthsToday);
        //     localStorage.lastVisited = `${t.curDay}/${t.curMonth}`;
        // }
        const birthsToday = this.getListOfBirthsToday(),
            newData = this.props.contacts.map(contact => {
                contact.hpbd = birthsToday.includes(contactHasBirthToday => {
                    return contactHasBirthToday.name === contact.name;
                });
                return contact;
            });
        console.log(newData);
        this.boundActions.contacts.replaceAllContacts(newData);
    }

    delAll() {
        // if data is empty already, no need to do anything
        if (this.props.contacts.length === 0) {
            this.showNoti('alert', 'There is no data left. Is it bad?');
            return;
        }

        if (confirm('Are you sure to delete all your data?')) {
            this.boundActions.contacts.removeAllContacts();
            this.boundActions.filterState.changeStateToAll();
            // this.refresh();
        }
    }

    // refresh() {
    //     // if (API.shouldBeSorted()) {
    //     this.boundActions.contacts.replaceAllContacts(sortByName(this.props.contacts));
    //         // API.filterBirthsToday();
    //         // API.dontSortAgain();
    //     // }
    // }

    // rmItem(contactId) {
    //     this.boundActions.contacts.removeContact(contactId);
    //     // this.refresh();
    // }

    findContactIndex(contactId) {
        return this.props.contacts.findIndex(contact => contact.id === contactId);
    }

    changeContactIndex(contactId) {
        this.setState({ contactIndex: this.findContactIndex(contactId) });
    }

    showNoti(notiType, notiMsg) {
        this.boundActions.notifications.pushNoti({
            notiType,
            notiMsg,
            notiId: Math.random()
        });
    }

    openContactCard(contactId) {
        this.setState({
            contactIndex: this.findContactIndex(contactId),
            isShowCC: true
        });

        bodyElem.classList.add('body--no-scroll');
    }

    closeContactCard() {
        this.setState({
            isShowCC: false
        });

        bodyElem.classList.remove('body--no-scroll');
    }

    openForm(contactId) {
        let contactIndex;
        if (contactId === -1) {
            newContactObj.color = getRandomColor();
        } else {
            contactIndex = this.findContactIndex(contactId);
        }

        this.setState({
            contactIndex,
            isShowForm: true
        });

        bodyElem.classList.add('body--no-scroll');
    }

    closeForm(contactId) {
        if (!this.state.isShowCC) {
            bodyElem.classList.remove('body--no-scroll');
        }
        this.setState((typeof contactId === 'string' ?
            {
                contactIndex: this.findContactIndex(contactId),
                isShowForm: false
            }
            :
            { isShowForm: false }
        ));
    }

    handlerClickDeleteMenu(e) {
        if (this.checkedItemsCounter > 0) {
            if (confirm('Are you want to delete these checked contacts?')) {
                this.boundActions.contacts.removeMarkedContacts();
                // this.refresh();
            }
        } else {
            this.showNoti('alert', 'Long-press to delete all contacts');
        }
    }

    // addItemToCheckedList(itemId) {
    //     const itemIndex = this.state.checkedItems.indexOf(itemId);

    //     if (itemIndex >= 0) {
    //         this.setState(prevState => ({
    //             checkedItems: [
    //                 ...prevState.checkedItems.slice(0, itemIndex),
    //                 ...prevState.checkedItems.slice(itemIndex + 1)
    //             ]
    //         }));
    //     } else {
    //         this.setState(prevState => ({
    //             checkedItems: [...prevState.checkedItems, itemId]
    //         }));
    //     }
    // }

    render() {
        const notifications = this.props.notiList.map(notiObj => (
                <NotiBar type={notiObj.notiType} msg={notiObj.notiMsg} key={notiObj.notiId} />
            ));
            this.checkedItemsCounter = this.props.contacts.filter(contact => contact.isMarked).length;

        let filteredContacts;
        switch (this.props.filterState) {
            case 1:
                filteredContacts = this.getBirthsInWeek();
                break;
            case 2:
                filteredContacts = this.getBirthsInMonth();
                break;
            default:
                filteredContacts = sortByName(this.props.contacts);
        }

        return (
            <div>
                <MainContent
                    contactsList={filteredContacts}
                    openContactCard={this.openContactCard}
                    rmItem={this.boundActions.contacts.removeContact}
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
                    replaceData={this.boundActions.contacts.replaceAllContacts}
                    numOfCheckedItems={this.checkedItemsCounter} />
                {this.state.isShowCC &&
                    <ContactCard
                        {...(this.props.contacts[this.state.contactIndex]) }
                        contactIndex={this.state.contactIndex}
                        onClose={this.closeContactCard}
                        onEditContact={this.openForm}
                        onRemoveContact={this.boundActions.contacts.removeContact} />
                }
                {this.state.isShowForm &&
                    <WorkingForm
                        isEditing={this.state.contactIndex > -1}
                        editingContact={this.props.contacts[this.state.contactIndex]}
                        newContact={newContactObj}
                        closeForm={this.closeForm}
                        addContact={this.boundActions.contacts.addContact}
                        editContact={this.boundActions.contacts.editContact}
                        // refresh={this.refresh}
                        changeContactIndex={this.changeContactIndex}
                        showNoti={this.showNoti} />
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(AddressBook);
