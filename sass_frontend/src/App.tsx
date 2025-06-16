import React from 'react';
import {router} from './routes/routes';
import {store} from './features/store';
import { Provider } from 'react-redux';
import {  RouterProvider, createBrowserRouter as Router} from 'react-router-dom';

const appRouter = Router(router);

function App() {

  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  )
}

export default App;
