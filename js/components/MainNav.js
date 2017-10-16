import API from '../API';
import React from 'react';
import PropTypes from 'prop-types';

import NavBtn from './NavBtn';

const MainNav = props => {
    let delAllPressTimer;

    const bodyElem = document.body,
        openBackupRestoreSubNav = e => {
            const filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0],
                backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
            filterBtnGroup.classList.add('translatedDown200');
            backupBtnGroup.classList.toggle('translatedDown100');
        },
        openFilterSubNav = e => {
            const filterBtnGroup = document.getElementsByClassName('filter-sub-nav')[0],
                backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0];
            backupBtnGroup.classList.add('translatedDown100');
            filterBtnGroup.classList.toggle('translatedDown200');
        },
        handlerAddNewContact = e => {
            props.onClickAddMenu(-1);
        },
        setTimer = e => {
            delAllPressTimer = setTimeout(props.onClickDelAll, 600);
        },
        clearTimer = e => {
            clearTimeout(delAllPressTimer);
        },
        handlerRestoreData = e => {
            if ('FileReader' in window) {
                document.getElementById('inptFileBtn').click();
            } else {
                alert('Sorry, your browser does not support this feature.');
            }
        },
        handlerUploadFile = e => {
            let fileToLoad = e.target.files[0];

            if (fileToLoad) {
                let reader = new FileReader();

                reader.addEventListener('load', fileLoadedEvent => {
                    let textFromFileLoaded = fileLoadedEvent.target.result,
                        dataParsedFromTextFile = JSON.parse(textFromFileLoaded);
                    API.replaceData(dataParsedFromTextFile);
                    API.saveDataToLocalStorage();
                    API.dataNeedToBeSorted();
                    props.onClickDisplayAll();
                    props.showNoti('success', 'Your data is restored successfully!');
                }, false);
                reader.readAsText(fileToLoad, 'UTF-8');
            }
        },
        handlerBackupData = e => {
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

                    props.showNoti('success', 'We have exported your data. Save it to safe place!');
                }

            } else {
                props.showNoti('alert', 'Sorry, your browser does not support this feature.');
            }
        };

    return (
        <nav className='sticky-nav'>
            <ul className='filter-sub-nav translatedDown200'>
                <li className="filter-sub-nav__item" title='Display contacts whose birthday is in current week' onClick={props.onFilterBirthsInWeek}>Current WEEK</li>
                <li className="filter-sub-nav__item" title='Display contacts whose birthday is in current month' onClick={props.onFilterBirthsInMonth}>Current MONTH</li>
            </ul>
            <input style={{display: 'none'}} type='file' id='inptFileBtn' accept='.txt'
                onChange={handlerUploadFile} />
            <ul className='backup-restore-sub-nav translatedDown100'>
                <li className="filter-sub-nav__item" id='bckpDataBtn' onClick={handlerBackupData} title='Save current data into a text file'>Backup</li>
                <li className="filter-sub-nav__item" id='rstrDataBtn' onClick={handlerRestoreData} title='Replace current data by the new one in your backup file'>Restore</li>
            </ul>
            <nav className='main-nav'>
                <NavBtn label={`Contacts (${props.totalContacts})`} icon="fa-address-book-o" onClick={props.onClickDisplayAll} />
                <input type='checkbox' id='sort-toggle' style={{display: 'none'}} />
                <NavBtn isDropdownBtn={true} inputId="sort-toggle" title='Display contacts whose birthday is in current week/month' label="Filter by births in..." icon="fa-birthday-cake" onClick={openFilterSubNav} />
                <NavBtn moreClass="week-btn" label="... current week" icon="fa-calendar-minus-o" onClick={props.onFilterBirthsInWeek} />
                <NavBtn moreClass="month-btn" label="... current month" icon="fa-calendar" onClick={props.onFilterBirthsInMonth} />
                <NavBtn
                    onMouseDown={setTimer}
                    onMouseUp={clearTimer}
                    onTouchStart={setTimer}
                    onTouchEnd={clearTimer}
                    moreClass={"trash-btn" + (props.numOfCheckedItems > 0 ? ' lighter' : '')} title="Long-press this button to delete all contacts" label={`Delete ${props.numOfCheckedItems > 0 ? 'checked' : 'all'} contacts`} icon="fa-trash-o" onClick={props.onClickDelete} />
                <input type='checkbox' id="bckp-rstr-toggle" style={{display: 'none'}} />
                <NavBtn isDropdownBtn={true} inputId="bckp-rstr-toggle" label="Backup / Restore" icon="fa-floppy-o" onClick={openBackupRestoreSubNav} />
                <NavBtn moreClass="backup-btn" label="Backup" icon="fa-download" onClick={handlerBackupData} />
                <NavBtn moreClass="restore-btn" label="Restore" icon="fa-upload" onClick={handlerRestoreData} />
                <NavBtn label="Add new contact" icon="fa-plus" onClick={handlerAddNewContact} />
            </nav>
        </nav>
    );
};

MainNav.propTypes = {
    onClickAddMenu: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired,
    totalContacts: PropTypes.number.isRequired,
    onClickDisplayAll: PropTypes.func.isRequired,
    onFilterBirthsInWeek: PropTypes.func.isRequired,
    onFilterBirthsInMonth: PropTypes.func.isRequired,
    onClickDelAll: PropTypes.func.isRequired,
    numOfCheckedItems: PropTypes.number.isRequired
};

export default MainNav;
