import React, { Component } from "react";
import { slide as Menu } from "react-burger-menu";
import { connect } from "react-redux";
import arrow from '../../assets/images/arrow.png';
import { userConstants } from "../../_constants";
import { history } from '../../_helpers';
import {Link} from "react-router-dom";
import logout from '../../assets/images/power-off.svg';
import additional from "../../assets/images/additinalicon.png";

class Navbar_ extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  logOut=()=>{
    localStorage.removeItem('globalStorage');
    this.props.dispatch({ type: userConstants.LOGOUT });
    history.push('/pwa/login');
  }
  render() {
    return (
        <div className="container-fluid">
        <div className="col-12 navbar navbar-expand-sm bg-light navbarstyleTop">
    
          {/* <Menu right>
            <a id="home" className="menu-item" href="/">
              Home
            </a>
            <a id="about" className="menu-item" href="/about">
              About
            </a>
            <a id="contact" className="menu-item" href="/contact">
              Contact
            </a>
            <a onClick={this.showSettings} className="menu-item--small" href="">
              Settings
            </a>
          </Menu> */}
          <div className="col-3 flex-column d-flex text-center" style={{position:'absolust',left:'4%'}}>
          {this.props.page &&
           
          <Link to={this.props.link} > 
       
        <span className="row flex-column d-flex align-item-center" >
           <i className="row navbarmessage rounded-circle fas fa-plus" style={{fontSize:"1.2em",paddingBottom: '.8em'}}></i>
         

          <span className="sendmessage iransansBold" style={{fontFamily:"iransansbold",fontSize:".8em",padding: "0"}}>{this.props.page}</span>
          </span>
          </Link>
     
            }
          
          </div>
          <div className="col-6 lalezar navbartitle text-center  animated fadeInUp navbar-title" >
            {this.props.name}

          </div>
          <div className="col-3 px-0 position-relative">
        {this.props.url &&
          <Link to={this.props.url} className="fal fa-chevron-left" style={{color:'#fff', fontSize: '1.3em'}}></Link>
        }
 
        {this.props.logout &&
        <span style={{position:'relative',left:'-2em',zIndex:'100',display:'flex',justifyContent:'center'}} onClick={this.logOut}><img src={logout} style={{width:'30px'}} /> </span>
        }
               </div>

        </div>
        </div>
    
    );
  }
}


export const Navbar= connect(state => ({
  globalStorage: state.globalStorage
}))(Navbar_);

