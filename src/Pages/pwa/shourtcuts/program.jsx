import React, { Component } from 'react';
import { connect } from "react-redux";
import person from "../../../assets/images/person.png";
class Program_ extends Component {
    constructor(props) {
        super(props);
        this.state = { 
           
         }
    }
    render() { 
        console.log(this.props.globalStorage.me.firstname)
        return (
            <div className="card cardstyle">
            <div className="card-body text-center">
              <div className="col-12 card-head ">
                <img className="card-img" src={person} alt="Card image" />
        <span className="card-text"> {this.props.globalStorage.me.firstname}  {this.props.globalStorage.me.lastname}</span>
                <span className="date">bbbbb</span>
                <span className="icon-enable"></span>
              </div>
  
              <p className="card-text col-12 px-0 py-0">nnnn</p>
              <p className="card-detail row px-0 py-0">
                <p className="col-6 logo my-0 px-0 py-0">
                  <img src={person} alt="Card image" />
                  <img src={person} alt="Card image" />
                  <img src={person} alt="Card image" />
                </p>
                <p className="col-6 seedtail my-0">
                  <span>{/* <img src={arrowback}/> */}</span>مشاهده جزییات
                </p>
              </p>
            </div>
          </div>
          );
    }
}
 
export const Program = connect(state => ({
    globalStorage: state.globalStorage
  }))(Program_)