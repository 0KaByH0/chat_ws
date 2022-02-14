import React from 'react';
import { getIsConnected } from '../../redux/selectors/selectors';
import { useAppSelector } from '../../redux/utils';
import { Display } from '../Display/Display';
import { Login } from '../Login/Login';

export const AppComponent = () => {
  const isConnected = useAppSelector(getIsConnected);
  const [userName, setUserName] = React.useState('');

  return (
    <div className="main-wrapper">
      <Login userName={userName} setUserName={setUserName} />
      {isConnected && <Display />}
    </div>
  );
};
