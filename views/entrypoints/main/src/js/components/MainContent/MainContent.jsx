import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AsyncContactsList from '../ContactsList/AsyncContactsList.jsx';
import SubNav from '../SubNav/SubNav.jsx';

const MainContent = (props) => {
  const [isSticky, setSticky] = useState(false);
  const subNavRef = React.useRef();
  const subNavOffsetTop = React.useRef(0); // explain why we have to use subNavOffsetTop with React.useRef
  window.addEventListener('scroll', (e) => {
    if (subNavRef.current) {
      subNavOffsetTop.current = subNavOffsetTop.current || subNavRef.current.offsetTop;
      const currentPosition = window.scrollY;
      const toggleStickyNav = (currentPosition) => {
        return currentPosition > subNavOffsetTop.current;
      };
      window.requestAnimationFrame(() => {
        try {
          setSticky(toggleStickyNav(currentPosition));
        } catch (e) {
          console.error(e);
        }
      });
    }
  });

  const selectBtnLabel =
    props.numOfCheckedItems !== props.allContacts.length ? (
      <>
        <i className="far fa-check-circle" />
        &nbsp;&nbsp;Select all
      </>
    ) : (
      <>
        <i className="fas fa-check-circle" />
        &nbsp;&nbsp;Unselect all
      </>
    );

  return (
    <main className="d-flex flex-column main">
      <header className="header">
        <h1 className="header__title">Contacts Book</h1>
      </header>
      <SubNav
        subNavRef={subNavRef}
        filterState={props.filterState}
        totalContactsAmount={props.allContacts.length}
        birthsInWeekAmount={props.birthsInWeekAmount}
        birthsInMonthAmount={props.birthsInMonthAmount}
        onBackupData={props.onBackupData}
        onRestoreData={props.onRestoreData}
        numOfCheckedItems={props.numOfCheckedItems}
      />
      <SubNav
        className={classNames('p-1 bg-light fixed-top shadow', {
          invisible: !isSticky,
        })}
        isSticky={isSticky}
        filterState={props.filterState}
        totalContactsAmount={props.allContacts.length}
        birthsInWeekAmount={props.birthsInWeekAmount}
        birthsInMonthAmount={props.birthsInMonthAmount}
        onBackupData={props.onBackupData}
        onRestoreData={props.onRestoreData}
        numOfCheckedItems={props.numOfCheckedItems}
      />
      <AsyncContactsList data={props.filteredContacts} />
      {!!props.numOfCheckedItems && (
        <div
          className={classNames('d-md-none', {
            'my-3 my-md-0': !!props.numOfCheckedItems,
          })}>
          <a
            style={{ cursor: 'pointer' }}
            onClick={
              props.numOfCheckedItems !== props.allContacts.length
                ? adbk.redux.action.contacts.markAllContact
                : adbk.redux.action.contacts.unmarkAllContact
            }
            label={props.numOfCheckedItems !== props.allContacts.length ? 'Check all' : 'Uncheck all'}>
            {selectBtnLabel}
          </a>
        </div>
      )}
      <p className="text-center text-md-right text-gray">&copy; 2020</p>
    </main>
  );
};

MainContent.propTypes = {
  // subNavRef: PropTypes.object.isRequired,
  // isSticky: PropTypes.bool.isRequired,
  birthsInWeekAmount: PropTypes.number.isRequired,
  birthsInMonthAmount: PropTypes.number.isRequired,
  allContacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact).isRequired).isRequired,
  filteredContacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact).isRequired).isRequired,
  onRestoreData: PropTypes.func.isRequired,
  onBackupData: PropTypes.func.isRequired,
  filterState: PropTypes.number.isRequired,
  numOfCheckedItems: PropTypes.number.isRequired,
};

export default MainContent;
