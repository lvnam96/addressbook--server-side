import API from '../../../API';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MainNav from '../MainNav';

let delAllPressTimer;

const bodyElem = document.body;

class MainNavContainer extends Component {
    constructor(props) {
        super(props);
        this.handlerAddNewContact = this.handlerAddNewContact.bind(this);
        this.setTimer = this.setTimer.bind(this);
        this.handlerUploadFile = this.handlerUploadFile.bind(this);
        this.handlerBackupData = this.handlerBackupData.bind(this);
    }

    static get propTypes() {
        return {
            onClickAddMenu: PropTypes.func.isRequired,
            onClickDelete: PropTypes.func.isRequired,
            showNoti: PropTypes.func.isRequired,
            onClickDisplayAll: PropTypes.func.isRequired,
            onFilterBirthsInWeek: PropTypes.func.isRequired,
            onFilterBirthsInMonth: PropTypes.func.isRequired,
            onClickDelAll: PropTypes.func.isRequired,
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

    openBackupRestoreSubNav(e) {
        const filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0],
            backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
        filterBtnGroup.classList.add('translatedDown200');
        backupBtnGroup.classList.toggle('translatedDown100');
    }

    openFilterSubNav(e) {
        const filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0],
            backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
        backupBtnGroup.classList.add('translatedDown100');
        filterBtnGroup.classList.toggle('translatedDown200');
    }

    handlerAddNewContact(e) {
        this.props.onClickAddMenu(-1);
    }

    setTimer(e) {
        delAllPressTimer = setTimeout(this.props.onClickDelAll, 600);
    }

    clearTimer(e) {
        clearTimeout(delAllPressTimer);
    }

    handlerRestoreData(e) {
        if ('FileReader' in window) {
            document.getElementById('inptFileBtn').click();
        } else {
            alert('Sorry, your browser does not support this feature.');
        }
    }

    handlerUploadFile(e) {
        let fileToLoad = e.target.files[0];

        if (fileToLoad) {
            let reader = new FileReader();

            reader.addEventListener('load', fileLoadedEvent => {
                let textFromFileLoaded = fileLoadedEvent.target.result,
                    dataParsedFromTextFile = JSON.parse(textFromFileLoaded);
                API.replaceData(dataParsedFromTextFile);
                API.saveDataToLocalStorage();
                API.dataNeedToBeSorted();
                this.props.onClickDisplayAll();
                this.props.showNoti('success', 'Your data is restored successfully!');
            }, false);
            reader.readAsText(fileToLoad, 'UTF-8');
        }
    }

    handlerBackupData(e) {
        if ('Blob' in window) {
            function destroyClickedElement(e) {
                bodyElem.removeChild(e.target);
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

                    if ('webkitURL' in window) {// Chrome allows the link to be clicked without actually adding it to the DOM.
                        const polyURL = window.URL || window.webkitURL;
                        downloadLink.href = polyURL.createObjectURL(textFileAsBlob);

                    } else {// Firefox requires the link to be added to the DOM before it can be clicked.
                        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                        downloadLink.addEventListener('click', destroyClickedElement);
                        downloadLink.style.display = 'none';
                        bodyElem.appendChild(downloadLink);
                    }

                    downloadLink.click();
                }

                this.props.showNoti('success', 'We have exported your data. Save it to safe place!');
            }

        } else {
            this.props.showNoti('alert', 'Sorry, your browser does not support this feature.');
        }
    }

    render() {
        return (
            <MainNav
                handlerAddNewContact={this.handlerAddNewContact}
                openBackupRestoreSubNav={this.openBackupRestoreSubNav}
                openFilterSubNav={this.openFilterSubNav}
                setTimer={this.setTimer}
                clearTimer={this.clearTimer}
                handlerRestoreData={this.handlerRestoreData}
                handlerUploadFile={this.handlerUploadFile}
                handlerBackupData={this.handlerBackupData}
                onClickDelete={this.props.onClickDelete}
                onClickDisplayAll={this.props.onClickDisplayAll}
                onFilterBirthsInWeek={this.props.onFilterBirthsInWeek}
                onFilterBirthsInMonth={this.props.onFilterBirthsInMonth}
                totalContacts={this.props.totalContacts}
                numOfCheckedItems={this.props.numOfCheckedItems} />
        );
    }
}

export default MainNavContainer;
