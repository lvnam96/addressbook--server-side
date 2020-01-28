import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getListOfBirthsToday, getBirthsInWeek, getBirthsInMonth } from '../../../helpers/timeHelper';
import { sortByName } from '../../../helpers/sortHelper';
import * as ls from '../../../services/localStorageService';

import MainContent from '../MainContent.jsx';
// import adbk from '../../../controllers/adbk';

const MainContentContainer = (props) => {
  useEffect(() => {
    const birthsToday = getListOfBirthsToday(props.contacts);
    const prepBirthNoti = (contactsNames) => {
      birthsToday.forEach((contact, idx) => {
        if (idx === 0) {
          return;
        }
        contactsNames += ` & ${contact.name}`;
      });
      return `Today is ${contactsNames}'s birthday!! Wish ${
        birthsToday.length > 1 ? 'them' : 'him/her'
      } a happy birthday!`;
    };

    if (birthsToday.length > 0) {
      const contactsNames = birthsToday[0].name;
      adbk.showNoti('alert', prepBirthNoti(contactsNames));
    }
  }, [props.contacts]);

  const fileInputRef = React.createRef();
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

  const onUploadFile = (e) => {
    const fileToLoad = fileInputRef.current.files[0];

    if (fileToLoad) {
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        (fileLoadedEvent) => {
          const textFromFileLoaded = fileLoadedEvent.target.result;
          const dataParsedFromTextFile = JSON.parse(textFromFileLoaded);
          adbk.replaceAllContacts(dataParsedFromTextFile);
        },
        false
      );
      reader.readAsText(fileToLoad, 'UTF-8');
    }
  };
  const onBackupData = (e) => {
    const store = adbk.redux.store;
    const bodyElem = document.body;
    if ('Blob' in window) {
      const destroyClickedElement = (e) => {
        bodyElem.removeChild(e.target);
      };

      let fileName = prompt('Type the name for your backup file:', 'contacts_backupFile.txt');
      fileName = fileName === '' ? 'contacts_backupFile.txt' : fileName;

      if (fileName) {
        const textToWrite = JSON.stringify(store.getState().contacts).replace(/\n/g, '\r\n');
        const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });

        if ('msSaveOrOpenBlob' in navigator) {
          navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
        } else {
          const downloadLink = document.createElement('a');
          downloadLink.download = fileName;
          downloadLink.innerHTML = 'Download File';

          if ('webkitURL' in window) {
            // Chrome allows the link to be clicked without actually adding it to the DOM.
            const polyURL = window.URL || window.webkitURL;
            downloadLink.href = polyURL.createObjectURL(textFileAsBlob);
          } else {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob); // Firefox requires the link to be added to the DOM before it can be clicked.
            downloadLink.addEventListener('click', destroyClickedElement);
            downloadLink.style.display = 'none';
            bodyElem.appendChild(downloadLink);
          }

          downloadLink.click();
        }

        adbk.showNoti('success', 'We have exported your data. Save it to safe place!');
      }
    } else {
      adbk.showNoti('alert', 'Sorry, your browser does not support this feature.');
    }
  };
  const onRestoreData = (e) => {
    if ('FileReader' in window) {
      fileInputRef.current.click();
    } else {
      alert('Sorry, your browser does not support this feature.');
    }
  };
  const onClickFileInput = (e) => {
    e.target.value = null;
  };

  const numOfCheckedItems = props.contacts.filter((contact) => contact.isMarked).length;
  return (
    <>
      <div className="file-input-container">
        <input
          ref={fileInputRef}
          style={{ display: 'none' }}
          type="file"
          id="inptFileBtn"
          accept=".txt"
          onChange={onUploadFile}
          onClick={onClickFileInput}
        />
      </div>
      <MainContent
        filterState={props.filterState}
        numOfCheckedItems={numOfCheckedItems}
        allContacts={props.contacts}
        filteredContacts={filteredContacts}
        birthsInWeekAmount={contactsHaveBirthInWeek.length}
        birthsInMonthAmount={contactsHaveBirthInMonth.length}
        onRestoreData={onRestoreData}
        onBackupData={onBackupData}
      />
    </>
  );
};

MainContentContainer.propTypes = {
  filterState: PropTypes.number.isRequired,
  contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact)).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  contacts: state.contacts,
  filterState: state.filterState,
  ...ownProps,
});
export default connect(mapStateToProps)(MainContentContainer);
