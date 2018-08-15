// import React from 'react';
import PropTypes from 'prop-types';
import { WindowScroller, AutoSizer, List } from 'react-virtualized';

import ContactItemContainer from './containers/ContactItemContainer';

const ContactsList = props => {
    function rowRenderer({
        index,
        isScrolling,
        isVisible,
        key,
        parent,
        style
    }) {
        // If content is complex, consider rendering a lighter-weight placeholder while scrolling.
        // const content = isScrolling
        //     ? '...'
        //     : <User/>;
        const contact = props.data[index];

        const handlerClickCheckbox = e => props.toggleMarkedItem(contact);
        return (
            <div key={contact.id} style={style}>
                <ContactItemContainer
                    {...contact}
                    openContactCard={props.openContactCard}
                    rmItem={props.rmItem}
                    openForm={props.openForm}
                    toggleMarkedItem={props.toggleMarkedItem}
                    handlerClickCheckbox={handlerClickCheckbox} />
            </div>
        );
    }

    return (
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
    );
};

ContactsList.propTypes = {
    openContactCard: PropTypes.func.isRequired,
    rmItem: PropTypes.func.isRequired,
    openForm: PropTypes.func.isRequired,
    toggleMarkedItem: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ContactsList;
