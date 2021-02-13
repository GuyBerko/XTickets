import Head from 'next/head'
import styles from '../styles/Home.module.css';
import TicketsList from '../components/tickets-list';

const Home = ({ currentUser, tickets }) => {
  return (
    <div className={ styles.container }>
      <Head>
        <title>XTickets - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={ styles.main }>
        <TicketsList tickets={ tickets } />
      </main>

      <footer className={ styles.footer }>
      </footer>
    </div>
  )
};

Home.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Home;
