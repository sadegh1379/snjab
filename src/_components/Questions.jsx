import React, { Component } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import {userActions} from "../_actions";
import * as _ from "lodash";
export class Questions extends Component {
    constructor(props){
        super(props);
        this.state={
            questions:props.questions
        }
    }
    componentDidUpdate(props,state){

        if(this.props.questions!==props.questions){
            this.setState({questions:this.props.questions});
        }
    }
    render() {
        return (
            <>
                {this.state.questions.sort((a,b)=>{
                    if(a.select && b.select){
                        if(a.select.label < b.select.label) { return 1; }
                        if(a.select.label > b.select.label) { return -1; }
                        return 0;
                    }
                    return 0;
                }).map((q,i)=>
                    <div  className="w-100 d-flex justify-content-center align-items-center mb-3" key={i}>
                        <div className="col-lg-1">
                            {i+1}
                        </div>
                        <div className={'col-lg-8 px-0'}>
                            <input type="text-aria" className='form-control  border-0  '
                                   value={q.title}
                                   name='title'
                                   readOnly={this.props.disabled(q)}
                                   onChange={e=>{userActions.handleChangeSelect.call
                                   (this,e.target.value,
                                       {name:'title'},'questions',i);this.props.onChange
                                   (this.state.questions)}}
                            />
                        </div>
                        <div className={'col-lg-2 px-0 '}>
                            <Select className=""
                                    placeholder={q.selectPlaceholder || this.props.selectPlaceholder}
                                    value={q.select}
                                    name="select"
                                    onChange={(value,data)=>{userActions.
                                    handleChangeSelect.call(this,value,data,'questions',i)
                                    ;this.props.onChange(this.state.questions)}}
                                    options={q. selectOptions || this.props.selectOptions}
                                    getOptionLabel={opt => opt.label}
                                    getOptionValue={opt => opt.value}
                                    isMulti={q.isMulti || this.props.isMulti}
                                    isDisabled={this.props.disabled(q)}
                            />
                        </div>
                        <div className={' px-3 '}>
                        <button className="btn btn-link p-0 mx-auto"
                                onClick={()=> {this.props.deleteQuestion(q)}}>
                            <i className="fal fa-trash-alt text-danger"/> </button>
                        </div>
                    </div>
                )}
            </>
        )
    }
}



Questions.defaultProps =   {
    questions: [],
    selectOptions:[],
    isMulti:false,
    selectPlaceholder:'',
}
Questions.propTypes={
    onChange:PropTypes.func,
    selectOptions:PropTypes.array,
    selectPlaceholder:PropTypes.string,
    component:PropTypes.string,
    isMulti:PropTypes.bool,
    disabled:PropTypes.func,
    deleteQuestion:PropTypes.func,
    questions:PropTypes.arrayOf(PropTypes.shape({
        title:PropTypes.string,
        select:PropTypes.any,
        component:PropTypes.string,
        selectPlaceholder:PropTypes.string,
        selectOptions:PropTypes.array,
        isMulti:PropTypes.bool
    }))
}
