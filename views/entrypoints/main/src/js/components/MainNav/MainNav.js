import React from 'react';
import PropTypes from 'prop-types';

import NavBtn from './NavBtn';

const MainNav = props => (
    <nav className='sticky-nav'>
        <ul className='filter-sub-nav translatedDown200'>
            <li className="filter-sub-nav__item" title='Display contacts whose birthday is in current week' onClick={props.onFilterBirthsInWeek}>Current WEEK</li>
            <li className="filter-sub-nav__item" title='Display contacts whose birthday is in current month' onClick={props.onFilterBirthsInMonth}>Current MONTH</li>
        </ul>
        <input style={{display: 'none'}} type='file' id='inptFileBtn' accept='.txt'
            onChange={props.handlerUploadFile} />
        <ul className='backup-restore-sub-nav translatedDown100'>
            <li className="filter-sub-nav__item" id='bckpDataBtn' onClick={props.handlerBackupData} title='Save current data into a text file'>Backup</li>
            <li className="filter-sub-nav__item" id='rstrDataBtn' onClick={props.handlerRestoreData} title='Replace current data by the new one in your backup file'>Restore</li>
        </ul>
        <nav className='main-nav'>
            <NavBtn
                label={`Contacts (${props.totalContacts})`}
                icon="fas fa-address-book"
                onClick={props.onClickDisplayAll} />
            <input type='checkbox' id='sort-toggle' style={{display: 'none'}} />
            <NavBtn
                isDropdownBtn={true}
                inputId="sort-toggle"
                title='Display contacts whose birthday is in current week/month'
                label="Filter by births in..."
                icon="fas fa-birthday-cake"
                onClick={props.openFilterSubNav} />
            <NavBtn
                moreClass="week-btn"
                label="... current week"
                icon="far fa-calendar-minus"
                onClick={props.onFilterBirthsInWeek} />
            <NavBtn
                moreClass="month-btn"
                label="... current month"
                icon="far fa-calendar-alt"
                onClick={props.onFilterBirthsInMonth} />
            <NavBtn
                moreClass={"trash-btn" + (props.numOfCheckedItems > 0 ? ' lighter' : '')}
                title="Long-press this button to delete all contacts"
                label={`Delete ${props.numOfCheckedItems > 0 ? 'checked' : 'all'} contacts`}
                icon="fas fa-trash"
                ref={props.getRefOfDelBtn}
                onMouseDown={props.setTimer}
                onMouseUp={props.clearTimer}
                onTouchStart={props.setTimer}
                onTouchEnd={props.clearTimer}
                onClick={props.onClickDelete} />
            <input type='checkbox'id="bckp-rstr-toggle" style={{display: 'none'}} />
            <NavBtn
                isDropdownBtn={true}
                inputId="bckp-rstr-toggle"
                label="Backup / Restore"
                icon="fas fa-save"
                onClick={props.openBackupRestoreSubNav} />
            <NavBtn
                moreClass="backup-btn"
                label="Backup"
                icon="fas fa-download"
                onClick={props.handlerBackupData} />
            <NavBtn
                moreClass="restore-btn"
                label="Restore"
                icon="fas fa-upload"
                onClick={props.handlerRestoreData} />
            <NavBtn
                label="Add new contact"
                icon="fas fa-plus-circle"
                onClick={props.handlerAddNewContact} />
        </nav>
    </nav>
);

MainNav.propTypes = {
    handlerAddNewContact: PropTypes.func.isRequired,
    openBackupRestoreSubNav: PropTypes.func.isRequired,
    openFilterSubNav: PropTypes.func.isRequired,
    setTimer: PropTypes.func.isRequired,
    clearTimer: PropTypes.func.isRequired,
    getRefOfDelBtn: PropTypes.func.isRequired,
    handlerRestoreData: PropTypes.func.isRequired,
    handlerUploadFile: PropTypes.func.isRequired,
    handlerBackupData: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    totalContacts: PropTypes.number.isRequired,
    onClickDisplayAll: PropTypes.func.isRequired,
    onFilterBirthsInWeek: PropTypes.func.isRequired,
    onFilterBirthsInMonth: PropTypes.func.isRequired,
    numOfCheckedItems: PropTypes.number.isRequired
};

export default MainNav;
