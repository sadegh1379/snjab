import React, { Component } from 'react';
import { connect } from "react-redux";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
  } from "react-router-dom";
class ChatTabbar_ extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
      
            
            <div className="row chattabbar ">
             <NavLink to="/pwa/chat/recentconv" className="icon_tab col-3 chaticon"  activeClassName="icon_tab_active active_chaticon"  >
               <span>گفتگوها اخیر </span>
            </NavLink>
            <NavLink to="/pwa/chat/users" className="icon_tab col-3 usericon" activeClassName="icon_tab_active active_usericon" >
              <span >مخاطبین</span>
            
            </NavLink>
            <NavLink to="/pwa/chat/group"  className="icon_tab col-3 groupicon" activeClassName="icon_tab_active active_groupicon" >

              <span>گروه ها</span>
    
            </NavLink>
            <NavLink to="/pwa/chat/recentconv"  className="icon_tab col-3  settingicon" activeClassName="icon_tab_active active_settingicon" >
           
    
              <span> تنظیمات</span>
           
            </NavLink>
          </div>
        
         );
    }
}

export const ChatTabbar = connect(state => ({
    globalStorage: state.globalStorage
  }))(ChatTabbar_);