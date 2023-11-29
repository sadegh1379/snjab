import React from 'react';
import moment from 'jalali-moment';
import Select from 'react-select';
import {DatePicker} from "react-advance-jalaali-datepicker";
import {globalStorage} from "../../_reducers/globalStorage.reducer";
import 'react-times/css/material/default.css';
import {connect} from 'react-redux';
import {userActions} from "../../_actions";
import {userConstants} from "../../_constants";
import {ToggleBotton} from "../../_components";
import fff from '../../assets/images/fmea.png';
import noavaranLogo from '../../assets/images/noavaran-logo.svg';
import TimePicker from 'react-times';
import { Navbar } from './Navbar';
class FMEA_ extends React.Component{

    constructor(props){
        super(props);
       const hideAtHospital=['11'].indexOf(props.match.params.hospital)>=0;
        this.state={
            wards:[],
            focused:'',
            users:[],
            job:'',
            ward:'',
            threat_factor:'',
            threat_factor_types:userActions.generateSelectLabelValue([
                'زیرساختی - کمبود منابع انسانی',
                'زیرساختی - ضعف عملکردی منابع انسانی',
                'زیرساختی - کمبود تجهیزات',
                'زیرساختی - نقص فنی تجهیزات',
                'فرآیندی - عدم رعایت دستورالعمل‌های روش‌های مراقبت و درمان',
                'فرآیندی - الزامات کیفی و فنی روش‌های مراقبت و درمان']),
            threat_factor_type:'',
            for_who:'',
            for_whos:userActions.generateSelectLabelValue(['پرسنل','بیمار','هر دو']),
            danger:'',
            cause:'',
            effects:'',
            control_measure:'',
            suggestions:'',
            submitted_by:'',
            submitted_by_other:'',
            hideAtHospital
        }
        this.myRef = React.createRef();
    }
    goBack=()=>{
        this.props.history.goBack();
    }

    searchFn=(value,type)=>{

            const {hospital}=this.props.match.params;

            this.props.dispatch(userActions.API('get',`/v1/search_${type}?hospital_id=${hospital}&query=${value}`,null,false)).then(res=>{
                if(type==='user'){
                    res.data.result.push({fn:'سایر',ln:'اعضا'})
                }
                this.setState({[type+'s']:res.data.result});
            });


    }
    search=(e,type)=>{
        const {value,name}=e.target;

        this.setState({[name]:value},()=>{
            if(value.length>=2){
                this.searchFn(value,type);
            }else{
                this.setState({[type+'s']:[]});
            }

        })
    }
    focused=(focused)=>{
        console.log(focused)
        this.setState({focused})
    }
    scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop)
    focuse_to=(elem)=>{

    }
    submitError=(e)=>{
        e.preventDefault();
        const {threat_factor,
            threat_factor_type,
            for_who,
            danger,
            cause,
            effects,
            control_measure,
            suggestions,
            ward,submitted_by,submitted_by_other}=this.state;
        if(threat_factor){
            if(threat_factor_type){

                if(ward){
                    console.log(ward)
                    if(submitted_by){
                        let x=this.props.match.params.hospital.indexOf('11')>=0?'خانم طلایی ':'';
                        const params={
                            hospital_id:this.props.match.params.hospital,
                            save:false,
                            threat_factor,
                            threat_factor_type:threat_factor_type.value,
                            for_who:for_who?for_who.value:'',
                            danger,
                            cause,
                            effects,
                            control_measure,
                            suggestions,
                            ward:ward.id,
                            submitted_by:submitted_by_other || submitted_by.id
                        }
                        this.props.dispatch(userActions.API('post','/v1/error_prevention',params)).then(res=>{
                            userActions.successAlert('ثبت عامل تهدید کننده ایمنی بیمار',
                                'گزارش شما' +

                                ' به کارشناس هماهنگ کننده ایمنی بیمار ' +x+
                                'ارسال گردید.');
                            this.props.history.goBack();
                        })

                    }else{
                        userActions.failure('لطفاً نام گزارش دهنده را انتخاب کنید.')
                    }
                  
                }else{
                    userActions.failure('لطفاً بخش را انتخاب کنید.')
                }
            }else{
                userActions.failure('لطفاً نوع عامل تهدید کننده را وارد کنید.')
            }
        }else{
            userActions.failure('لطفاً نام عامل تهدید کننده را وارد کنید.')
        }
       
    }
    componentDidMount(){
        this.searchFn('','ward');
        this.searchFn('','user');
    }
    render(){
        const {
            threat_factor,
            threat_factor_types,
            threat_factor_type,
            for_who,
            for_whos,
            danger,
            cause,
            users,
            effects,
            control_measure,
            suggestions,
            ward,
            submitted_by,
            wards,
            hideAtHospital,submitted_by_other
        }=this.state;
        return (
            <>
               <Navbar name="ایمنی بیمار" url={'/pwa/login'}  />
               <div className="container-fluid">
            <form onSubmit={this.submitError} className="w-100 bg-dr py-5 error_report" style={{minHeight:'100%',marginTop:'10%'}}>
                <img src={fff} alt="گــزارش عوامل تهدید کننده ایمنی بیمار" className="d-block mx-auto"
                     width={120}/>
                <h2 className="text-center text-primary h5 mt-4"> فــرم گزارش عوامل تهدید کننده ایمنی بیمار
                 </h2>
                <div className="w-100 mb-5">
                    <img src={noavaranLogo} className="d-block mx-auto mt-3 animated fadeInUp" alt="سنجاب"
                         width={60}/>
                    <div className="d-flex justify-content-center animated zoomIn">
                        <div className="lines bg-blue col-6 col-sm-10  col-md-8 col-lg-3" style={{top: -19}}/>
                    </div>

                </div>


                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30}}>اطلاعـات پایــه</h3>
                    <div className="row pt-5 ">
                        <div className="col-12  p-4">
                            <label className="text-right w-100 py-2 iran-sans_Bold"> شرح موضوع</label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}
                                   name="threat_factor"
                                   value={threat_factor}
                                   onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>


                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100 py-2 iran-sans_Bold">نوع عوامل تهدید کننده</label>

                            <Select className="w-100 text-justify custom-select-2"
                                    value={threat_factor_type}
                                    name="threat_factor_type"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={threat_factor_types}
                                    getOptionLabel={opt => opt.label}
                                    getOptionValue={opt => opt.value}
                            />

                        </div>
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100 py-2 iran-sans_Bold">انتخاب بخش گزارش دهنده</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={ward}
                                    name="ward"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={wards}
                                    getOptionLabel={opt => opt.name}
                                    getOptionValue={opt => opt.id}
                            />

                        </div>
                        {!hideAtHospital && <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100 py-2 iran-sans_Bold">عامل تهدیدکننده مربوط به...</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={for_who}
                                    name="for_who"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={for_whos}
                                    getOptionLabel={opt => opt.label}
                                    getOptionValue={opt => opt.value}
                            />

                        </div>}
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100 py-2 iran-sans_Bold">نام گزارش دهنده</label>
                            <Select className="w-100 text-justify custom-select-2"
                                    value={submitted_by}
                                    name="submitted_by"
                                    placeholder=""
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={users}
                                    getOptionLabel={u => (u.fn+' '+u.ln+(u.post && u.post!=='-' ?' ('+u.post+')':''))}
                                    getOptionValue={u => u.id}
                            />

                        </div>
                        {submitted_by && submitted_by.fn === 'سایر' && submitted_by.ln === 'اعضا' &&
                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100 py-2 iran-sans_Bold">سایر اعضا</label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor: '#efefef'}}
                                   name="submitted_by_other"
                                   value={submitted_by_other}
                                   onChange={userActions.handleChangeInput.bind(this)}

                            />

                        </div>
                        }

                    </div>
                </div>

                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30}}>
                        خطرات احتمالی
                    </h3>
                    <div className="row pt-5 ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="danger"
                                value={danger}
                                placeholder=""
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30}}>
                        علل خطا
                    </h3>
                    <div className="row pt-5 ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="cause"
                                value={cause}
                                placeholder=""
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>
                {!hideAtHospital && <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30}}>
                        اثرات و تبعات
                    </h3>
                    <div className="row pt-5 ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="effects"
                                value={effects}
                                placeholder=""
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>}
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30}}>
                        اقدامات کنترلی موجود
                    </h3>
                    <div className="row pt-5 ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="control_measure"
                                value={control_measure}
                                placeholder=""
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30}}>
                        اقدامات پیشنهادی
                    </h3>
                    <div className="row pt-5 ">
                        <div className="col-12 py-1 px-3">
                            <textarea
                                name="suggestions"
                                value={suggestions}
                                placeholder=""
                                onChange={userActions.handleChangeInput.bind(this)}
                                className="col-12 p-3 w-100 bg-light rounded border-0 shadow-sm"
                                style={{minHeight:120,maxHeight:120}}/>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center align-items-center mt-5 mb-5 ">
                    <button type="submit" className="btn col-5 btn-secondary py-2 mx-3 rounded-pill" style={{fontSize:"0.8em"}}>ثبت گــزارش</button>
                    <button type="reset" className="btn col-5  btn-outline-secondary py-2 mx-3 rounded-pill" style={{fontSize:"0.8em"}} onClick={this.goBack}>بازگشت</button>
                </div>
            </form>
            </div>
            </>
        )
    }
}

export const FMEA = connect(state => ({
    globalStorage: state.globalStorage
  }))(FMEA_);
