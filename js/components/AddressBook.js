import API from '../API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { Route } from 'react-router-dom';

import ContactCard from './ContactCard';
import ContactItem from './ContactItem';
import MainNav from './MainNav';
import NotiBar from './NotiBar';
import MainContent from './MainContent';
import WorkingForm from './WorkingForm';

class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: API.getContactsList(),
            contactIndex: 0,
            showContactDetails: false,
            showForm: false,
            showNoti: true,
            notiList: [],
            checkedItems: []
        };

        this.delAllPressTimer;
        this.notiMsg;
        this.notiType;// 'alert' or 'success' or 'error'
        this.presentFilterState = 'all';// or 'week' or 'month'
        this.bodyElem = document.body;
        this.newPerson = {
            name: '',
            id: 'example id',
            labels: [],
        };

        this.displayAll             = this.displayAll.bind(this);
        this.filterBirthsInWeek     = this.filterBirthsInWeek.bind(this);
        this.filterBirthsInMonth    = this.filterBirthsInMonth.bind(this);
        this.showNoti               = this.showNoti.bind(this);
        this.delAll                 = this.delAll.bind(this);
        this.openForm               = this.openForm.bind(this);
        this.closeForm              = this.closeForm.bind(this);
        this.closeContactDetails    = this.closeContactDetails.bind(this);
        this.rmItem                 = this.rmItem.bind(this);
        this.handlerDeleteMenu      = this.handlerDeleteMenu.bind(this);
        this.handlerAddCheckedItem  = this.handlerAddCheckedItem.bind(this);
        this.openContactDetails     = this.openContactDetails.bind(this);
        this.refresh                = this.refresh.bind(this);
        this.changeContactIndex     = this.changeContactIndex.bind(this);
    }

    componentDidMount() {
        const birthsToday = API.getBirthsToday();

        if (birthsToday.length > 0) {
            let contacts = birthsToday[0].name;

            birthsToday.forEach((contact, idx) => {
                if (idx === 0) { return; }
                contacts += ` & ${contact.name}`;
            });

            this.showNoti('alert', `Today is ${contacts}'s birthday!! Wish ${birthsToday.length > 1 ? 'them' : 'him/her'} a happy birthday!`);
        }
    }

    delAll() {
        // if data is empty already, no need to do anything
        if (!API.listLength()) {
            this.showNoti('alert', 'There is no data left. Is it bad?');
            return;
        }

        if (confirm('Are you sure to delete all your data?')) {
            API.rmAllContacts();
            this.refresh();
            this.setState({ checkedItems: [] });
        }
    }

    refresh() {
        if (API.shouldBeSorted()) {
            API.sortContactsList();
            API.filterBirthsToday();
            API.dontSortAgain();
        }

        {
            let newData;

            switch (this.presentFilterState) {
            case 'week':
                newData = API.getBirthsInWeek();
            break;

            case 'month':
                newData = API.getBirthsInMonth();
            break;

            default:
                newData = API.getContactsList();
            break;
            }

            this.setState({ contacts: newData });
        }
    }

    rmItem(contactId) {
        API.find(contactId, API.rmContact);
        this.refresh();

        // Remove contact's id out of checkedItems list if that contact was checked before
        const itemIndex = this.state.checkedItems.indexOf(contactId);
        if (itemIndex >= 0) {
            this.state.checkedItems.splice(itemIndex, 1);
        }
    }

    findContactIndex(contactId) {
        return this.state.contacts.findIndex(contact => contact.id === contactId);
    }

    changeContactIndex(contactId) {
        this.setState({ contactIndex: this.findContactIndex(contactId) });
    }

    showNoti(notiType, notiMsg) {
        this.setState(prevState => {
            const origNotiList = prevState.notiList,
                newNoti = {
                    notiType,
                    notiMsg,
                    notiId: Math.random()
            };

            if (origNotiList.length === 2) {
                origNotiList.shift();
            }
            origNotiList.push(newNoti);

            return { notiList: origNotiList };
        });
    }

    // Not be used anymore after using React Router for changing Filter
    // handleCheckedItems() {
    //     this.setState(prevState => {
    //         prevState.checkedItems.forEach((contactId, idx) => {
    //             const checkedItemNotAppearInCurrentContactsList =
    //                 prevState.contacts.findIndex(contact => contact.id === contactId) === -1;
    //             if (checkedItemNotAppearInCurrentContactsList) {
    //                 delete prevState.checkedItems[idx];
    //             }
    //         });
    //         return {
    //             checkedItems: prevState.checkedItems.filter(contactId => contactId)
    //         };
    //     });
    // }

    filterBirthsInWeek() {
        if (this.presentFilterState !== 'week') {
            this.presentFilterState = 'week';
            this.setState({ checkedItems: [] });
        }

        this.refresh();
        // this.handleCheckedItems();

        this.props.history.push('/birthdays-in-week');
    }

    filterBirthsInMonth() {
        if (this.presentFilterState !== 'month') {
            this.presentFilterState = 'month';
            this.setState({ checkedItems: [] });
        }

        this.refresh();
        // this.handleCheckedItems();

        this.props.history.push('/birthdays-in-month');
    }

    displayAll() {
        if (this.presentFilterState !== 'all') {
            this.presentFilterState = 'all';
            this.setState({ checkedItems: [] });
        }

        this.refresh();
        // this.handleCheckedItems();

        this.props.history.push('/');
    }

    openContactDetails(contactId) {
        this.setState({
            contactIndex: this.findContactIndex(contactId),
            showContactDetails: true
        });

        this.bodyElem.classList.add('body--no-scroll');
    }

    closeContactDetails() {
        this.setState({
            showContactDetails: false
        });

        this.bodyElem.classList.remove('body--no-scroll');
    }

    openForm(contactId) {
        this.setState(prevState => {
            let contactIndex;
            if (contactId === -1) {
                this.newPerson.color = API.getRandomColor();
            } else {
                contactIndex = this.findContactIndex(contactId);
            }
            return {
                contactIndex,
                showForm: true
            };
        });

        this.bodyElem.classList.add('body--no-scroll');
    }

    closeForm() {
        this.setState({ showForm: false });

        if (!this.state.showContactDetails) {
            this.bodyElem.classList.remove('body--no-scroll');
        }
    }

    handlerDeleteMenu(e) {
        if (this.state.checkedItems.length > 0) {
            if (confirm('Are you want to delete these checked contacts?')) {
                API.find(this.state.checkedItems, API.rmContact);
                this.refresh();
                this.setState({ checkedItems: [] });
            }

        } else {
            this.showNoti('alert', 'Long-press to delete all contacts');
        }
    }

    handlerAddCheckedItem(itemId) {
        const itemIndex = this.state.checkedItems.indexOf(itemId);

        if (itemIndex >= 0) {
            this.state.checkedItems.splice(itemIndex, 1);
        } else {
            this.state.checkedItems.push(itemId);
        }

        this.setState(prevState => ({ checkedItems: prevState.checkedItems }));
    }

    render() {
        const renderContactItems = contacts => contacts.map((contact, idx) => (
                <CSSTransition key={contact.id}
                    classNames="fadeIn"
                    timeout={{ enter: 1000, exit: 800 }}>
                    <ContactItem key={contact.id}
                        {...contact}
                        onClickOnItem={this.openContactDetails}
                        rmItem={this.rmItem}
                        openForm={this.openForm}
                        onClickCheckbox={this.handlerAddCheckedItem} />
                </CSSTransition>
            )),
            contactItems = renderContactItems(this.state.contacts),
            notifications = this.state.notiList.map(notiObj => (
                <NotiBar type={notiObj.notiType} msg={notiObj.notiMsg} key={notiObj.notiId} />
            ));

        return (
            <div>
                <Route exact path="/" render={() => (<MainContent>{contactItems}</MainContent>)} />
                <Route path="/birthdays-in-week" render={() => (<MainContent>{contactItems}</MainContent>)} />
                <Route path="/birthdays-in-month" render={() => (<MainContent>{contactItems}</MainContent>)} />
                {this.state.showNoti && notifications}
                <MainNav
                    totalContacts={API.listLength()}
                    onClickDisplayAll={this.displayAll}
                    onFilterBirthsInWeek={this.filterBirthsInWeek}
                    onFilterBirthsInMonth={this.filterBirthsInMonth}
                    onClickAddMenu={this.openForm}
                    onClickDelAll={this.delAll}
                    showNoti={this.showNoti}
                    onClickDelete={this.handlerDeleteMenu}
                    numOfCheckedItems={this.state.checkedItems.length} />
                {this.state.showContactDetails &&
                <ContactCard
                    contactIndex={this.state.contactIndex}
                    {...(this.state.contacts[this.state.contactIndex])}
                    onClose={this.closeContactDetails}
                    onEditContact={this.openForm}
                    onRemoveContact={this.rmItem} />
                }
                {this.state.showForm &&
                <WorkingForm
                    isEditing={this.state.contactIndex > -1}
                    editingContact={this.state.contacts[this.state.contactIndex]}
                    newContact={this.newPerson}
                    onClose={this.closeForm}
                    refresh={this.refresh}
                    changeContactIndex={this.changeContactIndex}
                    showNoti={this.showNoti}
                    getRandomColor={API.getRandomColor} />}
            </div>
        );
    }
}

export default AddressBook;
