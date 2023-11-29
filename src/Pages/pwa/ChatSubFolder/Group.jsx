import React, { Component } from "react";
import {  ChatList,ChatItem } from "react-chat-elements";
import { connect } from "react-redux";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import person from "../../../assets/images/person.png";
class Group_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: false
    };
  }
  handlermessage = id => {
    this.setState({ message: true });
  };
  render() {
    return (
        <div className="recent-chat w-100">
      <NavLink to="/pwa/chat/recent-chat/maessage">
          <ChatItem
            avatar={person}
            id={1}
            alt={"Reactjs"}
            title={"فرزاد ریانی"}
            subtitle={"نواآوران سلامت گستر شریف به عنوان یکی"}
            date={new Date()}
            unread={0}
        
          />
    </NavLink>
        <ChatItem
          id={2}
          avatar={person}
          alt={"Reactjs"}
          title={"فرزاد ریانی"}
          subtitle={"نواآوران سلامت گستر شریف به عنوان یکی"}
          date={new Date()}
          unread={0}
        />
        <ChatItem
          avatar={person}
          id={3}
          alt={"Reactjs"}
          title={"فرزاد ریانی"}
          subtitle={"نواآوران سلامت گستر شریف به عنوان یکی"}
          date={new Date()}
          unread={0}
        />
     

     </div>
    );
  }
}
export const Group = connect(state => ({
  globalStorage: state.globalStorage
}))(Group_);
