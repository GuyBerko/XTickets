import React from 'react';
import PropTypes from 'prop-types';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketInfo = ({ ticket }) => {
  const [purchaseTicket, errors] = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push(
      '/orders/[orderId]',
      `/orders/${order.id}`
    )
  });

  return (
    <div>
      <h1>{ ticket.title }</h1>
      <h4>Price: { ticket.price } $</h4>
      { errors }
      <button className="btn btn-primary" onClick={ () => purchaseTicket() }>Purchase</button>
    </div>
  )
}

TicketInfo.propTypes = {

}

TicketInfo.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketInfo
