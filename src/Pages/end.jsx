import React from 'react';
import {connect} from 'react-redux';
import {userActions} from "../_actions";
import {BreadcrumbsItem} from 'react-breadcrumbs-dynamic';
import gaugeIcon from '../assets/images/gauge.png';
import {globalStorage} from "../_reducers/globalStorage.reducer";
import noavaranLogo from '../assets/images/noavaran-logo.svg';
import {userConstants} from "../_constants";

// dowgani
import * as zhospital from '../hospital';
class End extends React.Component{

    constructor(props){
        super(props); 
    }
    componentDidMount(){
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function (event){
            window.history.pushState(null, document.title,  window.location.href);
        });
        // this.props.dispatch(userActions.getHospitals());
        // console.log(userActions.getUsers(zhospital.default.hospitalz));
        // const res=userActions.API('get', `/v1/hospitals`,null,true);
        // console.log(res);
        // ${zhospital.default.hospitalz}
        

    }

    render(){

        return (
            <form  className="w-100 bg-dr py-5 error_report" style={{minHeight:'100%'}}>
                {/* <img src={gozaresh_khata} alt="موفقیت آمیز" className="d-block mx-auto"
                     width={120}/> */}
                     {/* <img src={userConstants.SERVER_URL_2 + hospital.logo.url} alt={hospital.name} width={150}

                                         className="m-auto d-block"/> */}
                <div className="col-sm-12 col-md-6 col-lg-7 bg-dr   overflow-hidden pb-5"
                     style={{minHeight: '100%'}}>
                    <div className="d-block mx-auto mt-5 rounded-circle shadow-sm bg-white animated slideInDown position-relative overflow-hidden"
                         style={{width: 150, height: 150,zIndex:2}}>
                        {/* <img src={userConstants.SERVER_URL_2 + '/uploads/hospital/logo//logo.jpeg'} alt='' width={150} className="m-auto d-block"/> */}
                        <img 
                        // src={userConstants.SERVER_URL_2 + `${zhospital.default.hospital_name}`} 
                        src={userConstants.SERVER_URL_2 + `${zhospital.default.hospital_logo}`} 
                        alt={`${zhospital.default.hospital_name}`} 
                        width={150} 
                        className="m-auto d-block"/>
                    </div>

                <h2 className={` text-center text-primary h5 mt-4  ${'lineheight'} `}   > 
                <b   >از شركت شمـا</b> در نظـرسنجـي {`${zhospital.default.hospital_name}`} متشكـريـم
                </h2>
                <div className="w-100 mb-5">
                    <img src={noavaranLogo} className="d-block mx-auto mt-3 animated fadeInUp" alt="سنجاب"
                         width={60}/>
                    <div className="d-flex justify-content-center animated zoomIn">
                        <div className="lines bg-blue col-6 col-sm-10  col-md-8 col-lg-3" style={{top: -19}}/>
                    </div>
                </div>
             
      
                <div className="container bg-white rounded shadow position-relative mt-5 mb-2 infoBaseForm ">
                    <h3 className="rounded-pill h5  py-2 px-5 bg-secondary text-white position-absolute " style={{top:-17,right: 90}}>توجـه فرمـاییـد</h3>
                    <h6 className="text-center text-primary h5 mt-4 iransansbold "   >
                    <br />
                    <br />
                    <span className="text-center text-primary h5 mt-4 "   >لطفـاً</span> در نظـرسنجـي مجـدد وارد نشويـد زيـرا سيستـم آن را در نظـر نخـواهـد گـرفت
                <br/>
                    <br/>
                </h6>
                </div>
            </div>
            </form>
        )
    }

}
export default connect()(End);