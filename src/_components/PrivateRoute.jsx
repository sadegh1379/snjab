import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import localstorageTTL from 'localstorage-ttl';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localstorageTTL.get('globalStorage')
            ? <Component {...props} />
            : <Redirect to={{ pathname: rest.path.indexOf('pwa')>=0?'/pwa/login':'/login', state: { from: props.location } }} />
    )} />
)