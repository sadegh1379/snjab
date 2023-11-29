import React, { Component } from "react";
import { userConstants } from "../../../_constants";
import moment from 'jalali-moment';
import { connect } from "react-redux";
import arrowback from "../../../assets/images/arrowbackcblue.png";
import student from "../../../assets/images/student.svg";
import agahi from "../../../assets/images/aghahi.png";
import program from "../../../assets/images/web-design.svg";
import appointment from "../../../assets/images/appointment.svg";
import kam from "../../../assets/images/kam.png";
import mamooli from "../../../assets/images/mamooli.png";
import bala from "../../../assets/images/bala.png";
import ReactTooltip from 'react-tooltip';
import { Link } from "react-router-dom";
import  movafeg from '../../../assets/images/movafeg.png';
import mokhalef from '../../../assets/images/mokhalef.png';
import momtane from '../../../assets/images/momtane.png';
import ward from '../../../assets/images/ward.png';
import {Pagination} from "../../../_components/Pagination";
import PropTypes from 'prop-types';

class Dastorkar_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active:props.active || 1
    };
  }
  pageOnChange=(active)=>{
    this.setState({active},()=>{
        this.props.pageOnChange(active);
    })
}

  render() {
    const getCountVote=(votes,status)=>{
      console.log(votes,status)
      let vote = status == 2 ? 5 : (status == 1 ? 3 : 1);
      return votes.filter(function (itm) {
          return itm.value == vote;
      }).length;
    }
    const items = this.props.data.map(i => {
    
      return (
        <>
        
          <div className="card cardstyle" key={i._id}>
            <div className="card-body text-center px-2 py-2">
              <div className="row card-head ">
                <div className="col-2">
                  <div className="circle overflow_image">
                    {this.props.program_suggestion === "set" ?
                      <img style={{ top: "-100%", bottom: "-96%" }} src={(i.record_type === "program" && program) || (i.record_type === "event" && appointment) || (i.record_type === "step" && i.object.priority_status === 1 && kam) || (i.record_type === "step" && i.object.priority_status === 3 && mamooli) || (i.record_type === "step" && i.object.priority_status === 5 && bala)} />
                      : <img src={userConstants.SERVER_URL_2 + this.props.globalStorage.me.avatar.url} alt="Card image" />}
                  </div>
                </div>
                <div className="col-auto d-flex pl-0 align-items-center mr-1 card-name  ">
                  {this.props.program_suggestion === "set" ? "برنامـه پیشنهـادی" : <>{this.props.globalStorage.me.firstname} {this.props.globalStorage.me.lastname}</>}

                </div>
                <div className="col-auto d-flex pr-0 align-items-center date">
                  (
                 {(this.props.masshi === "set") && moment(i.object.create_doc_at).format('jDD jMMMM jYYYY')}
                  {this.props.process_flowchart === "set" && moment(i.object.flowchart.file.send_to_at).format('jDD jMMMM jYYYY')}
                  {(this.props.payam === "set" || this.props.dastorkar || this.props.mashi === "set") && moment(i.object.created_at).format('jDD jMMMM jYYYY')}
                  {this.props.sessions === "set" && moment(i.object.date).format('jDD jMMMM jYYYY')}
                  {this.props.program_suggestion === "set" && moment(i.object.created_at).format('jDD jMMMM jYYYY')}
                  {this.props.checklist_page === "set" && moment(i.object.created_at).format('jDD jMMMM jYYYY')}
                  {this.props.taiedie === "set" && moment(i.object.sent_to_at).format('jDD jMMMM jYYYY')}
                  {this.props.process_checklist === "set" && moment(i.object.created_at).format('jDD jMMMM jYYYY')}
                  {this.props.ravesh === "set" && moment(i.created_at).format('jDD jMMMM jYYYY')}
                  {this.props.dastor_amal === "set" && moment(i.created_at).format('jDD jMMMM jYYYY')}
                  {this.props.programs_confirmation === "set" && moment(i.created_at).format('jDD jMMMM jYYYY')}
                  )
               </div>
                <div className="col-1" style={{ position: 'absolute', left: '0' }}>
                  <div className={i.seen ? "" : "icon-enable"}></div>
                </div>
              </div>



              <div className="card-text col-12 px-0 pt-2">
                {this.props.process_checklist === "set" && i.object.form.title}
                {(this.props.program_suggestion==="set" || this.props.checklist_page === "set" || this.props.ravesh === "set" || this.props.dastor_amal === "set" || this.props.process_flowchart === "set") && i.object.title}
                {this.props.payam === "set" && i.object.subject}
                {this.props.program_suggestion==="set" && i.object.title}

                {i.tags}
              </div>





              <div className="card-detail row px-0 py-0  mx-1 my-3">
                <div className="col-6 logo my-0 px-0 py-0">
                  {this.props.program_suggestion === "set" ? <div className="w-70 sugestion-icon my-0 ">
                    {i.object.status === null && <p style={{ backgroundColor: '#ffffff', color: '#1c94e0', border: '1px solid #1b93df' }}>در دست بررسی</p>}
                    {i.object.status === "0" && <p style={{ backgroundColor: '#ffe119' }}>ممتنع</p>}
                    {i.object.status === "1" && <p style={{ backgroundColor: "#e6194b" }}>مخالف</p>}
                    {i.object.status === "2" && <p style={{ backgroundColor: "#3cb44b" }}>موافق</p>}
                  </div>
                    :
                    <>
                      <div className="col-4">
                        <div className="icons">
                          {(this.props.dastorkar === "set" || this.props.sessions === "set" || this.props.ravesh === "set" || this.props.mashi === "set") && <i data-toggle="tooltip" place="top" data-tip={i.mehvar || i.committee.name} className={i.object.mehvar_icon || i.committee.icon} />}
                          {this.props.dastor_amal === "set" && <i data-toggle="tooltip" place="top" data-tip={i.object.committee_name} className={i.object.committee_icon} />}
                          {this.props.checklist_page === "set" && <i data-toggle="tooltip" place="top" data-tip={i.object.mehvar} className={i.object.mehvar_icon} />}
                          {this.props.process_checklist === "set" && <span style={{ fontSize: ".5em" }}>{i.object.form.ward.ward_name}</span>}
                          {this.props.payam === "set" && <i className="icon-font fav-icon icon-favoite" style={{ right: "25px" }}></i>}
                          {this.props.process_flowchart === "set" && i.object.process_type}
                          {this.props.taiedie === "set" && <i data-toggle="tooltip" place="top" data-tip={i.object.committee_name} className={i.object.committee_icon} />}
                          {this.props.programs_confirmation === "set" && <span style={{ fontSize: ".5em" }}>{((i.object.status == undefined && "الویت ندارد") ||(i.object.status==2 && <img  data-toggle="tooltip" place="top" data-tip="موافق" src={movafeg} alt="movafegh"/>) || (i.object.status==1 && <img src={momtane} data-toggle="tooltip" place="top" data-tip="ممتنع" alt="momtane"/> ) ||((i.object.status!=null)&&(i.object.status!=1)&&(i.object.status!=2) && <img data-toggle="tooltip" place="top" data-tip="مخالف" src={mokhalef} alt="mokhalef"/>))} </span>}
                          <ReactTooltip type="dark" />
                        </div>
                      </div>


                      <div className="col-4">
                        {this.props.dastorkar === "set" && <div className="iconsitem"> <img src={(i.record_type === "program" && program) || (i.record_type === "event" && appointment) || (i.record_type === "step" && i.object.priority_status === 1 && kam) || (i.record_type === "step" && i.object.priority_status === 3 && mamooli) || (i.record_type === "step" && i.object.priority_status === 5 && bala)} /> </div>}
                        {/* {this.props.sessions!=="set" || this.props.checklist_page!=="set"  && <div className="iconsitem"> <img src={(i.record_type==="program" && program) || (i.record_type==="event" && appointment) || (i.record_type==="step" && i.object.priority_status===1 && kam) || (i.record_type==="step" && i.object.priority_status===3 && mamooli) ||(i.record_type==="step" && i.object.priority_status===5 && bala)}/>  </div>}
                  */}
                        {this.props.process_checklist === "set" && <div className="icons"> <span style={{ fontSize: ".5em" }}>{i.object.process_type}</span>  </div>}
                        {this.props.programs_confirmation === "set" && <div className="icons"> <span style={{ fontSize: ".5em" }} data-toggle="tooltip" place="top" data-tip={i.object.ward}><img src={ward} alt="ward"/></span>  </div>}

                      </div>
                      <div className="col-4">
                        <div className="iconsitem">

                          {this.props.dastorkar === "set" && <img src={i.for === "eghdam" ? student : agahi} alt={i.for === "eghdam" ? student : agahi} />}
                        </div>
                      </div>
                    </>
                  }
                </div>

                {this.props.sessions === "set" &&
                  <div className="col-6 seedtail my-0 mx-0 px-0" >

                    <a href={i.object.file[0] !== undefined ? userConstants.SERVER_URL_2 + i.object.file[0].file.url : "#"} download>
                      دریافت فایل صورت جلسه<span style={{ marginLeft: "15px" }}><img className="arrow" src={arrowback} alt="arrowdetail" /></span>
                    </a>
                  </div>
                }
                {(this.props.payam === "set") &&
                  <div className="col-6 seedtail my-0 ">
                    <Link to={{ pathname: '/pwa/detail_payam', state: { detail: i } }}>  مشاهده جزییات<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></Link>

                  </div>
                }

                {(this.props.dastorkar === "set" || this.props.process_checklist === "set" || this.props.inbox === "set" || this.props.process_flowchart === "set") &&
                  <div className="col-6 seedtail my-0 ">
                    <Link to={{ pathname: `/pwa/dashboard/${i.submenu}/${i._id}`, state: { detail: i } }}>  مشاهده جزییات<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></Link>

                  </div>
                }


                {this.props.program_suggestion === "set" &&
                  <div className="col-6 seedtail my-0 ">
                    <span>  مشاهده جزییات<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></span>

                  </div>
                }
                {(this.props.ravesh === "set" || this.props.mashi === "set" || this.props.dastor_amal === "set") &&
                  <div className="col-6 seedtail my-0 ">
                    <Link to={{ pathname: `/pwa/detail`, state: { detail: i } }}>  مشاهده جزییات<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></Link>

                  </div>
                }
                {this.props.taiedie === "set" &&
                  <div className="col-6 seedtail my-0 ">
                    <Link to={{ pathname: `/pwa/detail`, state: { detail: i } }}>مشاهده پیوست<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></Link>

                  </div>
                }
                {this.props.programs_confirmation === "set" &&
                  <div className="col-6 seedtail my-0 ">
                    <Link to={{ pathname: `/pwa/detail`, state: { detail: i } }}>مشاهده جزییات<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></Link>
                    
                  </div>
                }
                { this.props.checklist_page === "set" &&
                  <div className="col-6 seedtail my-0 ">
                    <Link to={{ pathname: `/pwa/checklist_page`, state: { detail: i }}}>مشاهده جزییات<span><img className="arrow" src={arrowback} alt="arrowdetail" /></span></Link>
             
                  </div>
                }
               
                

              </div>

            </div>
          </div>

        </>
      )
    })


    return (
      <div className="container-fluid">
        {items}
        {this.props.showPagination === false && this.props.title=== '' ? 
                        <></> 
                    :
                        <div className="row d-flex justify-content-between   my-4 px-4  ">
                            <div className="col-lg-6 text-right col-sm-8">
                                <span className="iran-sans text-right text-sm-center text-md-center">
                                    {this.props.title}
                                </span>
                            </div>
                            <div className="col-lg-6 text-left d-flex justify-content-end col-sm-8  ">
                            <Pagination totalPage={this.props.totalPage} active={this.state.active} callBack={this.pageOnChange}/>
                            </div>
                        </div>
                    }
        </div>
    );
  }
}

export const Dastorkar = connect(state => ({
  globalStorage: state.globalStorage
}))(Dastorkar_);
Dastorkar.propTypes = {
  marginClassName: PropTypes.string,
  showPagination: PropTypes.bool,
  totalPage:PropTypes.number.isRequired,
  pageOnChange:PropTypes.func.isRequired,
  minWidth: PropTypes.string,
  active:PropTypes.number,
  title: PropTypes.string,
  rows:PropTypes.arrayOf(PropTypes.object),
  addToTable:PropTypes.func,
  loader:PropTypes.any,
  minHeight:PropTypes.any,
  headers: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      style: PropTypes.object,
      getData:PropTypes.func.isRequired,
      className:PropTypes.string
  }))
};

Dastorkar.defaultProps = {
  minWidth: '1200px',
  marginClassName: 'mx-lg-5',
  showPagination: true,
  rows:[]
}