import React, {Component} from 'react';
import Select from 'react-select';
import Modal from "react-modal";
import ReactTooltip from 'react-tooltip';
import {connect} from "react-redux";
import {userActions} from "../_actions";
import {InputGenerator} from "./InputGenerator"


class ChecklistView extends React.Component {

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }
    render() {
        console.log("HERE")
        return (
            <form onSubmit={this.props.submit} className="p-4  text-right">
                <div className="container-fluid shadow rounded  py-2 pb-4 bg-white mt-5 ">
                    <div style={{position: "relative", bottom: "40px", right: "20px"}} className="row d-flex justify-content-center  p-3 ">
                        <div
                            className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5  ">اطلاعات
                            پــایه
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center p-3 ">
                        {this.props.menuItems.map((item, i) =>
                            <div className="col-lg-4  col-md-6 my-3 position-relative" key={i}>
                                <label htmlFor=""> {item.key}</label>
                                <div className="pt-2 pb-4 ">
                                   <input readOnly={this.props.readOnly} value={item.value !== "" ? item.value: "-"} className="form-control rounded-pill" />
                                </div>

                            </div>
                        )}

                    </div>
                </div>
                <br/>
                <br/>
                <div className="container-fluid shadow rounded  py-2 pb-4 bg-white ">
                    {/* {this.props.report_type && this.props.checklist_info &&
                    <>
                        <div className="row d-flex justify-content-center titleVlaue p-3 ">
                            <div
                                className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5 ">
                                {this.props.report_type}
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center p-3  ">
                            <div className="col-lg-9 ">
                                <label htmlFor=""> عنـوان</label>
                                <input type="text-aria"
                                       className="form-control  border-0 rounded-pill  boxshadow py-4 bg-white" readOnly
                                       value={this.props.checklist_info.title}/>
                            </div>
                            <div className="col-lg-3 ">
                                <label htmlFor=""> شمــاره</label>
                                <input type="text-aria"
                                       className="form-control  border-0 rounded-pill boxshadow  py-4 bg-white" readOnly
                                       value={this.props.checklist_info.number}/>
                            </div>
                            <div className="col-lg-12 col-md-12 mt-4 text-right my-2 ">
                                <label htmlFor=""
                                       className="rounded-pill  px-4 py-1 titleInput bg-white"> توضیحات/هــدف</label>
                                <textarea className="inputCkeckList boxshadow border-0" cols="30" rows="10" readOnly
                                          value={this.props.checklist_info.description}></textarea>
                            </div>
                        </div>

                    </>
                    } */}
                    <div className="container-fluid  ">
                        {this.props.records.map((record, i) =>
                            <div className="row py-5 " key={i}>
                                <p className="w-100 text-center text-justify iran-sans_Bold bg-blue rounded text-white py-1">{record.component !== 'default' ? record.component : ''}</p>
                                <div className="w-100 ">
                                    <div className="question-table text-center " >
                                        <div className="question-title d-flex mx-2 py-2" style={{minWidth: '1100px'}}>
                                            <div className="width-5 text-center  iran-sans_Bold ">ردیف</div>
                                            <div className="w-70 text-center iran-sans_Bold">موارد مورد بررسی (سوالات)
                                            </div>
                                            {this.props.guides.map((guide, j) =>
                                            <>
                                                <div key={j}
                                                    data-tip={guide.guide} data-for={`data-${j}`}
                                                     className="text-center iran-sans_Bold align-self-center rotate-90 "
                                                     style={{
                                                         width: (25 / this.props.guides.length) + '%',
                                                         fontSize: "1em"
                                                     }}>{guide.value}</div>
                                                     <ReactTooltip id={`data-${j}`} />
                                            </>
                                            )}

                                        </div>
                                        <div className="contents flex-column d-flex mx-2" style={{minWidth: '1100px'}}>
                                            {
                                                record.questions.map( (question, q_i) => {
                                                    return (
                                                        <div key={ q_i} className="row mx-0   " >
                                                            <div className="width-5 text-center text-iransans py-1 ">
                                                                <p className={`${q_i % 2 && "question-row"} shadow-sm mx-1 my-0 py-3 text-center CustomHeight`}>{q_i + 1}</p>
                                                            </div>

                                                            <div
                                                                className={` text-center text-iransans py-1 ${question.question_type == 'سوال باز' ? 'width-95' : 'w-70'} `}>
                                                                <p className={`${q_i % 2 && "question-row "} shadow-sm mx-1 my-0 py-2 text-center CustomHeight`}>
                                                                    {question.key}
                                                                </p>
                                                            </div>
                                                            {this.props.guides.map((guide, j) =>
                                                                <label key={j}
                                                                    className={`m-0 d-flex justify-content-center text-center text-iransans    position-relative  `}
                                                                    style={{width: (25 / this.props.guides.length) + '%'}}>
                                                                    <input type="checkbox"
                                                                        className="d-none"
                                                                        name={i + '-' + q_i }
                                                                        value={question.value === null ? undefined : question.value}
                                                                        onChange={(e) => {
                                                                            this.props.setAnswer(e, question, j, guide )
                                                                        }}
                                                                        disabled={this.props.readOnly}
                                                                    />
                                                                    <i className={`fa-2x fal ${guide.value ==  question.value ? 'fa-check text-success' : ''} ${q_i % 2 ? "question-row " : ''} shadow-sm mx-1 my-0 py-3 w-100 text-center `}></i>
                                                                    <span className="hint">{guide.value}</span>
                                                                </label>
                                                            )}
                                                            {/* {question.question_type !== 'سوال باز' && question.answers && question.answers.map((a, z) =>

                                                                <label key={z}
                                                                    className={`m-0 d-flex justify-content-center text-center text-iransans  py-1  position-relative  `}
                                                                    style={{width: (25 / question.answers.length) + '%'}}>
                                                                    <input type="checkbox"
                                                                        className="d-none"
                                                                        name={i + '-' + h}
                                                                        value={a.answer}
                                                                        onChange={(e) => {
                                                                            this.props.setAnswer(e, question, z, a)
                                                                        }}
                                                                        disabled={this.props.readOnly}
                                                                    />
                                                                    <i className={`fa-2x fal ${a.answer == question.answer ? 'fa-check text-success' : ''} ${h % 2 ? "question-row " : ''} shadow-sm mx-1 my-0 py-3 w-100 text-center `}></i>
                                                                    <span className="hint">{a.answer}</span>
                                                                </label>
                                                            )} */}
                                                        </div>
                                                    )
                                                })
                                            }
                                            
                                        </div>
                                        {/* 
                                            }).map((question, h) =>
                                                
                                                    
                                                    
                                                    
                                                    {question.question_type == 'سوال باز'
                                                    &&
                                                    <textarea
                                                        className="border-0 form-control mb-5 mt-2 p-2 shadow-sm w-100"
                                                        name={i + '-' + h}
                                                        value={question.answer}
                                                        onChange={(e) => {
                                                            this.props.setAnswer(e, question)
                                                        }}
                                                        readOnly={this.props.readOnly}
                                                    ></textarea>
                                                    }
                                                </div>
                                            )}

                                        </div> */}

                                    </div>

                                </div>
                            </div>
                        )}


                    </div>


                    {/* <div className="row justify-content-center pb-4 mt-4">
                        {this.props.submit &&
                        <button type="submit" className="btn btn-blue rounded-pill    mx-4 my-1 col-sm-5">ثبت</button>}
                        <button onClick={this.props.closeModal} type="reset"
                                className="btn btn-outline-blue rounded-pill    mx-4 my-1 col-sm-5">انصراف
                        </button>
                    </div> */}
                </div>
            </form>
        )
    }
}

const ChecklistViewComp = connect((state) => ({ globalStorage: state.globalStorage }))(ChecklistView);
export { ChecklistViewComp }