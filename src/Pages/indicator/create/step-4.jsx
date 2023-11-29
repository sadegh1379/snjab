import React from 'react';
import {userActions} from "../../../_actions";
import {connect} from "react-redux";
import {ToggleBotton} from "../../../_components";

class Step4_ extends React.Component {
    constructor(props){
        super(props);
        this.state=Object.assign({},props.globalStorage.temp);
    }
    componentDidUpdate(props,state){
        if(props.globalStorage.temp!==this.state){
            this.props.dispatch(userActions.setTemp({temp:this.state}))
        }
    }
    render(){
        const {safety_related,safety_relatedes,see_bsc,see_bsces,bsc_weight}=this.state;
        return(

            <div className="forth-step">



                        <div className="step-content py-3">
                            <div className="d-flex flex-column align-items-center px-4">
                                <div className="question row w-100 my-3">
                                    <div
                                        className="question-num bg-blue d-flex flex-column align-items-center justify-content-around col-lg-2 col-sm-3 py-3">
                                        <i className="fas fa-question-circle fa-4x"></i>
                                        <span className="text-center" style={{fontSize:'13px'}}>سـوال اول</span>
                                    </div>
                                    <div className="d-flex flex-column align-items-center col-lg-10 col-sm-9 py-3">
                                        <p className="text-center iran-sans_Bold my-4">آیـا شـاخص مورد نظـر در BSC (کـارت
                                            امتیـازی متـوازن) بیمـارستـان دیـده شـود؟</p>
                                        <ToggleBotton btns={see_bsces} onClickHandel={(data) => {
                                            this.setState({see_bsc: data})
                                        }} toggle_state={see_bsc} className="toggle_btn text-center d-flex align-items-center w-100" style={{maxWidth:300}}
                                                      color="blue w-50"/>
                                        {
                                            see_bsc && see_bsc.value===true &&
                                            <div className="form-group text-center pt-4 col-sm-5 col-10">
                                                <label htmlFor="bsc_weight" className="color-dark iran-sans_Bold my-3">
                                                    وزن این شـاخص در BSC بیمـارستـان چـه مقـدار است؟
                                                </label>
                                                <input id="bsc_weight" type="text" className="form-control rounded-pill border-0 text-center"
                                                       name="bsc_weight"
                                                       value={bsc_weight}
                                                       onChange={userActions.handleChangeInput.bind(this)}/>
                                            </div>

                                        }
                                        {/*<div className="btn-group my-3">

                                            <button type="button" className="btn btn-outline-blue">خیـــر</button>
                                            <button type="button" className="btn btn-blue">بـله</button>
                                        </div>*/}
                                    </div>
                                </div>

                                <div className="question row w-100 my-3">
                                    <div
                                        className="question-num bg-blue d-flex flex-column align-items-center justify-content-around col-lg-2 col-sm-3 py-3">
                                        <i className="fas fa-question-circle fa-4x"></i>
                                        <span className="text-center" style={{fontSize:'13px'}}>سـوال دوم</span>
                                    </div>
                                    <div className="d-flex flex-column align-items-center col-lg-10 col-sm-9 py-3">
                                        <p className="text-center iran-sans_Bold my-4">آیا شـاخص مورد نظـر مربـوط بـه ایمنـی
                                            بیمـار است؟</p>
                                        <ToggleBotton btns={safety_relatedes} onClickHandel={(data) => {
                                            this.setState({safety_related: data})
                                        }} toggle_state={safety_related} className="toggle_btn text-center d-flex align-items-center w-100" style={{maxWidth:300}}
                                                      color="blue w-50"/>
                                        {/*<div className="btn-group my-3">
                                            <button type="button" className="btn btn-outline-blue">خیـــر</button>
                                            <button type="button" className="btn btn-blue">بـله</button>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>


            </div>


    )
    }
}
const Step4=connect((state) => ({globalStorage: state.globalStorage}))(Step4_);
export {Step4}