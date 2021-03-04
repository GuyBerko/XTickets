import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.css';
import styles from '../styles/App.module.scss';
import PropTypes from 'prop-types';
import buildClient from '../api/build-client';
import Header from '../components/header';
import Footer from '../components/footer';
import { Container } from 'reactstrap';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className={ styles.MainWrapper }>
      <Header currentUser={ currentUser } />
      <Container className={ styles.MainContainer }>
        <Component { ...pageProps } currentUser={ currentUser } />
      </Container>
      <Footer />
    </div>
  );
}

AppComponent.propTypes = {
  pageProps: PropTypes.object,
  currentUser: PropTypes.object
}

AppComponent.getInitialProps = async ({ ctx, Component }) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
