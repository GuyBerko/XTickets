import PropTypes from 'prop-types';
import Head from 'next/head'
import styles from '../styles/Home.module.scss';
import TicketsCarousel from '../components/tickets-carousel';

const Home = ({ tickets }) => {
  return (
    <div className={ styles.container }>
      <Head>
        <title>XTickets - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={ styles.main }>
        { Object.keys(tickets).map((category, index) => (
          <TicketsCarousel key={ `category-${index}` } tickets={ tickets[category] } category={ category } />
        )) }
      </main>
    </div>
  )
};

Home.propTypes = {
  tickets: PropTypes.object
}

Home.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Home;
