import React, { Component } from "react";
import { Navbar, Input, MessageList, Avatar,MessageBox } from "react-chat-elements";
import { connect } from "react-redux";
import { userConstants } from "../../../_constants/user.constants";
import { userActions } from "../../../_actions";
import  send from '../../../assets/images/sendicon.png';
import  attachicon from '../../../assets/images/attach-icon.png';
import arrowback from "../../../assets/images/arrowback.png";
import Select from "react-select";
import {NavLink } from "react-router-dom";
import PropTypes from 'prop-types';
import { ActionCableConsumer } from 'react-actioncable-provider';

class Message_ extends Component {
  
  static propTypes = {
    message: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }
  handleReceived(message) {
    this.setState(state => {
      return {
        message
      };
    });
  }
  render() {
    return (
      <>
        {/* <div className="container chat">
          <div className="row navtop ">
          <div className="userchat col-12">
            <Navbar
              left={
                
                  <div className="avatar ">
                    <Avatar
                      src={
                        userConstants.SERVER_URL_2 +
                        this.props.globalStorage.me.avatar.url
                      }
                      alt={"logo"}
                      size="xlarge"
                      type="circle flexible"
                    />
                  </div>
          
                 
               
              }
              center={
                <div className="userinfo row px-2">
                <div className="userdata w-100 ">
                  {this.props.globalStorage.me.firstname}{" "}
                  {this.props.globalStorage.me.lastname}
                </div>
                <div className="online row">
                  {" "}
                  <Select
                    className="select-chat-status w-100 text-justify custom-select-2"
                    value={this.state.online}
                    onChange={userActions.handleChangeSelect.bind(this)}
                    name="online"
                    placeholder="آنلاین"
                    options={this.state.Condition}
                    getOptionLabel={opt => opt.name}
                    getOptionValue={opt => opt.id}
                  />
                
                </div>
              </div>
              }
              right={
                <div className="arrowback"><NavLink to="/pwa/chat"><img src={arrowback}/></NavLink></div>
              }
            
            />
             </div>
          </div>
          <div className="row contentmessage">
            <MessageList
              className="message-list recivemesage"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={[
                {
                  position: "right",
                  type: "text",
                  text:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
                  date: new Date(),
                  toBottomHeight: 100
                }
              ]}
            />
            <MessageList
              className="message-list sendmessage"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={[
                {
                  position: "left",
                  type: "text",
                  text:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
                  date: new Date()
                }
              ]}
            />
            <MessageBox
    position={'left'}
    type={'photo'}
    text={'react.svg'}
    data={{
        uri: 'https://facebook.github.io/react/img/logo.svg',
        status: {
            click: false,
            loading: 0,
        }
    }}/>
          </div>
          <div className="row chattabbar ">
            <div className="col-8 px-1">
            <Input ref="input" placeholder="چیزی بنویسید..." 
            />
           
            </div>
            <div className="col-2 attach_message"><img src={attachicon} alt="send_message"/></div>
            <div className="col-2 send_message"><img src={send} alt="send_message"/></div>
 
          </div>
        </div> */}
        
         <ActionCableConsumer
        channel={{Channel:"EopChannel",id: this.props.globalStorage.me.id}}
        onReceived={this.handleReceived}
      >
        <h1>{this.state.message}</h1>
      </ActionCableConsumer>
      </>
    );
  }
}

export const Message = connect(state => ({
  globalStorage: state.globalStorage
}))(Message_);
