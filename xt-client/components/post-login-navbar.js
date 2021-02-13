import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { postLoginMenu } from '../utils/menu';
import useRequest from '../hooks/use-request';
import MenuItem from './menu-item';

const PostLoginNavbar = () => {
  const [onLogout] = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  return (
    <ul className="nav d-flex align-items-center">
      { postLoginMenu.map((item, index) => (
        <MenuItem item={ item } key={ `menu-item-${index}` } />
      )) }
      <li className="nav-item active">
        <button className="btn btn-link" onClick={ () => onLogout() }>Log Out</button>
      </li>
    </ul>
  )
}

PostLoginNavbar.propTypes = {
}

export default PostLoginNavbar;
