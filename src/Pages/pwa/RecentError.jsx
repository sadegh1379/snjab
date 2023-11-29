import React, { Component } from 'react';
import { userActions } from "../../_actions";
import { connect } from "react-redux";
import moment from 'jalali-moment';
import { Navbar } from "./Navbar";
import { Tabbar } from './Tabbar';
class RecentError_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            flag: 0

        }
    }
    componentDidMount() {
        this.getError()
    }
    handleChangeAll = () => {
        this.setState({ flag: 0 })
    }
    handleChangeError = () => {
        this.setState({ flag: 1 })
    }
    handleChangeAction = () => {
        this.setState({ flag: 2 })
    }

    getError = () => {
        const { year } = this.props.globalStorage;

        this.props.dispatch(
            userActions.recentError(year))
            .then(res => {

                // console.log(res.data)
                this.setState({ errors: res.data })
            });
    };

    render() {
  
        const { flag } = this.state;
        const errors = this.state.errors.map((item, index) => {
            if (item.report_type === true) {
                return (
                    
                    <div className="card cardstyle" key={item.id} style={item.report_type?{backgroundColor:"#1c94e0"}:{backgroundColor:"#5b5b5b"}}>
                    <div className="col-12 px-0">
                    <div className="row">
                        <div className="col-8">
        
                            <div className="row">
                                <div className="col-3">
                                   <span style={{fontSize: '32px', color:'#fff',display:"flex"}}>
                                    <i className="fal fa-info-circle"></i>
                                    </span>
                                </div>
                                <div className="col-9">
                                  <lable className="row label item_style ">{item.report_type ? "خطــا" : "وقایـع ناخواستـه"}</lable>
                                    <div className="row item_style2">{moment(item.created_at).format('jDD jMMMM jYYYY')}</div>
                                </div>
                                </div>
                           
                        </div>
                     
                        <div className="col-4 pl-0">
                            <lable className="row label item_style title_style">شماره خطـا</lable>
                            <div className="row item_style2 title_style">{item.tracking_code}</div>
                        </div>
                        </div>
                    </div>
                    <hr className="hrstyle" style={{color: '#fff',borderTop: '1px solid #fff', marginBottom: '.5em'}} />
                    <div className="col-12 px-0">
                        <div className="col-12 descriptionerror px-0">{item.description}</div>
                    </div>

                </div>

                )
            }
        })
        const all = this.state.errors.map((item, index) => {

            return (

                <div className="card cardstyle" key={item.id} style={item.report_type?{backgroundColor:"#1c94e0"}:{backgroundColor:"#5b5b5b"}}>
                    <div className="col-12 px-0">
                    <div className="row">
                        <div className="col-8">
        
                            <div className="row">
                                <div className="col-3">
                                   <span style={{fontSize: '32px', color:'#fff',display:"flex"}}>
                                    <i className="fal fa-info-circle"></i>
                                    </span>
                                </div>
                                <div className="col-9">
                                  <lable className="row label item_style ">{item.report_type ? "خطــا" : "وقایـع ناخواستـه"}</lable>
                                    <div className="row item_style2">{moment(item.created_at).format('jDD jMMMM jYYYY')}</div>
                                </div>
                                </div>
                           
                        </div>
                     
                        <div className="col-4 pl-0">
                            <lable className="row label item_style title_style">شماره خطـا</lable>
                            <div className="row item_style2 title_style">{item.tracking_code}</div>
                        </div>
                        </div>
                    </div>
                    <hr  style={{color: '#fff',borderTop: '1px solid #fff', marginBottom: '.5em'}}/>
                    <div className="col-12 px-0">
                        <div className="col-12 descriptionerror px-0">{item.description}</div>
                    </div>

                </div>

            )
        })
        const action = this.state.errors.map((item, index) => {
            if (item.report_type === false) {
                return (

                    <div className="card cardstyle" key={item.id} style={item.report_type?{backgroundColor:"#1c94e0"}:{backgroundColor:"#5b5b5b"}}>
                    <div className="col-12 px-0">
                    <div className="row">
                        <div className="col-8">
        
                            <div className="row">
                                <div className="col-3">
                                   <span style={{fontSize: '32px', color:'#fff',display:"flex"}}>
                                    <i className="fal fa-info-circle"></i>
                                    </span>
                                </div>
                                <div className="col-9">
                                  <lable className="row label item_style ">{item.report_type ? "خطــا" : "وقایـع ناخواستـه"}</lable>
                                    <div className="row item_style2">{moment(item.created_at).format('jDD jMMMM jYYYY')}</div>
                                </div>
                                </div>
                           
                        </div>
                     
                        <div className="col-4 pl-0">
                            <lable className="row label item_style title_style">شماره خطـا</lable>
                            <div className="row item_style2 title_style">{item.tracking_code}</div>
                        </div>
                        </div>
                    </div>
                    <hr style={{color: '#fff',borderTop: '1px solid #fff', marginBottom: '.5em'}} />
                    <div className="col-12 px-0">
                        <div className="col-12 descriptionerror px-0">{item.description}</div>
                    </div>

                </div>

                )
            }
        })
        return (
            <>
                <Navbar name="50 خطای اخیر" url={"/pwa"} />
                <div className="container-fluid">
                <div className="errorspage">
                    <div className="toggle_btn text-center d-flex align-items-center">
                        <button type="button" className="btn btn-error-recently rounded-pill p-1 w-50  "  onClick={this.handleChangeAll} ><span> همـه </span></button>
                        <button type="button" className="btn btn-error-recently rounded-pill p-1 w-50  "  onClick={this.handleChangeError} ><span> خطـا </span></button>
                        <button type="button" className="btn btn-error-recently rounded-pill p-1 w-50  "   onClick={this.handleChangeAction} ><span> وقایع ناخـواسته </span></button></div>
                    <div className="col-12 p-0 mt-4">{flag == 0 && all || flag == 1 && errors || flag == 2 && action}</div>
                </div>
                </div>
            </>
        )
    }
}
export const RecentError = connect(state => ({
    globalStorage: state.globalStorage
}))(RecentError_);