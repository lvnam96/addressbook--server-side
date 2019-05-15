import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as storeActions from '../../storeActions';

const ContactsFilter = (props) => {
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
    const onClickShowAll = e => { onClickFilter('all'); };
    const onClickFilterBirthsInWeek = e => { onClickFilter('week'); };
    const onClickFilterBirthsInMonth = e => { onClickFilter('month'); };
    return (
        <nav aria-label="Contacts list filter" className="contact-filter">
            <ul className="pagination pagination-sm mb-0">
                <li className={classNames('page-item', { 'active': props.filterState === 0 })}>
                    <a
                        className="page-link"
                        onClick={onClickShowAll}>
                        All
                        {typeof props.totalContactsAmount === 'number' &&
                            <span className="contact-filter__hint-numb d-none d-md-inline"> ({props.totalContactsAmount})</span>
                        }
                    </a>
                </li>
                <li className={classNames('page-item', { 'active': props.filterState === 1 })}>
                    <a
                        className="page-link"
                        onClick={onClickFilterBirthsInWeek}>
                        Births in week
                        {typeof props.birthsInWeekAmount === 'number' &&
                            <span className="contact-filter__hint-numb d-none d-md-inline"> ({props.birthsInWeekAmount})</span>
                        }
                    </a>
                </li>
                <li className={classNames('page-item', { 'active': props.filterState === 2 })}>
                    <a
                        className="page-link"
                        onClick={onClickFilterBirthsInMonth}>
                        Births in month
                        {typeof props.birthsInMonthAmount === 'number' &&
                            <span className="contact-filter__hint-numb d-none d-md-inline"> ({props.birthsInMonthAmount})</span>
                        }
                    </a>
                </li>
            </ul>
        </nav>
    );
};

ContactsFilter.propTypes = {
    totalContactsAmount: PropTypes.number,
    // beingDisplayedContactsAmount: PropTypes.number,
    birthsInWeekAmount: PropTypes.number,
    birthsInMonthAmount: PropTypes.number,
};

export default ContactsFilter;
