import React, { Component } from "react";
import moment from "jalali-moment";
import Select from 'react-select';
import Modal from "react-modal";
import { connect } from "react-redux";
import {SetCource} from './SetCource'
import { userActions } from "../../../_actions";
const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  content: {
    animationName: "animatetop",
    animationDuration: "0.5s",
    margin: "auto"
    //   width: "50%"
    // top                   : '50%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
  }
};

class EducationalCalendar_ extends Component {
  state = {
    months: [],
    setCourseModal: false,
    // {
    //     days: [
    //         {
    //             day: '',
    //             className: '',
    //             data: [],
    //         }
    //     ],
    //     name: '',

    // }
  };

  

  componentDidMount() {
    this.initializeMonths();
    this.get_educational_periods();
  }

  initializeMonths() {
    const year = this.props.globalStorage.year;
    let months = [];
    for (let i = 1; i <= 12; i++) {
      let m = moment(`${year}/${i}/01`, "jYYYY/jMM/jDD");
      const firstDay = m.jDay();
      const name = m.format("jMMMM");
      const monthDaysCount = m.jDaysInMonth();
      let arr = [];
      for (let i = 0; i < firstDay; i++) {
          arr.push(null)
      }
      let month = {
        name,
        seasonName: this.getSeasonName(i),
        days: arr //new Array(firstDay).fill(null)
      };
      for (let i = 1; i <= monthDaysCount; i++) {
        month.days.push({
          day: i,
          className: "",
          data: []
        });
      }
      months.push(month);
    }
    this.setState({
      months
    });
  }

  getSeasonName = (num) => {
    if (num>=1 && num<=3) {
        return 'spring-' + num
    }

    if (num>=4 && num<=6) {
        return 'summer-' + num
    }

    if (num>=7 && num<=9) {
        return 'autumn-' + num
    }

    if (num>=10 && num<=12) {
        return 'winter-' + num
    }
    

  }

  opensetCourseModal = () => {
    this.setState({
      setCourseModal: true
    })
  }

  closeSetCourseModal = () => {
    this.setState({
      setCourseModal: false
    })
  }

  get_educational_periods = () => {
    this.props.dispatch(
      userActions.API(
        'get',
        '/v1/user/hospital/get_educational_periods'
      )
    ).then(res => {
      console.log(res.data)
    })
  }
  

  render() {
    return (
      <>
      <Modal
          isOpen={this.state.setCourseModal}
          onRequestClose={this.closeSetCourseModal}
          style={customStyles}
          contentLabel="Researches Modal"
          portalClassName="full_screen_modal"
        >

        <SetCource />
      </Modal>
      <div className="container-fluid">
            <div className="row justify-content-center my-5 py-3">

                <div className={'col-xl-2 col-lg-3 col-md-4 col-sm-5 col-9 px-1 my-1'}>
                    <div className="card text-center h-100 bg-white radius-10 borderDarkpurple">
                        <div className="card-body d-flex flex-column justify-content-around">
                            <p className="card-title Darkpurple lalezar">
                                تعداد کل دوره های درخواستی
                            </p>
                            <h5 className="card-text Darkpurple iran-sans_Bold my-1">7800</h5>
                        </div>
                    </div>
                </div>

                <div className={'col-xl-2 col-lg-3 col-md-4 col-sm-5 col-9 px-1 my-1'}>
                    <div className="card text-center h-100 bg-white radius-10 borderbluecolor">
                        <div className="card-body d-flex flex-column justify-content-around">
                            <p className="card-title bluecolor lalezar">
                                تعداد دوره های درخواستی کاربران
                            </p>
                            <h5 className="card-text bluecolor iran-sans_Bold ">1359</h5>
                        </div>
                    </div>
                </div>

                <div className={'col-xl-2 col-lg-3 col-md-4 col-sm-5 col-9 px-1 my-1'}>
                    <div className="card text-center h-100 bg-white radius-10 borderDarkpurple">
                        <div className="card-body d-flex flex-column justify-content-around">
                            <p className="card-title Darkpurple lalezar">
                                تعداد دوره های درخواستی مسئولین
                            </p>
                            <h5 className="card-text iran-sans_Bold Darkpurple">34</h5>
                        </div>
                    </div>
                </div>

                <div className={'col-xl-2 col-lg-3 col-md-4 col-sm-5 col-9 px-1 my-1'}>
                    <div className="card text-center h-100 bg-white radius-10 border-secondary">
                        <div className="card-body d-flex flex-column justify-content-around">
                            <p className="card-title text-secondary lalezar">
                                تعداد دوره های تایید شده
                            </p>
                            <h5 className="card-text iran-sans_Bold text-secondary">34</h5>
                        </div>
                    </div>
                </div>

                <div className={'col-xl-2 col-lg-3 col-md-4 col-sm-5 col-9 px-1 my-1'}>
                    <div className="card text-center h-100 bg-white radius-10 borderDarkpurple">
                        <div className="card-body d-flex flex-column justify-content-around">
                            <p className="card-title Darkpurple lalezar">
                                تعداد دوره های تایید نشده
                            </p>
                            <h5 className="card-text iran-sans_Bold Darkpurple">34</h5>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/*Charts*/}
        <div className="container-fluid">
            <div className="row justify-content-around">
                <div className="col-xl-6 col-lg-9 col-md-11 my-3">
                    <div className="d-flex flex-column justify-content-around bg-gray rounded h-100 pb-4">
                        <div className="row justify-content-between align-items-center mx-4 py-3">
                            <span className="text-right text-white iran-sans_Bold my-1">فراوانی دوره های درخواست شده</span>
                            <div className="row justify-content-center my-1">
                                <button className="btn btn-orange m-1">همه موارد</button>
                                <button className="btn btn-orange m-1">نظر مسئول</button>
                                <button className="btn btn-orange active m-1">نظر کاربران</button>
                            </div>
                        </div>
                        <div className="chart bg-blue mx-4" style={{height:"20em"}}></div>
                    </div>
                </div>

                <div className="col-xl-6 col-lg-9 col-md-11 my-3">
                    <div className="d-flex flex-column justify-content-around bg-gray rounded h-100 pb-4">
                        <div className="row justify-content-between align-items-center mx-4 py-3">
                            <span className="text-right text-white iran-sans_Bold my-1">فراوانی دوره ها در بخش های بیمارستان</span>
                        </div>
                        <div className="chart bg-blue mx-4" style={{height:"20em"}}></div>
                    </div>
                </div>

                <div className="col-xl-6 col-lg-9 col-md-11 my-3">
                    <div className="d-flex flex-column justify-content-around bg-gray rounded h-100 pb-4">
                        <div className="row justify-content-between align-items-center mx-4 py-3">
                            <span className="text-right text-white iran-sans_Bold my-1">فراوانی دوره های درخواست شده در ماه های مختلف</span>
                            <div className="row justify-content-center my-1">
                                <button className="btn btn-orange m-1">همه موارد</button>
                                <button className="btn btn-orange m-1">نظر مسئول</button>
                                <button className="btn btn-orange active m-1">نظر کاربران</button>
                            </div>
                        </div>
                        <div className="chart bg-blue mx-4" style={{height:"20em"}}></div>
                    </div>
                </div>

                <div className="col-xl-6 col-lg-9 col-md-11 my-3">
                    <div className="d-flex flex-column justify-content-around bg-gray rounded h-100 pb-4">
                        <div className="row justify-content-between align-items-center mx-4 py-3">
                            <span className="text-right text-white iran-sans_Bold my-1">فراوانی دوره های درخواست شده براساس نوع دوره</span>
                            <div className="row justify-content-center my-1">
                                <button className="btn btn-orange m-1">همه موارد</button>
                                <button className="btn btn-orange m-1">نظر مسئول</button>
                                <button className="btn btn-orange active m-1">نظر کاربران</button>
                            </div>
                        </div>
                        <div className="chart bg-blue mx-4" style={{height:"20em"}}></div>
                    </div>
                </div>
            </div>
        </div>

        <div style={{height: '130px'}} className='d-flex align-items-center justify-content-center mt-5 w-100 bg-blue'>
            <button onClick={this.opensetCourseModal} className='btn edCalendarBTN'> ثبت دوره آموزشی</button>
            <button className='btn mx-4 edCalendarBTN'>تدوین نظرسنجی</button>
        </div>

        <div
          className="calender_wrapper"
          style={{ position: "relative", left: "-20px" }}
        >
          {this.state.months.map((month, index) => {
            const monthNumber = index + 1;
            const seasonName = month.seasonName;
            return (
              <div key={index} className="card calender">
                <div className={`${seasonName} card-header text-center`}>{month.name}</div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="days days-name">شنبه</li>
                    <li className="days days-name">یک‌شنبه</li>
                    <li className="days days-name">دو‌شنبه</li>
                    <li className="days days-name">سه‌شنبه</li>
                    <li className="days days-name">چهار‌شنبه</li>
                    <li className="days days-name">پنج‌شنبه</li>
                    <li className="days days-name text-warning">جمعه</li>
                  </ul>
                  <ul className="list-unstyled">
                    {month.days
                      .filter(d => !d)
                      .map((day, index) => {
                        return (
                          <li key={index} className="days btn" data-title="">
                            &nbsp;
                          </li>
                        );
                      })}
                    {month.days
                      .filter(d => d)
                      .map((day, index) => {
                        return (
                          <button key={index} className="days btn" data-title="">
                            {day.day}
                          </button>
                        );
                      })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const EducationalCalendar = connect(state => ({
  globalStorage: state.globalStorage
}))(EducationalCalendar_);
export { EducationalCalendar };
