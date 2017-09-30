import React from 'react';
import PropTypes from 'prop-types';

import NavBtn from './NavBtn';

const MenuBar = props => (
    <nav className='sticky-nav'>
        <ul className='filter-sub-nav translatedDown200'>
            <li className='sort-sub-nav__item--presentState' title='Display contacts whose birthday is in current week' onClick={props.onFilterBirthsInWeek}>Current WEEK</li>
            <li title='Display contacts whose birthday is in current month' onClick={props.onFilterBirthsInMonth}>Current MONTH</li>
        </ul>
        <input style={{display: 'none'}} type='file' id='inptFileBtn' accept='.txt'
            onChange={props.onUploadFile} />
        <ul className='backup-restore-sub-nav translatedDown100'>
            <li id='bckpDataBtn' onClick={props.onClickBackup} title='Save current data into a text file'>Backup</li>
            <li id='rstrDataBtn' onClick={props.onClickRestore} title='Replace current data by the new one in your backup file'>Restore</li>
        </ul>
        <nav className='main-nav'>
            <NavBtn label={`Contacts (${props.totalContacts})`} icon="fa-address-book-o" onClick={props.onClickDisplayAll} />
            <input type='checkbox' id='sort-toggle' style={{display: 'none'}} />
            <NavBtn isDropdownBtn={true} inputId="sort-toggle" title='Display contacts whose birthday is in current week/month' label="Filter by births in..." icon="fa-birthday-cake" onClick={props.onClickOnFilterMenu} />
            <NavBtn moreClass="week-btn" label="... current week" icon="fa-calendar-minus-o" onClick={props.onFilterBirthsInWeek} />
            <NavBtn moreClass="month-btn" label="... current month" icon="fa-calendar" onClick={props.onFilterBirthsInMonth} />
            <NavBtn
                onMouseDown={props.onSetTimer}
                onMouseUp={props.onClearTimer}
                onTouchStart={props.onSetTimer}
                onTouchEnd={props.onClearTimer}
                moreClass={"trash-btn" + (props.numOfCheckedItems > 0 ? ' lighter' : '')} title="Long-press this button to delete all contacts" label={`Delete ${props.numOfCheckedItems > 0 ? 'checked' : 'all'} contacts`} icon="fa-trash-o" onClick={props.onClickDelete} />
            <input type='checkbox' id="bckp-rstr-toggle" style={{display: 'none'}} />
            <NavBtn isDropdownBtn={true} inputId="bckp-rstr-toggle" label="Backup / Restore" icon="fa-floppy-o" onClick={props.onClickOnBackupMenu} />
            <NavBtn moreClass="backup-btn" label="Backup" icon="fa-download" onClick={props.onClickBackup} />
            <NavBtn moreClass="restore-btn" label="Restore" icon="fa-upload" onClick={props.onClickRestore} />
            <NavBtn label="Add new contact" icon="fa-plus" onClick={props.onClickAddMenu} />
        </nav>
    </nav>
);

MenuBar.propTypes = {
    onSetTimer: PropTypes.func.isRequired,
    onClearTimer: PropTypes.func.isRequired,
    onClickOnBackupMenu: PropTypes.func.isRequired,
    onClickBackup: PropTypes.func.isRequired,
    onClickRestore: PropTypes.func.isRequired,
    onUploadFile: PropTypes.func.isRequired,
    onClickAddMenu: PropTypes.func.isRequired,
    onFilterBirthsInWeek: PropTypes.func.isRequired,
    onFilterBirthsInMonth: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired
};

export default MenuBar;
