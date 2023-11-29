import React, { Component } from "react";
import "react-chat-elements/dist/main.css";
import { connect } from "react-redux";
import { RecentConv } from "./ChatSubFolder/RecentConv";
import { Users } from "./ChatSubFolder/Users";
import { Group } from "./ChatSubFolder/Group";
import { ChatNavbar } from "./ChatSubFolder/ChatNavbar";
import { ChatTabbar } from "./ChatSubFolder/ChatTabbar";
import { PrivateRoute} from '../../_components';
import {Message} from "./ChatSubFolder/Message";
import ActionCable from 'actioncable';
import { ActionCableProvider } from 'react-actioncable-provider';
import { userConstants } from "../../_constants";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

class Chat_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const cable = ActionCable.createConsumer(`wss:${userConstants.SERVER_URL}/cable?id=${this.props.globalStorage.me.id}`);
    return (
      <div className="container-fluid">
      <ActionCableProvider cable={cable}>
      <Router>
      <div className="container chat">
       <ChatNavbar/>
        <div className="row contenttab">
          <form className="row search-chat">
            <input
              className="search-input  rounded-pill border-0  w-100 py-2 px-2"
              type="text"
              placeholder={"جستجو پیام ها یا کاربران"}
            />
          </form>
           <Switch>
             <PrivateRoute path="/pwa/chat/recentconv">
               <RecentConv/>
             </PrivateRoute>
             <PrivateRoute path="/pwa/chat/users">
                <Users/>
             </PrivateRoute>
             <PrivateRoute path="/pwa/chat/group">
                <Group />
             </PrivateRoute>
            
           


           </Switch>
        
        </div>
      
     
        <ChatTabbar/>
      </div>
      <PrivateRoute path='/pwa/chat/maessage' exact component={Message}/>
      
      </Router>
      </ActionCableProvider>
      </div>
    );
  }
}

export const Chat = connect(state => ({
  globalStorage: state.globalStorage
}))(Chat_);
