import React from 'react';
import moment from 'jalali-moment';
import Select from 'react-select';
import {DatePicker} from "react-advance-jalaali-datepicker";
import {globalStorage} from "../_reducers/globalStorage.reducer";
import 'react-times/css/material/default.css';
import {connect} from 'react-redux';
import {userActions} from "../_actions";
import {userConstants} from "../_constants";
import {ToggleBotton} from "../_components";
import imen from '../assets/images/imenii.png';
import noavaranLogo from '../assets/images/dddd.png';
import TimePicker from 'react-times';
import loading from '../assets/images/loading2.gif';

class FMEA extends React.Component{

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
    resetForm=()=>{
        this.setState({
            job:'',
            ward:'',
            threat_factor:'',
            threat_factor_type:'',
            for_who:'',
            danger:'',
            cause:'',
            effects:'',
            control_measure:'',
            suggestions:'',
            submitted_by:'',
            submitted_by_other:'',
        })
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
                            this.resetForm();
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
            <form onSubmit={this.submitError} className="w-100 bg-drr py-5 error_report" style={{minHeight:'100%'}}>
                <img src={imen} alt="گــزارش عوامل تهدید کننده ایمنی بیمار" className="d-block mx-auto"
                     width={120}/>
                <h2 className="text-center text-primary h5 mt-4"> فــرم گـزارش عـوامـل تهـدیـد کننـده ایمنـی بیمـار
                 </h2>
                <div className="w-100 mb-5">
                    <img src={noavaranLogo} className="d-block mx-auto mt-3 animated fadeInUp"  style={{position: 'relative',top: '-7px'}} alt="سنجاب"
                         width={130}/>
                    <div className="d-flex justify-content-center animated zoomIn">
                        <div className="lines bg-blue col-6 col-sm-10  col-md-8 col-lg-3" style={{top: -19}}/>
                    </div>

                </div>


                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 ">
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30,fontSize: '12px'}}>اطلاعـات پایــه</h3>
                    <div className="row pt-5 ">
                        <div className="col-12  p-4">
                            <label className="text-right w-100 py-2 iran-sans_Bold" style={{fontSize: '11px'}}> شـرح موضـوع</label>
                            <input type="text"
                                   className="form-control rounded-pill text-center shadow-sm"
                                   style={{borderColor:'#efefef'}}
                                   name="threat_factor"
                                   value={threat_factor}
                                   onChange={userActions.handleChangeInput.bind(this)}
                            />
                        </div>


                        <div className="col-12 col-md-6 col-lg-4 p-4 position-relative">
                            <label className="text-right w-100 py-2 iran-sans_Bold" style={{fontSize: '11px'}}>نـوع عوامـل تهدیـد کننـده</label>

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
                            <label className="text-right w-100 py-2 iran-sans_Bold" style={{fontSize: '11px'}}>انتخـاب بخش گـزارش دهنـده</label>
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
                            <label className="text-right w-100 py-2 iran-sans_Bold" style={{fontSize: '11px'}}>عامـل تهـدیـد کننـده مربـوط بـه</label>
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
                            <label className="text-right w-100 py-2 iran-sans_Bold" style={{fontSize: '11px'}}>نـام گـزارش دهنـده</label>
                            {users.length==0 &&
                            <img className="mx-auto d-block position-absolute" style={{left:0,right:0,bottom:15,zIndex:99}} src={loading} alt="لطفاً کمی صبر کنید." width={50}/>
                            }
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
                            <label className="text-right w-100 py-2 iran-sans_Bold" style={{fontSize: '11px'}}>سایـر اعضـا</label>
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
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30,fontSize: '12px'}}>
                        خطـرات احتمـالـی
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
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30,fontSize: '12px'}}>
                        علـل خطـا
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
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30,fontSize: '12px'}}>
                        اثـرات و تبعـات
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
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30,fontSize: '12px'}}>
                        اقـدامات کنتـرلی مـوجـود
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
                    <h3 className="rounded-pill h5 iran-sans_Bold py-2 px-5 bg-secondary text-white position-absolute" style={{top:-23,right:30,fontSize: '12px'}}>
                        اقدامـات پیشنهـادی
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
                    <button type="submit" className="btn btn-secondary py-2 mx-5 rounded-pill" style={{minWidth:300}}>ثبت گــزارش</button>
                    <button type="reset" className="btn btn-outline-secondary py-2 mx-5 rounded-pill" style={{minWidth:300}} onClick={this.goBack}>بازگشت</button>
                </div>
            </form>
        )
    }
}
export default connect((state)=>({globalStorage:state.globalStorage}))(FMEA);
