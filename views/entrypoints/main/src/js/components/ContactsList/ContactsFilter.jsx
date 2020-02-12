import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ContactsFilter = (props) => {
  const onClickFilter = (filterStateSlug) => {
    switch (filterStateSlug) {
      case 'week':
        adbk.redux.action.filterState.changeStateToWeek();
        break;
      case 'month':
        adbk.redux.action.filterState.changeStateToMonth();
        break;
      default:
        adbk.redux.action.filterState.changeStateToAll();
        break;
    }
  };
  const onClickShowAll = (e) => {
    onClickFilter('all');
  };
  const onClickFilterBirthsInWeek = (e) => {
    onClickFilter('week');
  };
  const onClickFilterBirthsInMonth = (e) => {
    onClickFilter('month');
  };
  return (
    <nav aria-label="Contacts list filter" className="contact-filter">
      <ul className="pagination pagination-sm mb-0">
        <li className={classNames('page-item', { active: props.filterState === 0 })}>
          <a className="page-link" onClick={onClickShowAll}>
            All
            <span className="contact-filter__hint-numb d-none d-md-inline">&nbsp;({props.totalContactsAmount})</span>
          </a>
        </li>
        <li className={classNames('page-item', { active: props.filterState === 1 })}>
          <a className="page-link" onClick={onClickFilterBirthsInWeek}>
            Births in week
            <span className="contact-filter__hint-numb d-none d-md-inline">&nbsp;({props.birthsInWeekAmount})</span>
          </a>
        </li>
        <li className={classNames('page-item', { active: props.filterState === 2 })}>
          <a className="page-link" onClick={onClickFilterBirthsInMonth}>
            Births in month
            <span className="contact-filter__hint-numb d-none d-md-inline">&nbsp;({props.birthsInMonthAmount})</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

ContactsFilter.propTypes = {
  filterState: PropTypes.number.isRequired,
  totalContactsAmount: PropTypes.number.isRequired,
  birthsInWeekAmount: PropTypes.number.isRequired,
  birthsInMonthAmount: PropTypes.number.isRequired,
};

export default memo(ContactsFilter);
