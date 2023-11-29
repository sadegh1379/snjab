import React from 'react';

import '../../assets/sass/_form-header.scss'


export default class FormHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:"bg-navy-blue",
            isActive:0,
            renderComponent:''
        }

    }


    handleClick=(partBg,id,component)=>{
        this.setState({selected:partBg});
        this.setState({ isActive: id });
        this.setState({renderComponent:component})
    }
    createMarkup = (state) => {
        return {__html: state}
    }


    render() {
        return (
            <div className="forth-step">
                {/*<div className="note my-5 mx-sm-5 mx-3">*/}
                {/*<p className="text-center iran-sans_Bold py-4">کاربر گرامی: با توجه به پیچیدگی و حجیم بودن اطلاعات،*/}
                {/*ثبت شناسنامه شاخص به 5 بخش تقسیم شده است. لطفا توجه داشته باشید که هر 5 بخش را تکمیل نمایید</p>*/}
                {/*</div>*/}

                <div className="container-fluid">
                    <div className="step my-5 mx-sm-5 mx-3">

                        <div className="steps py-3">
                            <hr className="m-5"/>
                            <div className="row justify-content-center px-4">

                                {this.props.parts.map((item, index) => (
                                    <div onClick={()=>this.handleClick(item.background,index,item.component)}
                                        className="d-flex flex-column align-items-center col-lg-2 col-sm-4 col-10 px-0">
                                        <button
                                            className={`btn ${item.background} rounded-circle texe`}>{index + 1}</button>t-whit
                                        <div
                                            className={`step-name ${item.background} d-flex flex-column align-items-center w-100 my-4 py-4 ${this.state.isActive===index?'active':''}`}>
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
                            <button className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">ثبت و
                                ادامـه
                            </button>
                            <button
                                className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">بازگـشــت
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
