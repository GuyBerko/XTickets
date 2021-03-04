import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import styles from '../styles/Footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithubSquare } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className={ styles.Footer }>
      <Container>
        <Row className={ styles.Centerized }>
          <Col xs="1">
            <a href="https://www.linkedin.com/in/guy-berkovich-8a4892123/" target="_blank"><FontAwesomeIcon size="1x" icon={ faLinkedin } /></a>
          </Col>
          <Col xs="1">
            <a href="https://github.com/GuyBerko" target="_blank"><FontAwesomeIcon size="1x" icon={ faGithubSquare } /></a>
          </Col>
        </Row>
        <Row xs="1">
          <Col sm="12" md={ { size: 6, offset: 3 } }>
            <span>&copy; 2020 - { new Date().getFullYear() } <a className={ styles.Link } href="mailto:mailofguy@gmail.com">Guy Berkovich</a>. All rights reserved.</span>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer;
