import React from 'react';
import PropTypes from 'prop-types';
import { preLoginMenu } from '../utils/menu';
import MenuItem from './menu-item';

const PreLoginNavbar = () => {
  return (
    <ul className="nav d-flex align-items-center">
      {preLoginMenu.map((item, index) => (
        <MenuItem item={ item } key={ `menu-item-${index}` } />
      )) }
    </ul>
  )
}

PreLoginNavbar.propTypes = {

}

export default PreLoginNavbar;
