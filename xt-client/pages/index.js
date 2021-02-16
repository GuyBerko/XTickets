import Head from 'next/head'
import styles from '../styles/Home.module.css';
import TicketsCarousel from '../components/tickets-carousel';

const Home = ({ tickets }) => {
  return (
    <div className={ styles.container }>
      <Head>
        <title>XTickets - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={ styles.main }>
        <TicketsCarousel tickets={ tickets } category="Concerts" />
      </main>
    </div>
  )
};

Home.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Home;
