import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/esm/Dropdown';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ContactsFilter from '../ContactsList/ContactsFilter.jsx';
import SubNavDropdown from './SubNavDropdown.jsx';

const SubNav = (props) => {
  const selectBtnLabel =
    props.numOfCheckedItems !== props.totalContactsAmount ? (
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
    <div
      ref={props.subNavRef}
      className={classNames('d-flex flex-wrap align-items-center justify-content-between sub-nav', {
        [props.className]: typeof props.className === 'string',
      })}
      style={{
        zIndex: 10,
      }}>
      <div className="col col-md-auto px-0">
        <ContactsFilter
          filterState={props.filterState}
          totalContactsAmount={props.totalContactsAmount}
          // beingDisplayedContactsAmount={props.filteredContacts.length}
          birthsInWeekAmount={props.birthsInWeekAmount}
          birthsInMonthAmount={props.birthsInMonthAmount}
        />
      </div>
      <div className="col-auto px-0 ml-auto order-md-3">
        <SubNavDropdown
          totalContactsAmount={props.totalContactsAmount}
          numOfCheckedItems={props.numOfCheckedItems}
          onBackupData={props.onBackupData}
          onRestoreData={props.onRestoreData}
        />
      </div>
      {!!props.numOfCheckedItems && (
        <div
          className={classNames('d-none d-md-block col-12 col-md-auto mr-md-auto order-md-2', {
            'my-3 my-md-0': !!props.numOfCheckedItems,
          })}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/anchor-is-valid */}
          <span
            style={{
              cursor: 'pointer',
              display: 'contents',
            }}
            onClick={
              props.numOfCheckedItems !== props.totalContactsAmount
                ? adbk.redux.action.contacts.markAllContact
                : adbk.redux.action.contacts.unmarkAllContact
            }
            label={props.numOfCheckedItems !== props.totalContactsAmount ? 'Check all' : 'Uncheck all'}
            role="button"
            tabIndex="0">
            {selectBtnLabel}
          </span>
        </div>
      )}
    </div>
  );
};

SubNav.propTypes = {
  subNavRef: PropTypes.any,
  birthsInWeekAmount: PropTypes.number.isRequired,
  birthsInMonthAmount: PropTypes.number.isRequired,
  className: PropTypes.string,
  filterState: PropTypes.number.isRequired,
  totalContactsAmount: PropTypes.number.isRequired,
  numOfCheckedItems: PropTypes.number.isRequired,
  onRestoreData: PropTypes.func.isRequired,
  onBackupData: PropTypes.func.isRequired,
};

export default SubNav;
