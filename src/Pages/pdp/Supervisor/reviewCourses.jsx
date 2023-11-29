import React, { Component } from 'react'
import Modal from "react-modal";
import Select from 'react-select';
import { connect } from "react-redux";
// import '../../assets/sass/_supervisor.scss'
import img1 from '../../../assets/images/doctor.png';
import img2 from '../../../assets/images/library.png';
import success from '../../../assets/images/success.png';
import cancel from '../../../assets/images/cancel.png';
import { HospitalTable } from '../../../_components';
import { userActions } from '../../../_actions';

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
      padding: 0,
    //   margin: "auto",
    //   width: "50%"
      // top                   : '50%',
      // left                  : '50%',
      // right                 : 'auto',
      // bottom                : 'auto',
      // marginRight           : '-50%',
      // transform             : 'translate(-50%, -50%)'
    }
  };

class ReviewCourses_ extends Component {
    state = {
        page: 1,
        per_page: 10,
        isModalOpen: false,
        coursePackageId: "",
        AllCoursesCount: "",
        coursesDataList: [],
        wardenRequestedTable: {
            row: [],
            headers: [
                {
                    title: "عـنــوان دوره",
                    getData: (item, index) => {
                        return (
                            item.title
                            );
                },
                    style: {
                        width: "80%"
                    }
                },
                {
                    title: "وضعیت",
                    getData: (item, index) => {
                        let confirm ;
                        let deny;
                        this.state.coursesDataList.map((course, i) => {
                            if (course.id === item._id) {
                                if (course.status === "accepted") {
                                    confirm = true;
                                    deny = false
                                } else {
                                    confirm = false;
                                    deny = true;
                                }
                            }
                        }) 
                        return (
                            <>
                                <button 
                                onClick={() => this.confirmCourse(item, index)}
                                className={`btn ${confirm === true ? "border-bottom" : ""}`}>
                                    <img src={success} alt=""  className="w-50"/>
                                </button>
                                <button  
                                onClick={() => this.denyCourse(item, index)}
                                className={`btn ${deny === true ? "border-bottom" : ""}`}>
                                    <img src={cancel} alt=""  className="w-50"/>
                                </button>
                            </>
                            );
                },
                    style: {
                        width: "20%"
                    }
                },
            ]
        },
        userRequestedTable: {
            row: [],
            headers: [
                {
                    title: "عـنــوان دوره",
                    getData: (item, index) => {
                        return (
                            item.title
                            );
                },
                    style: {
                        width: "80%"
                    }
                },
                {
                    title: "وضعیت",
                    getData: (item, index) => {
                        let confirm ;
                        let deny;
                        this.state.coursesDataList.map((course, i) => {
                            if (course.id === item._id) {
                                if (course.status === "accepted") {
                                    confirm = true;
                                    deny = false
                                } else {
                                    confirm = false;
                                    deny = true;
                                }
                            }
                        }) 
                        return (
                            <>
                                <button 
                                onClick={() => this.confirmCourse(item, index)}
                                className={`btn ${confirm === true ? "border-bottom" : ""}`}>
                                    <img src={success} alt=""  className="w-50"/>
                                </button>
                                <button  
                                onClick={() => this.denyCourse(item, index)}
                                className={`btn ${deny === true ? "border-bottom" : ""}`}>
                                    <img src={cancel} alt=""  className="w-50"/>
                                </button>
                            </>
                            );
                },
                    style: {
                        width: "20%"
                    }
                },
            ]
        },
        mainTable: {
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
                    title: "نام و نام خـانوادگـی",
                    getData: (item, index) => {
                        return (
                            item.requested_by.firstname + " " + item.requested_by.lastname
                          );
                },
                    style: {
                        width: "12%"
                    }
                },
                {
                    title: "بخش",
                    getData: (item, index) => {
                        let ward = '-';
                            item.courses.map(i => {
                                if(i.ward) {
                                    ward = i.ward.name
                                }
                                
                            })
                        return (
                            ward
                          );
                },
                    style: {
                        width: "10%"
                    }
                },
                {
                    title: "گروه شغلی",
                    getData: (item, index) => {
                        return (
                            item.requested_by.job_group
                          );
                },
                    style: {
                        width: "10%"
                    }
                },
                {
                    title: "تعداد دوره ها مطابق نظر کاربر",
                    getData: (item, index) => {
                        return (
                            item.courses.length
                          );
                },
                    style: {
                        width: "25%"
                    }
                },
                {
                    title: "تعداد دوره ها مطابق نظر مسئول",
                    getData: (item, index) => {
                        return (
                            item.ward_courses.length
                          );
                },
                    style: {
                        width: "25%"
                    }
                },
                {
                    title: "نظرات سوپروایزر",
                    getData: (item, index) => {
                        console.log(item)
                        return (
                            <button
                                style={{ color: "white" }}
                                className="btn  rounded-pill bg-blue iran-sans mx-2 w-30  "
                                onClick={() => {
                                    this.setState({
                                        coursePackageId:item.id
                                    })
                                    this.SupervisorOpinion(item);
                                }}
                                >
                                {" "}
                                اعمال نظر
                            </button>
                          );
                },
                    style: {
                        width: "13%"
                    }
                },
                
            ]
        },
    }

    submitSupervisorOpinion = () => {
        const {coursePackageId, coursesDataList, AllCoursesCount} = this.state;
        console.log(coursePackageId, )
        if (coursesDataList.length !== AllCoursesCount) {
            return userActions.failure('لطفا درباره تمامی دوره ها اعلام نظر کنید.')
        }
        this.props.dispatch(
            userActions.API(
                'put',
                'v1/user/hospital/accept_or_deny_courses',
                {
                   course_package:  coursePackageId,
                   courses: coursesDataList
                }
            )
        ).then(res => {
            userActions.successAlert('ثبت موفق', "با موفقیت ثبت شد")
        })

    } 


    denyCourse = (course, index) => {
        let {coursesDataList} = this.state;
        let isAccetpted;
        coursesDataList.map((c, i) => {
            if (c["id"] === course._id) {
                isAccetpted = true;
                return c["status"] =  "denied";
            }
        })

        if (!isAccetpted) {
            coursesDataList.push({
                id: course._id,
                status: "denied"
            })
        }

        this.setState({
            coursesDataList
        })
    } 

    confirmCourse = (course, index) => {
        let {coursesDataList} = this.state;
        let isDenied;
        coursesDataList.map((c, i) => {
            if (c["id"] === course._id) {
                isDenied = true;
                return c["status"] =  "accepted";
            }
        })
        if (!isDenied) {
            coursesDataList.push({
                id: course._id,
                status: "accepted"
            })
        }
        this.setState({
            coursesDataList
        })

    }
    getSupervisorCourses = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                'v1/user/hospital/supervisor_courses?page=1',
            )
        )
        .then(res => {
            this.setState({
                mainTable: {
                    ...this.state.mainTable,
                    row: [
                        ...res.data.course_packages,
                      ]

                }
                
            })
        })
    }



    closeModal = () => {
        this.setState({
            isModalOpen: false,
            userRequestedTable: {
                ...this.state.userRequestedTable,
                row: [],
            },
            wardenRequestedTable: {
                ...this.state.wardenRequestedTable,
                row: [],
            }
        })
    }


    SupervisorOpinion = (course) => {
        let ward_courses = [];
            let user_courses = [];
                course.ward_courses.map(w=> {
                    ward_courses.push(w)
                })
                course.courses.map(c=> {
                    user_courses.push(c)
                })

        this.setState({
            AllCoursesCount: course.ward_courses.length + course.courses.length,
            wardenRequestedTable: {
                ...this.state.wardenRequestedTable,
                row: ward_courses
            },
            userRequestedTable: {
                ...this.state.userRequestedTable,
                row: user_courses
            }
        })


        this.openModal();
    }

    openModal = () => {
        this.setState({
            isModalOpen: true
        })
    }


    componentDidMount() {
        this.getSupervisorCourses();
    }

    render() {
        let {coursesDataList} = this.state;
        console.log(coursesDataList)
        return (
    <>
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

        <div className="container-fluid my-5">
            <div className="search box-shadow radius-10 py-4">
                <form className="px-md-5 px-1">
                    <input className="text-center rounded-pill border-0 box-shadow w-100 py-3" type="text"
                            placeholder={"نام و نام خانوادگی کاربر، عنوان دوره، مسئول بالادستی و هریک از مشخصه های مرتبط را وارد کنید"} />

                    <div className="d-flex flex-column align-items-center my-5">
                        <div className="h-line w-50"></div>
                        <div className="header-logo-bg bg-blue rounded-circle p-2">
                            <i className="fal fa-search text-white fa-2x"></i>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="text-right col-xl-4 col-md-5 mx-md-4 my-2">
                            <label className="color-dark iran-sans_Bold mx-2">نام و نام خانوادگی</label>
                            <Select placeholder={''} />
                        </div>
                        <div className="text-right col-xl-4 col-md-5 mx-md-4 my-2">
                            <label className="color-dark iran-sans_Bold mx-2">بخش یا واحد</label>
                            <Select placeholder={''} />
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {/*Table*/}
    <div style={{marginBottom: '90px'}}>
        <HospitalTable
                // totalPage={Math.ceil(total_indicators/per_page)}
                totalPage={2}
                active={this.state.page}
                title="دوره های درخواست شده در بیمارستان"
                rows={this.state.mainTable.row}
                headers={this.state.mainTable.headers}
                minWidth='1100px'
                
        />
    </div>
       

       


        {/*supervisor-opinion*/}
        <Modal
            isOpen={this.state.isModalOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="User Modal"
            portalclassNameName="full_screen_modal selelctUsers"
        >
        <div className="container-fluid my-5 px-lg-5">
            <div className="supervisor-opinion shadow radius-10 mx-md-5">
                <h3 className="text-center h4 color-dark lalezar py-4">اعمال نظر سوپـروایــزر آمــوزشــی</h3>
                <div className="row justify-content-center pb-5 mx-1">
                    <div className="col-xl-6 col-lg-9 my-2">
                        <div className="box-shadow radius-10">
                            <div className="row align-items-center border-bottom mx-1 pb-2 pt-3">
                                <div className="d-flex justify-content-around col-3">
                                    <img width="70px" height="100px"  src={img1} />
                                    <div className="v-line"></div>
                                </div>
                                <div className="col-9">
                                    <h4 className="text-center h5 color-dark lalezar my-0">دوره های درخواست شده مطابق نظر کاربر</h4>
                                </div>
                            </div>

                            {/*table*/}
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
                    </div>

                    <div className="col-xl-6 col-lg-9 my-2">
                        <div className="box-shadow radius-10">
                            <div className="row align-items-center border-bottom mx-1 pb-2 pt-3">
                                <div className="d-flex justify-content-around col-3">
                                    <img width="70px" height="100px" src={img2} />
                                    <div className="v-line"></div>
                                </div>
                                <div className="col-9">
                                    <h4 className="text-center h5 color-dark lalezar my-0">دوره های درخواست شده مطابق نظر مسئول</h4>
                                </div>
                            </div>
                            {/*table*/}
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
                    </div>

                </div>

                <div className="row justify-content-center pb-4">
                    <button 
                    onClick={this.submitSupervisorOpinion}
                    className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">تـاییــد
                    </button>
                    <button
                        onClick={this.closeModal}
                        className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">بـازگـشــت
                    </button>
                </div>
            </div>

        </div>
    </Modal>
    </>
        )
    }
}



const ReviewCourses = connect(state => ({
    globalStorage: state.globalStorage
  }))(ReviewCourses_);
  export { ReviewCourses };
  