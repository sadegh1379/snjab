import React, { Component } from "react";
import { Navbar } from "../Navbar";
import Select from "react-select";
import { userActions } from "../../../_actions";
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

class DetailSugestion_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strategy:[],
      strategy_goals_value:'',
      strategy_defines_value:'',
      ward_list:[],
      ward_list_value:'',  
      relate_patient_safty:false,
      suggested_program_title:'',
      special_goals:'',
      description:'',
      gotodefine:false
     

    };
  }
 componentDidMount(){
  this.getStrategy()
 }
definatesteps=()=>{
  if(this.state.strategy_goals_value==='')
  {
    userActions.failure("لطفا هدف استراتژیک را وارد نمایید");
  }
  else if(this.state.special_goals==='')
  {
    userActions.failure("لطفا هدف اختصاصی  را وارد نمایید"); 
  }
  else if(this.state.strategy_defines_value==='')
  {
    userActions.failure("لطفا استراتژی را وارد نمایید"); 
  }
  else if(this.state.suggested_program_title==='')
  {
    userActions.failure("لطفا عنوان برنامه پیشنهادی را وارد نمایید"); 
  }
  else if(this.state.ward_list_value==='')
  {
    userActions.failure("لطفا بخش مورد نظر را انتخاب نمایید "); 
  }
  else{
    this.setState({gotodefine:true})
  }
}
 getStrategy=()=>{
    const year=this.props.globalStorage.year;
    this.props.dispatch(userActions.API('get',`/v1/user/hospital/strategies?year=${year}`)).then(res=>{
      
        res.data.map((item,index)=>{
            if(item.hasOwnProperty('strategy_factors')){
             this.setState({strategy:item})
            }

        })
    })
    this.props.dispatch(userActions.API('get','/v1/user/hospital/ward_lists')).then(res=>{
       this.setState({ward_list:res.data})
  })
  
 }
 handle_relate_patient_safty=()=>{
   this.setState({relate_patient_safty:!this.state.relate_patient_safty})
 }

  render() {
       const {strategy_goals,strategy_defines}=this.state.strategy;
       const {strategy_goals_value,strategy_defines_value,ward_list,ward_list_value,special_goals,suggested_program_title,description}=this.state;
    return (
      <>
        <Navbar url="/pwa/dashboard/program_suggestion" name="پیشنهاد برنامه" />
        <div className="container-fluid">
        <div className="detail_sugestion">
          <div className="col-12">
            <label className="text-right w-100 pt-2 iran-sans_Bold label">
              {" "}
              هـدف استراتـژیک
            </label>
            <Select
              className="text-justify custom-select-2 placeholder_font"
              value={strategy_goals_value}
              name="strategy_goals_value"
              placeholder="انتخاب هـدف استراتـژیک"
              onChange={userActions.handleChangeSelect.bind(this)}
              options={strategy_goals}
              getOptionLabel={opt => opt.description}
              getOptionValue={opt => opt._id}
              id=""
            />
    
          </div>

          <div className="col-12">
            <label className="text-right w-100 pt-2 iran-sans_Bold label">
              {" "}
              هـدف اختصاصـی
            </label>
            <textarea type="input" rows="5" className="w-100 style_suggestion_input" onChange={userActions.handleChangeInput.bind(this)} name="special_goals" value={special_goals} ></textarea>
          </div>
          <div className="col-12">
            <label className="text-right w-100 pt-2 iran-sans_Bold label">
              استـراتژی
            </label>
            <Select
              className="text-justify custom-select-2 placeholder_font style_suggestion_input"
              value={strategy_defines_value}
              name="strategy_defines_value"
              placeholder="انتخـاب استـراتژی"
              onChange={userActions.handleChangeSelect.bind(this)}
              options={strategy_defines}
              getOptionLabel={opt => opt.description}
              getOptionValue={opt => opt._id}
              id=""
            />
          </div>

          <div className="col-12">
            <label className="text-right w-100 pt-2 iran-sans_Bold label">
              عنـوان برنامـه پیشنهـادی
            </label>
            <textarea type="input" rows="5" className="w-100 style_suggestion_input" onChange={userActions.handleChangeInput.bind(this)} name="suggested_program_title" value={suggested_program_title}></textarea>
          </div>

          <div className="col-12">
            <label className="text-right w-100 pt-2 iran-sans_Bold label">
              توضیحـات
            </label>
            <textarea type="input" rows="5" className="w-100 style_suggestion_input " onChange={userActions.handleChangeInput.bind(this)} name="description" value={description} ></textarea>
          </div>
          <div className="col-12 mt-3">
            <div className="select_sugestion">
              <div className="col-12 d-inline-flex px-0">
                <div className="col-2 box_circle " style={this.state.relate_patient_safty? {background: '#fff'}:{background: '#cccccc'}}>
                  <span className="circle_style" onClick={this.handle_relate_patient_safty}>
                    <i className="fas fa-scrubber" style={this.state.relate_patient_safty?{color:'#1b93df'}:{color:'#fff'}}></i>
                  </span>
                </div>
                <div className="col-10 py-3 pl-2 text">
                  آیا برنامـه پیشنهـادی مربـوط به ایمنـی بیمـار است؟
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mb-3" style={{height:'140px'}}>
            <label className="text-right w-100 pt-2 iran-sans_Bold label mt-2">
              بخـش
            </label>
            <Select
              className="text-justify custom-select-2 placeholder_font"
              value={ward_list_value}
              name="ward_list_value"
              placeholder="انتخـاب بخـش"
              onChange={userActions.handleChangeSelect.bind(this)}
              options={ward_list}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt._id}
              id=""
            />
          </div>
        
          <div className="set_steps" onClick={this.definatesteps}>
            {this.state.gotodefine===true?
            <Link to={{pathname:"/pwa/detail_sugestion/defination_steps", state:this.state}}  style={{color:"#fff"}}>
              تعریف گـام هـای برنامـه
              </Link>
              :
             "تعریف گـام هـای برنامـه"
            }
          </div>
       
        </div>
        </div>
      </>
    );
  }
}
export const DetailSugestion = connect((state) => ({globalStorage: state.globalStorage}))(DetailSugestion_);



