import React from 'react';
import {connect} from 'react-redux';
import {userActions} from "../_actions";
import logo from '../assets/images/logo.png';
import noavaranLogo from '../assets/images/noavaran-logo.svg';
import polling from '../assets/images/formgozaresh.png';
import enteghadat from '../assets/images/enteghadat.svg';
import gozaresh_khata from '../assets/images/gozaresh_khata.svg';
import last24 from '../assets/images/fmea.png';
import {userConstants} from "../_constants";
import {ToggleBotton,RCG} from "../_components";
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';
import {globalStorage} from "../_reducers/";
import moment from 'jalali-moment';
import Modal from "react-modal";
import { Link } from "react-router-dom";

Modal.setAppElement('#root');
class Login extends React.Component{

    constructor(props){
        super(props);
        this.state={
            hospital:null,
            loginView:true,
            gender:'',
            committee_id:[],
            law:false,
            secreter:false,
            toggles:[
                {
                    label:'زن',
                    value:'female',
                    icon:'fal fa-female'
                },
                {
                    label:'مرد',
                    value:'male',
                    icon:'fal fa-male'
                }
            ],
            firstname:'',
            lastname:'',
            national_id:'',
            personal_code:'',
            cell_phone:'',
            password:'',
            password_confirmation:'',
            verification:false,
            remember: false,
            wait_verify: 0,
            wait_remember: 0,
            code_1:'',
            code_2:'',
            code_3:'',
            code_4:'',
            capcha:'',
            capcha_src:'',
            dev:false
        }
        this.code_1 = React.createRef();
        this.code_2 = React.createRef();
        this.code_3 = React.createRef();
        this.code_4 = React.createRef();
    }
    componentDidMount(){
        this.props.dispatch(userActions.resetRemember());
        if(!this.props.globalStorage.hospitals.length){
            this.props.dispatch(userActions.getHospitals());
        }else {
            this.selectHospital();
        }
    }
    componentDidUpdate(last_props,last_state){
        if(last_props.globalStorage.hospitals!=this.props.globalStorage.hospitals){
            this.selectHospital();
        }
    }
    selectHospital=(hospital_id)=>{
        const search = this.props.location.search;
        let dev=false;
        if(search){
            const params = new URLSearchParams(search);
            if(params){
                hospital_id = params.get('hospital') || hospital_id;
                dev = params.get('dev');


            }
        }

        if( this.props.globalStorage.hospitals.length===1){
            hospital_id=this.props.globalStorage.hospitals[0].id;
        }
        if(hospital_id){
            this.setState({dev});
            this.props.globalStorage.hospitals.map(h=>{
                if(h.id==hospital_id){
                    this.getCommittees(hospital_id);
                    this.setState({hospital:h})
                }

            })
        }

    }
    resetForms=()=>{
        this.setState({
            firstname:'',
            lastname:'',
            national_id:'',
            personal_code:'',
            cell_phone:'',
            password:'',
            password_confirmation:'',
            gender:'',
            committee_id:[],
            law:false,
            secreter:false,
        })
    }
    toggleView=()=>{
        this.setState({loginView:!this.state.loginView});
        this.resetForms();
    }
    getCommittees=(id)=>{
        this.props.dispatch(userActions.getCommittees(id,moment().jYear()));
    }
    validNationalCode=(code)=>{
        let isValid=false;
        if(code && code.length===10){
            const splitedCode=code.split('');
            let sum=0;
            splitedCode.map((c,i)=>{
                if(i<9){
                    sum=sum+(parseInt(c)*(10-i));
                }
            });
            let mod=sum%11;
            if(mod<2){
                mod=11-mod;
            }
            isValid=11-mod===parseInt(splitedCode[9]);
        }
        return isValid;
    }
    handleCloseModal=()=> {
        this.setState({verification:false,remember:false});
    }
    goNextFild=(e,ref)=>{
        const {  value } = e.target;
        if(value && value.length ){
            if(ref){
                ref.current.focus();
            }else{
                if(this.state.cell_phone.length===11 && this.state.cell_phone.startsWith('09')){
                    this.verifyUser();
                }
            }

        }

    }
    showVerify=()=>{
        this.setState({verification:true,remember:false});
    }
    remember=()=>{
        this.setState({verification:true,remember:true});
    }
    register=()=>{
        const {firstname,
            lastname,
            national_id,
            personal_code,
            cell_phone,
            password,
            password_confirmation,
            gender,
            committee_id,
            hospital,secreter}=this.state;
        if(firstname.length){
            if(firstname.length){
                if(cell_phone.length===11 && cell_phone.startsWith('09')){
                    if(password.length>=6){
                        if(password_confirmation.length>=6 && password===password_confirmation){
                            if(gender){
                                if(secreter){
                                    if(!committee_id || !committee_id.length){
                                        userActions.failure('دبیر محترم لطفاً کمیته(های) خود را اتخاب نمایید.');
                                        return false;
                                    }
                                }
                                if(national_id && !this.validNationalCode(national_id)){
                                    userActions.failure('لطفاً کد ملی خود را بدرستی وارد کنید.');
                                    return false;
                                }
                                const params={firstname,
                                    lastname,
                                    national_id,
                                    personal_code,
                                    cell_phone,
                                    password,
                                    password_confirmation,
                                    gender:gender.value,
                                    committee_id:committee_id?committee_id.map(c=>c.id):[],
                                    hospital_id:hospital.id};
                                this.props.dispatch(userActions.API('post','/v1/user/signup',params)).then(res=>{
                                    this.showVerify();
                                    this.setState({wait_verify:cell_phone});
                                    setTimeout(()=>{
                                        this.setState({wait_verify:0});
                                    },1000*3*60);
                                }).catch(err=>{
                                    if(err.response.data.message==="you already registered"){
                                        this.props.dispatch(userActions.question("اخطار","این شماره تلفن قبلاً در سامانه ثبت شده است. اگر شماره وارد شده متعلق به شما است ولی کلمه عبور خود را فراموش کرده اید، آن را بازیابی کنید.")).then(res=>{
                                            if(res.value){
                                                this.remember();
                                            }
                                        });

                                    }
                                })
                            }else{
                                userActions.failure('لطفاً جنسیت را تعیین کنید.');
                            }
                        }else{
                            userActions.failure('کلمه عبور با تکرار آن منطبق نمی باشد.');
                        }

                    }else{
                        userActions.failure('کلمه عبور می بایست حداقل 6 کاراکتر باشد.')
                    }
                }else{
                    userActions.failure("لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید.");
                }
            }else{
                userActions.failure("لطفاً نام خانوادگی خود را وارد کنید.");
            }
        }else{
            userActions.failure("لطفاً نام خود را وارد کنید.");
        }


    }
    afterLogin=(token)=>{
        this.props.dispatch(userActions.start_request());
        const {hospital,dev}=this.state;
        if(dev){
            window.location.href=`http://dev.snjab.ir/user_panel/#/?hospital=${hospital.id}&token=${token}`;
        }else{
            window.location.href=`${userConstants.SNJAB_URL}user_panel/#/?hospital=${hospital.id}&token=${token}`;
        }

    }
    getTimer=t=>{
        if(t){
            if(t>60*1000){
                return Math.ceil(t/(60*1000))+' دقیقه';
            }else{
                return Math.ceil(t/(1000))+' ثانیه';
            }
        }
    }
    rememberPassword=()=>{
        const {cell_phone}=this.state;
        const {remember}=this.props.globalStorage;
        console.log(remember)
        if(!remember || remember.cell_phone !== cell_phone){
            if(cell_phone.length===11 && cell_phone.startsWith('09')) {
                this.props.dispatch(userActions.API('post', '/v1/user/resetpassword', {cell_phone})).then(res=>{
                    this.handleCloseModal();
                    userActions.successToast('کلمه عبور جدید برای شما ارسال شد.');
                    this.props.dispatch(userActions.setRemember({cell_phone,time:15*60*1000}))

                }).catch(error=>{
                    if (error.response.data.message == 'no such user.') {
                        userActions.failure('این شماره تلفن همراه در سامانه ثبت نشده است.');
                    }
                });
            }else{
                userActions.failure("لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید.");
            }
        }else{
            userActions.failure('لطفاً تا زمان دریافت پیامک کمی صبر نمایید. ' +
                '<br/>'+
                'در صورت عدم دریافت پیامک پس از ' +
                '' +this.getTimer(remember.time)+
                ' مجدداً تلاش کنید.')
        }

    }
    resend=()=>{
        const {cell_phone,wait_verify}=this.state;
        if(wait_verify!==cell_phone){
            if(cell_phone.length===11 && cell_phone.startsWith('09')){
                const params={ cell_phone}
                this.props.dispatch(userActions.API('post','/v1/user/resendcode',params)).then(res=>{

                    this.setState({wait_verify:cell_phone});
                    setTimeout(()=>{
                        this.setState({wait_verify:0});
                    },1000*3*60);
                    userActions.successToast('کد فعال سازی به شماره تلفن همراه شما مجدداً ارسال شد.');

                }).catch(err=>{
                    if(err.response.data.message==='no such user.' || err.response.data.message==='no user found with this cell_phone.'){
                        userActions.failure('این شماره تلفن در سامانه ثبت نشده است.');
                    }else{
                        userActions.failure('در خواست ارسال مجدد پیامک فعال سازی برای شما ثبت شده است. حهت ثبت دوباره درخواست باید 3 دقیقه صبر کنید.');
                    }
                })

            }else{
                userActions.failure("لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید.");
            }
        }else{
            userActions.failure('لطفاً تا زمان دریافت پیامک کمی صبر نمایید. ' +
                '<br/>'+
                'در صورت عدم دریافت پیامک پس از 3 دقیقه مجدداً تلاش کنید.')
        }


    }
    verifyUser=()=>{
        const {cell_phone,code_1,code_2,code_3,code_4}=this.state;
        if(cell_phone.length===11 && cell_phone.startsWith('09')){
            if(code_4.length && code_3.length && code_2.length && code_1.length){
                const params={username: cell_phone, sms_code: code_1+code_2+code_3+code_4}
                this.props.dispatch(userActions.API('post','/v1/user/verify',params)).then(res=>{
                    if(res.data.message=='no need for activation'){
                        this.props.dispatch(userActions.question("اخطار","این شماره تلفن قبلاً تأیید شده است. اگر شماره وارد شده متعلق به شما است ولی کلمه عبور خود را فراموش کرده اید، آن را بازیابی کنید.")).then(res=>{
                            if(res.value){
                                this.remember();
                            }
                        });

                    }else{
                        this.setState({verification:false,remember:false,loginView:true});

                    }
                }).catch(err=>{
                    if (err.response.status == 403) {
                        userActions.failure('کد وارد شده اشتباه است');
                    }
                })
            }else{
                userActions.failure('لطفاً کد تأیید را به طور کامل وارد کنید.')
            }
        }else{
            userActions.failure("لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید.");
        }
    }
    login=(e)=>{
        if(e){
            e.preventDefault();
        }
        const {cell_phone,password,hospital} =this.state;
        if(cell_phone.length){
            if(password.length>=6){

                const params={cell_phone,password,id:hospital.id};
                this.props.dispatch(userActions.API('post','/v1/user/signin',params,true,false)).then(res=>{

                    this.afterLogin(res.data.token);

                }).catch(err=>{
                    if(err.response.status=="401")
                        userActions.failure("نام کاربری یا کلمه عبور اشتباه است.");
                    else if(err.response.status=="403" || err.response.status=="402")
                        userActions.failure("اطلاعات شما هنوز توسط ادمین سامانه تأیید نشده است.");
                    else if(err.response.status=="404" || err.response.data.message==='user not found')
                        userActions.failure("این نام کاربری در سامانه موجود نیست.");
                })
            }else{
                userActions.failure('کلمه عبور می بایست حداقل 6 کاراکتر باشد.')
            }
        }else{
            userActions.failure("لطفاً نام کاربری خود را وارد کنید.");
        }


    }
    goTo=(url)=>{
        this.props.history.push(url);
    }
    verifyCapcha=()=>{
        const {capcha,capcha_src}=this.state;
        return capcha.toString()===capcha_src.toString();
    }
    result=(data)=>{
        this.setState({capcha_src:data});
    }
    render(){
        const {hospital,loginView,law,secreter,firstname,
            lastname,
            national_id,
            personal_code,
            cell_phone,
            password,
            password_confirmation,
            gender,
            committee_id,
            remember,
            wait_verify,
            wait_remember,
            code_1,
            code_2,
            code_3,
            code_4,
            capcha}=this.state;
        const {globalStorage}=this.props;
        return (
            hospital?
                <div className="h-100 container-fluid" style={{minHeight:'100vh'}}>

                    <div className="row h-100" style={{minHeight:'100vh'}}>
                        <div className="col-sm-12 col-md-6 col-lg-5 bg-primary overflow-hidden pb-5 position-relative" style={{minHeight:'100vh'}}>
                            {!loginView && <div className="position-absolute" style={{top:100,left:100,zIndex:99}}>
                                <button onClick={this.toggleView} type="reset" className="btn btn-link" data-tip="بازگشت به صفحه ورود">
                                    <i className="fal fa-reply text-light fa-2x"/>
                                    <ReactTooltip type="light" />
                                </button>

                            </div>}
                            <div className="mt-5 d-flex justify-content-center animated slideInDown">
                                <img src={logo} alt="سنجاب" height={150}/>
                            </div>
                            <h2 className="text-center mt-3 iran-sans_Bold h3 text-white animated fadeInUp">
                                سامانه نوین جامع اطلاعات بیمارستانی
                            </h2>
                            {loginView?
                                <form className="mt-3 d-flex flex-column justify-content-center align-items-center animated bounceInLeft" onSubmit={e=>{e.preventDefault();this.verifyCapcha()?this.login():userActions.failure('لطفاً حاصل عبارت را به درستی وارد کنید.')}} >
                                    <label className="col-sm-12 col-xl-6 clearfix mt-3" style={{minHeight:70}}>
                                        <b className="d-block iran-sans text-white text-right mb-2"> نام کاربری </b>
                                        <input autoComplete="new-password"
                                               maxLength={11}
                                               type="text"
                                               name="cell_phone"
                                               value={cell_phone}
                                               onChange={(e)=>userActions.handleChangeInput.call(this,e,'number')}
                                               placeholder="نام کاربری خود را وارد کنید"
                                               className="form-control rounded-pill text-center"/>
                                    </label>
                                    <label className="col-sm-12 col-xl-6 clearfix mt-3" style={{minHeight:70}}>
                                        <b className="d-block iran-sans text-white text-right mb-2">کلمه عبـور </b>
                                        <input autoComplete="new-password"
                                               type="password"
                                               placeholder="کلمه عبـور خود را وارد کنید"
                                               name="password"
                                               value={password}
                                               onChange={userActions.handleChangeInput.bind(this)}
                                               className="form-control rounded-pill text-center"/>
                                    </label>
                                    <label className="col-sm-12 col-xl-6 clearfix mt-3">
                                        <RCG className="bg-white mx-auto mb-3 rounded d-block"
                                             result={this.result}
                                        />
                                        <b className="d-block iran-sans text-white text-right mb-2">حاصل عبارت بالا چند است؟</b>

                                        <input autoComplete="new-password"
                                               type="text"
                                               placeholder="حاصل عبارت بالا را وارد کنید"
                                               name="capcha"
                                               value={capcha}
                                               onChange={userActions.handleChangeInput.bind(this)}
                                               className="form-control rounded-pill text-center"/>
                                    </label>
                                    <div className="col-sm-12 col-xl-6 clearfix mt-4" style={{minHeight:38}}>
                                        <button type="submit" className="btn btn-dark w-100 rounded-pill iran-sans_Bold">ورود</button>
                                    </div>
                                    <div className="col-sm-12 col-xl-6 clearfix mt-4" style={{minHeight:38}}>
                                        <button type="reset" className="btn btn-light text-blue w-100 rounded-pill iran-sans_Bold" onClick={this.toggleView}>ثبت نـام</button>
                                    </div>
                                    <div className="col-sm-12 col-xl-6 clearfix mt-3" style={{minHeight:38}}>
                                        <button type="button" onClick={this.remember} className="btn btn-link text-white text-center iran-sans_Bold w-100 rounded-pill">کلمه عبور خود را فراموش کردید؟</button>
                                    </div>

                                    <div className="col-sm-12 col-xl-6 clearfix mt-3" style={{minHeight:38}}>
                                        <button type="button" onClick={this.showVerify} className="btn btn-light d-block mx-auto px-5 lalezar rounded-pill">تأیید کد</button>
                                        <br/>
                                    </div>
                                    <br/>

                                    <b className="d-block iran-sans text-white text-right mb-2"> نسخــه 1.3.18.15 (بهــار 1402)</b>
                                </form>

                                :
                                <div className="container-fluid">
                                    <div className="mt-3 row  justify-content-center align-items-center animated bounceInLeft"  >
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2"> نام  </b>
                                            <input autoComplete="new-password"
                                                   type="text"

                                                   name="firstname"
                                                   value={firstname}
                                                   onChange={(e)=>userActions.handleChangeInput.call(this,e,'fa')}
                                                   placeholder="نام خود را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2"> نام خانوادگی </b>
                                            <input autoComplete="new-password"

                                                   type="text"
                                                   name="lastname"
                                                   value={lastname}
                                                   onChange={(e)=>userActions.handleChangeInput.call(this,e,'fa')}
                                                   placeholder="نام خانوادگی خود را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2"> کد پرسنلی  </b>
                                            <input autoComplete="new-password"
                                                   type="text"
                                                   name="personal_code"
                                                   value={personal_code}
                                                   onChange={userActions.handleChangeInput.bind(this)}
                                                   placeholder="کد پرسنلی خود را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2"> کد ملی </b>
                                            <input autoComplete="new-password"
                                                   maxLength={10}
                                                   type="text"
                                                   name="national_id"
                                                   value={national_id}
                                                   onChange={(e)=>userActions.handleChangeInput.call(this,e,'number')}
                                                   placeholder="کد ملی خود را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2"> تلفن همراه </b>
                                            <input autoComplete="new-password"
                                                   type="text"
                                                   maxLength={11}
                                                   name="cell_phone"
                                                   value={cell_phone}
                                                   onChange={(e)=>userActions.handleChangeInput.call(this,e,'number')}

                                                   placeholder="تلفن همراه خود را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <div className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2"> جنسیت </b>

                                            <ToggleBotton btns={this.state.toggles} onClickHandel={(data)=>{this.setState({gender:data})}} toggle_state={gender} className="toggle_btn text-center d-flex align-items-center"/>

                                        </div>
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2">کلمه عبـور </b>
                                            <input autoComplete="new-password"
                                                   type="password"
                                                   name="password"
                                                   value={password}
                                                   onChange={userActions.handleChangeInput.bind(this)}
                                                   placeholder="کلمه عبـور را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <label className="col-sm-12 col-xl-6 mt-3">
                                            <b className="d-block iran-sans_Bold text-white text-right mb-2">تکرار کلمه عبـور </b>
                                            <input autoComplete="new-password"
                                                   type="password"
                                                   name="password_confirmation"
                                                   value={password_confirmation}
                                                   onChange={userActions.handleChangeInput.bind(this)}
                                                   placeholder="تکرار کلمه عبـور را وارد کنید"
                                                   className="form-control rounded-pill text-center"/>
                                        </label>
                                        <button type="button" className="col-xl-12 mt-3 btn btn-link" onClick={()=>{this.setState({law:!law})}}>

                                        <span className="d-flex align-items-center text-white">
                                            <i className={`fas fa-2x px-2 ${law?"fa-check-square":"fa-square"}`}/>
                                           <u className="px-1 text-light">شـرایط و قـوانین</u>
                                           <span>مورد تأیید اینجانب است</span>
                                        </span>
                                        </button>

                                    </div>
                                </div>
                            }

                        </div>
                        {loginView ?
                            <div className="col-sm-12 col-md-6 col-lg-7 bg-dr   overflow-hidden pb-5"
                                 style={{minHeight: '100%'}}>
                                <div className="d-block mx-auto mt-5 rounded-circle shadow-sm bg-white animated slideInDown position-relative overflow-hidden"
                                     style={{width: 150, height: 150,zIndex:2}}>
                                    <img src={userConstants.SERVER_URL_2 + hospital.logo.url} alt={hospital.name} width={150}
                                         className="m-auto d-block"/>
                                </div>
                                <h2 className="text-center mt-3 iran-sans_Bold text-secondary">{hospital.name}</h2>
                                <div className="w-100">
                                    <img src={noavaranLogo} className="d-block mx-auto mt-3 animated fadeInUp" alt="سنجاب"
                                         width={60}/>
                                    <div className="d-flex justify-content-center animated zoomIn">
                                        <div className="lines bg-blue col-sm-8  col-md-6 col-lg-5" style={{top: -19}}/>
                                    </div>

                                </div>
                                <div className="container my-3">
                                    <div className="row">
                                        <div className="col-lg-6  col-sm-12">
                                            <button className="btn btn-link mx-auto d-block my-2 text-dark animated zoomIn" onClick={()=>{this.goTo('login/error_report/'+hospital.id)}}>
                                                <img src={gozaresh_khata} alt="گــزارش خطا" className="d-block mx-auto"
                                                     width={120}/>
                                                <span className="iran-sans_Bold py-2 d-block">گــزارش خطا</span>
                                            </button>
                                        </div>
                                        <div className="col-lg-6  col-sm-12">
                                            <button className="btn btn-link mx-auto d-block my-2 text-dark animated zoomIn" onClick={()=>{this.goTo('login/fmea/'+hospital.id)}}>
                                                <img src={last24} alt=" گزارش عوامل تهدید کننده ایمنی بیمار" className="d-block mx-auto"
                                                     width={120}/>
                                                <span className="iran-sans_Bold py-2 d-block"> گزارش عوامل تهدید کننده ایمنی بیمار</span>
                                            </button>
                                        </div>
                                        <div className="col-lg-6  col-sm-12" >
                                            <button className="btn btn-link mx-auto d-block my-2 text-dark animated zoomIn" >
                                                <img src={enteghadat} alt="پیشنهادات و انتقادات" className="d-block mx-auto"
                                                     width={120}/>
                                                <span className="iran-sans_Bold py-2 d-block">پیشنهـادات و انتقـادات</span>
                                            </button>
                                        </div>
                                        <div className="col-lg-6  col-sm-12">
                                            <button className="btn btn-link mx-auto d-block my-2 text-dark animated zoomIn" onClick={()=>{this.goTo('login/checklist/'+hospital.id)}}>
                                                <img src={polling} alt="نظـرسنجـی" className="d-block mx-auto" width={120}/>
                                                <span className="iran-sans_Bold py-2 d-block">فرم های گزارش دهی</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-sm-12 col-md-6 col-lg-7 bg-dr   overflow-hidden pb-5"   style={{minHeight: '100%'}}>
                                <p className="text-primary pt-5 text-center animated fadeIn iran-sans_Bold h5">
                                    کاربر گرامی در صورتی که دبیر کمیته هسـتید، کمیته مورد نظر خود را انتخاب کنید
                                </p>
                                <div className="mt-4 text-center animated zoomIn ">
                                    <button onClick={()=>{this.setState({secreter:!secreter})}} type="button" className="text-primary mx-auto text-center d-flex flex-column align-items-center justify-content-center btn btn-link" >
                                        <i className={`fas fa-2x px-2 ${secreter?"fa-check-square":"fa-square"}`}/>

                                        <b className="iran-sans_Bold mt-2 h5">
                                            دبیـر کمیتـه هستـم
                                        </b>
                                    </button>
                                </div>
                                {secreter &&
                                <div className="mt-4 mx-auto animated fadeInUp" style={{maxWidth: 500}}>
                                    <Select className="w-100 custom-select-2"
                                            value={committee_id}
                                            name="committee_id"
                                            placeholder="انتخـاب کمیتـه"
                                            onChange={userActions.handleChangeSelect.bind(this)}
                                            options={globalStorage.committees.filter(c=>c.name!=='ندارد')}
                                            getOptionLabel={opt => opt.name}
                                            getOptionValue={opt => opt.id}
                                            isMulti={true}
                                    />
                                    <hr/>
                                </div>
                                }
                                <div className="mt-2 d-flex justify-content-center flex-wrap align-items-center overflow-auto w-100" style={{height:400}}>
                                    {secreter && committee_id.map((c,i)=>
                                        <div key={i} className="bg-light-gray m-5 shadow rounded d-flex justify-content-center align-items-center animated bounceIn" style={{width:90,height:90}}>
                                            <i className={c.icon+" fa-4x "} style={{color:userConstants.COLORS[i]}}/>
                                        </div>
                                    )}
                                </div>
                                {law && <button onClick={this.register} className="btn btn-primary rounded-pill mt-5 mx-auto d-block w-75 text-center animated fadeInRightBig" style={{maxWidth:300}}>عضـویت</button>}

                            </div>
                        }
                    </div>
                    <Modal
                        isOpen={this.state.verification}
                        onRequestClose={this.handleCloseModal}
                        contentLabel="Example Modal"
                        portalClassName="full_screen_modal"
                    >
                        <div className="modal-content container px-5 border-0" >
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (remember) this.rememberPassword(); else this.verifyUser()
                            }} className="animated fadeIn row my-5 d-flex justify-content-center step2">

                                <div className="w-100  "  style={{maxWidth: 615}}>

                                    <div className="form-group text-right ">
                                        <label className="iran-sans_Bold text-primary my-3"> تلفن همــــراه</label>
                                        <div className="d-flex justify-content-around">
                                            <input
                                                className="form-control input-underline iran-sans_Bold text-center"
                                                type="text" placeholder="" maxLength={11}
                                                autoComplete="new-password"
                                                name="cell_phone"
                                                value={cell_phone}
                                                onChange={userActions.handleChangeInput.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                {remember ? '' :
                                    <div className="d-flex justify-content-center w-100 my-4"  style={{maxWidth: 615}}>
                                        <div className="col-sm-1 animated rubberBand"><input
                                            className="form-control input-underline iran-sans_Bold text-center "
                                            type="text"
                                            name="code_4"
                                            value={code_4} maxLength={1} tabIndex={5}
                                            onChange={userActions.handleChangeInput.bind(this)} onKeyUp={(e)=>{this.goNextFild(e,this.null)}} ref={this.code_4}/>
                                        </div>
                                        <div className="col-sm-1 animated rubberBand"><input
                                            className="form-control input-underline iran-sans_Bold text-center"
                                            type="text"
                                            name="code_3"
                                            value={code_3} maxLength={1} tabIndex={4}
                                            onChange={userActions.handleChangeInput.bind(this)} onKeyUp={(e)=>{this.goNextFild(e,this.code_4)}} ref={this.code_3}/>
                                        </div>
                                        <div className="col-sm-1 animated rubberBand"><input
                                            className="form-control input-underline iran-sans_Bold text-center"
                                            type="text"
                                            name="code_2"
                                            value={code_2} maxLength={1} tabIndex={3}
                                            onChange={userActions.handleChangeInput.bind(this)} onKeyUp={(e)=>{this.goNextFild(e,this.code_3)}} ref={this.code_2}/>
                                        </div>
                                        <div className="col-sm-1 animated rubberBand"><input
                                            className="form-control input-underline iran-sans_Bold text-center"
                                            type="text"
                                            name="code_1"
                                            value={code_1} maxLength={1} tabIndex={2}
                                            onChange={userActions.handleChangeInput.bind(this)} onKeyUp={(e)=>{this.goNextFild(e,this.code_2)}} ref={this.code_1}/>
                                        </div>
                                    </div>}
                                <div className="d-flex w-100 justify-content-center">
                                    <button className="rounded-pill btn btn-primary w-100 my-2  mx-2 iran-sans_Bold"
                                            style={{maxWidth: 300,minWidth:200}} type="button" onClick={this.handleCloseModal}
                                    >

                                        بازگشت

                                    </button>
                                    {!remember && <button className="rounded-pill btn btn-primary w-100 my-2  mx-2 iran-sans_Bold"

                                                          style={{maxWidth: 300,minWidth:200}} type="button" onClick={this.resend}
                                    >

                                        ارسال مجدد کد

                                    </button>}
                                    <button
                                        className="rounded-pill btn btn-primary custom-btn w-100 my-2 mx-2  iran-sans_Bold"
                                        style={{maxWidth: 300,minWidth:200}} type="submit"
                                    >

                                        {remember ? 'بازیابی کلمه عبور' : 'تأیید'}

                                    </button>

                                </div>

                            </form>
                        </div>
                    </Modal>
                </div>
                :
                <div className="h-100 container-fluid bg-dr py-5 " style={{minHeight:'100vh'}}>
                    <h2 className="text-center iran-sans_Bold h3 animated fadeInUp my-5">لطفـاً بیمـارستـان مـورد نظـر خــود را انتخـاب نمـاییدد</h2>
                    <h4 className="text-center h6 animated fadeInUp my-5">نسخــه 1.3.18.15 (بهــار 1402)</h4>
                    <div className="container d-flex flex-wrap justify-content-center align-items-center">
                        {globalStorage.hospitals.map((h,i)=> {
                                if (h.name === "بیمـارستـان سـاسـان") {
                                    return <a href="http://213.217.49.99" className="btn animated zoomIn rounded-circle p-0 w-100 h-100 shadow-sm flipper bg-transparent m-5" key={i} style={{minWidth:150,maxWidth:150,minHeight:150,maxHeight:150}}>
                                        <div className="flip-box-inner bg-light" style={{minHeight:150}}>
                                            <img className="front-face bg-light" src={userConstants.SERVER_URL_2+h.logo.url} alt={h.name} width={150}/>
                                            <div className="back-face bg-primary text-center iran-sans_Bold d-flex align-items-center justify-content-center w-100 h-100 text-light" style={{fontsize: '1em', lineheight: '2.2em' , padding: '10px'}}>
                                               <span>
                                                   {h.name}
                                               </span>
                                            </div>
                                        </div>
                                    </a>
                                }

                                if (h.name === "بیمارستان آتیه") {
                                    return <a href="http://snjab.atiehhospital.ir" className="btn animated zoomIn rounded-circle p-0 w-100 h-100 shadow-sm flipper bg-transparent m-5" key={i} style={{minWidth:150,maxWidth:150,minHeight:150,maxHeight:150}}>
                                        <div className="flip-box-inner bg-light" style={{minHeight:150}}>
                                            <img className="front-face bg-light" src={userConstants.SERVER_URL_2+h.logo.url} alt={h.name} width={150}/>
                                            <div className="back-face bg-primary text-center iran-sans_Bold d-flex align-items-center justify-content-center w-100 h-100 text-light" style={{fontsize: '1em', lineheight: '2.2em' , padding:' 10px'}}>
                                               <span>
                                                   {h.name}
                                               </span>
                                            </div>
                                        </div>
                                    </a>
                                }

                            if (h.name === "بیمارستان مرکز قلب") {
                                return <a href="http://172.16.0.40" className="btn animated zoomIn rounded-circle p-0 w-100 h-100 shadow-sm flipper bg-transparent m-5" key={i} style={{minWidth:150,maxWidth:150,minHeight:150,maxHeight:150}}>
                                    <div className="flip-box-inner bg-light" style={{minHeight:150}}>
                                        <img className="front-face bg-light" src={userConstants.SERVER_URL_2+h.logo.url} alt={h.name} width={150}/>
                                        <div className="back-face bg-primary text-center iran-sans_Bold d-flex align-items-center justify-content-center w-100 h-100 text-light" style={{fontsize:'1em', lineheight: '2.2em' , padding: '10px'}}>
                                               <span>
                                                   {h.name}
                                               </span>
                                        </div>
                                    </div>
                                </a>
                            }

                                return (<button onClick={()=>{this.selectHospital(h.id)}} className="btn animated zoomIn rounded-circle p-0 w-100 h-100 shadow-sm flipper bg-transparent m-5" key={i} style={{minWidth:150,maxWidth:150,minHeight:150,maxHeight:150}}>
                                    <div className="flip-box-inner bg-light" style={{minHeight:150}}>
                                        <img className="front-face bg-light" src={userConstants.SERVER_URL_2+h.logo.url} alt={h.name} width={150}/>
                                        <div className="back-face bg-primary text-center iran-sans_Bold d-flex align-items-center justify-content-center w-100 h-100 text-light" style={{fontsize: '1em', lineheight: '2.2em' , padding: '10px'}}>
                                        <span>
                                            {h.name}
                                        </span>
                                        </div>
                                    </div>
                                </button>)
                            }
                        )}
                    </div>
                </div>
        );
    }
}
export default connect((state)=>({globalStorage:state.globalStorage}))(Login);
