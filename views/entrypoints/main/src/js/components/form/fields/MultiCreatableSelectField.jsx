import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

class CreatableMulti extends React.Component {
  constructor (props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  static get propTypes () {
    return {
      id: PropTypes.string,
      handleChange: PropTypes.func.isRequired,
      onBlur: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(PropTypes.object),
      defaultValue: PropTypes.arrayOf(PropTypes.object),
      name: PropTypes.string.isRequired,
    };
  }

  onChange (newValue, actionMeta) {
    // console.group('Value Changed');
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`, actionMeta);
    // console.groupEnd();

    this.props.handleChange(newValue);
  }

  render () {
    return (
      <CreatableSelect
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderRadius: '.7rem',
          }),
        }}
        id={this.props.id}
        className={this.props.className}
        name={this.props.name}
        isMulti
        onChange={this.onChange}
        onBlur={this.props.onBlur}
        options={this.props.options}
        defaultValue={this.props.defaultValue}
      />
    );
  }
}

export default CreatableMulti;
