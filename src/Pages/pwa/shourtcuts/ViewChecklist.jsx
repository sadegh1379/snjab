import React, { Component } from 'react';
import { Router, Route, BrowserRouter, Switch } from "react-router-dom";
import {userActions} from "../../../_actions";
import {userConstants} from "../../../_constants";
import * as _ from "lodash";
import Select from "react-select";
import { connect } from "react-redux";
import { globalStorage } from '../../../_reducers/globalStorage.reducer';
class ViewChecklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: this.props.location.state.detail,
            question: [],
            wards:[],
            ward:null

        }
    }
 componentDidMount(){
     this.props.dispatch(userActions.API('get',`v1/user/hospital/ward_lists`)).then(
         res=>{
             this.setState({wards:res.data})
       
         }
     )

 }
 saveTemperory=()=>{
    let sub='';
     let params={
        checklist_page_id:this.state.answer.object_id,
        year:this.props.globalStorage.year,   
        records:this.state.question.map((item,index)=>{
            return{
                question: item.question,
                value: item.answer,
                v: item.value,
                point_type: item.question_type,
                ans:item.answers.map((a,z)=>{
                    if (item.answers==a.nswer)
                    sub=a.id
                })
            }
        }),
        submitted_at:1,
        id:this.state.answer.special_object,
        cpar_id:sub,
        save_temp: true
    }
     this.props.dispatch(userActions.API('put',`v1/user/hospital/answer_checklist`,params)).then(
         userActions.successToast("پیام با موفقیت ثبت موقت گردید")
     )
 }
 save=()=>{
     let sub='';
    let params={
        checklist_page_id:this.state.answer.object_id,
        year:this.props.globalStorage.year,   
        records:this.state.question.map((item,index)=>{
            return{
                question: item.question,
                value: item.answer,
                v: item.value,
                point_type: item.question_type,
                ans:item.answers.map((a,z)=>{
                    if (item.answers==a.nswer)
                    sub=a.id
                })
            }
            
        }),
        submitted_at:1,
        id:this.state.answer.special_object,
        cpar_id:sub,
        save_temp: false 
 }
 this.props.dispatch(userActions.API('put',`v1/user/hospital/answer_checklist`,params)).then(
    userActions.successToast("پیام با موفقیت ثبت نهایی گردید")
)
}
 handleCancel=()=>{
  this.props.history.push('/pwa')
 }




     
    setAnswer = (e, question, answer_index, answer) => {
        const { name, value } = e.target;
        console.log(question)
        const { questions } = this.props.location.state;
        const index_array = name.split("-");
        const last_answer =
            questions[index_array[0]]["content"][index_array[1]]["answer"];
        if (question.question_type === "سوال باز") {
            questions[index_array[0]]["content"][index_array[1]]["answer"] = value;
        } else if (question.question_type === "کیفی") {
            questions[index_array[0]]["content"][index_array[1]]["answer"] =
                last_answer === answer.answer ? undefined : answer.answer;
            questions[index_array[0]]["content"][index_array[1]]["value"] =
                last_answer === answer.answer ? undefined : answer_index + 1;
        } else if (question.question_type === "دوسطحی") {
            questions[index_array[0]]["content"][index_array[1]]["answer"] =
                last_answer === answer.answer ? undefined : answer.answer;
            questions[index_array[0]]["content"][index_array[1]]["value"] =
                last_answer === answer.answer ? undefined : answer_index;
        } else {
            questions[index_array[0]]["content"][index_array[1]]["answer"] =
                last_answer === answer.answer ? undefined : answer.answer;
            questions[index_array[0]]["content"][index_array[1]]["value"] =
                last_answer === answer.answer ? undefined : answer.answer;
        }
        this.setState({question:[...this.state.question,question]});
         
    };
  
    render() {
        console.log(this.state.question)
        const { questions } = this.props.location.state;
        const { answer,wards ,ward} = this.state;
        console.log(this.props)
        return (
            <div className="container-fluid">
                <div className="pwa_checklist_type">
                    <div className="btn rounded-pill btn-primary w-100 domain">{answer.object.title}</div>

                    <div className="row my-4 justify-content-center">
                <div className="col-12 col-md-6">
                  <div className="form-group text-right ">
                    <label className="iran-sans_Bold text-right text-dark">
                      {" "}
                      بخش{" "}
                    </label>
                    <Select
                      className="text-center custom-select-2"
                      value={ward}
                      name="ward"
                      placeholder=""
                      onChange={userActions.handleChangeSelect.bind(this)}
                      options={wards}
                      getOptionLabel={opt => opt.name}
                      getOptionValue={opt => opt._id}
                      id="ward"
                    />
                  </div>
                </div>
            
              </div>
                    {questions.map((q, i) => {

                        return (

                            <div className="card">

                                <p className="w-100 text-center text-justify iran-sans_Bold ">{q.component !== 'default' ? q.component : ''}</p>


                                {q.content.sort((a, b) => {
                                    if (a.question_type && b.question_type) {
                                        if (a.question_type < b.question_type) { return 1; }
                                        if (a.question_type > b.question_type) { return -1; }
                                        return 0;
                                    }
                                    return 0;
                                }).map((question, h) =>

                                    <div className="table-question" key={h}>
                                        <div className={` text-center text-iransans py-1 ${question.question_type == 'سوال باز' ? 'width-95' : 'w-7100'} `}>
                                            <div className={`${h % 2 && "question-row "}  px-1 my-0 text-right py-1`} style={{fontSize:".8em"}}>
                                                {question.question}
                                            </div>
                                        </div>
                                        <tr>
                                            {q.content[0]['answers'].map((a, j) =>
                                                <th key={j} className="text-center iran-sans_Bold align-self-center  py-3" style={{ width: (25 / q.content[0]['answers'].length) + '%', fontSize: ".7em" }}>{a.answer}</th>
                                            )}
                                        </tr>
                                       <tr>
                                        {question.question_type !== 'سوال باز' && question.answers.map((a, z) =>

                                            <td key={z}
                                                className={`m-0 justify-content-center text-center text-iransans  py-1`}
                                                style={{ width: (25 / question.answers.length) + '%' }}>
                                                <input type="checkbox"
                                                   style={{opacity:0}}
                                                    name={i + '-' + h}
                                                    value={a.answer}
                                                    onChange={(e) => {this.setAnswer(e, question, z, a) }}
                                        
                                                />
                                                <i className={`fal ${a.answer == question.answer ? 'fa-circle text-success' : ''} ${h % 2 ? "question-row " : ''}  center-block custom-height text-center  `}></i>
                                            </td>
                                        )}
                                        {question.question_type == 'سوال باز'
                                            &&
                                            <textarea
                                                className="border-0 form-control mb-5 mt-2 p-2 shadow-sm w-100"
                                                name={i + '-' + h}
                                                value={question.answer}
                                                onChange={(e) => {this.setAnswer(e, question) }}
                                 
                                            ></textarea>
                                        }
                                        </tr>
                                    </div>
                                )}






                            </div>

                        )



                    })}
                </div>
                <div className="w-100 d-flex justify-content-center py-3 w-100">
                        <button onClick={this.saveTemperory} type="button" className="btn btn-blue rounded-pill px-1 mx-2 w-30" style={{width:"30%"}}>  ثبت موقت
                            </button>
                            <button onClick={this.save} type="button" className="btn btn-blue rounded-pill px-1 mx-2 w-30" style={{width:"30%"}}>  ثبت نهایی
                            </button>
                            <button type="button" className="btn btn-blue rounded-pill px-1  mx-2 w-30" style={{width:"30%"}}  onClick={this.handleCancel}>انصراف
                            </button>
                           
                        </div>
            </div>

        );
        
    }
}


export default connect(state => ({ globalStorage: state.globalStorage }))(ViewChecklist)