import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import Head from 'next/head';
import Validators from '../../utils/validators';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import FloatingLabelInput from '../../components/floating-label-input';

import styles from '../../styles/NewTicket.module.scss';
import params from '../../constants/tickets.json';

const NewTicket = ({ categories }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState({});
  const [priceValidation, setPriceValidation] = useState(null);
  const [titleValidation, setTitleValidation] = useState(null);
  const [dateValidation, setDateValidation] = useState(null);
  const [createTicket, errors] = useRequest({
    url: '/api/tickets',
    method: 'post',
    useFormData: true,
    onSuccess: () => Router.push('/')
  });

  const onChange = (e) => {
    const value = e.target.value;
    const type = e.target.name;

    switch (type) {
      case 'title': {
        setTitle(value);
        if (titleValidation !== null) {
          setTitleValidation(Validators.title(value));
        }
        break;
      }
      case 'price': {
        setPrice(value);
        if (priceValidation !== null) {
          setPriceValidation(Validators.price(value));
        }
        break;
      }
      case 'category': {
        setCategory(value);
        break;
      }
      case 'description': {
        setDescription(value);
        break;
      }
      case 'date': {
        if (dateValidation !== null) {
          setDateValidation(new Date(value) > new Date());
        }
        setDate(value);
        break;
      }
      case 'image': {
        setImage(e.target.files[0]);
        break;
      }
      default:
        break;
    }
  }

  const onBlur = (e) => {
    const value = e.target.value;
    const type = e.target.name;

    if (type === 'price' && !isNaN(parseFloat(value))) {
      setPrice(parseFloat(value).toFixed(2));
      validateField(type, parseFloat(value).toFixed(2));
      return;
    }

    validateField(type, value);
  }

  const validateField = (type, value) => {
    switch (type) {
      case 'title': {
        const valid = Validators.title(value);
        setTitleValidation(valid);
        return valid;
      }
      case 'price': {
        const valid = Validators.price(value);
        setPriceValidation(valid);
        return valid;
      }
      case 'date': {
        const valid = new Date(value) > new Date();
        setDateValidation(valid);
        return valid;
      }
      default:
        return true;
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    const data = new FormData();

    params.fields.forEach(field => {
      if (!validateField(field.name, values[field.name].value)) {
        valid = false;
      } else {
        const value = field.type === 'date' ? new Date(values[field.name].value) : values[field.name].value;
        data.append(field.name, value);
      }
    });

    if (!valid) {
      return;
    }

    data.append('image', image);
    createTicket(data);
  };


  const values = {
    title: {
      value: title,
      valid: titleValidation
    },
    price: {
      value: price,
      valid: priceValidation
    },
    category: {
      value: category,
      valid: null
    },
    description: {
      value: description,
      valid: null
    },
    date: {
      value: date,
      valid: dateValidation
    }
  };

  // Add te categories from the backend to the category field
  if (params.fields[0].options.length === 1) {
    categories.forEach(category => {
      params.fields[0].options.push({
        label: category,
        value: category
      });
    });
  }

  return (
    <div className={ styles.Wrapper }>
      <Head>
        <title>XTickets - { params.title }</title>
      </Head>
      <Form onSubmit={ onSubmit }>
        <h1>{ params.title }</h1>
        { params.fields.map(field => (
          <FloatingLabelInput
            key={ field.id }
            onChange={ onChange }
            onBlur={ onBlur }
            valid={ values[field.name].valid }
            value={ values[field.name].value }
            { ...field } />
        )) }
        <FormGroup className={ styles.UploadWrapper }>
          <Label for="image">Event image</Label>
          <Input type="file" name="image" id="image" onChange={ onChange } />
        </FormGroup>
        { errors }
        <Button className={ styles.SubmitButton } size="lg" color="primary" type="submit">{ params.submitText }</Button>
      </Form>
    </div>
  )
}

NewTicket.propTypes = {
  categories: PropTypes.array
}

NewTicket.getInitialProps = async (context, client) => {
  let { data } = await client.get('/api/categories');

  return { categories: data };
};

export default NewTicket;
