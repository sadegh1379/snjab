import React, { Component } from "react";
import { ChatItem } from "react-chat-elements";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
import person from "../../../assets/images/person.png";
class Users_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: false
    };
  }
  handlermessage = (id) => {
    this.setState({ message: true });
   
  };
  render() {
    return (
      <>

        <ChatItem
          avatar={person}
          id={1}
          alt={"Reactjs"}
          title={"فرزاد ریانی"}
          subtitle={"مدیر عامل بیمارستان"}
          date={new Date()}
          unread={0}
          onClick={(id)=>this.handlermessage(id)}
        />
  
        <ChatItem
         id={2}
          avatar={person}
          title={"فرزاد ریانی"}
          subtitle={"مدیر عامل بیمارستان"}
          date={new Date()}
          unread={0}
        />
        <ChatItem
          avatar={person}
          id={3}
          alt={"Reactjs"}
          title={"فرزاد ریانی"}
          subtitle={"مدیر عامل بیمارستان"}
          date={new Date()}
          unread={0}
        />
     
      </>
    );
  }
}
export const Users = connect(state => ({
  globalStorage: state.globalStorage
}))(Users_);
