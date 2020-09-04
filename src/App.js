import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './components/Routes';
import NotFound from './components/NotFound';
import LoginPage from './views/Login/Login';
// import HomePage from './components/BaseLayout/BaseLayout';
import CartPage from './views/Cart/Cart';
import UserPage from './views/User/User';
import AgencyPage from './views/Agency/Agency';
import configLocalStorage from './utils/storage';
configLocalStorage();

export default function App() {
  return (
    <Router>
      <Switch>
       <Redirect exact from="/" to="cart" />
       <PublicRoute exact={true} path="/login" component={LoginPage} />
       <PrivateRoute exact={true} path="/cart" component={CartPage} />
       <PrivateRoute exact={true} path="/user" component={UserPage} />
       <PrivateRoute exact={true} path="/agency" component={AgencyPage} />
       <PrivateRoute exact={true} path="/*" component={NotFound} />
      </Switch>
    </Router>
  );
}
