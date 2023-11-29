import React from 'react';
import {userActions} from "../../../_actions";
import {connect} from "react-redux";

class Step3_ extends React.Component {
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
        const {measure_interval,delivery_date_respite}=this.state;
        return(
            <div className="third-step">
            <div className="step-content py-3">
                <h3 className="h6 text-center iran-sans_Bold pb-4" style={{fontSize:'13px'}}>دوره تنـاوب اندازه گیـری شـاخص</h3>
                <div className="container">
                    <div className="time row justify-content-center">
                        <div className="d-flex justify-content-center col-xl-2 col-sm-4 col-6 my-1">
                            <button className={`${measure_interval==='روزانه'?'active-time-btn':''}  btn iran-sans_Bold`} onClick={()=>{this.setState({measure_interval:'روزانه'})}}>روزانــه</button>
                        </div>
                        <div className="d-flex justify-content-center col-xl-2 col-sm-4 col-6 my-1">
                            <button className={`${measure_interval==='هفتگی'?'active-time-btn':''}  btn iran-sans_Bold`} onClick={()=>{this.setState({measure_interval:'هفتگی'})}}>هفتگــی</button>
                        </div>
                        <div className="d-flex justify-content-center col-xl-2 col-sm-4 col-6 my-1">
                            <button className={`${measure_interval==='ماهانه'?'active-time-btn':''}  btn iran-sans_Bold`} onClick={()=>{this.setState({measure_interval:'ماهانه'})}}>مــاهـانــه</button>
                        </div>
                        <div className="d-flex justify-content-center col-xl-2 col-sm-4 col-6 my-1">
                            <button className={`${measure_interval==='سه ماه یکبار'?'active-time-btn':''}  btn iran-sans_Bold`} onClick={()=>{this.setState({measure_interval:'سه ماه یکبار'})}}>3 مـاه یکبـار</button>
                        </div>
                        <div className="d-flex justify-content-center col-xl-2 col-sm-4 col-6 my-1">
                            <button className={`${measure_interval==='شش ماه یکبار'?'active-time-btn':''}  btn iran-sans_Bold`} onClick={()=>{this.setState({measure_interval:'شش ماه یکبار'})}}>6 مـاه یکبـار</button>
                        </div>
                        <div className="d-flex justify-content-center col-xl-2 col-sm-4 col-6 my-1">
                            <button className={`${measure_interval==='سالانه'?'active-time-btn':''}  btn iran-sans_Bold`} onClick={()=>{this.setState({measure_interval:'سالانه'})}}>سـالانــه</button>
                        </div>
                    </div>

                    <h3 className="h6 text-center iran-sans_Bold mt-5">فرجـه زمانـی تحویـل داده</h3>
                    <p className="text-center iran-sans_Bold my-4">شمـا می توانیـد به کاربـران فرجـه زمانـی برای اندازه
                        گیـری شـاخص بدهیـد. به عنـوان مثـال تـا 10 روز بعـد از پایـان "مـاه"</p>

                    <div className="row justify-content-center">
                        <div
                            className="final-time d-flex flex-column align-items-center col-xl-3 col-md-5 col-sm-7 col-10 py-4 my-4">
                            <span className="iran-sans_Bold">تــــا</span>
                            <input type="text" className="form-control text-center w-75 my-3 py-4"
                                   name="delivery_date_respite"
                                   value={delivery_date_respite}
                                   onChange={userActions.handleChangeInput.bind(this)}/>
                                <div className="final-date row">
                                    <p className="iran-sans_Bold my-0">روز بعـد از</p>
                                    <span className="align-self-center text-center iran-sans_Bold mx-2">{measure_interval==='هفتگی'?'پایان هفته':(measure_interval==='سالانه'?'پایان سال':(measure_interval==='شش ماه یکبار'?'پایان شش ماه':(measure_interval==='سه ماه یکبار'?'پایان سه ماه':(measure_interval==='ماهانه'?'پایان ماه':(measure_interval==='روزانه'?'پایان روز':'')))))}</span>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    )
    }
}
const Step3=connect((state) => ({globalStorage: state.globalStorage}))(Step3_);
export {Step3}