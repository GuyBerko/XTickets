import React, { useState } from 'react';
import useRequest from '../../hooks/use-request';
import classNames from 'classnames';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [createTicket, errors] = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  })

  const onPriceBlur = () => {
    let value = parseFloat(price);

    if (isNaN(value) || value <= 0) {
      setPriceError('Price is invalid');
      return;
    }

    setPriceError('');
    setPrice(value.toFixed(2));
  }

  const onPriceChange = (e) => {
    let value = parseFloat(e.target.value);
    let priceError = '';

    if (isNaN(value)) {
      priceError = 'Price must be valid number';
      value = '';
    }

    if (value <= 0) {
      priceError = 'Price must be greater then zero';
    }

    setPriceError(priceError);
    setPrice(value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    createTicket();
  };

  const priceCX = classNames({
    'form-control': true,
    'is-invalid': price && !!priceError,
    'is-valid': price && !priceError,
  });

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={ onSubmit }>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" value={ title } onChange={ e => setTitle(e.target.value) } />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input className={ priceCX } type="number" value={ price } onChange={ onPriceChange } onBlur={ onPriceBlur } />
          { priceError && (
            <div className="invalid-feedback">
              { priceError }
            </div>
          ) }
        </div>
        { errors }
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket;
