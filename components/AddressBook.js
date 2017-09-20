import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ContactCard from './contact-card';
import ContactItem from './contact-item';
import Form from './form';
import MenuBar from './menu-bar';
import NotiBar from './noti-bar';

class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: this.props.API.getContactsList(),
            contactIndex: 0,
            showContactDetails: false,
            showForm: false,
            showNoti: false,
            notiList: []
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
    }
    static get propTypes() {
        return {
            API: PropTypes.object.isRequired
        };
    }
    componentDidMount() {
        const birthsToday = this.props.API.getBirthsToday();
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
        const API = this.props.API;
        // if data is empty already, no need to do anything
        if (!API.listLength()) {
            this.showNoti('alert', 'There is no data left. Is it bad?');
            return;
        }
        if (confirm('Are you sure to delete all your data?')) {
            API.rmAllContacts();
            this.refresh();
            // checkedList = [];
            // METHOD_A();
        }
    }
    openContactDetails(index) {
        this.setState({
            contactIndex: index,
            showContactDetails: true
        });
    }
    closeContactDetails() {
        this.setState({
            showContactDetails: false
        });
    }
    openForm(index) {
        if (index === -1) {
            this.newPerson.color = this.props.API.getRandomColor();
        }
        this.setState({
            contactIndex: index,
            showForm: true
        });
    }
    closeForm() {
        this.setState({
            showForm: false
        });
    }
    refresh() {
        let newData;
        const API = this.props.API;
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
        const API = this.props.API;
        if (confirm('Delete this contact? Are you sure?')) {
            API.find(contactId, API.rmContact);
            this.refresh();
            if (this.state.showContactDetails) { this.closeContactDetails(); }
        }
    }
    saveEditedContact(editedContact) {
        const API = this.props.API,
            curryingEditDataFunc = API.editContact.bind(API, editedContact);
        API.find(editedContact.id, curryingEditDataFunc);
        this.refresh();
        this.setState({
            contactIndex: API.find(editedContact.id)
        });
        this.closeForm();
        this.showNoti('success', `Saved.`);
    }
    addNewContact(newContact) {
        const API = this.props.API;
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
    openBackupRestoreSubNav() {
        let filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0],
            backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
        filterBtnGroup.classList.add('translatedDown200');
        backupBtnGroup.classList.toggle('translatedDown100');
    }
    openFilterSubNav() {
        let filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0],
            backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
        backupBtnGroup.classList.add('translatedDown100');
        filterBtnGroup.classList.toggle('translatedDown200');
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
                const API = this.props.API;
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
                document.body.removeChild(e.target);
            }
            let fileName = prompt('Type the name for your backup file:', 'contacts_backupFile.txt');
            fileName = (fileName === '' ? 'contacts_backupFile.txt' : fileName); 
            if (fileName) {
                let textToWrite = JSON.stringify(this.props.API.getContactsList()).replace(/\n/g, '\r\n');
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
                        document.body.appendChild(downloadLink);
                    }
                    downloadLink.click();
                }
                this.showNoti('success', 'We have exported your data. Save it to safe place!');
            }
        } else {
            this.showNoti('alert', 'Sorry, your browser does not support HTML5 Blob. We can not export your data.');
        }
    }
    filterBirthsInWeek() {
        this.presentFilterState = 'week';
        this.refresh();
    }
    filterBirthsInMonth() {
        this.presentFilterState = 'month';
        this.refresh();
    }
    displayAll() {
        this.presentFilterState = 'all';
        this.refresh();
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
    }
    handlerRmContactOnItem(contactId, e) {
        e.stopPropagation();
        this.rmItem(contactId);
    }
    render() {
        const API = this.props.API,
            ContactItems = this.state.contacts.map((contact, idx) => (
                <CSSTransition key={contact.id}
                    classNames="fadeIn"
                    timeout={{ enter: 1000, exit: 800 }}>
                    <ContactItem key={contact.id}
                        {...contact}
                        onClickEdit={this.handlerEditContactOnItem.bind(this, idx)}
                        onClickRemove={this.handlerRmContactOnItem.bind(this, contact.id)}
                        onClickOnItem={this.openContactDetails.bind(this, idx)} />
                </CSSTransition>
            )),
            notifications = this.state.notiList.map((notiObj) => (
                <NotiBar type={notiObj.notiType} msg={notiObj.notiMsg} key={notiObj.notiId}/>
            ));
        return (
            <div>
                <main className='main'>
                    <header className='page-title'>
                        <h1>Address Book</h1>
                    </header>
                    <ul className='contact-list'>
                        <TransitionGroup>
                        {this.state.contacts.length > 0 &&
                            ContactItems
                        }
                        </TransitionGroup>
                    </ul>
                </main>
                {this.state.showNoti && notifications}
                <MenuBar
                    totalContacts={API.listLength()}
                    onClickDisplayAll={this.displayAll}
                    onClickOnFilterMenu={this.openFilterSubNav}
                    onFilterBirthsInWeek={this.filterBirthsInWeek}
                    onFilterBirthsInMonth={this.filterBirthsInMonth}
                    onClickOnBackupMenu={this.openBackupRestoreSubNav}
                    onClickAddMenu={this.handlerAddContact}
                    onClickRestore={this.rstrData}
                    onUploadFile={this.inptFile}
                    onClickBackup={this.bckpData}
                    onSetTimer={this.setTimer}
                    onClearTimer={this.clearTimer}
                    showNoti={this.showNoti} />
                {this.state.showContactDetails &&
                    <ContactCard
                    {...(this.state.contacts[this.state.contactIndex])}
                    onClose={this.closeContactDetails}
                    onEditContact={this.handlerEditContact}
                    onRemoveContact={this.handlerRmContact} />}
                {this.state.showForm &&
                    <Form
                    title={this.state.contactIndex > -1 ? 'Edit Contact' : 'Add new contact'}
                    {...(this.state.contactIndex > -1 ?
                        this.state.contacts[this.state.contactIndex] : this.newPerson)}
                    onClose={this.closeForm}
                    onSave={this.state.contactIndex > -1 ?
                        this.saveEditedContact
                        :
                        this.addNewContact}
                    showNoti={this.showNoti}
                    getRandomColor={API.getRandomColor} />}
            </div>
        );
    }
}

export default AddressBook;
