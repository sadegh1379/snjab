import React from 'react';
import {userActions} from "../_actions";
import PropTypes from 'prop-types';
export class FormHeader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected:"bg-navy-blue",
            isActive:0,
            renderComponent:'',
            submitStep:props.submitStep===undefined?props.parts.length:props.submitStep

        }
        this.handleClick=this.handleClick.bind(this);

    }
    componentDidMount(){
        const {currentStep,parts}=this.props;
        if(currentStep!==undefined && currentStep>0){
            this.handleClick(parts[currentStep-1].background,currentStep-1,parts[currentStep-1].component)
        }
    }

    async handleClick(partBg,id,component){
        const {parts,submitStep}=this.props;

        if(parts[id-1]){
            if(typeof parts[id-1].onLeave==='function' && !await parts[id-1].onLeave()){
                return false;
            }
        }
        if(submitStep===id &&!await this.props.submit()){
            return false;
        }

        this.setState({selected:partBg});
        this.setState({ isActive: id });
        this.setState({renderComponent:component})

    }
    createMarkup = (state) => {
        return {__html: state}
    }
    previusStep=()=>{
        const {parts}=this.props;
        const {isActive}=this.state;
            this.handleClick(parts[isActive-1].background,isActive-1,parts[isActive-1].component)

    }
    nextStep=()=>{
        const {parts}=this.props;
        const {isActive}=this.state;
            this.handleClick(parts[isActive+1].background,isActive+1,parts[isActive+1].component)

    }

    render() {
        return (

                    <div className="stepWrapper my-5 mx-sm-5 mx-3 bg-white">

                        <div className="steps py-3">
                            {/*<div> className="iran-sans_Bold align-items-center" style={{marginLeft:'auto',marginRight:'auto'}}>لطفـاً هر پنـج مرحلـه را طـی کنیـد</p>*/}
                            <hr className="m-5"/>
                            <div className="row justify-content-center px-4">
                                {this.props.parts.map((item, index) => (
                                    <div key={index} onClick={()=>this.handleClick(item.background,index,item.component)}
                                        className="d-flex flex-column align-items-center col-lg-2 col-sm-4 col-10 px-0">
                                        <button
                                            className={`btn ${item.background} text-white rounded-circle texe`}>{index + 1}</button>
                                        <div
                                            className={`step-name position-relative ${item.background} d-flex flex-column align-items-center w-100 my-4 py-4 ${this.state.isActive===index?'active':''}`}>
                                            <span className="text-center lalezar mb-4">{item.title}</span>
                                            <div dangerouslySetInnerHTML={this.createMarkup(item.icon)} />
                                        </div>
                                    </div>
                                ))}


                            </div>

                            <div className={`${this.state.selected} py-2`}></div>
                        </div>

                        <div className="step-content py-3">
                            {this.state.renderComponent}
                        </div>

                        <div className="row justify-content-center pb-4">
                            {this.state.isActive>0 && <button
                                className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1" onClick={this.previusStep}>بازگـشــت
                            </button>}
                            {this.state.isActive<this.props.parts.length-1 &&<button className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1" onClick={this.nextStep}>ثبت و
                                ادامـه
                            </button>}
                            {this.state.isActive===this.props.parts.length-1 &&<button className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1" onClick={this.props.submit}>
                                ثبت نهایی
                            </button>}

                        </div>

                    </div>


        )
    }
}

FormHeader.propTypes={
    submitStep:PropTypes.number,
    submit:PropTypes.func.isRequired,
    parts:PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        background: PropTypes.string,
        icon:PropTypes.any,
        component: PropTypes.element,
        onLeave:PropTypes.func
    }))
}
