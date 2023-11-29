
import React, { Component } from "react";
import Modal from "react-modal";
import Select, { components } from "react-select";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import { userActions } from "../../_actions";
import { HospitalTable, Routes } from "../../_components";
import Concept from "../../assets/images/concept.png";
import IdCard from "../../assets/images/id-card.png";
import SendImg from "../../assets/images/send.png";
import moment from "jalali-moment";

const TitleOptions = [
  { value: "هوش هیجانی", label: "هوش هیجانی" },
  { value: "هوش هیجانی 2", label: "هوش هیجانی 2" },
  { value: "هوش هیجانی 3", label: "هوش هیجانی 3" }
];

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
    width: "50%"
    // top                   : '50%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
  }
};

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <i className="fas fa-calendar-alt color-dark"></i>
    </components.DropdownIndicator>
  );
};

//
export class Dashboard_ extends React.Component {
  state = {
    isModalOpen: false,
    pending_id: "",
    isOnEdit: false,
    page: 1,
    per_page: 10,
    ward: "",
    select_title: "",
    select_type: "",
    select_date: "",
    select_job: "",
    title_options: "",
    course_id: "",
    ward_id: "",
    type_options: userActions.generateSelectLabelValue([
      "درون بخشی",
      "درون سازمانی",
      "برون سازمانی"
    ]),
    date_options: userActions.generateSelectLabelValue(monthNames),
    job_options: undefined,
    tableRow: [],
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
            width: "10%"
          }
        },
        {
          title: "عنوان دوره",
          getData: (item, index) => {
            return item.title;
          },
          style: {
            width: "10%"
          }
        },
        {
          title: "تاریـــخ پیشنهاد",
          getData: (item, index) => {
            return item.suggested_date;
          },
          style: {
            width: "15%"
          }
        },
        {
          title: "تاریــخ درخــواست",
          getData: (item, index) => {
            return moment(item.requested_at).format("jYYYY/jMM/jDD");
          },
          style: {
            width: "13%"
          }
        },
        {
          title: "گــروه شغلــی",
          getData: (item, index) => {
            return item.job_group;
          },
          style: {
            width: "15%"
          }
        },
        {
          title: "وضعیت",
          getData: (item, index) => {
            let status = item.status;
            if (status == "pending") {
              status = "ارسال نشده";
            } else if (status == "requested_to_ward") {
              status = "در دست بررسی مسئول بخش";
            } else if (status === 'requested_to_supervisor') {
              status = 'در درست بررسی سوپروایز'
            } else {
              status = item.status;
            }
            return status;
          },
          style: {
            width: "17%"
          }
        },
        {
          title: "عملیات",
          getData: (item, index) => {
            console.log(item.status)
            if (item.status == "pending") {
              
              return (
                <>
                  <button
                    className="btn btn-link"
                    data-tip="حذف"
                    onClick={() => {
                      this.DeleteRequestedCourse(item, index);
                    }}
                  >
                    <i className="fal fa-1x fa-trash-alt text-danger" />
                  </button>
                  <ReactTooltip type="light" />
                  <button
                    className="btn btn-link"
                    disabled={item.updating}
                    data-tip="به روزرسانی"
                    onClick={() => {
                      this.updateRequstedCourse(item, index);
                    }}
                  >
                    <i
                      className={`fal ${
                        item.updating
                          ? " fa-spinner-third fa-spin text-success"
                          : "fa-upload text-warning"
                      } `}
                    />
                  </button>
                </>
              );
            }
            
          },
          style: {
            width: "10%"
          }
        },
      ]
    },
    meta: {},
  };

  updateRequstedCourse = (course, index) => {
    console.log(course);
    const ward = course.ward;
    const select_title = this.state.title_options.find(
      t => t.value === course.title
    );
    const select_type = this.state.type_options.find(
      t => t.value === course.course_type
    );
    const select_date = this.state.date_options.find(
      t => t.value === course.suggested_date
    );
    const select_job = this.state.job_options.find(
      t => t.value === course.job_group
    );

    this.setState({
      ward,
      select_title,
      select_type,
      select_date,
      select_job,
      course_id: course._id,
      ward_id: ward._id,
      isOnEdit: true,
      isModalOpen: true
    });
  };

  openModal = () => {
    this.setState({
      isModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isOnEdit: false,
      isModalOpen: false
    });
  };

  getJobGroups = () => {
    this.props
      .dispatch(userActions.API("get", "/v1/hospital/job_groups"))
      .then(res => {
        let arr = [];
        res.data.map(item => {
          arr.push(item.name);
        });
        this.setState({
          job_options: userActions.generateSelectLabelValue(arr)
        });
      });
  };

  getUserRequestedCourses = () => {
    const { page, per_page } = this.state;
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v1/user/hospital/courses?page=${page}&per=${per_page}`
        )
      )
      .then(res => {
        this.setState({
          table: {
            ...this.state.table,
            row: res.data.courses,
            total_page: res.data.meta_data.total_page
          },
          meta: res.data.meta_data
        });
      });
  };

  DeleteRequestedCourse = (course, index) => {
    this.props
      .dispatch(userActions.question("حذف دوره", "از حذف دوره مطمئن هستید ؟"))
      .then(res => {
        if (res.value) {
          this.props
            .dispatch(
              userActions.API(
                "delete",
                "/v1/user/hospital/course/" + course._id
              )
            )
            .then(res => {
              if (res.data.message === "ok") {
                this.getUserRequestedCourses();
                userActions.successAlert("دوره مورد نظر با موفقیت حذف شد.");
              }
            });
        }
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

  async componentDidMount() {
    if (!this.props.globalStorage.wards.length) {
      this.props.dispatch(userActions.getWards());
    }

    this.getUserRequestedCourses();
    this.getCourseTitles();
    this.getJobGroups();
  }

  submitRequestCourse = e => {
    e.preventDefault();
    const {
      ward,
      select_title,
      select_type,
      select_date,
      select_job
    } = this.state;

    if (select_title === "") {
      return userActions.failure("لطفا عنوان را انتخاب نمایید");
    }

    if (ward === "") {
      return userActions.failure("لطفا بخش را انتخاب نمایید");
    }

    // if (select_type === "") {
    //   return userActions.failure("لطفا نوع دوره را انتخاب نمایید");
    // }

    if (select_date === "") {
      return userActions.failure("لطفا تاریخ دوره را انتخاب نمایید");
    }

    if (select_job === "") {
      return userActions.failure("لطفا گروه شغلی را انتخاب نمایید");
    }

    this.props
      .dispatch(
        userActions.API("post", "/v1/user/hospital/course", {
          courses: [
            {
              title: select_title.value,
              // course_type: select_type.value,
              ward_id: ward._id,
              suggested_date: select_date.value,
              job_group: select_job.value
            }
          ]
        })
      )
      .then(res => {
        this.getUserRequestedCourses();
        this.setState({
          ward: "",
          select_title: "",
          select_type: "",
          select_date: "",
          select_job: ""
        });

        this.closeModal();
        userActions.successAlert("دوره مورد نظر با موفقیت ثبت شد.");
      });
  };

  editCourseHandler = e => {
    e.preventDefault();
    const {
      ward,
      select_title,
      select_type,
      select_date,
      select_job
    } = this.state;

    if (select_title === "") {
      return userActions.failure("لطفا عنوان را انتخاب نمایید");
    }

    if (ward === "") {
      return userActions.failure("لطفا بخش را انتخاب نمایید");
    }

    if (select_type === "") {
      return userActions.failure("لطفا نوع دوره را انتخاب نمایید");
    }

    if (select_date === "") {
      return userActions.failure("لطفا تاریخ دوره را انتخاب نمایید");
    }

    if (select_job === "") {
      return userActions.failure("لطفا گروه شغلی را انتخاب نمایید");
    }

    this.props
      .dispatch(
        userActions.API("put", "/v1/user/hospital/course", {
          id: this.state.course_id,
          title: select_title.value,
          // course_type: select_type.value,
          ward_id: this.state.ward_id,
          suggested_date: select_date.value,
          job_group: select_job.value
        })
      )
      .then(res => {
        this.setState({
          ward: "",
          select_title: "",
          select_type: "",
          select_date: "",
          select_job: ""
        });
        this.getUserRequestedCourses();
        this.closeModal();
        userActions.successAlert("تغییرات با موفقیت اعمال شدند.");
      });
    console.log("edit here");
  };

  sendRequests = e => {
    e.preventDefault();
    let course_id;
    this.state.table.row.find(item => {
      if (item["status"] === "pending") {
        course_id = item._id;
        return true;
      }
    });

    if (course_id) {
      this.props
        .dispatch(
          userActions.question(
            "ارسال درخواست ها",
            "از ارسال درخواست ها به مسئول مطمئن هستید؟"
          )
        )
        .then(res => {
          if (res.value) {
            this.props
              .dispatch(
                userActions.API("post", "v1/user/hospital/course/request", {
                  id: course_id
                })
              )
              .then(res => {
                this.getUserRequestedCourses();
                userActions.successAlert(
                  "دوره ها با موفقیت به مسئول بخش ارسال شد."
                );
              });
          }
        });
    } else {
      return userActions.failure("هنوز دوره ای درخواست نشده است...");
    }
  };




  render() {
    const {
      ward,
      select_title,
      select_type,
      select_date,
      select_job,
      date_options,
      type_options,
      job_options
    } = this.state;
    const { wards } = this.props.globalStorage;
    return (
      <>
        {/* 
                            <button className="btn btn-blue rounded-pill py-2 px-4 text-white mx-2">ارسال</button>
                            <button className="btn bg-danger rounded-pill py-2 px-4 text-white">حــذف</button> */}
        <Routes page="pdp/dashboard" />
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
          <div className="container">
            <div className="row d-flex justify-content-center ">
              <div className="col-lg-4 col-md-6 card-deck">
                <div className="card borderDarkpurple my-md-2 my-sm-2 my-1 py-1">
                  <div className="card-body text-center">
                    <p className="card-title Darkpurple">
                      <span className="Darkpurple lalezar">
                        کل های دوره های درخواستی شما
                      </span>
                    </p>
                    <h4 className="card-text Darkpurple iran-sans_Bold ">
                      {this.state.meta.total_courses}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 card-deck">
                <div className="card borderbluecolor my-md-2 my-sm-2 my-1 py-1 ">
                  <div className="card-body text-center">
                    <p className=" card-title">
                      <span className="bluecolor lalezar">
                        {" "}
                        دوره های تایید شده
                      </span> 
                    </p>
                    <h4 className="card-text bluecolor iran-sans_Bold ">
                    {this.state.meta.total_accepted}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 card-deck">
                <div className="card borderlightBlue my-md-2 my-sm-2 my-1 py-1">
                  <div className="card-body text-center">
                    <p className=" card-title">
                      <span className="lightBlue lalezar">
                        دوره های تایید نشده
                      </span>
                    </p>
                    <h4 className="card-text iran-sans_Bold lightBlue ">
                    {this.state.meta.total_courses - this.state.meta.total_accepted}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid chart-section my-3">
            <div className="row">
              <div className="col-lg-7 my-2">
                <div className="card-deck h-100">
                  <div className="card border-0 shadow bg-gray2">
                    <div className="card-body">
                      <div className="row d-flex justify-content-between     my-lg-1 pb-2">
                        <div className="iran-sans text-white col-lg-5 col-md-12 text-md-center ">
                          {" "}
                          فراوانی دوره های درخواست شده بر اساس نوع دوره{" "}
                        </div>
                        <div className="d-flex justify-content-center col-lg-7 col-md-12 ">
                          <button className="btn  btnOrange mx-1 my-sm-2   px-lg-3">
                            همه موارد
                          </button>
                          <button className="btn  btnOrange my-sm-2 mx-1 active px-lg-3 ">
                            برون سازمانی{" "}
                          </button>
                          <button className="btn  btnOrange my-sm-2  mx-1 active px-lg-3 ">
                            درون سازمانی{" "}
                          </button>
                          <button className="btn  btnOrange my-sm-2 mx-1 active px-lg-3 ">
                            درون بخشی{" "}
                          </button>
                        </div>
                      </div>
                      <div className="bg-light SalesChart"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 shadow d-flex justify-content-center">
                <button
                  onClick={() => {
                    this.setState({
                      ward: "",
                      select_title: "",
                      select_type: "",
                      select_date: "",
                      select_job: ""
                    });
                    this.openModal();
                  }}
                  className="request btn"
                >
                  <img className="" src={Concept} alt="" height="100px" />
                  <p className="lalezar ">درخواست دوره اموزشی</p>
                </button>
                <button onClick={this.sendRequests} className="request btn">
                  <img className="" src={SendImg} alt="" height="100px" />
                  <p className="lalezar ">ارسال در خواست ها</p>
                </button>
                <button className="request btn">
                  <img className="" src={IdCard} alt="" height="100px" />
                  <p className="lalezar ">شناسنامه اموزشی</p>
                </button>
              </div>
            </div>
          </div>

          <Modal
            isOpen={this.state.isModalOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="User Modal"
            portalclassNameName="full_screen_modal selelctUsers"
          >
            <div className="container bg-white">
              <div className="d-flex justify-content-center border-0">
                <div className="d-flex flex-column align-items-center justify-content-center w-100">
                  <h4 className="lalezar mt-3 pb-2">
                    {this.state.isOnEdit ? "ویرایش" : "درخــواست"} دوره آموزشی
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
                      بخش مورد نظر
                    </label>
                    <Select
                      className="text-center custom-select-2"
                      value={ward}
                      name="ward"
                      placeholder=""
                      onChange={userActions.handleChangeSelect.bind(this)}
                      options={wards}
                      getOptionLabel={opt => opt.name}
                      getOptionValue={opt => opt._id}
                      id="ward"
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center text-right col-sm-6 col-12">
                    <label className="color-dark iran-sans_Bold my-3">
                      {" "}
                      گـروه شغلـی
                    </label>
                    <Select
                      isClearable
                      className="text-center custom-select-2"
                      value={select_job}
                      autoFocus={false}
                      name="select_job"
                      onChange={userActions.handleChangeSelect.bind(this)}
                      placeholder={""}
                      options={job_options}
                      id="select_job"
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
                    {this.state.isOnEdit ? (
                      <button
                        onClick={this.editCourseHandler}
                        className="btn btn-blue rounded-pill col-sm-5 my-1"
                      >
                        ویرایش درخواست
                      </button>
                    ) : (
                      <button
                        onClick={this.submitRequestCourse}
                        className="btn btn-blue rounded-pill col-sm-5 my-1"
                      >
                        ثبت درخواست
                      </button>
                    )}
                    <button
                      onClick={() => this.closeModal()}
                      className="btn btn-outline-blue rounded-pill col-sm-5 my-1"
                      data-dismiss="modal"
                    >
                      بــازگـشـــت
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>

          <div className="mb-5">
            <HospitalTable
              // totalPage={Math.ceil(total_indicators/per_page)}
              totalPage={this.state.total_page}
              active={this.state.page}
              title="دوره های درخواستی شما"
              rows={this.state.table.row}
              headers={this.state.table.headers}
              // pageOnChange={this.getIndicator}
              // loader={ loader}
            />
          </div>
        </div>
      </>
    );
  }
}

const Dashboard = connect(state => ({
  globalStorage: state.globalStorage
}))(Dashboard_);
export { Dashboard };
