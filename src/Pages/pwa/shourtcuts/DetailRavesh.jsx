import React, { Component } from 'react';
import { userConstants } from "../../../_constants";
import moment from "jalali-moment";
import { connect } from "react-redux";
import { userActions } from "../../../_actions";
import { Navbar } from "../Navbar";
import { Collapse } from "react-collapse";
class DetailRavesh_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: [],
            isOpened: true,
        }
    }
    componentDidMount() {
        this.setState({ detail: this.props.location.state.detail });
    }
    diffmoment = (d1, d2, from_now, diff, result_type) => {
        if (d1 && d2) {
            var min_date;
            var max_date;
            let rsult_type = "%";
            if (moment(d1).isBefore(d2)) {
                min_date = moment(d1);
                max_date = moment(d2);
            } else {
                min_date = moment(d2);
                max_date = moment(d1);
            }

            if (from_now) {
                if (rsult_type) {
                    if (rsult_type === "%") {
                        return moment().isBefore(min_date)
                            ? 0
                            : max_date.diff(moment(), diff) > 0
                                ? ((max_date.diff(min_date, diff) -
                                    max_date.diff(moment(), diff)) *
                                    100) /
                                max_date.diff(min_date, diff)
                                : 100;
                    } else {
                        return max_date.diff(moment(), diff) > 0
                            ? max_date.diff(moment, diff)
                            : 0;
                    }
                } else {
                    return max_date.diff(moment(), diff) > 0
                        ? max_date.diff(moment(), diff)
                        : 0;
                }
            } else {
                return max_date.diff(min_date, diff);
            }
        }
        if (d1 && from_now) {
            return moment(d1).diff(moment(), diff);
        } else {
            return "";
        }
    };


    render() {
        const  detail  = this.props.location.state.detail;
        const revise_at=detail.object.refer_at!=null && moment(detail.object.revise_at).format("jYYYY/jMM/jDD");
        const refer_at =detail.object.revise_at!=null && moment(detail.object.refer_at).format("jYYYY/jMM/jDD");
        const diff = Math.floor(
            this.diffmoment(
                moment(detail.object.revise_at).format("YYYY/MM/DD"),
                moment(detail.object.refer_at).format("YYYY/MM/DD"),
                moment(),
                "%"
            )
        );

        return (
          <div className="container-fluid">
            <div className="detail-shortcut">
                <Navbar
                    url={`/pwa/dashboard/${detail.submenu}`}
                    // page="روش اجرایی"
                    // link="#"
                    name={(detail.submenu=="dastor_amal" && 'جزییات دستورالعمل' )||
                    (detail.submenu=="ravesh" && 'جزییات روش های اجرایی' )||
                    (detail.submenu=="taiedie" && 'جزییات کتابخانه دیجیتال' ) ||
                    (detail.submenu=="programs_confirmation" && 'جزییات پایش برنامه' ) }
                />

                <div className="col-12 detail detail_ravesh" style={{ height: "100vh" }}>
                    <div className="col-12">
                        <div className="col-12 card cardstyle my-4">
                            <div className="row text-center">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 image_position">
                                            <div className="col-auto border_image">
                                                <div className="circle overflow_image">
                                                    <img
                                                        src={
                                                            userConstants.SERVER_URL_2 +
                                                            this.props.globalStorage.me.avatar.url
                                                        }
                                                        alt="Card image"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-12 d-flex mt-2  justify-content-center align-items-center card-name "
                                            style={{ fontSize: "0.9em", fontFamily: "iransansbold" }}
                                        >
                                            {this.props.globalStorage.me.firstname}{" "}
                                            {this.props.globalStorage.me.lastname}

                                        </div>
                                        <div className="col-12 d-flex  justify-content-center  text-center align-items-center date" >
                                            {moment(detail.created_at).format(
                                                "jDD jMMMM jYYYY"
                                            )}
                                        </div>
                                        <div className="col-12 d-flex  justify-content-center  text-center align-items-center  style_ravsh">روش اجـرایی</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 descrip-detail d-flex justify-content-center">{detail.object.title}</div>
                            <div className="card-body text-center px-0 py-0 ">
                                <div className="col-12 d-flex  justify-content-center  text-center align-items-center  style_ravsh">محـور مربوطـه</div>
                                <div className="col-12 d-flex  justify-content-center  text-center align-items-center descrip-detail">{detail.object.committee_name}</div>
                            </div>
                            <div className="card-body text-center px-0 py-0 ">


                                <div className="row mb-3  box_progress">
                                    <sub className="mb-1 w-20 sub_style">
                                        تاریخ شـروع
                                            <span>{revise_at}</span>
                                    </sub>
                                    <div
                                        className="progress w-60 p-0"
                                        style={{ width: "60%", margin: "1em" }}
                                    >
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            aria-valuenow={Number(diff.toString().split("%"))}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            style={{
                                                width: `${Number(diff.toString().split("%"))}%`
                                            }}
                                        ></div>
                                    </div>
                                    <sub className="mb-1 w-20 sub_style">
                                        تاریخ پایان<span>{refer_at}</span>
                                    </sub>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-12"
                        style={{ textAlign: "center", fontSize: "1.4em", color: "#4d4d4d" }}
                    >
                        <i
                            className="fal fa-chevron-down"
                            onClick={() => {
                                this.setState({ isOpened: !this.state.isOpened });
                            }}
                        ></i>
                    </div>
                    <Collapse isOpened={this.state.isOpened}>
                        {(detail.submenu === "ravesh" ||detail.submenu === "dastor_amal") &&
                            <>
                                <div className="col-12 steps  pr-4">هدف</div>
                                <div className="col-12">
                                    {detail.object.documention.map(item => {

                                        return (


                                            <div className="col-12 title_object">
                                                {item.goal}{" "}
                                            </div>

                                        )
                                    })
                                    }
                                </div>

                                <div className="col-12 steps  pr-4 mt-1 pb-1">دامنه کاربرد</div>
                                <div className="col-12 mb-5">
                                    {detail.object.documention.map(item => {

                                        return (


                                            <div className="col-12 title_object">
                                                {item.domain}{" "}
                                            </div>

                                        )
                                    })
                                    }
                                    </div>
                                
                        </>
                        }
                                    {detail.submenu === "policy" &&
                                        <>
                                            <div className="col-12 steps  pr-4">تعاریف</div>
                                            <div className="col-12">

                                                <div className="col-12 title_object">
                                                    {detail.object.define}{" "}
                                                </div>
                                                </div>
                                                <div className="col-12 steps  pr-4">دامنه خط مشی و روش</div>
                                            <div className="col-12">

                                                <div className="col-12 title_object">
                                                    {detail.object.domain}{" "}
                                                </div>

                                              </div>  
                                              <div className="col-12 steps  pr-4">چرایی، هدف و سیاست خط مشی</div>
                                            <div className="col-12">

                                                <div className="col-12 title_object">
                                                    {detail.object.goal}{" "}
                                                </div>

                                              </div>  
                                              <div className="col-12 steps  pr-4">روش ارزیابی، اطمینان از اجرای خط مشی</div>
                                            <div className="col-12">

                                                <div className="col-12 title_object">
                                                    {detail.object.evaluation_method}{" "}
                                                </div>

                                              </div> 
                                              <div className="col-12 steps  pr-4">امکانات و تسهیلات مورد نیاز</div>
                                            <div className="col-12">

                                                <div className="col-12 title_object">
                                                    {detail.object.facilities}{" "}
                                                </div>

                                              </div>   

                                        </>
                                    }
                            
                         
    
                    </Collapse>
                </div>


                )}

            </div>
            </div>
        )












    }
}

export const DetailRavesh = connect(state => ({
    globalStorage: state.globalStorage
}))(DetailRavesh_);