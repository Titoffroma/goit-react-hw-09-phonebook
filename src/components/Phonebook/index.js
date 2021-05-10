import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { addContact, removeContact } from '../../redux/actions';
import {
  getContactsList,
  getContactsFilter,
  getMessage,
  getToken,
} from '../../redux/contacts-selectors';
import { BASE_URL } from '../../API/index';
import PhonebookCard from '../PhonebookCard/PhonebookCardStyled';
import Section from '../Section';
import Form from '../Form';
import ContactsList from '../ContactsList';
import Button from '../Button/ButtonStyled';
import Title from '../Title';
import ErrorNote from '../ErrorNote';
import './phonebook.css';

const Phonebook = () => {
  const [isMessage, setMessage] = useState(false);

  const dispatch = useDispatch();

  const contacts = useSelector(({ contacts }) => getContactsList(contacts));
  const filter = useSelector(({ contacts }) => getContactsFilter(contacts));
  const { error, success } = useSelector(({ contacts }) =>
    getMessage(contacts),
  );
  const token = useSelector(({ user }) => getToken(user));

  const clearMessage = () => {
    setMessage(true);
    setTimeout(() => {
      dispatch({ type: 'message/clear' });
      setMessage(false);
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

  const handleSubmit = e => {
    e.preventDefault();
    const duplicate = contacts.find(
      contact => contact.name === e.target.elements[0].value,
    );

    if (duplicate) {
      return addMessage({
        error: `${duplicate.name} is already in contacts`,
      });
    }

    const name = e.target.elements[0].value;
    const number = e.target.elements[1].value;
    const contact = { name, number };
    dispatch(addContact(contact, token));
  };

  const handleChangeFilter = e => {
    dispatch({ type: 'contact/filter', payload: e.target.value });
  };

  const handleRemoveContact = e => {
    const id = e.target.dataset.id;
    dispatch(removeContact(id, token));
  };

  useEffect(() => {
    dispatch({ type: 'loading-state/set', payload: true });

    fetch(`${BASE_URL}contacts`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
      .then(responce => responce.json())
      .then(data => {
        if (data.message) addMessage({ error: data.message });
        else dispatch({ type: 'contacts/fetch', payload: data });
      })
      .catch(error => {
        addMessage({ error: error.message });
      })
      .finally(() => dispatch({ type: 'loading-state/set', payload: false }));
  }, []);

  useEffect(() => {
    if (error || success) !isMessage && clearMessage();
  }, [error, success]);

  const search = contacts.length > 1;

  const ref = useRef(null);
  const errorRef = useRef(null);
  const messageText = error || success;

  return (
    <>
      <CSSTransition
        in={!!messageText}
        nodeRef={errorRef}
        timeout={500}
        classNames="error"
        unmountOnExit
      >
        <div ref={errorRef} className="error-wrapper">
          <ErrorNote>{messageText}</ErrorNote>
        </div>
      </CSSTransition>
      <PhonebookCard>
        <Section title="Phonebook">
          <Form handleSubmit={handleSubmit} />
        </Section>
        <Section title="Contacts">
          <CSSTransition
            in={search}
            nodeRef={ref}
            timeout={750}
            classNames="slide"
            unmountOnExit
          >
            <div ref={ref}>
              <Title
                as="h3"
                title="Find contacts by name"
                fontSize="16"
                textAlign="left"
              />
              <Button
                as="input"
                type="text"
                id="filter"
                onChange={handleChangeFilter}
                value={filter}
              />
            </div>
          </CSSTransition>
          <ContactsList
            contactsList={contacts}
            filter={filter}
            handleRemoveContact={handleRemoveContact}
          />
        </Section>
      </PhonebookCard>
    </>
  );
};

export default Phonebook;
