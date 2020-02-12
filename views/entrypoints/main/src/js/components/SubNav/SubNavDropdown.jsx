import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/esm/Dropdown';
// import { Link } from 'react-router-dom';
import memoizeOne from 'memoize-one';

const alertNotFinishedFeature = memoizeOne(() => {
  adbk.showNoti('alert', 'This feature is not finished yet!');
});
const SubNavDropdown = (props) => {
  return (
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
  );
};

SubNavDropdown.propTypes = {
  totalContactsAmount: PropTypes.number.isRequired,
  numOfCheckedItems: PropTypes.number.isRequired,
  onRestoreData: PropTypes.func.isRequired,
  onBackupData: PropTypes.func.isRequired,
};

export default memo(SubNavDropdown);
