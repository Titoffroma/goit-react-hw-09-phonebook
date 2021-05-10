import { useSelector, useDispatch } from 'react-redux';
import Button from '../Button/ButtonStyled';
import { BASE_URL } from '../../API';
import { getToken } from '../../redux/contacts-selectors';

const UserMenu = () => {
  const dispatch = useDispatch();

  const handleClick = e => {
    dispatch({ type: 'loading-state/set', payload: true });

    const headers = new Headers({
      accept: 'application/json',
      authorization: 'Bearer ' + token,
    });

    const request = new Request(`${BASE_URL}users\/logout`, {
      method: 'POST',
      headers,
    });

    fetch(request).then(response => {
      if (response.ok) dispatch({ type: 'auth-state/set', payload: false });
      dispatch({ type: 'loading-state/set', payload: false });
    });
  };

  const user = useSelector(({ user }) => user.user);
  const isLoading = useSelector(({ contacts }) => contacts.isLoading);
  const token = useSelector(({ user }) => getToken(user));

  const userMail = user ? user.email : '';
  const disabled = { disabled: isLoading };

  return (
    token && (
      <div>
        <Button
          as="input"
          disabled
          value={userMail}
          style={{ border: 'none' }}
        />
        <Button {...disabled} onClick={handleClick}>
          Logout
        </Button>
      </div>
    )
  );
};

export default UserMenu;
