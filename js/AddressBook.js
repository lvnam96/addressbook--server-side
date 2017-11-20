import API from './API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getRandomColor } from './helpers/utilsHelper';

import ContactCard from './components/ContactCard/ContactCard';
import MainNavContainer from './components/MainNav/containers/MainNavContainer';
import NotiBar from './components/NotiBar';
import MainContent from './components/MainContent';
import WorkingForm from './components/Form/WorkingForm';

class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            contactIndex: 0,
            isShowCC: false,
            isShowForm: false,
            isShowNoti: true,
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
        this.closeContactCard       = this.closeContactCard.bind(this);
        this.rmItem                 = this.rmItem.bind(this);
        this.handlerDeleteMenu      = this.handlerDeleteMenu.bind(this);
        this.addItemToCheckedList   = this.addItemToCheckedList.bind(this);
        this.openContactCard        = this.openContactCard.bind(this);
        this.refresh                = this.refresh.bind(this);
        this.changeContactIndex     = this.changeContactIndex.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.contacts !== this.state.contacts) {
            return true;
        }
        if (nextState.isShowForm !== this.state.isShowForm) {
            return true;
        }
        if (nextState.isShowCC !== this.state.isShowCC) {
            return true;
        }
        if (nextState.checkedItems !== this.state.checkedItems) {
            return true;
        }
        if (nextState.notiList !== this.state.notiList) {
            return true;
        }
        return false;
    }

    componentWillMount() {
        this.setState({
            contacts: API.getContactsList()
        });
    }

    componentDidMount() {
        const birthsToday = API.getListOfBirthsToday();

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
            return { notiList: [...origNotiList, newNoti] };
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
    }

    filterBirthsInMonth() {
        if (this.presentFilterState !== 'month') {
            this.presentFilterState = 'month';
            this.setState({ checkedItems: [] });
        }

        this.refresh();
        // this.handleCheckedItems();
    }

    displayAll() {
        if (this.presentFilterState !== 'all') {
            this.presentFilterState = 'all';
            this.setState({ checkedItems: [] });
        }

        this.refresh();
        // this.handleCheckedItems();
    }

    openContactCard(contactId) {
        this.setState({
            contactIndex: this.findContactIndex(contactId),
            isShowCC: true
        });

        this.bodyElem.classList.add('body--no-scroll');
    }

    closeContactCard() {
        this.setState({
            isShowCC: false
        });

        this.bodyElem.classList.remove('body--no-scroll');
    }

    openForm(contactId) {
        this.setState(prevState => {
            let contactIndex;
            if (contactId === -1) {
                this.newPerson.color = getRandomColor();
            } else {
                contactIndex = this.findContactIndex(contactId);
            }
            return {
                contactIndex,
                isShowForm: true
            };
        });

        this.bodyElem.classList.add('body--no-scroll');
    }

    closeForm() {
        this.setState({ isShowForm: false });

        if (!this.state.isShowCC) {
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

    addItemToCheckedList(itemId) {
        const itemIndex = this.state.checkedItems.indexOf(itemId);

        if (itemIndex >= 0) {
            this.setState(prevState => ({
                checkedItems: [
                    ...prevState.checkedItems.slice(0, itemIndex),
                    ...prevState.checkedItems.slice(itemIndex + 1)
                ]
            }));
        } else {
            this.setState(prevState => ({
                checkedItems: [...prevState.checkedItems, itemId]
            }));
        }
    }

    render() {
        const notifications = this.state.notiList.map(notiObj => (
                <NotiBar type={notiObj.notiType} msg={notiObj.notiMsg} key={notiObj.notiId} />
            ));
        return (
            <div>
                <MainContent
                    contactsList={this.state.contacts}
                    openContactCard={this.openContactCard}
                    rmItem={this.rmItem}
                    openForm={this.openForm}
                    addItemToCheckedList={this.addItemToCheckedList} />
                {this.state.isShowNoti && notifications}
                <MainNavContainer
                    totalContacts={API.listLength()}
                    onClickDisplayAll={this.displayAll}
                    onFilterBirthsInWeek={this.filterBirthsInWeek}
                    onFilterBirthsInMonth={this.filterBirthsInMonth}
                    onClickAddMenu={this.openForm}
                    onClickDelAll={this.delAll}
                    showNoti={this.showNoti}
                    onClickDelete={this.handlerDeleteMenu}
                    numOfCheckedItems={this.state.checkedItems.length} />
                {this.state.isShowCC &&
                    <ContactCard
                        contactIndex={this.state.contactIndex}
                        {...(this.state.contacts[this.state.contactIndex]) }
                        onClose={this.closeContactCard}
                        onEditContact={this.openForm}
                        onRemoveContact={this.rmItem} />
                }
                {this.state.isShowForm &&
                    <WorkingForm
                        isEditing={this.state.contactIndex > -1}
                        editingContact={this.state.contacts[this.state.contactIndex]}
                        newContact={this.newPerson}
                        onClose={this.closeForm}
                        refresh={this.refresh}
                        changeContactIndex={this.changeContactIndex}
                        showNoti={this.showNoti} />
                }
            </div>
        );
    }
}

export default AddressBook;
