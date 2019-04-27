import React from 'react';
import PropTypes from 'prop-types';
import { WindowScroller, AutoSizer, List } from 'react-virtualized';

import ContactItemContainer from './containers/ContactItemContainer';
import Contact from '../../classes/Contact';// SHOULD THIS COMPONENT KNOW ABOUT THE EXISTING OF MY CLASSES???

const MainList = props => {
    function rowRenderer ({
        index,
        isScrolling,
        isVisible,
        key,
        parent,
        style
    }) {
        const contactData = props.data[index],
            contact = new Contact(contactData),

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

MainList.propTypes = {
    openContactCard: PropTypes.func.isRequired,
    rmItem: PropTypes.func.isRequired,
    openForm: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    toggleMarkedItem: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default MainList;
