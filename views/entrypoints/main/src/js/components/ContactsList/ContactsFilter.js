import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

const ContactsFilter = (props) => {
    return (
        <nav aria-label="Contacts list filter">
            <ul className="pagination pagination-sm mb-0">
                <li className={classNames('page-item', { 'active': props.filterState === 0 })}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={props.onClickShowAll}>
                        All <span className="contact-filter__hint-numb d-none d-md-inline">({props.totalContactsAmount})</span>
                    </a>
                </li>
                <li className={classNames('page-item', { 'active': props.filterState === 1 })}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={props.onClickFilterBirthsInWeek}>
                        Births in week <span className="contact-filter__hint-numb d-none d-md-inline">({props.birthsInWeekAmount})</span>
                    </a>
                </li>
                <li className={classNames('page-item', { 'active': props.filterState === 2 })}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={props.onClickFilterBirthsInMonth}>
                        Births in month <span className="contact-filter__hint-numb d-none d-md-inline">({props.birthsInMonthAmount})</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

ContactsFilter.propTypes = {
    onClickShowAll: PropTypes.func.isRequired,
    onClickFilterBirthsInWeek: PropTypes.func.isRequired,
    onClickFilterBirthsInMonth: PropTypes.func.isRequired,
    totalContactsAmount: PropTypes.number.isRequired,
    beingDisplayedContactsAmount: PropTypes.number.isRequired,
    birthsInWeekAmount: PropTypes.number.isRequired,
    birthsInMonthAmount: PropTypes.number.isRequired,
};

export default ContactsFilter;
