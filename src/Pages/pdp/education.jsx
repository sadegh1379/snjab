import React, { Component } from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import {Dashboard, Checking, Archive, Supervisor} from ".";
import {Proceedings} from './Supervisor/';

export  class Education extends React.Component{

    render(){
        return(
          <>
              <Route path="/pdp/dashboard" component={Dashboard} exact={true}/>
              <Route path="/pdp/supervisor" component={Supervisor} exact={true}/>             
              <Route path="/pdp/supervisor/proceedings" component={Proceedings} exact={true}/>              
              <Route path="/pdp/checking" component={Checking} exact={true}/>
              <Route path="/pdp/checking/archives" component={Archive} exact={true}/>
          </>
            )
    }
}
