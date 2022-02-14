import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas/sagas';
import { chatSliceReducer } from './slices/chat';

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

export const store = configureStore({
  reducer: chatSliceReducer,
  middleware,
});

sagaMiddleware.run(rootSaga);
