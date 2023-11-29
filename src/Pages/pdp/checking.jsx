import React, { Component } from "react";
import Modal from "react-modal";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { HospitalTable, Routes } from "../../_components";

import archiveCourse from "../../assets/images/archive-course.png";
// import Gauge from "../../assets/images/gauge.png";
// import { RequestedModal } from ".";
import { userActions } from "../../_actions";
import img1 from "../../assets/images/doctor.png";
// import img2 from "../../assets/images/library.png";
import moment from "jalali-moment";

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <i className="fas fa-calendar-alt color-dark"></i>
    </components.DropdownIndicator>
  );
};

const monthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "ابان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند"
];

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
    margin: "auto",
    width: "70%"
    // top                   : '50%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
  }
};

class Checking_ extends Component {
  state = {
    isModalOpen: false,
    checkModalOpen: false,
    total_pages: 0,
    today_suggested: '',
    total_accepted: '',
    total_pending: '',
    total_requested: '',
    sendOpinionId: '',
    select_title: "",
    select_type: "",
    select_date: "",
    select_job: "",
    title_options: "",
    type_options: userActions.generateSelectLabelValue([
      "درون بخشی",
      "درون سازمانی",
      "برون سازمانی"
    ]),
    date_options: userActions.generateSelectLabelValue(monthNames),
    page: 1,
    per_page: 10,
    user_courses: {
      headers: [
        {
          title: "عنوان دوره",
          getData: (item, index) => {
            if (item.is_ward_suggested) {
              return <span className='green'>{item.title}</span>
            } else {
              return item.title;
            }
          },
          style: {
            width: "25%"
          }
        },
        {
          title: "تاریــخ درخــواست",
          getData: (item, index) => {
            if (item.is_ward_suggested) {
              return <span className='green'>{moment(item.requested_at).format("jYYYY/jMM/jDD")}</span>
            } else {
              return moment(item.requested_at).format("jYYYY/jMM/jDD");
            }
          },
          style: {
            width: "25%"
          }
        },
        {
          title: "تاریــخ پیشنهاد",
          getData: (item, index) => {
            if (item.is_ward_suggested) {
              return <span className='green'>{item.suggested_date}</span>
            } else {
              return item.suggested_date;
            }
          },
          style: {
            width: "22%"
          }
        },
        {
          title: "وضعیت",
          getData: (item, index) => {
            let status = item.status;
            if (item.status === "acsept") {
              status = <span className="green">تایید شده</span>;
            } else {
              status = <span className="red">تایید نشده</span>;
            }
            return status;
          },
          style: {
            width: "25%"
          }
        }
      ],
      row: []
    },
    table: {
      row: [],
      headers: [
        {
          title: "ردیف",
          getData: (item, index) => {
            return (
              (parseInt(this.state.page) - 1) * this.state.per_page + 1 + index
            );
          },
          style: {
            width: "5%"
          }
        },
        {
          title: "نام و نام خــانوادگی",
          getData: (item, index) => {
            // return item.title
            return (
              item.requested_by.firstname + " " + item.requested_by.lastname
            );
          },
          style: {
            width: "25%"
          }
        },
        {
          title: "دوره های درخواست شده",
          getData: (item, index) => {
            return (
              <button
                onClick={ev => {
                  this.SendComment(item);
                  this.showCourse(item, ev);
                }}
                className="btn"
              >
                <img src={img1} />
              </button>
            );
          },
          style: {
            width: "25%"
          }
        },
        {
          title: "گــروه شغلــی",
          getData: (item, index) => {
            return item.requested_by.job_group;
          },
          style: {
            width: "25%"
          }
        },
        {
          title: "عملیات",
          getData: (item, index) => {
            return (
              <>
                {/* <button
                  style={{ color: "white" }}
                  className="btn  rounded-pill bg-blue iran-sans mx-2 w-30  "
                  onClick={() => {
                    this.SendComment(item);
                  }}
                >
                  {" "}
                  اعمال نظر
                </button> */}
                <button
                  style={{ color: "white" }}
                  className="btn  rounded-pill bg-blue iran-sans w-30"
                  onClick={() => {
                    this.sendToSupervisor(item);
                  }}
                >
                  {" "}
                  ارسال به سوپروایز اموزشی
                </button>
              </>
            );
          },
          style: {
            width: "20%"
          }
        }
      ]
    }
  };

  SendComment = (course) => {
    this.setState({
      sendOpinionId: course.id
    })
    // this.setState({
    //   checkModalOpen: true
    // });
  };


  closeOpinionModal = () => {
    this.setState({
      checkModalOpen: false,
      select_title: "",
      select_type: "",
      select_date: "",
    })
  }

  showCourse = (course) => {
    this.setState({
      user_courses: {
        ...this.state.user_courses,
        row: [
          ...course.courses,
          ...course.ward_courses
        ]
      }
    });
    this.openModal();
  };

  openModal = () => {
    this.setState({
      isModalOpen: true
    });
  };

  closeModal = (e) => {
    this.setState({
      isModalOpen: false
    });
  };


  getCourseTitles = () => {
    this.props
      .dispatch(userActions.API("get", "v1/user/hospital/course/titles"))
      .then(res =>
        this.setState({
          title_options: userActions.generateSelectLabelValue(res.data)
        })
      );
  }


  getUserRequstedCourse = () => {
    this.props
      .dispatch(userActions.API("get", "v1/user/hospital/ward_courses?page=1&per=10"))
      .then(res => {
        this.setState({
          table: {
            ...this.state.table,
            row: res.data.course_packages
          },

          today_suggested: res.data.meta_data.today_suggested,
          total_accepted: res.data.meta_data.total_accepted,
          total_pending: res.data.meta_data.total_pending,
          total_requested: res.data.meta_data.total_requested,
          total_pages: res.data.meta_data.total_pages,
        });
      });
  };

  componentDidMount() {
    this.getUserRequstedCourse();
    this.getCourseTitles();
  }


  submitOpinion = (e) => {
    e.preventDefault();
    const {
      select_title,
      select_type,
      select_date,
    } = this.state;

    if (select_title === "") {
      return userActions.failure("لطفا عنوان را انتخاب نمایید");
    }



    if (select_date === "") {
      return userActions.failure("لطفا تاریخ دوره را انتخاب نمایید");
    }

    this.props.dispatch(
      userActions.API(
        'put',
        'v1/user/hospital/ward_course',
        {
          id: this.state.sendOpinionId,
          title: select_title.value,
          course_type: select_type.value,
          suggested_date: select_date.value
        }
      )
    )
      .then(res => {
        console.log(res.data);
        this.getUserRequstedCourse();
        this.closeOpinionModal();
        userActions.successAlert('اعمال نظر با موفقیت انجام شد.')

      })
  }

  sendToSupervisor = (course) => {
    const id = course.id;
    if (course.ward_courses.length == 0) {
      return userActions.failure('هنوز نظری ثبت نکرده اید')
    }
    this.props.dispatch(
      userActions.question('ارسال به سوپروایز', 'از ارسال به سوپروایز مطمئن هستید؟')
    )
      .then(res => {  
        if (res.value) {
          this.props.dispatch(
            userActions.API(
              'post',
              'v1/user/hospital/course/supervisor_request',
              {
                id
              }
            )
          )
            .then(
              res => {
                this.getUserRequstedCourse()
                userActions.successAlert('با موفقیت ارسال شد.')
              }
            )
        }
      })
  }

  submitAndAddAnother = (e) => {
    e.preventDefault();
    const {
      select_title,
      select_type,
      select_date,
    } = this.state;

    if (select_title === "") {
      return userActions.failure("لطفا عنوان را انتخاب نمایید");
    }


    if (select_date === "") {
      return userActions.failure("لطفا تاریخ دوره را انتخاب نمایید");
    }

    this.props.dispatch(
      userActions.API(
        'put',
        'v1/user/hospital/ward_course',
        {
          id: this.state.sendOpinionId,
          title: select_title.value,
          // course_type: select_type.value,
          suggested_date: select_date.value
        }
      )
    )
      .then(res => {
        this.setState({
          user_courses: {
            ...this.state.user_courses,
            row: [
              ...this.state.user_courses.row,
              res.data
            ]
          },
          select_title: "",
          select_date: "",
        })
        this.getUserRequstedCourse();
        userActions.successToast('دوره مورد نظر با موفقیت اضافه شد.')
      })
  }

  render() {
    const {
      select_title,
      select_type,
      select_date,
      date_options,
      type_options,
    } = this.state;
    console.log(this.state)
    return (
      <>
        <Routes page="pdp/checking" />
        <div className="content bg-light py-3 px-3">
          <div className="container-fluid">
            <div className="card bg-white shadow text-center border-0">
              <div className="card-body iran-sans_Bold text-dark">
                پیام مدیــر سنجــاب: برای بازگشت به صفحه اصلی از دکمه بازگشت
                بالا استفاده کنید
              </div>
            </div>
          </div>
          <br />

          <div className="container-fluid">
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-column align-items-center">
                <Link to={"/pdp/checking/archives"}>
                  <button className="btn bg-blue rounded-pill p-3 ">
                    <img src={archiveCourse} width="60" height="60" />
                  </button>
                </Link>
                <span className="iran-sans_Bold py-1">آرشیو درخواست ها</span>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-3 col-md-6">
                <div className="card borderDarkpurple my-md-2 my-sm-2 my-1 py-1">
                  <div className="card-body text-center">
                    <p className="card-title Darkpurple">
                      <span className="Darkpurple lalezar">
                          دوره های درخواستی بخش شما
                  </span>
                    </p>
                    <h4 className="card-text Darkpurple iran-sans_Bold ">
                      {this.state.total_requested}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card borderbluecolor my-md-2 my-sm-2 my-1 py-1">
                  <div className="card-body text-center">
                    <p className=" card-title">
                      <span className="bluecolor lalezar">
                        {" "}
                        دوره های بررسی نشده
                      </span>
                    </p>
                    <h4 className="card-text bluecolor iran-sans_Bold ">
                      {this.state.total_pending}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card borderlightBlue my-md-2 my-sm-2 my-1 py-1">
                  <div className="card-body text-center">
                    <p className=" card-title">
                      <span className="lightBlue lalezar">
                        دوره های تایید شده
                      </span>
                    </p>
                    <h4 className="card-text iran-sans_Bold lightBlue ">{this.state.total_accepted}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card borderOrange my-md-2 my-sm-2 my-1 py-1">
                  <div className="card-body text-center">
                    <p className=" card-title">
                      <span className="orange lalezar">
                        دوره های پیشنهاد شده امروز
                      </span>
                    </p>
                    <h4 className="card-text orange iran-sans_Bold ">{this.state.today_suggested}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />

          <div className="mb-5">
            <HospitalTable
              totalPage={0}
              // totalPage={this.state.total_pages}
              active={this.state.page}
              title="دوره های درخواست شده در بخش شما"
              rows={this.state.table.row}
              headers={this.state.table.headers}
              pageOnChange={(page) => {
                this.setState({
                  page
                })
              }}
            // loader={ loader}
            />

            <Modal
              isOpen={this.state.checkModalOpen}
              onRequestClose={this.closeOpinionModal}
              style={customStyles}
              contentLabel="User Modal"
              portalclassNameName="full_screen_modal selelctUsers"
            >
              <div className="container bg-white">
                <div className="d-flex justify-content-center border-0">
                  <div className="d-flex flex-column align-items-center justify-content-center w-100">
                    <h4 className="lalezar mt-3 pb-2">
                      اعمال نظر
                    </h4>
                    <div
                      style={{ height: "2px" }}
                      className="w-100 bg-blue"
                    ></div>
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <form className="row justify-content-center">
                    <div className="custom-select-box form-group text-right col-12">
                      <label className="color-dark iran-sans_Bold my-3">
                        عنوان دوره
                      </label>
                      <Select
                        isClearable
                        className="text-center custom-select-2"
                        value={select_title}
                        autoFocus={false}
                        name="select_title"
                        onChange={userActions.handleChangeSelect.bind(this)}
                        placeholder={"انتخاب عنوان دوره ..."}
                        options={this.state.title_options}
                        id="select_title"
                      />
                    </div>

                    <div className="custom-select-box form-group text-right col-sm-6 col-12">
                      <label className="color-dark iran-sans_Bold my-3">
                        نوع دوره
                      </label>
                      <Select
                        className="text-center custom-select-2"
                        isClearable
                        value={select_type}
                        autoFocus={false}
                        name="select_type"
                        onChange={userActions.handleChangeSelect.bind(this)}
                        placeholder={""}
                        options={type_options}
                        id="select_type"
                      />
                    </div>

                    <div className="d-flex flex-column justify-content-center text-right col-sm-6 col-12">
                      <label className="color-dark iran-sans_Bold my-3">
                        تاریخ پیشنهادی
                      </label>
                      <Select
                        className="text-center custom-select-2"
                        isClearable
                        components={{ DropdownIndicator }}
                        value={select_date}
                        autoFocus={false}
                        name="select_date"
                        onChange={userActions.handleChangeSelect.bind(this)}
                        placeholder={""}
                        options={date_options}
                        id="select_date"
                      />
                    </div>

                    <div className="row justify-content-around col-12 my-5">
                      <button
                        onClick={this.submitOpinion}
                        className="btn btn-blue rounded-pill col-sm-3 my-1"
                      >
                        ثبت
                        </button>
                      <button
                        onClick={this.submitAndAddAnother}
                        className="btn btn-outline-blue rounded-pill col-sm-3 mx-2 my-1"
                      >
                        ثبت و افزودن دوره دیگر
                        </button>
                      <button
                        onClick={this.closeOpinionModal}
                        className="btn btn-outline-blue rounded-pill col-sm-3 my-1"
                      >
                        بــازگـشـــت
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal>

            <Modal
              isOpen={this.state.isModalOpen}
              onRequestClose={this.closeModal}
              shouldCloseOnOverlayClick
              style={customStyles}
              contentLabel="Requested Modal"
              portalclassNameName="full_screen_modal selelctUsers"
            >
              <HospitalTable
                totalPage={Math.ceil(this.state.total_pages / 10)}
                // totalPage={this.state.total_pages}
                active={this.state.page}
                minWidth="600px"
                title={"دوره های درخواست شده مطابق نظر کاربر و مسئول"}
                rows={this.state.user_courses.row}
                headers={this.state.user_courses.headers}
              // pageOnChange={this.getIndicator}
              // loader={ loader}
              />


              <p className="text-center my-4 iran-sans_Bold">
              - اعمال نظر -
              </p>
              <div className="d-flex flex-column">
                <form className="row justify-content-center align-items-baseline">

                  <div className="custom-select-box form-group text-right col-sm-5 col-12">
                    <label className="color-dark iran-sans_Bold my-3">
                      عنوان دوره
                      </label>
                    <Select
                      isClearable
                      className="text-center custom-select-2"
                      value={select_title}
                      autoFocus={false}
                      name="select_title"
                      onChange={userActions.handleChangeSelect.bind(this)}
                      placeholder={"انتخاب عنوان دوره ..."}
                      options={this.state.title_options}
                      id="select_title"
                    />
                  </div>

                  <div className="d-flex flex-column justify-content-center text-right col-sm-5 col-12">
                    <label className="color-dark iran-sans_Bold my-3">
                      تاریخ پیشنهادی
                      </label>
                    <Select
                      className="text-center custom-select-2"
                      isClearable
                      components={{ DropdownIndicator }}
                      value={select_date}
                      autoFocus={false}
                      name="select_date"
                      onChange={userActions.handleChangeSelect.bind(this)}
                      placeholder={""}
                      options={date_options}
                      id="select_date"
                    />
                  </div>

                  <div className="row justify-content-around col-12 my-5">
                    <button
                      onClick={this.submitOpinion}
                      className="btn btn-blue rounded-pill col-sm-3 my-1"
                    >
                      ثبت
                        </button>
                    <button
                      onClick={this.submitAndAddAnother}
                      className="btn btn-outline-blue rounded-pill col-sm-3 mx-2 my-1"
                    >
                      ثبت و افزودن دوره دیگر
                        </button>
                    <button
                       onClick={() => this.closeModal()}
                      className="btn btn-outline-blue rounded-pill col-sm-3 my-1"
                    >
                      بــازگـشـــت
                      </button>
                  </div>
                </form>
              </div>

           
            </Modal>
          </div>
        </div>
      </>
    );
  }
}

const Checking = connect(state => ({
  globalStorage: state.globalStorage
}))(Checking_);
export { Checking };
