import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { userActions } from "../_actions";
import Loading from "../assets/images/loading_2.gif";
import Loading2 from "../assets/images/loading2.gif";
import { connect } from "react-redux";
import { UsersInterface } from "../Interfaces";
import InfiniteScroll from "react-infinite-scroller";
import Select from "react-select";

Modal.setAppElement("#root");



class Programs_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      type_resources: [
        { id: 1, name: "هیچکـدام" },
        { id: 2, name: "منابـع انسانـی" },
        { id: 3, name: "مواد/وسایل/ابزار" },
        { id: 4, name: "فضـای فیزیکـی" },
        { id: 4, name: "منابـع اطلاعاتـی" }
      ],

      resource: "",
      descripition_resource:"",
      value_resource:"",
      unit_cost:"",
      total_cost:""
    };
  }
handelProgram=()=>{
 this.props.data(
   {resource:this.state.resource,
    descripition_resource:this.state.descripition_resource,
    value_resource:this.state.value_resource,
    unit_cost:this.state.unit_cost,
    total_cost:this.state.total_cost,
  }
 ) ;
 this.props.isClose()
}
  render() {
   console.log(this.props.sendData)
    const { resource, type_resources ,descripition_resource,value_resource,total_cost,unit_cost} = this.state;
    return (

      <div className="white-box radius box_shadow">
        <div className="row header">
          <p className="text-center text-lalezar h4 text">
            منابـع مـورد نیـاز برای گـام تدوین شـده
          </p>
        </div>
        <div className="row">
          <div className="col-12 ">
            <label className="text-right w-100 pb-1 pt-3 iran-sans_Bold label">
              نـوع منبـع
            </label>
             
        
            <Select
              className="w-100 text-justify custom-select-2 placeholder_font "
              value={resource}
              name="resource"
              placeholder="انتخاب نوع منبع"
              onChange={userActions.handleChangeSelect.bind(this)}
              options={type_resources}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.id}
              id="user_list"
            />
               
          </div>
        </div>

        
        <div className="row">
          <div className="col-12 ">
            <label className="text-right w-100 pb-1 pt-3 iran-sans_Bold label">
              توضیحـات
            </label>
            <textarea
              className="no_padding border_shadow"
              style={{ minHeight: "32px" , height:" 32px" }}
              onChange={userActions.handleChangeInput.bind(this)} name="descripition_resource" value={descripition_resource}
              type="text"
            ></textarea>
          </div>
        </div>

        <div className="row">
          <div className="col-12 ">
          
              <label className="text-right w-100 pb-1 pt-3 iran-sans_Bold label">
                تعـداد / مقـدار
              </label>
              <textarea
                className="no_padding border_shadow"
                style={{ minHeight: "32px" , height:" 32px" }}
                onChange={userActions.handleChangeInput.bind(this)} name="value_resource" value={value_resource}
                type="number"
              ></textarea>
            </div>
         
        </div>
        
        <div className="row">
          <div className="col-12 ">
            <label className="text-right w-100 pb-1 pt-3 iran-sans_Bold label">
              هزینـه واحـد(ریـال)
            </label>
            <textarea
              className="no_padding border_shadow w-100"
              style={{minHeight: "32px" , height:" 32px"}}
              type="number"
              onChange={userActions.handleChangeInput.bind(this)} name="unit_cost" value={unit_cost}
            ></textarea>
          </div>
          </div>
          <div className="row">
          <div className="col-12 ">
            <label className="text-right w-100 pb-1 pt-3 iran-sans_Bold label">
              هزینـه کـل(ریـال)
            </label>
            <textarea
              className="no_padding border_shadow w-100"
              style={{minHeight: "32px" , height:" 32px"}}
              type="number"
              onChange={userActions.handleChangeInput.bind(this)} name="total_cost" value={total_cost}
            ></textarea>
          </div>
        </div>
 
        <div className="row">
          <div className="col-12 d-flex btn_wrapper justify-content-center mt-4">
           <button className="col-5 btn btn-blue no-icon mx-1 rounded-pill" onClick={this.handelProgram}>ثبت</button>
            <button className="col-5 btn btn-blue no-icon mx-1 rounded-pill" onClick={this.props.isClose} >انصـراف</button>
          </div>
        </div>
     
        
     
        
  
      </div>
    );
  }
}

const Programs = connect(state => ({
  globalStorage: state.globalStorage
}))(Programs_);
export { Programs };
