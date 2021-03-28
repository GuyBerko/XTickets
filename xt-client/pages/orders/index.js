import React from 'react';
import Head from 'next/head'
import PropTypes from 'prop-types';
import { Container, Row, Col, Table, Card, Button, CardText, List, CardBody, CardHeader, CardFooter } from 'reactstrap';
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
              <h2>Orders:</h2>
              <Table striped className={ styles.OrderListTable }>
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
              <div className={ styles.OrderListCards }>
                {
                  orders.map((order, index) => (
                    <Card className={ styles.Card } key={ `order-card-${index}` }>
                      <CardHeader><b>Event Name:</b> { order.ticket.title }</CardHeader>
                      <CardBody>
                        <CardText>
                          <ul className={ styles.Ul }>
                            <li><b>Event Date:</b> { getDate(order.ticket.date) }</li>
                            <hr className={ styles.CardHr }></hr>
                            <li><b>Order Date:</b> { getDate(order.ticket.createdAt) }</li>
                            <hr className={ styles.CardHr }></hr>
                            <li><b>Order Expires At:</b> { getExpiresAt(order.expiresAt, order.status) }</li>
                            <hr className={ styles.CardHr }></hr>
                            <li><b>Order Status:</b> { getStatus(order.status) }</li>
                            <hr className={ styles.CardHr }></hr>
                            <li><b>Quantity:</b> { order.quantity }</li>
                            <hr className={ styles.CardHr }></hr>
                            <li><b>Price Per Ticket:</b> { order.ticket.price } $</li>
                            <hr className={ styles.CardHr }></hr>
                            <li><b>Total Price:</b> { (order.ticket.price * order.quantity).toFixed(2) } $</li>
                          </ul>
                        </CardText>
                      </CardBody>
                      <CardFooter>
                        <Button color="info">
                          <Link href="/orders/[orderId]" as={ `/orders/${order.id}` }><a>See order info</a></Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                }
              </div>
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
