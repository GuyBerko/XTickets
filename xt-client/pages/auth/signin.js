import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signin = ({ }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [onSignin, errors] = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  return (
    <form onSubmit={ e => { e.preventDefault(); onSignin() } }>
      <h1>signin</h1>
      <div className="form-group">
        <label>Email:</label>
        <input value={ email } onChange={ e => setEmail(e.target.value) } className="form-control" type="email" />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input value={ password } onChange={ e => setPassword(e.target.value) } className="form-control" type="password" />
      </div>
      { errors }
      <button className="btn btn-primary" type="submit">Sign In</button>
    </form>
  );
};

signin.propTypes = {

};

export default signin;
