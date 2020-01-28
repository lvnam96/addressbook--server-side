import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class IconBtn extends React.PureComponent {
  static get propTypes () {
    return {
      htmlTag: PropTypes.string,
      href: PropTypes.string,
    };
  }

  render () {
    // const children = React.cloneElement(this.props.children, {});
    const elemProps = { ...this.props };
    // delete elemProps.children;
    delete elemProps.htmlTag;
    delete elemProps.href;
    switch (this.props.htmlTag) {
    case 'a':
      return <a {...elemProps} href={this.props.href} className={classNames('btn icon-btn', elemProps.className)} />;
    default:
      return <button {...elemProps} className={classNames('btn icon-btn', elemProps.className)} />;
    }
  }
}

export default IconBtn;
