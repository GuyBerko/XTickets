import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signup = ({ }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [onSignup, errors] = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (e) => {
    e.preventDefault();
    onSignup();
  };

  return (
    <form onSubmit={ onSubmit }>
      <h1>signUp</h1>
      <div className="form-group">
        <label>Email:</label>
        <input value={ email } onChange={ e => setEmail(e.target.value) } className="form-control" type="email" />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input value={ password } onChange={ e => setPassword(e.target.value) } className="form-control" type="password" />
      </div>
      { errors }
      <button className="btn btn-primary" type="submit">Sign Up</button>
    </form>
  );
};

signup.propTypes = {

};

export default signup;
