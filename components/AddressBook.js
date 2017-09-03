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
        // this.showNotiTimer;
        this.notiMsg;
        this.notiType;// 'alert' or 'success' or 'error'
        this.presentFilterState = 'all';// or 'week' or 'month'
    }
    setTimer() {
        this.delAllPressTimer = setTimeout(this.delAll, 600);
    }
    clearTimer() {
        clearTimeout(this.delAllPressTimer);
    }
    delAll() {
        // if data (BIRTH_STORE.getBirthList()) is empty already, no need to do anything
        if (!this.props.API.listLength()) {
            alert('There is no data left. Is it bad?');
            return;
        }
        if (confirm("Are you sure to delete all your data?")) {
            this.props.API.rmAllContacts();
            this.setState({
                contacts: this.props.API.getContactsList()
            });
            // checkedList = [];
            // METHOD_A();
        }
    }
    static get propTypes() {
        return {
            initialContacts: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired,
                id: PropTypes.number.isRequired
            })),
            API: PropTypes.object.isRequired
        };
    }
    onClickOnItem(index) {
        this.setState({
            contactIndex: index,
            showContactDetails: true
        });
    }
    onCloseDetails() {
        this.setState({
            showContactDetails: false
        });
    }
    onOpenEditForm(index) {
        this.setState({
            contactIndex: index,
            showForm: true
        });
    }
    onCloseForm() {
        this.setState({
            showForm: false
        });
    }
    refresh() {
        let newData;
        switch (this.presentFilterState) {
        case 'week':
            newData = this.props.API.filterBirthsInWeek();
        break;
        case 'month':
            newData = this.props.API.filterBirthsInMonth();
        break;
        case 'all':
            newData = this.props.API.getContactsList();
        break;
        }
        this.setState({
            contacts: newData
        });
    }
    onClickRemoveItem(contactId) {
        if (confirm('Are you sure?')) {
            this.props.API.find(contactId, this.props.API.rmContact);
            this.refresh();
            if (this.state.showContactDetails) { this.onCloseDetails(); }
        }
    }
    saveEditedContact(editedContact) {
        // this.props.API.editContact(editedContact, this.state.contactIndex);
        let curryingEditDataFunc = this.props.API.editContact(editedContact);
        this.props.API.find(editedContact.id, curryingEditDataFunc);
        this.refresh();
        this.onCloseForm();
        this.showNoti('success', `Saved.`);
    }
    addNewContact(newContact) {
        let getRandomCode = string_length => {
            let text = "";
            const POSSIBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                POSSIBLE_SCOPE = POSSIBLE.length;
            for (let i = 0; i < string_length; i += 1) {
                text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
            }
            return text;
        },
        getRandomColor = () => {
            let h = Math.floor(Math.random() * 360),
            s = Math.floor(Math.random() * 100) + '%',
            l = Math.floor(Math.random() * 60) + '%';
            // while (hexCode > 12895428) {16042184
            //     hexCode = Math.floor(Math.random() * 16777215);16042184
            // }
            return `hsl(${h},${s},${l})`;
        };
        newContact.id = getRandomCode(4);
        newContact.color = getRandomColor();
        this.props.API.addContact(newContact);
        // this.setState({
        //     contacts: this.props.API.getContactsList()
        // });
        this.refresh();
        this.onCloseForm();
        this.showNoti('success', `New contact: "${newContact.name}" was created.`);
    }
    showNoti(notiType, notiMsg) {
        // clearTimeout(this.showNotiTimer);
        // let hideNoti = () => {
        //     console.log(this.state.showNoti);
        //     this.setState({
        //         showNoti: false
        //     });
        // // }
        // this.notiMsg = notiMsg;
        // this.notiType = notiType;
        //     console.log(this.state.showNoti);
        // this.setState({
        //     showNoti: true
        // });
        //     console.log(this.state.showNoti);
        // this.showNotiTimer = setTimeout(hideNoti, 3000);// 3s is animating time
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
                this.setState({
                    contacts: this.props.API.getContactsList()
                });
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
            }
        } else {
            alert('Sorry, your browser does not support HTML5 Blob. We can not export your data.');
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
    render() {
        return (
            <div>
                <main className="main">
                    <header className="page-title">
                        <h1>Address Book</h1>
                    </header>
                    <ul className="contact-list">
                        {this.state.contacts.length === 0 ? null : this.state.contacts.map((contact, index) => {
                            console.log('re-rendered', index);// IS IT BUG?: render lại cả list mỗi khi state thay đổi, dù không phải thay đổi ở state.contacts
                            return <ContactItem
                                        contact={contact}
                                        key={contact.id}
                                        onClickEdit={(e) => { e.stopPropagation();this.onOpenEditForm(index); }}
                                        onClickRemove={(e) => { e.stopPropagation();this.onClickRemoveItem(contact.id); }}
                                        onClickOnItem={(e) => { this.onClickOnItem(index); }} />
                        })}
                    </ul>
                </main>
                {this.state.showNoti && this.state.notiList.map((notiObj, index) => {
                    return (<NotiBar type={notiObj.notiType} msg={notiObj.notiMsg} key={notiObj.notiId}/>);
                })}
                <MenuBar
                    totalContacts={this.props.API.getContactsList().length}
                    onClickDisplayAll={e => { this.displayAll(); }}
                    onClickOnFilterMenu={this.openFilterSubNav}
                    onFilterBirthsInWeek={e => { this.filterBirthsInWeek(); }}
                    onFilterBirthsInMonth={e => { this.filterBirthsInMonth(); }}
                    onClickOnBackupMenu={this.openBackupRestoreSubNav}
                    onClickAddMenu={e => { this.onOpenEditForm(-1); }}
                    onClickRestore={this.rstrData}
                    onUploadFile={this.inptFile.bind(this)}
                    onClickBackup={this.bckpData.bind(this)}
                    onSetTimer={e => {
                        this.delAllPressTimer = setTimeout(this.delAll.bind(this), 1000);
                    }}
                    onClearTimer={e => clearTimeout(this.delAllPressTimer)} />
                {this.state.showContactDetails &&
                    <ContactCard
                    data={this.state.contacts[this.state.contactIndex]}
                    onClose={this.onCloseDetails.bind(this)}
                    onEditContact={e => { this.onOpenEditForm(this.state.contactIndex); }}
                    onRemoveContact={e => { this.onClickRemoveItem(this.state.contacts[this.state.contactIndex].id); }} />}
                {this.state.showForm &&
                    <Form
                    title="Edit Contact"
                    data={this.state.contactIndex > -1 ?
                        this.state.contacts[this.state.contactIndex]
                        :
                        {
                            name: '',
                            labels: [],
                            birth: '',
                            note: '',
                            email: '',
                            website: '',
                            phone: ''
                        }}
                    onClose={this.onCloseForm.bind(this)}
                    onSave={this.state.contactIndex > -1 ?
                        this.saveEditedContact.bind(this)
                        :
                        this.addNewContact.bind(this)}
                    showNoti={this.showNoti.bind(this)} />}
            </div>
        );
    }
}
// {!this.state.hideContactBox && <ContactBox contact={this.state.contacts[this.state.showContactDetailsBoxOrder]} />}
// <div className="overlay overlay--hidden"></div>
export default AddressBook;
