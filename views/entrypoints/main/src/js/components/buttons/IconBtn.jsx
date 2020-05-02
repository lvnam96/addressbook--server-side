import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const IconBtn = (props) => {
  // const children = React.cloneElement(props.children, {});
  const { children, href, ...htmlAttrs } = props;
  htmlAttrs.className = classNames('btn icon-btn', htmlAttrs.className);
  if (typeof href === 'string' && href) {
    return (
      <a {...htmlAttrs} href={href}>
        {children}
      </a>
    );
  } else {
    return <button {...htmlAttrs}>{children}</button>;
  }
};
IconBtn.propTypes = {
  children: PropTypes.element.isRequired, // usually a font-awesome icon diplayed by a <i /> tag
  href: PropTypes.string,
};

export default memo(IconBtn);
