import React from 'react';
import PropTypes from 'prop-types';

const OrdersList = ({ orders }) => {
  return (
    <>
      <Head>
        <title>XTickets - My Orders</title>
      </Head>
      <ul>
        { orders.map(order => (
          <li key={ order.id }>{ order.ticket.title } - { order.status }</li>
        )) }
      </ul>
    </>
  )
}

OrdersList.propTypes = {
  orders: PropTypes.array
}

OrdersList.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrdersList;
