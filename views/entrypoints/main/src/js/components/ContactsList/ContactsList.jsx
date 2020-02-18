import React, { memo } from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList, areEqual } from 'react-window';
import { connect } from 'react-redux';

import ContactItemContainer from './containers/ContactItemContainer.jsx';
import img from '../../../img/empty-contact-list-placeholder.png';
// const img = import('../../../img/empty-contact-list-placeholder.png');

const ContactsList = (props) => {
  const RowRenderer = memo(function RowRenderer({ index, style }) {
    const contactData = props.data[index];
    const contact = new adbk.classes.Contact(contactData);
    // If content is complex, consider rendering a lighter-weight placeholder while scrolling:
    const content = <ContactItemContainer contact={contact} />; // isScrolling ? '...' : <ContactItemContainer contact={contact} />;

    return (
      <div key={contact.id} style={style}>
        {content}
      </div>
    );
  }, areEqual);

  return props.data.length > 0 ? (
    <div className="contact-list">
      <AutoSizer disableHeight nonce={adbk.status.isDev ? undefined : window.NONCE_ID}>
        {/* how-to doc: https://github.com/bvaughn/react-virtualized/blob/master/docs/usingAutoSizer.md */}
        {({ width }) => (
          <VariableSizeList
            height={64 * props.data.length + 2} // + 2 is for fixing a weird issue when displaying on Chrome: showing side scrollbar because of lacking of 2px
            // useIsScrolling
            // onScroll={({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
            //   // scrollDirection is either "forward" or "backward".
            //   // scrollOffset is a number.
            //   // scrollUpdateWasRequested is a boolean.
            //   // This value is true if the scroll was caused by scrollTo() or scrollToItem(),
            //   // And false if it was the result of a user interaction in the browser.
            // }}
            overscanCount={0}
            itemCount={props.data.length}
            estimatedItemSize={64}
            itemSize={() => 64}
            initialScrollOffset={0}
            width={width}>
            {RowRenderer}
          </VariableSizeList>
        )}
      </AutoSizer>
    </div>
  ) : props.contacts.length > 0 ? (
    <p className="mt-4 mb-0 text-muted font-italic">There is no contacts match your need.</p>
  ) : (
    <div className="text-center py-3 py-md-4 contact-list">
      <p className="mb-3">
        <img src={img} alt="" className="" />
      </p>
      <p
        className="mb-0 text-muted font-weight-bold"
        style={{
          fontFamily: 'Courier, monospace',
        }}>
        Looks like you haven&#39;t added any contact yet.
      </p>
    </div>
  );
};

ContactsList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact)).isRequired,
  data: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact).isRequired).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  contacts: state.contacts,
  ...ownProps,
});
export default connect(mapStateToProps)(ContactsList);
// export default ContactsList;
