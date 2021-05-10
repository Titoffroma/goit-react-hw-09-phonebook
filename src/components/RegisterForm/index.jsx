import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StyledLink from '../LoginForm/styledLoginForm';
import Button from '../Button/ButtonStyled';
import { Label, FormButton } from '../Form/FormStyled';
import { BASE_URL } from '../../API/index';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const clearMessage = () => {
    setTimeout(() => {
      dispatch({ type: 'message/clear' });
    }, 3000);
  };

  const addMessage = ({ error, success }) => {
    clearMessage();

    dispatch({
      type: 'message/add',
      payload: {
        error: error || false,
        success: success || false,
      },
    });
  };

  const handleChangeName = e => {
    setName(e.target.value);
  };

  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };

  const handleChangePass = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      name,
      email,
      password,
    };
    const body = JSON.stringify(data);

    dispatch({ type: 'loading-state/set', payload: true });

    fetch(`${BASE_URL}users\/signup`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
      },
      body,
    })
      .then(responce => responce.json())
      .then(data => {
        if (data.message) addMessage({ error: data.message });
        else if (data.token) {
          dispatch({ type: 'auth-state/set', payload: data.token });
          dispatch({ type: 'user-data/set', payload: data.user });
        }
      })
      .catch(error => {
        addMessage({ error: error.message });
      })
      .finally(() => dispatch({ type: 'loading-state/set', payload: false }));
  };

  const isLoading = useSelector(({ contacts }) => contacts.isLoading);
  const disabled = { disabled: isLoading };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <Label>
          <strong>Name</strong>
          <br />
          <Button
            as="input"
            type="text"
            required
            id="name"
            value={name}
            onChange={handleChangeName}
          />
        </Label>
        <br />
        <Label>
          <strong>Email</strong>
          <br />
          <Button
            as="input"
            type="email"
            required
            id="email"
            value={email}
            onChange={handleChangeEmail}
          />
        </Label>
        <br />
        <Label>
          <strong>Pathword</strong>
          <br />
          <Button
            as="input"
            type="password"
            required
            id="password"
            value={password}
            onChange={handleChangePass}
          />
        </Label>
        <br />
        <FormButton {...disabled}>Register</FormButton>
        <StyledLink to="/login">Login</StyledLink>
      </form>
    </div>
  );
};

export default RegisterForm;
