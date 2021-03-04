import React from 'react';
import PropTypes from 'prop-types';
import { preLoginMenu } from '../utils/menu';
import MenuItem from './menu-item';
import { NavItem } from 'reactstrap';
import styles from '../styles/NavBar.module.scss';

const PreLoginNavbar = () => {
  return (
    preLoginMenu.map((item, index) => (
      <NavItem className={ styles.NavItem }>
        <MenuItem item={ item } key={ `menu-item-${index}` } />
      </NavItem>
    ))
  )
}




PreLoginNavbar.propTypes = {

}

export default PreLoginNavbar;
