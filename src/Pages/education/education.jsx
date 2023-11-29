import React, { Component } from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import Dashboard from "./dashboard";
 class Education extends React.Component{

    render(){
        return(
          <>
                    <Route path="/education/dashboard" component={Dashboard} exact={true}/>
          </>
            )
    }
}

export default Education