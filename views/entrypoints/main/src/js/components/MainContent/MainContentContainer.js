import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import store from '../../store';

import { getBirthsInWeek, getBirthsInMonth } from '../../helpers/timeHelper';
import { sortByName } from '../../helpers/sortHelper';
import * as ls from '../../services/localStorageService';
import * as storeActions from '../../storeActions';

import MainContent from './MainContent';

const MainContentContainer = props => {
    const contactsHaveBirthInWeek = getBirthsInWeek(props.contacts);
    const contactsHaveBirthInMonth = getBirthsInMonth(props.contacts);
    let filteredContacts;
    switch (props.filterState) {
        case 1:
            filteredContacts = contactsHaveBirthInWeek;
            break;
        case 2:
            filteredContacts = contactsHaveBirthInMonth;
            break;
        default:
            filteredContacts = sortByName(props.contacts);
    }
    const onClickFilter = (filterStateSlug) => {
        switch (filterStateSlug) {
            case 'week':
                storeActions.changeStateToWeek();
                break;
            case 'month':
                storeActions.changeStateToMonth();
                break;
            default:
                storeActions.changeStateToAll();
                break;
        }
    };

    const onUploadFile = e => {
        let fileToLoad = e.target.files[0];

        if (fileToLoad) {
            const reader = new FileReader();

            reader.addEventListener('load', fileLoadedEvent => {
                let textFromFileLoaded = fileLoadedEvent.target.result;
                let dataParsedFromTextFile = JSON.parse(textFromFileLoaded);
                storeActions.asyncReplaceAllContacts(dataParsedFromTextFile).then(json => {
                    if (json.isSuccess) {
                        ls.save(dataParsedFromTextFile);
                        storeActions.changeStateToAll();
                        storeActions.showNoti('success', 'Your data is restored successfully!');
                    } else {
                        storeActions.notifyServerFailed();
                    }
                });
            }, false);
            reader.readAsText(fileToLoad, 'UTF-8');
        }
    };

    const onBackupData = e => {
        const bodyElem = document.body;
        if ('Blob' in window) {
            const destroyClickedElement = (e) => {
                bodyElem.removeChild(e.target);
            };

            let fileName = prompt('Type the name for your backup file:', 'contacts_backupFile.txt');
            fileName = (fileName === '' ? 'contacts_backupFile.txt' : fileName);

            if (fileName) {
                let textToWrite = JSON.stringify(store.getState().contacts).replace(/\n/g, '\r\n');
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

                storeActions.showNoti('success', 'We have exported your data. Save it to safe place!');
            }

        } else {
            storeActions.showNoti('alert', 'Sorry, your browser does not support this feature.');
        }
    };

    const onRestoreData = e => {
        if ('FileReader' in window) {
            document.getElementById('inptFileBtn').click();
        } else {
            alert('Sorry, your browser does not support this feature.');
        }
    };

    return (
        <>
            <input
                style={{display: 'none'}}
                type='file'
                id='inptFileBtn'
                accept='.txt'
                onChange={onUploadFile}
            />
            <MainContent
                {...props}
                allContacts={props.contacts}
                filteredContacts={filteredContacts}
                birthsInWeekAmount={contactsHaveBirthInWeek.length}
                birthsInMonthAmount={contactsHaveBirthInMonth.length}
                onClickFilter={onClickFilter}
                onRestoreData={onRestoreData}
                onBackupData={onBackupData}
            />
        </>
    );
};

MainContentContainer.propTypes = {
    // props from redux store provider:
    // dispatch: PropTypes.func.isRequired,
    filterState: PropTypes.number.isRequired,
    // notiList: PropTypes.arrayOf(PropTypes.object).isRequired,
    // contactIndex: PropTypes.number.isRequired,
    contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact)).isRequired
};

// const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(MainContentContainer);
export default MainContentContainer;
