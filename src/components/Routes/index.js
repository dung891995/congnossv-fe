import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      <Component {...props} />
    )} />
  );
};

export const PrivateRoute = ({ component: Component, ...rest }) => {
  let accessToken = localStorage.getAccessToken()

  return (

    <Route
      {...rest}
      render={(props) => {
        let componentRender = <Component {...props} />;
        let user = localStorage.getObject('user')
        let loginCompoent = <Redirect
              to='/login'
            />
        let notActiveComponent = <Redirect
              to='/not-active'
            />
        let blockPageComponent = <Redirect
          to='/block-page'
        />
        //check login
        if (!accessToken) return loginCompoent
        if (user.status === 'inactive') return notActiveComponent
        if (user.status === 'block') return blockPageComponent
        switch(rest.routeRole){
          case 'admin':
            if(user.role === 'admin'){
              return componentRender
            }else{
              return loginCompoent
            }
          case 'teacher':
            if(user.role === 'teacher' || user.role === 'admin'){
              return componentRender
            }else{
              return loginCompoent
            }
          default :
            if(user.role === 'user' || user.role === 'teacher' || user.role === 'admin'){
              return componentRender
            }else{
              return loginCompoent
            }
        }

      }}
    />
  )
}