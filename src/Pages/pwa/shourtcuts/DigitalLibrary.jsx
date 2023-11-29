import React, { Component } from 'react';
import { userConstants } from "../../../_constants";
import moment from "jalali-moment";
import { connect } from "react-redux";
import { userActions } from "../../../_actions";
import { a } from "react-router-dom";
import ReactTooltip from 'react-tooltip';
import masoleanjam from '../../../assets/images/masoleanjam.png';
import { Collapse } from "react-collapse";
import clips from '../../../assets/images/clip.svg';
import { Pagination } from "../../../_components/Pagination";
import PropTypes from 'prop-types';
class DigitalLibrary_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isopened:false,
            user:[],
            active:props.active || 1
        }
     
    }
    pageOnChange=(active)=>{
        this.setState({active},()=>{
            this.props.pageOnChange(active);
        })
    }
    componentDidMount(){
    this.getUser()
    }
    getUser=()=>{
        this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id)).then(res=>{
            this.setState({user:res.data.result})
            
         })
    }
    getObjectOfConfigurationAnswer = (row, keys, resultKey1, resultKey2) => {
        if (row && row.object.attrs && keys) {
            var res = row.object.attrs.find(function (attr) {
                return keys !== 'file' && keys.indexOf(attr.key) >= 0;
            });
            if (!res) {
                res = row.object.attrs.find(function (attr) {
                    return attr.file && attr.file_name;
                });
            }
            return res ? (res[resultKey1] || res[resultKey2]) : '-';
        }
    }
    collapseToggle=id=>{
        this.setState(state => ({
            ...state,
            ["Id" + id]: state["Id" + id] === true ? false : true
      
          }))
    }
 
    show_partners=function (user,all_users) {

    //    {all_users.map((useritem,index)=>{
    //      return(
    // <>
    
    //        {user.split("-")[1]==useritem.id && useritem.fn+" "+useritem.ln}
        
          
    //     </>
    //      )
    // })
    // }
     all_users.find((useritem,index)=>{
         if(useritem.id==user.split("-")[1]){
            return user.fn
         }
      
     })
    }
    render() {
      const {active}=this.state;
        return (
            <>
            <div className="container-fluid">
            <div className="col-12 digital_library px-0">
                {this.props.data.map((item, index) => {
                    
                    return (
                        <div className="card card_style" key={item.id}>
                            <div className="row card-head ">
                                <div className="col-2">
                                    <div className="circle overflow_image">

                                        <img src={userConstants.SERVER_URL_2 + this.props.globalStorage.me.avatar.url} alt="Card image" />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="row">
                                <div className="col-auto d-flex px-0 align-items-center  card-name  ">
                                    {this.props.globalStorage.me.firstname} {this.props.globalStorage.me.lastname}

                                </div>
                                <div className="col-auto d-flex pr-0 align-items-center date">

                                    ({moment(item.created_at).format('jDD jMMMM jYYYY')})

                                </div>
                                </div>
                                <div className="row">
                                <div className="col-auto text_mehvar">
                                {item.object.committee_name}
                                </div>
                                </div>
                                </div>
                                <div className="col-1" style={{ position: 'absolute', left: '0' }}>
                                    <div className={item.seen ? "" : "icon-enable"}></div>
                                </div>
                            </div>
                            <div className="card-cody">
                                <div className="card-text col-12 px-0 pt-2">

                                    {(item.record_type === "gas" && "تأییدیه کنترل و مصرف گازهای طبی") || (item.record_type === 'confirmation' && 'تأییدیه سیستم اتصال به زمین و نقشه الکتریکی') || (item.record_type === 'patient_safety_department' && 'معرفی مسئولان ایمنی بیمار') || (item.record_type === 'acs' && '	سامانه فرماندهی حادثه') || (this.getObjectOfConfigurationAnswer(item, ['عنوان سند'], 'value', 'file_name'))}

                                </div>
                                <div className="col-12 m-auto">
                                    <div className="row d-flex justify-content-center py-1">
                                        <div className="col-2">
                                            {/* <div className="icons">
                                                <i data-toggle="tooltip" place="top" data-tip={item.object.committee_name} className={item.object.committee_icon} />
                                            </div> */}
                                            <ReactTooltip type="dark" />
                                        </div>
                                        {/* <div className="col-2 image_masol">
                                            <span data-toggle="tooltip" place="top" data-tip={this.show_partners(item.object.sent_to,this.state.user)}>
                                            <img src={masoleanjam}  alt="masoleanjam"/>
                                            </span>
                                            <ReactTooltip type="dark" />
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-12">
                                {/* <div className="see_details" >مشاهـده پیـوست هـا</div>
                                <div className="arrow d-flex justify-content-center">
                                <i className={this.state.isOpened? "far fa-angle-double-up" : "far fa-angle-double-down}fa fa-chevron-down"} onClick={()=>this.collapseToggle(item._id)}/>
                                </div>  */}
                                 <div className="row m-auto clips d-flex justify-content-center">
                                 {(item.record_type=='gas'|| item.record_type=='confirmation') &&<a href={userConstants.SERVER_URL_2+item.object.file1.url} rel="nofollow" target="_blank" data-toggle="tooltip" place="top" data-tip={item.record_type=='gas'?'استاندارد رنگ سیلندرهای گازهای طبی':'تائیدیه پایش فعال بودن سیستم اتصال به زمین'}> <img src={clips} /></a>}
                               {(item.record_type=='gas'|| item.record_type=='confirmation') &&<a href={userConstants.SERVER_URL_2+item.object.file2.url} rel="nofollow" target="_blank" data-toggle="tooltip" place="top" data-tip={item.record_type=='gas'?'استاندارد رنگ سیلندرهای گازهای طبی':'تائیدیه پایش فعال بودن سیستم اتصال به زمین'} > <img src={clips} /></a>}
                               {item.record_type=='acs' &&<a href={userConstants.SERVER_URL_2+item.object.string.url} target="_blank" rel="nofollow" data-toggle="tooltip" place="top" data-tip={'سامانه فرماندهی حادثه'}> <img src={clips}   /></a>}
                               {item.record_type=='acs' &&<a href={userConstants.SERVER_URL_2+item.object.duties.url} target="_blank" rel="nofollow" data-toggle="tooltip" place="top" data-tip={'شرح وظایف افراد'} > <img src={clips} /></a>}
                               {item.record_type=='patient_safety_department' &&<a href={userConstants.SERVER_URL_2+item.object.coordinator_verdict.url} target="_blank" rel="nofollow" data-toggle="tooltip" place="top" data-tip={'حکم ابلاغی کارشناس هماهنگ کننده ایمنی بیمار'} > <img src={clips} /></a>}
                               {item.record_type=='patient_safety_department' &&<a href={userConstants.SERVER_URL_2+item.object.responsible_verdict.url} target="_blank" rel="nofollow" data-toggle="tooltip" place="top" data-tip={'حکم ابلاغی مسئول ایمنی بیمار'} > <img src={clips} /></a>}
                               {item.record_type=='configuration_answer' && <a href={`${userConstants.SERVER_URL_2}${this.getObjectOfConfigurationAnswer(item,'file', 'file').url}`} target="_blank" rel="nofollow" data-toggle="tooltip" place="top" data-tip={this.getObjectOfConfigurationAnswer(item,'file','key')} > <img src={clips} /></a> }
                               <ReactTooltip type="dark" />
                                </div>
                                </div>
                            
                                {/* <Collapse isOpened={this.state["Id" + item._id]} >
                               <>  
                               <div className="row m-auto clips d-flex justify-content-center m-auto row">
                                 
                               {(item.record_type=='gas'|| item.record_type=='confirmation') &&<a href={userConstants.SERVER_URL_2+item.object.file1.url} rel="nofollow" target="_blank"> <img src={clips} data-toggle="tooltip" place="top" data-tip={item.record_type=='gas'?'استاندارد رنگ سیلندرهای گازهای طبی':'تائیدیه پایش فعال بودن سیستم اتصال به زمین'} /></a>}
                               {(item.record_type=='gas'|| item.record_type=='confirmation') &&<a href={userConstants.SERVER_URL_2+item.object.file2.url} rel="nofollow" target="_blank"> <img src={clips} data-toggle="tooltip" place="top" data-tip={item.record_type=='gas'?'استاندارد رنگ سیلندرهای گازهای طبی':'تائیدیه پایش فعال بودن سیستم اتصال به زمین'} /></a>}
                               {item.record_type=='acs' &&<a href={userConstants.SERVER_URL_2+item.object.string.url} target="_blank" rel="nofollow"> <img src={clips}  data-toggle="tooltip" place="top" data-tip={'سامانه فرماندهی حادثه'} /></a>}
                               {item.record_type=='acs' &&<a href={userConstants.SERVER_URL_2+item.object.duties.url} target="_blank" rel="nofollow"> <img src={clips} data-toggle="tooltip" place="top" data-tip={'شرح وظایف افراد'} /></a>}
                               {item.record_type=='patient_safety_department' &&<a href={userConstants.SERVER_URL_2+item.object.coordinator_verdict.url}> <img src={clips} /></a>}
                               {item.record_type=='patient_safety_department' &&<a href={userConstants.SERVER_URL_2+item.object.responsible_verdict.url}> <img src={clips} /></a>}
                               {item.record_type=='configuration_answer' && <a href={`${userConstants.SERVER_URL_2}${this.getObjectOfConfigurationAnswer(item,'file', 'file').url}`}> <img src={clips} /></a> }
                               </div>  
</>
                                </Collapse> */}
                            </div>
                            
                    
                   
                         
                        </div>
                          
                    )
                })}
            </div>
            </div>
            {this.props.showPagination === false  ? 
                        <></> 
                    :
                        <div className="row d-flex justify-content-between   my-4 px-4  ">
                            <div className="col-lg-6 text-right col-sm-8">
                                <span className="iran-sans text-right text-sm-center text-md-center">
                                    {this.props.title}
                                </span>
                            </div>
                            <div className="col-lg-6 text-left d-flex justify-content-end col-sm-8  ">
                            <Pagination totalPage={2} active={active} callBack={this.pageOnChange}/>
                            </div>
                        </div>
                    }
                   </>
        );
    }
 
}

export const DigitalLibrary = connect(state => ({
    globalStorage: state.globalStorage
}))(DigitalLibrary_);
DigitalLibrary.propTypes = {
   
    showPagination: PropTypes.bool,
    totalPage:PropTypes.number.isRequired,
    pageOnChange:PropTypes.func.isRequired,
    minWidth: PropTypes.string,
    active:PropTypes.number,
};

DigitalLibrary.defaultProps = {
    showPagination: true,
  
}