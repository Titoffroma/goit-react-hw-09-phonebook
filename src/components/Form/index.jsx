import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../Button/ButtonStyled';
import { Label, FormButton } from './FormStyled';

const Form = ({ handleSubmit }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const isLoading = useSelector(({ contacts }) => contacts.isLoading);

  const clearValue = e => {
    setName('');
    setNumber('');
    handleSubmit(e);
  };

  const handleChangeName = e => {
    setName(e.target.value);
  };

  const handleChangeNumber = e => {
    setNumber(e.target.value);
  };

  const handleAwait = el => {
    el.setAttribute('disabled', '');
  };

  const disabled = { disabled: isLoading };

  return (
    <form onSubmit={clearValue}>
      <Label>
        <strong>Name</strong>
        <br />
        <Button
          as="input"
          type="text"
          required
          id="name"
          value={name}
          {...disabled}
          onChange={handleChangeName}
        />
      </Label>
      <br />
      <Label>
        <strong>Number</strong>
        <br />
        <Button
          as="input"
          type="tel"
          required
          id="number"
          value={number}
          {...disabled}
          onChange={handleChangeNumber}
        />
      </Label>
      <br />
      <FormButton {...disabled}>Add contact</FormButton>
    </form>
  );
};

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default Form;
