import React, { Component } from "react";

import { Routes, HospitalTable } from "../../_components";
import { connect } from "react-redux";
import Gauge from "../../assets/images/gauge.png";
import { userActions } from "../../_actions";
import Modal from "react-modal";

import img1 from "../../assets/images/doctor.png";
import img2 from "../../assets/images/library.png";
import IdCard from "../../assets/images/id-card.png";
import moment from "jalali-moment";

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
  

class Archive_ extends Component {
  state = {
    isUserCoursesModalOpen: false,
    isWardCoursesModalOpen: false,
    isReportCardModalOpen: false,
    page: 1,
    per_page: 10,
    meta: {},
    wardenRequestedTable: {
        row: [],
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
    },
    userRequestedTable: {
        row: [],
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
            width: "10%"
          }
        },
        {
          title: "نام و نام خــانوادگی",
          getData: (item, index) => {
            return (
              item.requested_by.firstname + " " + item.requested_by.lastname
            );
          },
          style: {
            width: "20%"
          }
        },
        {
          title: "دوره های درخواستی طبق نظر فرد",
          getData: (item, index) => {
            return (
              <button onClick={() => { this.openUserCourseModal(item) }} className="btn">
                <img src={img1} />
              </button>
            );
          },
          style: {
            width: "20%"
          }
        },
        {
          title: "دوره های درخواستی طبق نظر مسئول",
          getData: (item, index) => {
            return (
              <button onClick={() => { this.openWardCourseModal(item) }} className="btn">
                <img src={img2} />
              </button>
            );
          },
          style: {
            width: "20%"
          }
        },
        {
          title: "شناسنامه آموزشی",
          getData: (item, index) => {
            return (
              <button className="btn">
                <img src={IdCard} />
              </button>
            );
          },
          style: {
            width: "20%"
          }
        }
      ]
    }
  };

  openUserCourseModal = (item) => {
    let user_courses = [];
        item.courses.map(c=> {
            user_courses.push(c)
        })

      this.setState({
          isUserCoursesModalOpen: true,
          userRequestedTable: {
            ...this.state.userRequestedTable,
            row: user_courses
        }
      })
  }


  openWardCourseModal = (item) => {
    // let ward_courses = [];
    // item.ward_courses.map(w=> {
    //     ward_courses.push(w)
    // })

    this.setState({
      isWardCoursesModalOpen: true,
        wardenRequestedTable: {
          ...this.state.wardenRequestedTable,
          row: item.ward_courses
      },
    })
  }


  componentDidMount() {
    this.props
      .dispatch(userActions.API("get", "v1/user/hospital/ward_archive?page=1"))
      .then(res => {
        this.setState({
          table: {
            ...this.state.table,
            row: res.data.course_packages
          },
          meta: res.data.meta_data
        });
      });
  }


  closeUserCourseModal = () => {
      this.setState({
        isUserCoursesModalOpen: false
      })

  }   

  closeWardCoursesModal = () => {
      this.setState({
        isWardCoursesModalOpen: false
      })

  }

  closeReportCardModal = () => {
      this.setState({
          isReportCardModalOpen: false
      })

  }

  render() {
    console.log(this.state)
    return (
      <>
        <Routes page="pdp/checking/archives" />
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
          </div>

          <div className="mb-5">
            <HospitalTable
                totalPage={Math.ceil(this.state.meta.total_requested/10)}
                // totalPage={2}
                // active={this.state.page}
                title="دوره های درخواست شده در بخش شما"
                rows={this.state.table.row}
                headers={this.state.table.headers}
                // pageOnChange={this.getIndicator}
                // loader={ loader}
            />
          </div>
        </div>

        
        <Modal
        isOpen={this.state.isUserCoursesModalOpen}
        onRequestClose={this.closeUserCourseModal}
        style={customStyles}
        contentLabel="User Modal"
        portalclassNameName="full_screen_modal selelctUsers"
        >
            <div className='shadow'>
            <HospitalTable
                // totalPage={Math.ceil(total_indicators/per_page)}
                totalPage={1}
                active={this.state.page}
                title=""
                rows={this.state.userRequestedTable.row}
                headers={this.state.userRequestedTable.headers}
                minWidth='550'
                marginClassName=''
                showPagination={false}
                />
            </div>
        </Modal>

        <Modal
            isOpen={this.state.isWardCoursesModalOpen}
            onRequestClose={this.closeWardCoursesModal}
            style={customStyles}
            contentLabel="User Modal"
            portalclassNameName="full_screen_modal selelctUsers"
        >
            <div className='shadow'>
            <HospitalTable
                // totalPage={Math.ceil(total_indicators/per_page)}
                totalPage={1}
                active={this.state.page}
                title=""
                rows={this.state.wardenRequestedTable.row}
                headers={this.state.wardenRequestedTable.headers}
                minWidth='550'
                marginClassName=''
                showPagination={false}
                />
            </div>
        </Modal>

        <Modal
            isOpen={this.state.isReportCardModalOpen}
            onRequestClose={this.closeReportCardModal}
            style={customStyles}
            contentLabel="User Modal"
            portalclassNameName="full_screen_modal selelctUsers"
        >
            <div className='shadow'>
                <HospitalTable
                    // totalPage={Math.ceil(total_indicators/per_page)}
                    totalPage={this.state.total_page}
                    active={this.state.page}
                    title="دوره های درخواست شده در بیمارستان"
                    rows={this.state.table.row}
                    headers={this.state.table.headers}
                    // pageOnChange={this.getIndicator}
                    // loader={ loader}
                />
            </div>
        </Modal>

      </>
    );
  }
}

const Archive = connect(state => ({
  globalStorage: state.globalStorage
}))(Archive_);
export { Archive };
