import React, { Component } from 'react';
import Select from "react-select";
import { Avatar, Navbar } from "react-chat-elements";
import { connect } from "react-redux";
import { userConstants } from "../../../_constants/user.constants";
import { userActions } from "../../../_actions";

class ChatNavbar_ extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="row navtop ">
            <Navbar
              left={
                <div className="userchat col-12">
                  <div className="avatar col-3">
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
                  <div className="userinfo col-9 px-2">
                    <div className="userdata col-12">
                      {this.props.globalStorage.me.firstname}{" "}
                      {this.props.globalStorage.me.lastname}
                    </div>
                    <div className="online col-12">
                      {" "}
                      <Select
                        className="select-chat-status w-100 text-justify custom-select-2"
                        value={this.state.online}
                        onChange={userActions.handleChangeSelect.bind(this)}
                        name="online"
                        placeholder="مشغول"
                        options={this.state.Condition}
                        getOptionLabel={opt => opt.name}
                        getOptionValue={opt => opt.id}
                      />
                    </div>
                    
                  </div>
                </div>
              }
            />
          </div>
         );
    }
}
 
export const ChatNavbar = connect(state => ({
    globalStorage: state.globalStorage
  }))(ChatNavbar_);