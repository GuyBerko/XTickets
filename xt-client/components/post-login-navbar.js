import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { postLoginMenu } from '../utils/menu';
import useRequest from '../hooks/use-request';
import MenuItem from './menu-item';
import styles from '../styles/NavBar.module.scss';
import { NavItem } from 'reactstrap';

const PostLoginNavbar = () => {
  const [onLogout] = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  return (
    <>
      { postLoginMenu.map((item, index) => (
        <NavItem className={ styles.NavItem } key={ `menu-item-${index}` } >
          <MenuItem item={ item } />
        </NavItem>
      )) }
      <NavItem className={ styles.NavItem }>
        <a href="#" className="nav-link" onClick={ () => onLogout() }>Log Out</a>
      </NavItem>
    </>
  )
}

PostLoginNavbar.propTypes = {
}

export default PostLoginNavbar;
