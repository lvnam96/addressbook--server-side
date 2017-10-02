import API from '../API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { Route } from 'react-router-dom';

import ContactCard from './ContactCard';
import ContactItem from './ContactItem';
import MenuBar from './MenuBar';
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
            showNoti: false,
            notiList: [],
            checkedItems: []
        };
        this.delAllPressTimer;
        this.notiMsg;
        this.notiType;// 'alert' or 'success' or 'error'
        this.presentFilterState = 'all';// or 'week' or 'month'
        this.newPerson = {
            name: '',
            id: 'example id',
            labels: [],
        };
        this.bodyElem = document.body;
        this.displayAll = this.displayAll.bind(this);
        this.filterBirthsInWeek = this.filterBirthsInWeek.bind(this);
        this.filterBirthsInMonth = this.filterBirthsInMonth.bind(this);
        this.handlerAddContact = this.handlerAddContact.bind(this);
        this.inptFile = this.inptFile.bind(this);
        this.bckpData = this.bckpData.bind(this);
        this.setTimer = this.setTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.showNoti = this.showNoti.bind(this);
        this.delAll = this.delAll.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.saveEditedContact = this.saveEditedContact.bind(this);
        this.addNewContact = this.addNewContact.bind(this);
        this.closeContactDetails = this.closeContactDetails.bind(this);
        this.handlerEditContact = this.handlerEditContact.bind(this);
        this.handlerRmContact = this.handlerRmContact.bind(this);
        this.handlerDeleteMenu = this.handlerDeleteMenu.bind(this);
        this.handlerAddCheckedItem = this.handlerAddCheckedItem.bind(this);
    }
    static get propTypes() {
        return {};
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
    setTimer(e) {
        this.delAllPressTimer = setTimeout(this.delAll.bind(this), 600);
    }
    clearTimer(e) {
        clearTimeout(this.delAllPressTimer);
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
    openContactDetails(index) {
        this.setState({
            contactIndex: index,
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
    openForm(index) {
        if (index === -1) {
            this.newPerson.color = API.getRandomColor();
        }
        this.setState({
            contactIndex: index,
            showForm: true
        });
        this.bodyElem.classList.add('body--no-scroll');
    }
    closeForm() {
        this.setState({
            showForm: false
        });
        if (!this.state.showContactDetails) {
            this.bodyElem.classList.remove('body--no-scroll');
        }
    }
    refresh() {
        let newData;
        if (API.shouldBeSorted()) {
            API.sortContactsList();
            API.filterBirthsToday();
            API.dontSortAgain();
        }
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
        this.setState({
            contacts: newData
        });
    }
    rmItem(contactId) {
        if (confirm('Delete this contact? Are you sure?')) {
            API.find(contactId, API.rmContact);
            this.refresh();
            // Remove contact's id out of checkedItems list if that contact was checked before
            const itemIndex = this.state.checkedItems.indexOf(contactId);
            if (itemIndex >= 0) {
                this.state.checkedItems.splice(itemIndex, 1);
            }
        }
    }
    saveEditedContact(editedContact) {
        const curryingEditDataFunc = API.editContact.bind(API, editedContact);
        API.find(editedContact.id, curryingEditDataFunc);
        this.refresh();
        this.setState(prevState => {
            const contactIndex = prevState.contacts.findIndex(contact => contact.id === editedContact.id);
            return {
                contactIndex
            };
        });
        this.closeForm();
        this.showNoti('success', `Saved.`);
    }
    addNewContact(newContact) {
        newContact.id = API.getRandomId(4);
        API.addContact(newContact);
        this.refresh();
        this.closeForm();
        this.showNoti('success', `New contact: "${newContact.name}" was created.`);
    }
    showNoti(notiType, notiMsg) {
        this.state.notiList.push({
            notiType,
            notiMsg,
            notiId: this.state.notiList.length
        });
        this.setState({
            showNoti: true
        });
    }
    // rstrData = (function() {
    //     if ('FileReader' in window) {
    //         return function() {
    //             if (BIRTH_STORE.HANDLERS.isEditing) {
    //                 alert('Hãy lưu lại item bạn đang chỉnh sửa.');
    //             } else {
    //                 inptFileBtn.click();
    //             }
    //         };
    //     } else {
    //         return function() {
    //             alert('Rất tiếc, trình duyệt của bạn không hỗ trợ HTML5 FileReader. Vì vậy, chúng tôi không thể khôi phục dữ liệu của bạn.');
    //         };
    //     }
    // })()
    rstrData(e) {
        document.getElementById('inptFileBtn').click();
    }
    inptFile(e) {
        let fileToLoad = e.target.files[0];
        if (fileToLoad) {
            let reader = new FileReader();
            reader.addEventListener('load', fileLoadedEvent => {
                let textFromFileLoaded = fileLoadedEvent.target.result,
                    dataParsedFromTextFile = JSON.parse(textFromFileLoaded);
                API.replaceData(dataParsedFromTextFile);
                API.saveDataToLocalStorage();
                API.dataNeedToBeSorted();
                this.displayAll();
                this.showNoti('success', 'Your data is restored successfully!');
            }, false);
            reader.readAsText(fileToLoad, 'UTF-8');
        }
    }
    bckpData(e) {
        if ('Blob' in window) {
            function destroyClickedElement(e) {
                this.bodyElem.removeChild(e.target);
            }
            let fileName = prompt('Type the name for your backup file:', 'contacts_backupFile.txt');
            fileName = (fileName === '' ? 'contacts_backupFile.txt' : fileName); 
            if (fileName) {
                let textToWrite = JSON.stringify(API.getContactsList()).replace(/\n/g, '\r\n');
                let textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
                if ('msSaveOrOpenBlob' in navigator) {
                    navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
                } else {
                    let downloadLink = document.createElement('a');
                    downloadLink.download = fileName;
                    downloadLink.innerHTML = 'Download File';
                    if ('webkitURL' in window) {
                    // Chrome allows the link to be clicked without actually adding it to the DOM.
                        const polyURL = window.URL || window.webkitURL;
                        downloadLink.href = polyURL.createObjectURL(textFileAsBlob);
                    } else {
                    // Firefox requires the link to be added to the DOM before it can be clicked.
                        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                        downloadLink.addEventListener('click', destroyClickedElement);
                        downloadLink.style.display = 'none';
                        this.bodyElem.appendChild(downloadLink);
                    }
                    downloadLink.click();
                }
                this.showNoti('success', 'We have exported your data. Save it to safe place!');
            }
        } else {
            this.showNoti('alert', 'Sorry, your browser does not support HTML5 Blob. We can not export your data.');
        }
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
    handlerAddContact() {
        this.openForm(-1);
    }
    handlerEditContact() {
        this.openForm(this.state.contactIndex);
    }
    handlerEditContactOnItem(idx, e) {
        e.stopPropagation();
        this.openForm(idx);
    }
    handlerRmContact() {
        const contactId = this.state.contacts[this.state.contactIndex].id;
        this.rmItem(contactId);
        this.closeContactDetails();
    }
    handlerRmContactOnItem(contactId, e) {
        e.stopPropagation();
        this.rmItem(contactId);
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
                        onClickEdit={this.handlerEditContactOnItem.bind(this, idx)}
                        onClickRemove={this.handlerRmContactOnItem.bind(this, contact.id)}
                        onClickOnItem={this.openContactDetails.bind(this, idx)}
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
                <MenuBar
                    totalContacts={API.listLength()}
                    onClickDisplayAll={this.displayAll}
                    onFilterBirthsInWeek={this.filterBirthsInWeek}
                    onFilterBirthsInMonth={this.filterBirthsInMonth}
                    onClickAddMenu={this.handlerAddContact}
                    onClickRestore={this.rstrData}
                    onUploadFile={this.inptFile}
                    onClickBackup={this.bckpData}
                    onSetTimer={this.setTimer}
                    onClearTimer={this.clearTimer}
                    onClickDelete={this.handlerDeleteMenu}
                    numOfCheckedItems={this.state.checkedItems.length} />
                {this.state.showContactDetails &&
                <ContactCard
                    {...(this.state.contacts[this.state.contactIndex])}
                    onClose={this.closeContactDetails}
                    onEditContact={this.handlerEditContact}
                    onRemoveContact={this.handlerRmContact} />
                }
                {this.state.showForm &&
                <WorkingForm
                    isEditing={this.state.contactIndex > -1}
                    editingContact={this.state.contacts[this.state.contactIndex]}
                    newContact={this.newPerson}
                    onClose={this.closeForm}
                    onSave={this.saveEditedContact}
                    onAdd={this.addNewContact}
                    showNoti={this.showNoti}
                    getRandomColor={API.getRandomColor} />}
            </div>
        );
    }
}
export default AddressBook;
