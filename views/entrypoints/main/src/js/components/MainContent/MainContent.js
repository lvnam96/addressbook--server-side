import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';

import ContactsList from '../ContactsList/ContactsList';
import ContactsFilter from '../ContactsList/ContactsFilter';

const MainContent = props => {
    const onClickShowAll = e => { props.onClickFilter('all'); };
    const onClickFilterBirthsInWeek = e => { props.onClickFilter('week'); };
    const onClickFilterBirthsInMonth = e => { props.onClickFilter('month'); };
    return (
        <main className="main">
            <header className="page-header">
                <h1 className="page-title">Contacts Book</h1>
            </header>
            {/*
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-outline-primary">All</button>
                <button type="button" className="btn btn-outline-primary">Births in week</button>
                <button type="button" className="btn btn-outline-primary">Births in month</button>
            </div>
            OR:
            */}
            <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div className="col-auto px-0">
                    <ContactsFilter
                        filterState={props.filterState}
                        totalContactsAmount={props.allContacts.length}
                        beingDisplayedContactsAmount={props.filteredContacts.length}
                        birthsInWeekAmount={props.birthsInWeekAmount}
                        birthsInMonthAmount={props.birthsInMonthAmount}
                        onClickShowAll={onClickShowAll}
                        onClickFilterBirthsInWeek={onClickFilterBirthsInWeek}
                        onClickFilterBirthsInMonth={onClickFilterBirthsInMonth}
                    />
                </div>
                <div className="col-auto px-0">
                    <Dropdown alignRight>
                        <Dropdown.Toggle bsPrefix="a" href="#" variant="" id="dropdown-basic" className="settings-btn">
                            <i className="fas fa-sliders-h"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow" style={{ overflow: 'hidden', }}>
                            <Dropdown.Item className='py-3 py-md-2' onClick={props.onBackupData}><i className='fas fa-download'></i>&nbsp;&nbsp;Backup</Dropdown.Item>
                            <Dropdown.Item className='py-3 py-md-2' onClick={props.onRestoreData}><i className='fas fa-upload'></i>&nbsp;&nbsp;Restore</Dropdown.Item>
                            <hr className="my-2"/>
                            <Dropdown.Item className='py-3 py-md-2' href="/signout"><i className="fas fa-door-open"></i>&nbsp;&nbsp;Sign out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <ContactsList
                data={props.filteredContacts}
                openContactCard={props.openContactCard}
                rmItem={props.rmItem}
                openForm={props.openForm}
                openModalDialog={props.openModalDialog}
                toggleMarkedItem={props.toggleMarkedItem} />
        </main>
    );
};

MainContent.propTypes = {
    totalContactsAmount: PropTypes.number.isRequired,
    birthsInWeekAmount: PropTypes.number.isRequired,
    birthsInMonthAmount: PropTypes.number.isRequired,
    openContactCard: PropTypes.func.isRequired,
    rmItem: PropTypes.func.isRequired,
    openForm: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    toggleMarkedItem: PropTypes.func.isRequired,
    allContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    filteredContacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClickFilter: PropTypes.func.isRequired,
    onRestoreData: PropTypes.func.isRequired,
    onBackupData: PropTypes.func.isRequired,
    filterState: PropTypes.number.isRequired,
};

export default MainContent;
