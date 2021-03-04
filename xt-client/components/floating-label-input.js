import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/FloatingLabel.module.scss';
import { Input, Label } from 'reactstrap';

const FloatingLabelInput = ({ type, id, placeholder, label, onChange, onBlur, name, value, valid, options = [] }) => {
  return (
    <div className={ styles.Wrapper }>
      <Input
        className={ styles.Input }
        type={ type || "text" }
        onBlur={ onBlur }
        name={ name }
        id={ id }
        placeholder={ placeholder }
        onChange={ onChange }
        valid={ valid }
        invalid={ valid !== null && !valid }
        value={ value }
        children={ type === 'select' ? options.map((option, i) => (<option key={ `${id}-option-${i}` } value={ option.value }>{ option.label }</option>)) : null }
      />
      <Label className={ styles.Label } for={ id }>{ label }</Label>
    </div>
  )
}

FloatingLabelInput.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onBlur: PropTypes.func,
  name: PropTypes.string,
  options: PropTypes.array
}

export default FloatingLabelInput
