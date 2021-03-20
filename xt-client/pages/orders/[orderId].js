import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head'
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import { Alert, Container, Row, Col, Table } from 'reactstrap';
import styles from '../../styles/OrderInfo.module.scss';

const OrderInfo = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [createPayment, errors] = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const distance = new Date(order.expiresAt) - new Date();
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('');
        return;
      }

      setTimeLeft(`Time left for purchase: ${minutes}:${seconds} minutes`);
    }

    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);

    return () => { clearInterval(timer); }
  }, []);

  const onPurchase = (token) => {
    createPayment({ token: token.id });
  };

  if (order.status === 'cancelled') {
    return <Alert color="dark">This order has been Cancelled!</Alert>
  }

  if (order.status === 'complete') {
    return <Alert color="success">This order has been Completed</Alert>
  }

  if (!timeLeft) {
    return <Alert color="danger">Order is EXPIRED</Alert>
  }

  return (
    <>
      <Head>
        <title>XTickets - Order Info</title>
      </Head>
      <Container>
        <div className={ styles.Wrapper }>
          <Row>
            <Alert color="info">{ timeLeft }</Alert>
          </Row>
          <Row className={ styles.PaymentRow }>
            <Col sm="auto">
              <Table bordered>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Event Name</th>
                    <th>Event Date</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>{ order.ticket.title }</td>
                    <td>{ new Date(order.ticket.date).toDateString() }</td>
                    <td>{ order.quantity }</td>
                    <td>{ order.ticket.price } $</td>
                    <td>{ (order.ticket.price * order.quantity).toFixed(2) } $</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col sm="auto">
              <StripeCheckout
                token={ onPurchase }
                stripeKey="pk_test_51IIfQXGp7Ot0L3hwbJxwG41dQAatQWDzM5rpygpCjUCmLDWs7u4HWv7rK770Fjn0sjp4BJ160l8kyrov2s22fXfT00Vj3VzPxm"
                amount={ (order.ticket.price * order.quantity).toFixed(2) * 100 }
                allowRememberMe
                email={ currentUser.email }
              />
            </Col>
          </Row>
        </div>
      </Container>
      {errors && (<Alert color="danger">{ errors }</Alert>) }
    </>
  )
}

OrderInfo.propTypes = {
  order: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
}

OrderInfo.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderInfo
