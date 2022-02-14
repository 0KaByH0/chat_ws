import React from 'react';
import { Provider } from 'react-redux';
import { AppComponent } from './components/AppComponent/AppComponent';
import { store } from './redux/store';
import './styles.scss';

function App() {
  return (
    <>
      <Provider store={store}>
        <AppComponent />
      </Provider>
    </>
  );
}

export default App;
