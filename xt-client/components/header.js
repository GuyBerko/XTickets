import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import PreLoginNavbar from './pre-login-navbar';
import PostLoginNavbar from './post-login-navbar';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav } from 'reactstrap';
import styles from '../styles/NavBar.module.scss';
import Image from 'next/image'

const Header = ({ currentUser }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarToggler onClick={ toggleNavbar } className="mr-2" />
        <NavbarBrand href="/" className="ml-auto">
          <Image
            src="https://storage.googleapis.com/xtickets/assets/logo-black.png"
            width="140px"
            height="33px"
          />
        </NavbarBrand>
        <Collapse isOpen={ collapsed } navbar>
          <Nav className="ml-auto" navbar>
            { currentUser ?
              <PostLoginNavbar currentUser={ currentUser } /> :
              <PreLoginNavbar />
            }
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

Header.propTypes = {
  currentUser: PropTypes.object
};

export default Header;
