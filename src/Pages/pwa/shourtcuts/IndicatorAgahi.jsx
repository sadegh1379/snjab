import React, { Component } from 'react';
import { userConstants } from "../../../_constants";
import moment from "jalali-moment";
import { connect } from "react-redux";
import { userActions } from "../../../_actions";
import {Link} from "react-router-dom";
class IndicatorAgahi_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator:[]
          }
    }
    componentDidMount(){
      this.getIndicatorMonitoring()
    }
    getIndicatorMonitoring=(page = 1,per=24)=>{
        const { year } = this.props.globalStorage;
        
        this.props.dispatch(userActions.API('get',`/v2/get_monitor_indicators?year=${year}&page=${page}&per=${per}`)).then(res=>{
            this.setState({indicator:res.data.indicators})
          
        });
    }
    render() {
         const {indicator}=this.state;
        
     return(
         <div className="container-fluid">
        <div className="col-12 indicator_agahi  px-0" >
        {indicator.map((item,index)=>{
             return(
                 <div className="card" key={item.indicator.id}>
                 <div className="card-body px-3 py-0" style={{paddingLeft: '.85em',paddingRight:'.85em'}}>
                  <div className="row text-center title py-2" >{item.indicator.title}</div>
                  <div className="row border_item">
                      <div className="col-6 text-center py-2" style={{borderLeft:"1px solid #ccc"}}>
                          <lable className="lable">دوره تنـاوب</lable>
                           <div className="item">{item.indicator.measure_interval}</div>
                      </div>
                      <div className="col-6 text-center py-2">
                          <lable className="lable">مبنـای شاخـص</lable>
                           <div className="item">{item.indicator.basis}</div>
                      </div>
                  </div>
                  <div className="row border_item">
                      <div className="col-4 text-center py-2" style={{borderLeft:"1px solid #ccc"}}>
                          <lable className="lable" >حـد پایین</lable>
                           <div className="item">{item.indicator.lower_limit}</div>
                      </div>
                      <div className="col-4 text-center py-2" style={{borderLeft:"1px solid #ccc"}}>
                          <lable className="lable" >تارگـت</lable>
                           <div className="item">{item.indicator.target}</div>
                      </div>
                      <div className="col-4 text-center py-2">
                          <lable className="lable">حـد بالا</lable>
                           <div className="item">{item.indicator.upper_limit}</div>
                      </div>

                  </div>
                  <div className="row d-flex justify-content-center">
                  <button className="col-11  btn rounded-pill btn-primary my-3 detail_style" >
                      <Link to={'/pwa/detail_indicator'}>
                    جزییـات
                    </Link>
                  </button>
                  </div>
                 </div>
               </div>
             )
         })}
         </div>
         </div>
     )
          
         
    }
}

export const IndicatorAgahi = connect(state => ({
    globalStorage: state.globalStorage
  }))(IndicatorAgahi_);