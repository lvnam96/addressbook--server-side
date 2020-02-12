import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NotiBar from './NotiBar.jsx';

const NotificationsList = ({ notiList }) =>
  notiList.map(({ type, msg, displayTimeDuration, id }) => (
    <NotiBar displayTimeDuration={displayTimeDuration} type={type} msg={msg} key={id} />
  ));

NotificationsList.propTypes = {
  notiList: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({ notiList: state.notiList });
export default connect(mapStateToProps)(NotificationsList);
