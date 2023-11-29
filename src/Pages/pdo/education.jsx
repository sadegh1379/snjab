import React, { Component } from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import {Dashboard} from ".";


export  class Education extends React.Component{

    render(){
        return(
          <>
              <Route path="/pdo/dashboard" component={Dashboard} exact={true}/>
          </>
            )
    }
}
