import React, { Component } from "react";
import eror from "../../assets/images/cauro-footer1.png";
import chat from "../../assets/images/cauro-footer2.png";
import NahiyeKarbari from "../../assets/images/cauro-footer3.png";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
class Tabbar_ extends Component {
     constructor(props) {
         super(props);
         this.state = {  }
     }
     render() { 
         return ( 
            <div className="navbar navbar-expand-sm bg-light  navbarstyleBottom">
            <div className="shotcut-pwa-icon col-12 ">
              <NavLink to="/pwa/support" className="col-4  p-0 m-0 text-center">
              
                <span className="col-12 p-0 m-0">
                  <img src={NahiyeKarbari} alt="NahiyeKarbari" />
                </span>
                <span className="col-12 p-0 m-0">پشتیبانی</span>
             
              </NavLink>
              <NavLink to="/pwa/chat" className="col-4  p-0 m-0 text-center">
              
              <span className="col-12 p-0 m-0">
                <img src={chat} alt="chat" />
              </span>
              <span className="col-12 p-0 m-0">چت آنلایـن</span>
           
            </NavLink>
            <NavLink to="/pwa/recenterror" className="col-4  p-0 m-0 text-center">
              
              <span className="col-12 p-0 m-0">
                <img src={eror} alt="eror" />
              </span>
              <span className="col-12 p-0 m-0">50 خطای اخیـر</span>
           
            </NavLink>
          
            </div>
          </div>
          );
     }
 }
  
 export const Tabbar = connect(state => ({
  globalStorage: state.globalStorage
}))(Tabbar_);