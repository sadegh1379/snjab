import React, { Component } from "react";
import { Navbar } from "./Navbar";
import PropTypes from 'prop-types';
import { TabbarMessage } from "./TabbarMessage";
import { connect } from "react-redux";
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroller";
import person from "../../assets/images/person.png";
import arrowback from "../../assets/images/arrowback.png";
import { userActions } from "../../_actions";
import { userConstants } from "../../_constants";
import { Dastorkar } from './shourtcuts/dastor_kar';
import {Pagination} from "../../_components/Pagination";
import {IndicatorAgahi} from './shourtcuts/IndicatorAgahi';
import {IndicatorCollectorOrMonitorComponent} from '../indicator/IndicatorCollectorOrMonitor';
import { Dashboard } from '../pdp/dashboard';
import { DigitalLibrary } from "./shourtcuts/DigitalLibrary";
class Instructions_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      has_more: true,
      items: [],
      nextHref: null,
      kartabl: [],
      sessions: "set",
      dastorkar: "set",
      checklist_page: "set",
      process_checklist: "set",
      program_suggestion: "set",
      payam: "set",
      ravesh: "set",
      mashi: "set",
      dastor_amal: "set",
      taiedie: "set",
      process_flowchart: "set",
      suggestion:"set",
      programs_confirmation:"set",
      search:"",
      typingTimeout :null,

      active:props.active || 1
    };
  }

  getMenu = () => {
    const submenu = this.props.match.params.submenu;
    switch (submenu) {
      case 'suggestion':
        return 'program';
      case 'programs_confirmation':
        return 'program'
      case 'checklist_page':
        return 'checklist_page'
      case 'inbox':
        return 'payam';

      case "eghdam": case "sessions": case "taiedie": case "dastor_amal": case "ravesh": case "dastor_kar": case "policy": case "checklist_page": case "mashi":
        return "daryafti";
      case "process_checklist": case "program_suggestion": case "process_flowchart": case "indicator_agahi":
        return submenu.split("_")[0];
      default:
        return submenu;
    }

  };

  getSubmenu = () => {
    const submenu = this.props.match.params.submenu;
    switch (submenu) {
      case "dastor_amal":
        return "dastor_amal";
      case 'checklist_page':
        return ""
      case "programs_confirmation":
        return "programs_confirmation";

      case "dastor_kar":
        return 'dastor_kar';

      case 'mashi':
        return 'policy';

      case 'program_suggestion': case 'indicator_eghdam': case 'process_checklist': case 'process_flowchart': case 'indicator_agahi':
        return submenu.split("_")[1]
      case 'programs_confirmation':
        return 'programs_confirmation'
      case 'payam':
        return 'inbox'
     
      default:
        return submenu;
    }

  };
  componentDidMount() {

    this.getDate(); 
 
}

  getDate = (page = 1) => {
    const { year } = this.props.globalStorage;
  
    this.props.dispatch(
      userActions.kartabl(year, page, 10, this.getMenu(), this.getSubmenu()))
      .then(res => {
      
   
        this.setState({ kartabl: res.data })
      });
    
  };
  
  loadMore = () => {
    this.setState({ items: [] });
  };

  search = (e) => {
    clearTimeout(this.typingTimeout);

    this.setState({ search: e.target.value })
    setTimeout(() => {
    this.props.dispatch(
      userActions.searchItem(this.state.search, this.getMenu(), this.getSubmenu()))
      .then(res => {
        if(!res.data.hasOwnProperty("message"))
        {
          this.setState({ kartabl: res.data });
        }
         
      })

      if(this.state.search===""){
       this.getDate()
      }

  },4000)

}

render() {

  const {active}=this.state;
  const submenu = this.props.match.params.submenu;
  const datas = this.state.items.map(item => {
    return (

      <div className="card cardstyle">
        <div className="card-body text-center">
          <div className="col-12 card-head ">
            <img className="card-img" src={person} alt="Card image" />
            <span className="card-text">{item.name}</span>
            <span className="date">{item.date}</span>
            <span className="icon-enable"></span>
          </div>

          <p className="card-text col-12 px-0 py-0">{item.description}</p>
          <p className="card-detail row px-0 py-0">
            <p className="col-6 logo my-0 px-0 py-0">
              <img src={person} alt="Card image" />
              <img src={person} alt="Card image" />
              <img src={person} alt="Card image" />
            </p>
            <p className="col-6 seedtail my-0">
              <span>{/* <img src={arrowback}/> */}</span>مشاهده جزییات
              </p>
          </p>
        </div>
      </div>
    );
  });

  return (

    <div className="shourtcut-pwa">
      <Navbar  url={`/pwa`}   
      name={
           submenu === 'dastor_kar' && "دستورکارها" 
        || submenu === 'sessions' && "صورت جلسات کمیته‌ها" 
        || submenu === 'checklist_page' && 'چک لیست ارزیابی' 
        || submenu === 'checklist_page' && 'چک لیست ارزیابی'
        || submenu === 'process_checklist' && 'ارزیابی فرآیندها'
        || submenu === 'program_suggestion'  && 'پیشنهاد برنامه ها'
        || submenu === 'payam' && 'پیام ها'
        || submenu === 'ravesh' && 'روش های اجرایی'
        || submenu === 'mashi' && 'خط مشی'
        || submenu === 'dastor_amal' && 'دستورالعمل ها'
        || submenu === 'taiedie' && 'کتابخانه دیجیتال'
        || submenu === 'process_flowchart' && 'فلوچارت فرآیندها'
        || submenu === 'programs_confirmation' && 'پایش برنامه'
        || submenu === 'indicator_agahi' && 'پایش شاخص'
        || submenu === 'indicator_eghdam' && 'اندازه گیری شاخص'
        }
        page={submenu === 'program_suggestion' && 'پیشنهاد برنامه'}
        link={submenu === 'program_suggestion' && '/pwa/detail_sugestion'}
        />
    <div className="container-fluid">
      <div className="col-12 instruction-pwa ">
  
        <div className="search-pwa w-100">
          <input
            autoComplete="new-password"
            type="text"
            className="inputText simple-search-pwa w-100"
            value={this.state.search}
            name="search"
            maxLength={11}
            placeholder="دنبال چه چیزی هستید؟"
            onChange={this.search}
            required
          />
        </div>
        <div
          className="card-columns py-2"
          ref={ref => (this.scrollParentRef = ref)}
        >
          {/* <InfiniteScroll
            pageStart={1}
            loadMore={this.loadMore}
            hasMore={this.state.has_more}
            initialLoad={false}
            useWindow={false}
            getScrollParent={() => this.scrollParentRef}
            height={100}
          > */}
           
            {submenu === 'dastor_kar' && <Dastorkar dastorkar={this.state.dastorkar} data={this.state.kartabl}   totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}/>}
            {submenu === 'sessions' && <Dastorkar sessions={this.state.sessions} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}/>}
            {submenu === 'checklist_page' && <Dastorkar checklist_page={this.state.checklist_page} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}} />}
            {submenu === 'process_checklist' && <Dastorkar process_checklist={this.state.process_checklist} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}} />}
            {submenu === 'program_suggestion' && <Dastorkar program_suggestion={this.state.program_suggestion} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}/> }
            {submenu === 'payam' && <Dastorkar payam={this.state.payam} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}} />}
            {submenu === 'ravesh' && <Dastorkar ravesh={this.state.ravesh} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}} />}
            {submenu === 'mashi' && <Dastorkar mashi={this.state.mashi} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}} />}
            {submenu === 'dastor_amal' && <Dastorkar dastor_amal={this.state.dastor_amal} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}} />}
            {submenu === 'process_flowchart' && <Dastorkar process_flowchart={this.state.process_flowchart} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}/>}
            {submenu === 'suggestion' && <Dastorkar suggestion={this.state.suggestion} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}/>}
            {submenu === 'programs_confirmation' && <Dastorkar programs_confirmation={this.state.programs_confirmation} data={this.state.kartabl} totalPage={this.props.totalPage}  active={1}   pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}/>}
            {submenu ==='indicator_eghdam' && <IndicatorCollectorOrMonitorComponent />}
            {submenu ==='taiedie' && <DigitalLibrary taiedie={this.state.taiedie} data={this.state.kartabl}/>}
            {submenu==='course' && <Dashboard/>}
           

          {/* </InfiniteScroll> */}
        </div>
      </div>

     
    </div>
    </div>
  );
}
}

export const Instructions = connect(state => ({
  globalStorage: state.globalStorage
}))(Instructions_);
Instructions.propTypes = {
 
  showPagination: PropTypes.bool,
  totalPage:PropTypes.number.isRequired,
  pageOnChange:PropTypes.func.isRequired,
  active:PropTypes.number,
};

Instructions.defaultProps = {
  showPagination: true,
}