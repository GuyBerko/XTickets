import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Auth = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [onSignin, errors] = useRequest({
    url: `/api/users/${type}`,
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const submitText = type === 'signin' ? 'Sign In' : 'Sign Up';

  return (
    <>
      <Head>
        <title>XTickets - { type.charAt(0).toUpperCase() + type.substring(1) }</title>
      </Head>
      <form onSubmit={ e => { e.preventDefault(); onSignin() } }>
        <h1>{ type }</h1>
        <div className="form-group">
          <label>Email:</label>
          <input value={ email } onChange={ e => setEmail(e.target.value) } className="form-control" type="email" />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input value={ password } onChange={ e => setPassword(e.target.value) } className="form-control" type="password" />
        </div>
        { errors }
        <button className="btn btn-primary" type="submit">{ submitText }</button>
      </form>
    </>
  );
};

Auth.propTypes = {
  type: PropTypes.string
};

Auth.getInitialProps = async (context, client) => {
  const { type } = context.query;

  return { type };
};

export default Auth;
