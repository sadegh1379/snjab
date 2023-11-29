import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { history } from './_helpers';
import {Header, PrivateRoute, Routes} from './_components';
import DocumentsCopm from './_components/Documents.jsx';
import loading from './assets/images/loading.gif';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/bootstrap-rtl.min.css';
import './assets/css/all.min.css';
import './assets/css/animate.css';
import './assets/sass/template.scss';
import {Router,Route,Switch,Redirect} from 'react-router-dom';
import axios from "axios";
import {userActions} from "./_actions";
import Home from './Pages/home';
import Login from './Pages/login';
import End from './Pages/end';
import Public from './Pages/public';
import PublicCheclist from './Pages/publicChecklist';
import ErrorReport from './Pages/error_report';
import FMEA from './Pages/fmea';
import {
    IndicatorIndexComponent,
    IndicatorListComponent,
    IndicatorCreateComponent,
    IndicatorDetailComponent,
    IndicatorChecklistComponent,
    IndicatorCollectorOrMonitorComponent,
    IndicatorDashbaord,
    SafetyRelatedIndicatorComponent
} from './Pages/indicator';


import {
    checkListDetailComponent,
    CheckListIndexComponent,
    CheckListPageComponent,
    ChecklistCreate,
    CheckListDashbaord
} from "./Pages/checklist"


import {
    ChecklistState
} from './Pages/checklist/listchecklist';


import {
    Education,
} from './Pages/pdp';
import { PWA } from './Pages/pwa/pwa';
import UpdateUsers from "./_helpers/updateUsers";
import { NewIndicatorCollectorOrMonitor } from './Pages/indicator/NewIndicatorCollectorOrMonitor';


class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            waitToRender:true
        }
        axios.defaults.headers.common['Authorization'] = this.props.globalStorage.token;
        const { dispatch,globalStorage } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            /*console.log(location);
            if(location.pathname.indexOf(globalStorage.current_page.location)===-1){
                dispatch(userActions.removeCurrentPage());
            }*/
        });

    }
    async componentDidMount(){
        const search = history.location.search;
        if(search){
            const params = new URLSearchParams(search);
            if(params){
                const token = params.get('Token');
                const year = params.get('Year');
                const id = params.get('id');
                if(token){
                    this.props.dispatch(userActions.setToken({token}))
                    await new Promise(r => setTimeout(r, 2000));
                }
                if(year){
                    this.props.dispatch(userActions.setStorage({year}))
                }
                if(id){
                    this.props.dispatch(userActions.setTemp(id,'id'))
                }

            }
        }
        this.setState({waitToRender:false})
    }
    Routes(){
        const {globalStorage}=this.props;
        return !this.state.waitToRender?(
            <Router history={history}>
                <div  style={{minHeight:'100vh'}}>
                    <Header history={history}/>
                    <Route path="/updateUsers/:hospital/:password" component={UpdateUsers}/>
                    <PrivateRoute path="/" component={Home}  exact={true} />
                    <Route path="/login" component={Login} exact/>
                    <Route path="/end" component={End} exact/>
                    <Route path="/doc" component={DocumentsCopm} />
                    <Route path="/login/error_report/:hospital" component={ErrorReport} />
                    <Route path="/login/FMEA/:hospital" component={FMEA} />
                    <Route path="/login/checklist/:hospital" component={PublicCheclist} />
                    <Route path="/login/public/:hospital" component={Public} />
                    <Route path="/pwa" component={PWA} />
                    <PrivateRoute path="/pdp" component={Education} />
                    <PrivateRoute path="/indicator" component={IndicatorIndexComponent} exact/>
                    <PrivateRoute path="/indicator/safety_related" component={SafetyRelatedIndicatorComponent} exact/>
                    <PrivateRoute path="/indicator/dashboard" component={IndicatorDashbaord} exact/>
                    <PrivateRoute path="/indicator/monitor" component={NewIndicatorCollectorOrMonitor} exact/>
                    <PrivateRoute path="/indicator/collector" component={NewIndicatorCollectorOrMonitor} exact/>
                    <PrivateRoute path="/indicator/list" component={IndicatorListComponent} exact/>
                    <PrivateRoute path="/indicator/list/detail/:id" component={IndicatorDetailComponent} exact/>
                    <PrivateRoute path="/indicator/list/create" component={IndicatorCreateComponent} exact/>
                    <PrivateRoute path="/indicator/list/edit/:id" component={IndicatorCreateComponent} exact/>
                    <PrivateRoute path="/indicator/list/checklist/:id" component={IndicatorChecklistComponent} exact/>
                    {/* <PrivateRoute path="/checklist/" component={ChecklistCreate} exact/> */}
                    <PrivateRoute path="/checklist/" component={CheckListIndexComponent} exact/>
                    <PrivateRoute path="/rezayat/" component={CheckListIndexComponent} exact/>
                    <PrivateRoute path="/checklist/create" component={ChecklistCreate} exact/>
                    <PrivateRoute path="/checklist/checklist_page" component={CheckListPageComponent} exact/>
                    <PrivateRoute path="/checklist/dashboard" component={CheckListDashbaord} exact/>
                    <PrivateRoute path="/checklist/detail/:id" component={checkListDetailComponent} exact/>
                    <PrivateRoute path="/checkliststate/" component={ChecklistState} exact/>
                    {/*    <Route path="/exam" component={Exam}  exact={true} />

                    <Route path="/login/user" component={Login} />
                    <PrivateRoute path="/user" component={UserPanel}  />*/}



                    {globalStorage && globalStorage.loading>0 &&
                    <div className="loading_req position-fixed bg-white w-100 h-100 zoomIn" style={{top:0,left:0,zIndex:99999}}>
                        <img src={loading} alt="در حال دریافت اطلاعات..." className="position-absolute m-auto loading" style={{left:0,right:0,top:0,bottom:0}}/>
                    </div>
                    }
                </div>
                <div className="wave">
                        <button onClick={()=>{window.scrollTo(0, 0)}} className="btn btn-link mx-auto d-block">
                            <i className="fal fa-chevron-up  circle" style={{background:"#104c82",padding:"10px",color:"#ffffff"}}/>
                        </button>
                        <p className="text-center" style={{fontSize:"0.8em"}}>
                            تمام حقوق نرم افزار سنجاب متعلق به

                    <a href="https://noavaran-sharif.ir" className="px-1 text-center" style={{color:"#104c82"}}> نـوآوران سلامت گستر شریف </a>
                   است
                </p>
                </div>

            </Router>
        ):(<div className="loading_req position-fixed bg-white w-100 h-100 zoomIn" style={{top:0,left:0,zIndex:99999}}>
            <img src={loading} alt="در حال دریافت اطلاعات" className="position-absolute m-auto loading" style={{left:0,right:0,top:0,bottom:0}}/>
        </div>)
    }
    render() {
        /*const {globalStorage}=this.props;
        const subdomain = window.location.hostname.split('.')
*/
        return (
            this.Routes()
        );
    }
}
function mapStateToProps(state) {
    const { globalStorage} = state;
    return {
        globalStorage
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
