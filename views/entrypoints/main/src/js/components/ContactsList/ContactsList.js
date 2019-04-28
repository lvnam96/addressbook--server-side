import React from 'react';
import PropTypes from 'prop-types';
import { WindowScroller, AutoSizer, List } from 'react-virtualized';

import ContactItemContainer from './containers/ContactItemContainer';

const ContactsList = props => {
    const rowRenderer = ({
        index,
        isScrolling,
        isVisible,
        key,
        parent,
        style
    }) => {
        const contactData = props.data[index],
            contact = new adbk.classes.Contact(contactData),

            // If content is complex, consider rendering a lighter-weight placeholder while scrolling.
            // content = isScrolling ? '...' : (
            item = (
                <ContactItemContainer
                    contact={contact}
                    openContactCard={props.openContactCard}
                    rmItem={props.rmItem}
                    openForm={props.openForm}
                    openModalDialog={props.openModalDialog}
                    toggleMarkedItem={props.toggleMarkedItem} />
            );

        return (
            <div key={contact.id} style={style}>
                {item}
            </div>
        );
    };

    return props.data.length > 0 ?
        <div className="contact-list">
            <WindowScroller>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <List
                                autoHeight
                                height={height}
                                isScrolling={isScrolling}
                                onScroll={onChildScroll}
                                overscanRowCount={5}
                                rowCount={props.data.length}
                                rowHeight={64}
                                rowRenderer={rowRenderer}
                                scrollTop={scrollTop}
                                width={width}
                            />
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
        </div>
        :
        <p className="mt-4 mb-0 text-muted font-italic">There is no contacts match your need.</p>
    ;
};

ContactsList.propTypes = {
    openContactCard: PropTypes.func.isRequired,
    rmItem: PropTypes.func.isRequired,
    openForm: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    toggleMarkedItem: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ContactsList;
