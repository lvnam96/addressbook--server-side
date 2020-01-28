import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/esm/Dropdown';
// import { Link } from 'react-router-dom';
import classNames from 'classnames';

import ContactsFilter from '../ContactsList/ContactsFilter.jsx';
// import adbk from '../../controllers/adbk';

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

  const alertNotFinishedFeature = (e) => {
    adbk.showNoti('alert', 'This feature is not finished yet!');
  };
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
        <Dropdown alignRight>
          <Dropdown.Toggle
            bsPrefix="a"
            href="#"
            variant=""
            id="dropdown-basic"
            className="settings-btn"
            title="Open popup menu">
            <i className="fas fa-sliders-h" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="border-0 shadow" style={{ overflow: 'hidden' }}>
            <Dropdown.Item className="py-2" onClick={alertNotFinishedFeature}>
              <i className="fas fa-sort-amount-down" />
              &nbsp;&nbsp;Sort
            </Dropdown.Item>
            <Dropdown.Item className="py-2" onClick={alertNotFinishedFeature}>
              <i className="fas fa-filter" />
              &nbsp;&nbsp;More filter
            </Dropdown.Item>
            <hr />
            {props.totalContactsAmount !== 0 && (
              <Dropdown.Item
                className="py-2"
                onClick={
                  props.numOfCheckedItems !== props.totalContactsAmount
                    ? adbk.redux.action.contacts.markAllContact
                    : adbk.redux.action.contacts.unmarkAllContact
                }>
                <i className="fas fa-user-check" />
                &nbsp;&nbsp;
                {props.numOfCheckedItems !== props.totalContactsAmount ? 'Select all' : 'Unselect all'}
              </Dropdown.Item>
            )}
            <Dropdown.Item className="py-2" onClick={props.onBackupData}>
              <i className="fas fa-download" />
              &nbsp;&nbsp;Backup
            </Dropdown.Item>
            <Dropdown.Item className="py-2" onClick={props.onRestoreData}>
              <i className="fas fa-upload" />
              &nbsp;&nbsp;Restore
            </Dropdown.Item>
            <hr />
            {/* <Link className="py-2 dropdown-item" to="/settings"> */}
            <Dropdown.Item className="py-2" onClick={alertNotFinishedFeature}>
              <i className="fas fa-cogs" />
              &nbsp;&nbsp;Settings
            </Dropdown.Item>
            <Dropdown.Item className="py-2" href="/signout">
              <i className="fas fa-door-open" />
              &nbsp;&nbsp;Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
