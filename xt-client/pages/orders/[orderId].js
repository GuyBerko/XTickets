import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

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

      //const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      //const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
  }, []);

  const onPurchase = (token) => {
    createPayment({ token: token.id });
  };

  if (!timeLeft) {
    return <div className="alert alert-danger" role="alert">Order is EXPIRED</div>
  }

  return (
    <div>
      <StripeCheckout
        token={ onPurchase }
        stripeKey="pk_test_51IIfQXGp7Ot0L3hwbJxwG41dQAatQWDzM5rpygpCjUCmLDWs7u4HWv7rK770Fjn0sjp4BJ160l8kyrov2s22fXfT00Vj3VzPxm"
        amount={ order.ticket.price * 100 }
        email={ currentUser.email }
      />
      { timeLeft }
    </div>
  )
}

OrderInfo.propTypes = {

}

OrderInfo.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderInfo
