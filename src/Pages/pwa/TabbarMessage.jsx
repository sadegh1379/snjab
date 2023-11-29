import React, { Component } from "react";
import { connect } from "react-redux";
import additional from "../../assets/images/additinalicon.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Chat } from './Chat';
export class TabbarMessage_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendMessage:false
    };
  }
  render() {
    return (
 
      <div className="navbar navbar-expand-sm bg-light  navbarstyletabbar">
    
      </div>

      
    
  
    );
  }
}

export const TabbarMessage = connect(state => ({
  globalStorage: state.globalStorage
}))(TabbarMessage_);
