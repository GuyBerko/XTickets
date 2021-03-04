import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Input } from 'reactstrap';
import styles from '../styles/QuantityInput.module.scss';

const QuantityInput = ({ value, onChange }) => {
  return (
    <div>
      <Row>
        <Col className={ styles.Col } xs="auto">
          <Button color="primary" className={ [styles.Button, styles.Left, 'shadow-none'].join(' ') } onClick={ onChange.bind(this, 'decre') }>-</Button>
        </Col>
        <Col className={ styles.Col } xs="auto">
          <Input className={ styles.Input } type="text" disabled value={ value } />
        </Col>
        <Col className={ styles.Col } xs="auto">
          <Button color="primary" className={ [styles.Button, styles.Right, 'shadow-none'].join(' ') } onClick={ onChange.bind(this, 'incer') }>+</Button>
        </Col>
      </Row>
    </div>
  )
}

QuantityInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired
}

export default QuantityInput;
