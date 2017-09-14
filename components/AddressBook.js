import React from 'react';
import PropTypes from 'prop-types';

import ContactCard from './contact-card';
import ContactItem from './contact-item';
import Form from './form';
import MenuBar from './menu-bar';
import NotiBar from './noti-bar';

class AddressBook extends React.Component {
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
        // if data is empty already, no need to do anything
        if (!this.props.API.listLength()) {
            this.showNoti('alert', 'There is no data left. Is it bad?');
            return;
        }
        if (confirm('Are you sure to delete all your data?')) {
            this.props.API.rmAllContacts();
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
        if (this.props.API.shouldBeSorted()) {
            this.props.API.sortContactsList();
            this.props.API.filterBirthsToday();
            this.props.API.dontSortAgain();
        }
        switch (this.presentFilterState) {
        case 'week':
            newData = this.props.API.getBirthsInWeek();
        break;
        case 'month':
            newData = this.props.API.getBirthsInMonth();
        break;
        default:
            newData = this.props.API.getContactsList();
        break;
        }
        this.setState({
            contacts: newData
        });
    }
    rmItem(contactId) {
        if (confirm('Delete this contact? Are you sure?')) {
            this.props.API.find(contactId, this.props.API.rmContact);
            this.refresh();
            if (this.state.showContactDetails) { this.closeContactDetails(); }
        }
    }
    saveEditedContact(editedContact) {
        let curryingEditDataFunc = this.props.API.editContact(editedContact);
        this.props.API.find(editedContact.id, curryingEditDataFunc);
        this.refresh();
        this.closeForm();
        this.showNoti('success', `Saved.`);
    }
    addNewContact(newContact) {
        newContact.id = this.props.API.getRandomId(4);
        this.props.API.addContact(newContact);
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
                this.props.API.replaceData(dataParsedFromTextFile);
                this.props.API.saveDataToLocalStorage();
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
                        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
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
        return (
            <div>
                <main className='main'>
                    <header className='page-title'>
                        <h1>Address Book</h1>
                    </header>
                    <ul className='contact-list'>
                        {this.state.contacts.length === 0 ? null : this.state.contacts.map((contact, idx) => {
                            // console.log('re-rendered', idx);// IS IT BUG?: render lại cả list mỗi khi state thay đổi, dù không phải thay đổi ở state.contacts
                            return <ContactItem
                                        contact={contact}
                                        key={contact.id}
                                        onClickEdit={this.handlerEditContactOnItem.bind(this, idx)}
                                        onClickRemove={this.handlerRmContactOnItem.bind(this, contact.id)}
                                        onClickOnItem={this.openContactDetails.bind(this, idx)} />
                        })}
                    </ul>
                </main>
                {this.state.showNoti && this.state.notiList.map((notiObj) => (
                    <NotiBar type={notiObj.notiType} msg={notiObj.notiMsg} key={notiObj.notiId}/>
                ))}
                <MenuBar
                    totalContacts={this.props.API.listLength()}
                    onClickDisplayAll={this.displayAll.bind(this)}
                    onClickOnFilterMenu={this.openFilterSubNav}
                    onFilterBirthsInWeek={this.filterBirthsInWeek.bind(this)}
                    onFilterBirthsInMonth={this.filterBirthsInMonth.bind(this)}
                    onClickOnBackupMenu={this.openBackupRestoreSubNav}
                    onClickAddMenu={this.handlerAddContact.bind(this)}
                    onClickRestore={this.rstrData}
                    onUploadFile={this.inptFile.bind(this)}
                    onClickBackup={this.bckpData.bind(this)}
                    onSetTimer={this.setTimer.bind(this)}
                    onClearTimer={this.clearTimer.bind(this)}
                    showNoti={this.showNoti.bind(this)} />
                {this.state.showContactDetails &&
                    <ContactCard
                    data={this.state.contacts[this.state.contactIndex]}
                    onClose={this.closeContactDetails.bind(this)}
                    onEditContact={this.handlerEditContact.bind(this)}
                    onRemoveContact={this.handlerRmContact.bind(this)} />}
                {this.state.showForm &&
                    <Form
                    title={this.state.contactIndex > -1 ? 'Edit Contact' : 'Add new contact'}
                    data={this.state.contactIndex > -1 ?
                        this.state.contacts[this.state.contactIndex]
                        :
                        {
                            name: '',
                            id: 'example id',
                            color: this.props.API.getRandomColor(),
                            labels: [],
                            birth: '',
                            note: '',
                            email: '',
                            website: '',
                            phone: ''
                        }}
                    onClose={this.closeForm.bind(this)}
                    onSave={this.state.contactIndex > -1 ?
                        this.saveEditedContact.bind(this)
                        :
                        this.addNewContact.bind(this)}
                    showNoti={this.showNoti.bind(this)}
                    getRandomColor={this.props.API.getRandomColor} />}
            </div>
        );
    }
}

export default AddressBook;
