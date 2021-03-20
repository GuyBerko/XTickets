import React from 'react';
import Head from 'next/head'
import PropTypes from 'prop-types';
import { Container, Row, Col, Table } from 'reactstrap';
import styles from '../../styles/OrdersList.module.scss';
import Link from 'next/link';

const OrdersList = ({ orders }) => {
  const getDate = (date) => (new Date(date).toDateString());

  const getExpiresAt = (date, status) => {
    if (status === 'cancelled' || status === 'complete') {
      return '-';
    }

    const distance = new Date(date) - new Date();
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0) {
      return '-';
    }

    return `${minutes}:${seconds} minutes`;
  }

  const getLink = (order, index) => (
    <Link href="/orders/[orderId]" as={ `/orders/${order.id}` }><a>{ index }</a></Link>
  );

  const getStatus = (status) => {
    switch (status) {
      case 'created': {
        return 'Created';
      }
      case 'awaiting:payment': {
        return 'Awaiting Payment';
      }
      case 'cancelled': {
        return 'Cancelled';
      }
      case 'complete': {
        return 'Complete';
      }
      default: {
        return '-';
      }
    }
  }

  return (
    <>
      <Head>
        <title>XTickets - My Orders</title>
      </Head>
      <Container>
        <div className={ styles.Wrapper }>
          <Row>
            <Col sm="auto">
              <Table striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event Name</th>
                    <th>Event Date</th>
                    <th>Order Date</th>
                    <th>Order Expires At</th>
                    <th>Order Status</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  { orders.map((order, index) => (
                    <tr key={ `order-${index}` }>
                      <th scope="row">{ getLink(order, index + 1) }</th>
                      <td>{ order.ticket.title }</td>
                      <td>{ getDate(order.ticket.date) }</td>
                      <td>{ getDate(order.createdAt) }</td>
                      <td>{ getExpiresAt(order.expiresAt, order.status) }</td>
                      <td>{ getStatus(order.status) }</td>
                      <td>{ order.quantity }</td>
                      <td>{ order.ticket.price } $</td>
                      <td>{ (order.ticket.price * order.quantity).toFixed(2) } $</td>
                    </tr>
                  )) }
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Container>
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
