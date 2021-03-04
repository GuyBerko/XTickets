import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import { Container, Row, Col } from 'reactstrap';
import styles from '../../styles/TicketInfo.module.scss';
import QuantityInput from '../../components/quantity-input';
import Head from 'next/head';

const TicketInfo = ({ ticket }) => {
  const [quantity, setQuantity] = useState(1);
  const [purchaseTicket, errors] = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
      quantity
    },
    onSuccess: (order) => Router.push(
      '/orders/[orderId]',
      `/orders/${order.id}`
    )
  });

  if (!ticket.id) {
    return <div>Ticket not found</div>;
  }

  const onQuantityChange = (type) => {
    switch (type) {
      case 'incer':
        setQuantity(quantity + 1);
        break;
      case 'decre':
        if (quantity - 1 <= 0) return;
        setQuantity(quantity - 1);
        break;
      default:
        console.log(`[onQuantityChange] - type: ${type} is not supported`);
        break;
    }
  }

  return (
    <>
      <Head>
        <title>XTickets - Ticket Info</title>
      </Head>
      <Container fluid="lg" className={ styles.Wrapper }>
        <Row>
          <Col className={ styles.TicketInfoCol }>
            <Row>
              <Col>{ ticket.title }</Col>
            </Row>
            <Row>
              <Col>{ ticket.description }</Col>
            </Row>
            <Row>
              <Col xs="auto">{ new Date(ticket.date).toDateString() } - </Col>
              <Col xs="auto">{ ticket.price } $</Col>
            </Row>
            <Row>
              <Col><QuantityInput value={ quantity } onChange={ onQuantityChange } /></Col>
            </Row>
            <Row>
              <Col>
                { errors }
                <button className="btn btn-primary" onClick={ () => purchaseTicket() }>Purchase</button>
              </Col>
            </Row>
          </Col>
          <Col>
            <img className={ styles.Image } src="https://media.stubhubstatic.com/stubhub-catalog/d_defaultLogo.jpg/t_f-fs-0fv,q_auto:low,f_auto,c_fill,$w_218_mul_3,$h_172_mul_3/performer/188486/1862a0d035db8349f62a7de21cea5872" />
          </Col>
        </Row>
      </Container>
    </>
  )
}

TicketInfo.propTypes = {
  ticket: PropTypes.object
}

TicketInfo.getInitialProps = async (context, client) => {
  try {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
  }
  catch (err) {
    return { ticket: {} };
  }
};

export default TicketInfo
