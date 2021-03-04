import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import styles from '../../styles/Auth.module.scss';
import FloatingLabelInput from '../../components/floating-label-input';
import Validators from '../../utils/validators';
import { Button, Form } from 'reactstrap';
import params from '../../constants/auth.json';

const Auth = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailValidation, setEmailValidation] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [nameValidation, setNameValidation] = useState(null);
  const [onAuth, errors] = useRequest({
    url: `/api/users/${type}`,
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  if (!params[type]) {
    throw new Error('Not Found');
  }

  const onChange = (e) => {
    const value = e.target.value;
    const type = e.target.name;

    switch (type) {
      case 'email': {
        setEmail(value);
        if (emailValidation !== null) {
          setEmailValidation(Validators.email(value));
        }
        break;
      }
      case 'name': {
        setName(value);
        if (nameValidation !== null) {
          setNameValidation(Validators.name(value));
        }
        break;
      }
      case 'password': {
        setPassword(value);
        if (passwordValidation !== null) {
          setPasswordValidation(Validators.password(value));
        }
        break;
      }
      default:
        break;
    }
  };

  const onBlur = (e) => {
    const value = e.target.value;
    const type = e.target.name;

    validateField(type, value);
  };

  const validateField = (type, value) => {
    switch (type) {
      case 'email': {
        const valid = Validators.email(value);
        setEmailValidation(valid);
        return valid;
      }
      case 'name': {
        const valid = Validators.name(value);
        setNameValidation(valid);
        return valid;
      }
      case 'password': {
        const valid = Validators.password(value);
        setPasswordValidation(valid);
        return valid;
      }
      default:
        return true;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let formParams = {};

    params[type].fields.forEach(field => {
      if (!validateField(field.name, values[field.name].value)) {
        valid = false;
      }
      formParams[field.name] = values[field.name].value;
    });

    if (!valid) {
      return;
    }

    onAuth(formParams);
  };

  const values = {
    email: {
      value: email,
      valid: emailValidation
    },
    password: {
      value: password,
      valid: passwordValidation
    },
    name: {
      value: name,
      valid: nameValidation
    }
  };

  return (
    <div className={ styles.Wrapper }>
      <Head>
        <title>XTickets - { params[type].title }</title>
      </Head>
      <Form onSubmit={ onSubmit }>
        <h1>{ params[type].title }</h1>
        { params[type].fields.map(field => (
          <FloatingLabelInput
            key={ field.id }
            onChange={ onChange }
            onBlur={ onBlur }
            valid={ values[field.name].valid }
            value={ values[field.name].value }
            { ...field } />
        )) }
        { errors }
        <Button className={ styles.SubmitButton } size="lg" color="primary" type="submit">{ params[type].submitText }</Button>
      </Form>
    </div>
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
