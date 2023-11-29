import React, { Component } from "react";
import { connect } from "react-redux";
import { userActions } from "../../_actions";
import { Navbar } from "./Navbar";
import moment from "jalali-moment";
import clip from "../../assets/images/clip.svg";
import support from "../../assets/images/support.svg";
import Rating from "react-rating";
import star from "../../assets/images/star-empty.png";
import fullstar from "../../assets/images/star-full.png";
import arrow_bottom from "../../assets/images/double-arrow-bottom.png";
import { Collapse } from "react-collapse";
import { TabbarMessage } from "./TabbarMessage";
import mehicon from "../../assets/images/meh_icon.png";
import smileicon from "../../assets/images/smile_icon.png";
import { isReturnStatement } from "typescript";
import {userConstants} from "../../_constants";
class Support_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: [],
      meta: [],
      rating: 0,
      activeIndex: null,
      isOpened: false,
      answer: []
    };
  }
  componentDidMount() {
    this.getAllTickets();
  }
  getAllTickets = () => {
    const { year } = this.props.globalStorage;
    let page = 1;

    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v1/user/hospital/tickets?year=${year}&page=${page}`
        )
      )
      .then(res => {
      

        let ticket = res.data.result;
        let meta = res.data.meta;


        this.setState({ ticket: ticket, meta: meta });
      });
  };

  changeRating = () => {
    this.setState({ rating: undefined });
  };
  toggleClass = (index, e) => {
    this.setState({
      activeIndex: this.state.activeIndex === index ? null : index
    });
  };
  ticketClose = id => {
    this.setState(prevState => ({
      ticket: prevState.ticket.map(obj =>
        obj.id === id ? Object.assign(obj, { status: "done" }) : obj
      )
    }));
  };
  getanswer = id => {
    const { year } = this.props.globalStorage;
    this.setState(state => ({
      ...state,
      ["Id" + id]: state["Id" + id] === true ? false : true

    }))

   
    this.props
      .dispatch(
        userActions.API("get", `/v1/user/hospital/ticket/${id}?year=${year}`)
      )

      .then(res2 => {
        this.setState({ answer: res2.data });
      });
  };

  
  render() {

    const { meta, ticket } = this.state;
    const tickets = ticket.map((item, index) => {
      
      return (

        <div className="col-12 ticket">
          <div className="row box">
            <div className="col-12 line_part">
              <div className="row " style={{ padding: "0 15px" }}>
                <div className="col-6">
                  <div className="row text">شماره تیکت</div>
                  <div className="row  data m-auto">{item.certificate}</div>
                </div>
                <div className="col-6 left_data">
                  <div className="row text text-left">تاریخ ایجاد تیکت</div>
                  <div className="row  data m-auto text-left">
                    {moment(item.created_at).format("jDD jMMMM jYYYY")}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 d-flex flex-column reason line_part">
              <div className="w-100">{item.reason}</div>
              </div>

              <div className="col-12 d-flex flex-column reason line_part">
              <div className="w-100 " style={{fontFamily:'iransansbold'}}>توضیحـات</div>
            <div className="col-12 body_desc px-1">{item.body}</div>
            </div>


            <div className="col-12 reason status">
              <p className="status_type">
              {(item.status === "pennding" && "در انتظار پاسخ") ||
                (item.status === "done" && "انجام شده") ||
                (item.status === "doing" && "در حال انجام")}
                </p>
            </div>

            <div
              className="col-12"
              style={{
                textAlign: "center",
                fontSize: "1.4em",
                color: "#4d4d4d"
              }}
            >
              <p className="arrow_box">
                <i
                  className={
                    this.state.isOpened
                      ? "far fa-angle-double-up"
                      : "far fa-angle-double-down"
                  }
                  onClick={() => this.getanswer(item.id)}
                ></i>
              </p>
            </div>
            <div className="col-12 reason  status ">
           
              <Collapse isOpened={this.state["Id" + item.id]}>
              
                <div className="col-12  px-0 detail_answer_suport">
                  {this.state.answer &&
                    this.state.answer.map(det => {
                      if(det.user)
                      {
                      return (
                        <div className="row item px-2">
                      
                          <div className="row suporter">
                            <div className="col-2 ">
                            <div className="circle overflow_image">
                            
                              <img src={userConstants.SERVER_URL_2+det.user.avatar.url} alt="avatar" />
                            
                              </div>
                            </div>
                            <div className="col-10  suportername">
                              <div className="user"> 
                                {det.user.firstname} {det.user.lastname}
                              </div>
                              <div>
                                {moment(det.created_at).format(
                                  "jDD jMMMM jYYYY - HH:mm"
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="row body">
                            <p className="px-3">{det.user.message}</p>
                          </div>
                    
                        </div>
                      )}
                    })}

                  <div className="row ticket_button">
                    <button className="btn round-pill answer_ticket col-5 m-auto">
                      پاسخ به تیکت
                    </button>
                    <button className="btn round-pill close_ticket col-5 m-auto">
                      بستن درخواست
                    </button>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      );
    });
    return (
      <>
        <Navbar name="پشتیبانی" url={"/pwa"} page="جدید" link="#" />
        <div className="container-fluid">
        <div className="supportpage">
          <div className="col-12">
            <div className="row meta">
              <div className="col-6">
                <div className=" total_tickets">
                  <div className="row col-12 top_box">
                    <div className="number col-6">{meta.total_tickets}</div>
                    <div className="col-6">
                      <img src={smileicon}  alt="smileicon"/>
                    </div>
                  </div>
                  <div className="text">کل در خواست ها</div>
                </div>
              </div>
              <div className="col-6">
                <div className="pendding_tickets">
                  <div className="row col-12 top_box">
                    <div className="number col-6">{meta.pendding_tickets}</div>
                    <div className="col-6">
                      <img src={mehicon} alt="mehicon"/>
                    </div>
                  </div>
                  <div className="text col-12">در حـال انجام ها</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 tickets_background">{tickets}</div>
        </div>
        </div>
      </>
    );
  }
}

export default Support_;
export const Support = connect(state => ({
  globalStorage: state.globalStorage
}))(Support_);

