import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';

class CreatableMulti extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  static get propTypes() {
    return {
      id: PropTypes.string,
      onChange: PropTypes.func.isRequired,
      onBlur: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(PropTypes.object),
      defaultValue: PropTypes.arrayOf(PropTypes.object),
      name: PropTypes.string.isRequired,
      className: PropTypes.string,
    };
  }

  handleChange(newValue, actionMeta) {
    // console.group('Value Changed');
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`, actionMeta);
    // console.groupEnd();

    this.props.onChange(newValue);
  }

  render() {
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
        onChange={this.handleChange}
        onBlur={this.props.onBlur}
        options={this.props.options}
        defaultValue={this.props.defaultValue}
      />
    );
  }
}

export default CreatableMulti;
