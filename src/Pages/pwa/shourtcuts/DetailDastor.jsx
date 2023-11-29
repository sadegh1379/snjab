import React, { Component } from "react";
import { userConstants } from "../../../_constants";
import moment from "jalali-moment";
import { connect } from "react-redux";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import student from "../../../assets/images/student.svg";
import agahi from "../../../assets/images/aghahi.png";
import program from "../../../assets/images/web-design.svg";
import appointment from "../../../assets/images/appointment.svg";
import kam from "../../../assets/images/kam.png";
import mamooli from "../../../assets/images/mamooli.png";
import bala from "../../../assets/images/bala.png";
import { Navbar } from "../Navbar";
import additional from "../../../assets/images/additinalicon.png";
import masoleanjam from "../../../assets/images/masoleanjam.png";
import Clips from "../../../assets/images/clip.svg";
import { Collapse } from "react-collapse";
import ReactTooltip from "react-tooltip";
import Modal from "react-modal";
import { userActions } from "../../../_actions";
import Select from "react-select";
import { TabbarMessage } from "../TabbarMessage";
import { Pointer } from "highcharts";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '30em'

  },
  overlay: { zIndex: 9999 }
};
class DetailDastorKar_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      percent: "0",
      isOpened: true,
      isResting: false,
      paragraphs: 0,
      detail: [],
      description_work: " ",
      open: false,
      top: false,
      files: [],
      action_not_recorded: [],
      action_type: "",

    };
  }

  componentDidMount() {
    if(this.props.location.state.detail.kartabl_actions==undefined)
    {
      this.setState({ percent:0})
    }
   else if (this.props.location.state.detail.kartabl_actions[1]) {
      this.setState({
        percent: this.props.location.state.detail.kartabl_actions[1].percent 
      });
    }
    else if (this.props.location.state.detail.kartabl_actions[0]) {
      this.setState({
        percent: this.props.location.state.detail.kartabl_actions[0].percent 
      })
    }
    else
    {
      this.setState({ percent:0})
    }
  
    this.actionNotRecorded()
  }
  handleFile = (event) => {
    // this.setState({files:event.target.files[0]})

    this.setState({ files: [...this.state.files, event.target.files[0]] })

  }
  actionNotRecorded = () => {
    let page = 1;
    let per = 10;
    const year = this.props.globalStorage.year;
    this.props.dispatch(userActions.API("get", `/v1/user/kartabl?year/v1/user/kartabl?year=${year}&page=${page}&per=${per}`))

      .then(res => {
        this.setState({ action_not_recorded: res.data[2].action_description_defaults });
      });
  }


  submitDescriptionAction = () => {
    let params = {
      id: this.props.location.state.detail._id,
      action_description: this.state.description_work,
      percent: this.state.percent,
      description: this.state.action_type.description,
      files: this.state.files
    }
    this.props.dispatch(userActions.API("put", `/v1/user/kartabl/submit_action_description`, params))
    this.setState({ modalIsOpen: false })

  }



  openBottomSheet = open => {
    this.setState({ open });
  };

  toggleBottomSheet = () => {

    this.setState({ open: true })
  };
  sendDetailDastor = () => {
    if (this.state.open) {
      this.setState({ modalIsOpen: true })
    }
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false });
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

  // handleSendMessage = () => {
  //    const {action_type}=this.state
  //   let params = {
  //     id: action_type._id,
  //     action_description: "شرح↵",
  //     percent: "0",
  //     description: "انجام نشده به دلیل سایر موارد",
  //     files: this.state.files
  //   };
  //   this.props
  //     .dispatch(userActions.API("post", "/v1/user/mail/compose", params))
  //     .then(res => {});
  // };


  render() {
    console.log(this.props.location.state.detail)
    const { description_work, files, action_not_recorded, action_type } = this.state;
    const { detail } = this.props.location.state;
    const start_at = moment(detail.object.start_at).format("jYYYY/jMM/jDD");
    const finish_at = moment(detail.object.finish_at).format("jYYYY/jMM/jDD");
    const diff = Math.floor(
      this.diffmoment(
        moment(detail.object.start_at).format("YYYY/MM/DD"),
        moment(detail.object.finish_at).format("YYYY/MM/DD"),
        moment(),
        "%"
      )
    );

    const steps = detail.object.steps.map((item, index) => {
      return (
        <>
          <div className="row" key={index}>
            <div className="col-2 step_title">
              <span
                className="steppic"
                style={{
                  position: "absolute",
                  right: "0",
                  width: "10px",
                  background: "#ccc"
                }}
              ></span>
              <div
                className="col-12"
                style={{ textAlign: "center", display: "inline-table" }}
              >
                <span
                  style={{
                    width: "100%",
                    display: "block",
                    fontFamily: "iransansBold"
                  }}
                >
                  {" "}
                  گــام{" "}
                </span>
                <span
                  style={{
                    width: "100%",
                    display: "block",
                    fontFamily: "iransansBold"
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{ width: "100%", display: "block" }}
                  data-tip={detail.committee.secretary_id}
                >
                  <img
                    style={{ width: "25px" }}
                    src={masoleanjam}
                    alt="masolanjam"
                  />
                  <ReactTooltip type="dark" />
                </span>
              </div>
            </div>
            <div className="col-10 title_object">{item.description}</div>
          </div>
        </>
      );
    });

    return (
      <div className="container-fluid">
      <div className="detail-shortcut">
        <Navbar
          url={`/pwa/dashboard/${detail.submenu}`}
          // page="شرح اقدامات"
          link="#"
          name={detail.submenu === 'dastor_kar' && " جزییات دستورکارها" 
          || detail.submenu === 'sessions' && " جزییات صورت جلسات کمیته‌ها" 
          || detail.submenu === 'checklist_page' && 'جزییات چک لیست ارزیابی' 
          || detail.submenu === 'process_checklist' && 'جزییات ارزیابی فرآیندها'
          || detail.submenu === 'program_suggestion'  && 'جزییات پیشنهاد برنامه ها'
          || detail.submenu === 'payam' && 'جزییات پیام ها'
          || detail.submenu === 'ravesh' && 'جزییات روش های اجرایی'
    
          || detail.submenu === 'process_flowchart' && 'جزییات فلوچارت فرآیندها'
          || detail.submenu === 'programs_confirmation' && 'جزییات پایش برنامه'
          || detail.submenu === 'indicator_agahi' && 'جزییات پایش شاخص'
          || detail.submenu === 'indicator_eghdam' && 'جزییات اندازه گیری شاخص'
        }
        />

        <div className="col-12 detail" style={{ height: "100vh" }}>
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
                    <div className="col-12 d-flex  justify-content-center  text-center align-items-center date">
                      {moment(detail.object.created_at).format(
                        "jDD jMMMM jYYYY"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 descrip-detail">{detail.tags}</div>
              <div className="card-body text-center px-0 ">
                {/* <div className="col-12 text-right" style={{fontFamily: 'iransansbold',fontSize: '.8em',position: 'relative',top: '-27px',right:'-33px'}}>تاریخ جلسه</div>
                <div className="col-12 dateset my-2">
                  {dayofweak + day + month + year}
                </div> */}
                {/* <div className="row icons my-2">
                  <div className=" icon_detail">
                    <p className="commite_detail">
                      <i
                        style={{'fontSize': '1.5em', color: '#fff'}}
                        data-toggle="tooltip"
                        place="top"
                        data-tip={detail.mehvar || detail.committee.name}
                        className={`${detail.object.mehvar_icon || detail.committee.icon}`}
                      />
                    </p>
                  </div>

                  <div className="icon_detail">
                    <img
                      src={detail.for === "eghdam" ? student : agahi}
                      alt={detail.for === "eghdam" ? student : agahi}
                    />
                  </div>
                  <div className="icon_detail">
                    <img
                      src={
                        (detail.record_type === "program" && program) ||
                        (detail.record_type === "event" && appointment) ||
                        (detail.record_type === "step" &&
                          detail.object.priority_status === 1 &&
                          kam) ||
                        (detail.record_type === "step" &&
                          detail.object.priority_status === 3 &&
                          mamooli) ||
                        (detail.record_type === "step" &&
                          detail.object.priority_status === 5 &&
                          bala)
                      }
                      alt={"record_type"}

                    />
                  </div>
                </div> */}

                <div className="row mb-2 box_progress px-4 py-2">
                  <p
                    className="mb-2"
                    style={{ fontFamily: "iransansbold", fontSize: "0.7em" }}
                  >
                    پیشـرفت کار
                  </p>
                  <div className="progress col-12 p-0">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={this.state.percent}
                      aria-valuemin={0}
                      aria-valuemax={10}
                      style={{ width: `${this.state.percent}%` }}
                    ></div>
                  </div>

                  <sub
                    className="mt-2"
                    style={{ position: "relative", right: "50%" }}
                  >
                    100%
                  </sub>
                  <sub
                    className="mt-2"
                    style={{ position: "relative", left: "50%" }}
                  >
                    0%
                  </sub>
                </div>
                <div className="row mb-3  box_progress">
                  <sub className="mb-1 w-20 sub_style">
                    تاریخ شـروع
                    <span>{start_at}</span>
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
                    تاریخ پایان<span>{finish_at}</span>
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
            <div className="col-12 steps  pr-4">گـام هـا و شـرح تصمـیمات </div>
            <div className="col-12">
              <div className="row">
                <div className="col-2 step_title">
                  {" "}
                  <span className="steppic"></span> گــام شمـا
                </div>
                <div className="col-10 title_object">
                  {detail.object.step.description}{" "}
                </div>
              </div>
            </div>
            <span className="hrstyle col-12">
              <hr />
            </span>

            {detail.object.steps.length > 0 && (
              <div className="col-12">{steps}</div>
            )}
          </Collapse>
        </div>

        {detail.for === "eghdam" && (
          <SwipeableBottomSheet
            overflowHeight={this.state.open ? 0 : 55}
            open={this.state.open}
            onChange={this.openBottomSheet}
            bodyStyle={
              this.state.top ? { position: "absolute", bottom: "200px" } : ""
            }
          >
            <div style={{height: "340px"}} className="answer">
              <div
                className={this.state.open ? "send_data" : "title-pwa"}
                onClick={this.toggleBottomSheet}
              >
                {this.state.open ? <span style={{ fontSize: ".7em" }}>شـرح اقدامـات انجام شده دربـاره این مصوبـه را بنویسیـد</span> : "شرح اقدامات انجام شده"}
              </div>
              <div className="content">
                <div class="file-upload">
                  <label for="file-input" className="m-auto">
                    <img
                      alt="Clips"
                      src={Clips}
                      style={{ pointerEvents: "none", width: "30px" }}
                    />
                  </label>

                  <input id="file-input" type="file" onChange={this.handleFile} />
                </div>
                <div className="row m-auto">
                  {this.state.files != null && this.state.files.map(item => {

                    return (
                      <div className="col-2 file_preview m-1 d-flex justify-content-around px-0">
                      

                          <div><i className="fa fa-paperclip" aria-hidden="true" style={{ fontSize: ".5em" }}></i></div>
                          <div  onClick={(e) => {
                            this.setState(prevState => {
                              const files = prevState.files.filter(file => file.name !== item.name);
                              return { files };
                            });
                          }
                          }

                          ><i className="fa fa-trash" aria-hidden="true" style={{ fontSize: ".5em" }} ></i></div>
                        </div>

                   
                    )

                  })}
                </div>
                <div class=" text-center p-1">
                  <p style={{ width: "100%" }}>
                    <textarea
                      placeholder="چیزی بنویسید..."
                      type="text"
                      onChange={userActions.handleChangeInput.bind(this)}
                      name="description_work"
                      value={description_work}
                      style={{
                        width: "100%",
                        borderRadius: ".5em",
                        boxShadow: "unset",
                        minHeight: "150px",
                        border: "1px solid #ccc",
                        fontSize: ".6em",
                        height: "150px",
                        padding: ".75em"

                      }}
                    />
                    <button onClick={this.sendDetailDastor} className="btn w-60" style={{ border: "1px solid #fff", color: "#fff", borderRadius: "50em", width: '100%', marginTop: '1em' }}>ارسـال</button>
                  </p>
                  <p>

                  </p>
                  {/* <p style={{width:'100%'}} ><button className="btn round-pill btn-primary  col-12" style={{borderRadius:'50em'}} onClick={this.handleSendMessage}>ارسال</button></p> */}
                </div>
              </div>
            </div>
          </SwipeableBottomSheet>
        )}
        {this.state.modalIsOpen &&
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Example Modal"

          >
            <div className="modal_action_eghdamat">
              <p className="text-center " style={{ fontFamily: 'iransansbold', fontSize: '.8em' }}>کاربر گرامی لطفا جهت ثبت پیشرفت کار این برنامه،  وضعیت عملکردی خود را از موارد زیر انتخاب کنید</p>
              <div className="row text-center" >
                <Select
                  className="w-100 text-justify custom-select-2 select_style"
                  value={action_type}
                  onChange={userActions.handleChangeSelect.bind(this)}
                  name="action_type"
                  placeholder="وضعیت عملکرد خود را انتخاب کنید..."
                  options={this.state.action_not_recorded}
                  getOptionLabel={opt => opt.description}
                  getOptionValue={opt => opt._id}
                />
              </div>
            </div>
            <div className="col-12 text-center">
              <button
                type="button"
                className="col-10 btn btn-blue rounded-pill    mx-4 my-1 m-auto"
                onClick={this.submitDescriptionAction}
              >
                ثبت{" "}
              </button>
            </div>
          </Modal>
        }
      </div>
      </div>
    );
  }
}

export const DetailDastorKar = connect(state => ({
  globalStorage: state.globalStorage
}))(DetailDastorKar_);
