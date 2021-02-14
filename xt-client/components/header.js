import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import PreLoginNavbar from './pre-login-navbar';
import PostLoginNavbar from './post-login-navbar';

const Header = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Home</a>
      </Link>
      { currentUser &&
        <div className="d-flex justify-content-center">
          <span className="navbar-text">
            Hello { currentUser.email }
          </span>
        </div> }
      <div className="d-flex justify-content-end">
        { currentUser ?
          <PostLoginNavbar currentUser={ currentUser } /> :
          <PreLoginNavbar />
        }
      </div>
    </nav>
  )
}

Header.propTypes = {
  currentUser: PropTypes.object
};

export default Header;
