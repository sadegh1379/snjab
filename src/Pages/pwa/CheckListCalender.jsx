import React, { Component } from 'react'
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import moment from 'jalali-moment';
import {userActions} from "../../_actions";
import {IndicatorCalenderComp} from '../../_components';
import ViewChecklist from './shourtcuts/ViewChecklist';
import {Router, Route,BrowserRouter,Switch } from "react-router-dom";
const daysStyle = {
    minWidth: 21,
    minHeight:21,
    maxWidth: 21,
    maxHeight: 21,
    fontSize: '0.7em',
}

export class CheckListCalender extends Component {
   constructor(props) {
        super(props);
        this.state = {
          data:[],
          intervals: [],
          interval:null,
          menuItems: [],
          measure_interval: null,
          complateChecklist: false,
          checklist: null,
          checklist_info: "",
          questions:null
        };
      }
  componentWillMount(){
      this.detailChecklist(this.props.location.state.detail.object)
  }
  detailChecklist = data => {
 
    const measure_interval = data.checklist_page_wards[0]["delivery_type"];
    let repeat_value = userActions.getPeriodCount(measure_interval);
    const intervals = [];
    for (let i = 0; i < repeat_value; i++) {
      intervals.push({});
    }
    const menuItems=Array.from(data.menu_items).map(itm=>{
      delete itm.value;
      return itm;
     
    });
    const components=userActions.groupBy(data.checklist_page_questions,'component');
    const questions=[];
    Object.keys(components).map(c=>{
        questions.push({
            component:c,
            content:components[c].map(q=>{
                return {
                    question_id:q._id,
                    question:q.key,
                    question_type:q.point_type,
                    answers:data.checklist_page_guides.filter(ans=>ans.key===q.point_type).map(ans=>{
                        return {
                            id:ans._id,
                            answer:ans.value,
                            answer_help:ans.guide
                        }
                    })
                }
            })
        })
    })
    this.setState({ measure_interval, intervals:intervals,menuItems ,questions,ward:''});
   
  };
  closeDetailChecklist
    render() {
        return (
      <>
                <IndicatorCalenderComp
                  measure_interval={this.props.location.state.detail.object.checklist_page_wards[0].delivery_type}
                  indicator={this.props.location.state.detail.object}
                  intervals={this.state.intervals}
                  CloseModal={this.closeDetailChecklist}
                  OpenMonitorScreenModal={() => {
                    this.props.history.push({pathname:'/pwa/checklist_page/detail',state:{detail:this.props.location.state.detail,questions:this.state.questions}})
                     
                    // <Route path="/users" render={() => <UsersPage/>}/>
                  }}
             
                />
               
            </>
           
        )
    }
}



function checkHexProp(props, propName, componentName) {
    componentName = componentName || 'ANONYMOUS';
    if (props[propName]) {
      let value = props[propName];
      if (typeof value === 'string') {
          return validator.isHexColor(value) ? null : new Error(propName + ' in ' + componentName + " is not a hex Color");
      }
    }
  
    // assume all ok
    return null;
  }

  CheckListCalender.propTypes = {
    title: PropTypes.string.isRequired,
    colorTheme: checkHexProp,
    btnHandler: PropTypes.func.isRequired,
    day: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    status: PropTypes.string,

    
}

CheckListCalender.defaultProps = {
    colorTheme: '#343a40'
}