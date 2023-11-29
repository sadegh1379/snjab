import React, { Component } from "react";
import {Router, Route,BrowserRouter,Switch } from "react-router-dom";
import { PrivateRoute} from '../../_components';
import { Login } from "./Login";
import { Carousel }  from "./carousel";
import { Instructions } from './Instructions';
import { connect } from "react-redux";
import { userActions } from "../../_actions";
import { Chat } from "./Chat";
import { Message } from "./ChatSubFolder/Message";
import { RecentError } from './RecentError';
import { DetailDastorKar } from "./shourtcuts/DetailDastor";
import { Support } from "./Support";
import { ErrorReport } from "./ErrorReport";
import { FMEA }from "./Fmea";
import { detailPayam } from "./shourtcuts/DetailPayam";
import { DetailSugestion } from "./shourtcuts/DetailSugestion";
import { DefinationSteps } from './shourtcuts/DefinantionSteps';
import { DetailRavesh } from './shourtcuts/DetailRavesh';
import { Dashboard } from '../pdp/dashboard';
import { DetailIndicator } from './shourtcuts/DetailIndicator' ;

import {IndicatorCollectorOrMonitorComponent} from "../indicator";
import { CheckListCalender } from "./CheckListCalender";
import ViewChecklist from "./shourtcuts/ViewChecklist";
 class PWA_ extends React.Component {
  componentDidMount() {
    userActions.getMe();
    const elements = document.getElementsByClassName("wave");
    while (elements.length > 0) elements[0].remove();
  }

  render() {
    return (
     <>
     
       <PrivateRoute path='/pwa/dashboard/:submenu' exact component={Instructions} />
        <PrivateRoute path='/pwa' exact component={Carousel}/>
        <PrivateRoute path='/pwa/chat' exact component={Chat}/>
        <PrivateRoute path="/pwa/detail_payam" exact component={detailPayam}/>
        <PrivateRoute path='/pwa/dashboard/:submenu/:id' exact component={DetailDastorKar} />
        <PrivateRoute path='/pwa/detail_sugestion/defination_steps' exact component={DefinationSteps}/>
        <PrivateRoute path='/pwa/detail_sugestion' exact component={DetailSugestion}/>
        <PrivateRoute path='/pwa/detail' exact component={DetailRavesh}/>
        <PrivateRoute path='/pwa/recenterror' exact  component={RecentError}/>
        <PrivateRoute path='/pwa/support' exact component={Support}/>
        {/* <PrivateRoute path='/pwa/detail_indicator' exact component={DetailIndicator}/> */}
         <PrivateRoute path="/pwa/indicator/monitor/:pwa" component={IndicatorCollectorOrMonitorComponent} />
         <PrivateRoute path="/pwa/indicator/monitor/:pwa" component={IndicatorCollectorOrMonitorComponent} />
         <PrivateRoute path="/pwa/checklist_page" exact component={CheckListCalender} />
         <PrivateRoute path="/pwa/checklist_page/detail" exact  component={ViewChecklist} />
         <PrivateRoute path="/pwa/detail/dashboard" exact component={Dashboard}/>
        <Route path="/pwa/login" component={Login}  />
        <Route path="/pwa/errorreport" exact component={ErrorReport}/>
        <Route path="/pwa/fmea"  exact component={FMEA}/>
      
    

        
     </>
    );
  }
}


export const PWA = connect(state => ({
  globalStorage: state.globalStorage
}))(PWA_);
