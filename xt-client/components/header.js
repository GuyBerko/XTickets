import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PreLoginNavbar from './pre-login-navbar';
import PostLoginNavbar from './post-login-navbar';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import styles from '../styles/NavBar.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Header = ({ currentUser }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div>
      <Navbar color="light" light className={ styles.NavBarWrapper } expand="md">
        <NavbarBrand href="/">
          <FontAwesomeIcon className={ styles.HomeIcon } icon={ faHome } />
        </NavbarBrand>
        <NavbarBrand className={ styles.NavBrand } href="/">
          <Image
            src="https://storage.googleapis.com/xtickets/assets/logo-black.png"
            width="140px"
            height="33px"
          />
        </NavbarBrand>
        <NavbarToggler onClick={ toggleNavbar } className="mr-2" />
        <Collapse isOpen={ collapsed } className={ styles.Collapse } navbar>
          <Nav navbar>
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
