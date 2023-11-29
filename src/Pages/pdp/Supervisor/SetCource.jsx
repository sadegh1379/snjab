import React from "react";
import Select from "react-select";
import {HospitalTable, InputGenerator} from "../../../_components";
import {userActions} from "../../../_actions";
import {connect} from "react-redux";
import {DatePicker} from "react-advance-jalaali-datepicker";
import moment from 'jalali-moment'
import TimePicker from "react-times";

class SetCource_ extends React.Component {
    state = {
        CourseTitle: "",
        CourseContent: "",
        CourseAuthor: "",
        holdPlace: "",
        CourseTarget: "",
        reeducationPoint: "",
        time_event: undefined,
        holdPlaces: [],
        reeducationPointOptions: [],
        AcceptedCourse: [],
        table: {
            row: [],
            headers: [
                {
                    title: "ردیف",
                    getData: (item, index) => {
                        return index + 1;
                    },
                    style: {
                        width: "10%"
                    }
                },
                {
                    title: "تاریخ",
                    getData: (item, index) => {
                        if (item.add === true) {
                            return (
                                <div className={"mx-auto"}>
                                    <DatePicker
                                        inputComponent={(props) => (
                                            <input
                                                type="text"
                                                className="form-control border-0 bg-white rounded-pill text-center  pl-5"
                                                style={{borderColor: '#efefef'}}
                                                {...props}/>)}
                                        placeholder="انتخاب تاریخ"
                                        format="jYYYY/jMM/jDD"
                                        cancelOnBackgroundClick={true}
                                        onChange={(unix, formatted) => {
                                            item['slut'] = {
                                                ...item['slut'],
                                                start_date: moment(formatted, "jYYYY/jMM/DD").locale("en").format('YYYY-MM-DD')
                                            };
                                            this.setState({table: {...this.state.table}})

                                        }}
                                    />
                                </div>
                            )

                        }
                    },
                    style: {
                        width: "20%"
                    }
                },
                {
                    title: "ساعت شروع",
                    getData: (item, index) => {
                        if (item.add === true) {
                            return(
                             <div className="form-control rounded-pill text-center border-0 w-70 mr-3" style={{boxShadow:'0px 0px 4px 1px #ccc'}}>
                              
                                <TimePicker  timezone="Asia/Tehran" colorPalette="dark" theme="classic"
                                onTimeChange={(time) => {
                                                item['slut'] = {
                                                    ...item['slut'],
                                                    start_time: time.hour + ":" + time.minute
                                                };
                                                this.setState({table: {...this.state.table}})
                                            }}
                                time={item['slut'] ? item['slut']['start_time'] : undefined}
                                />
                            </div>
                                // <div className="form-control rounded-pill text-center border-0 w-70 mr-3" style={{boxShadow:'0px 0px 4px 1px #ccc'}}>
                                //     <TimePicker
                                //         withoutIcon
                                //         time={item['sluts'] ? item['sluts']['start_time'] : undefined}
                                //         theme="material"
                                //         timeMode='24'
                                //         timezone="Asia/Tehran"
                                //         onTimeChange={(time) => {
                                //             item['slut'] = {
                                //                 ...item['slut'],
                                //                 start_time: time.hour + ":" + time.minute
                                //             };
                                //             this.setState({table: {...this.state.table}})
                                //         }}
                                //     />
                                // </div>
                                )
                        }
                    },
                    style: {
                        width: "20%"
                    }
                },
                {
                    title: "ساعت پایان",
                    getData: (item, index) => {
                        if (item.add === true) {
                            return(
                                <div className="form-control rounded-pill text-center border-0 w-70 mr-3" style={{boxShadow:'0px 0px 4px 1px #ccc'}}>
                              
                                <TimePicker  timezone="Asia/Tehran" colorPalette="dark" theme="classic"
                                onTimeChange={(time) => {
                                                item['slut'] = {
                                                    ...item['slut'],
                                                    end_time: time.hour + ":" + time.minute
                                                };
                                                this.setState({table: {...this.state.table}})
                                            }}
                                time={item['slut'] ? item['slut']['end_time'] : undefined}
                                />
                            </div>
                                )
                        }
                    },
                    style: {
                        width: "20%"
                    }
                },
                {
                    title: "عملیات",
                    getData: (item, index) => {
                        return <button onClick={() => {
                            delete this.state.table.row[index]
                            this.setState({table: {...this.state.table}})

                        }}  className={'btn btn-danger rounded-pill w-70'}>
                            حذف
                        </button>
                    },
                    style: {
                        width: "20%"
                    }
                }
            ]
        }
    };

    getAcceptedCourses = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                '/v1/user/hospital/get_accepted_courses',
            )
        ).then(res => {
            this.setState({
                AcceptedCourse: userActions.generateSelectLabelValue(res.data.accpeted_courses)
            })
        })
    };


    getLocations = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                '/v1/user/hospital/event_locations',
            )
        ).then(res => {
            this.setState({
                holdPlaces: res.data
            })
        })
    };
    generateReeducationPoint = () => {
        const {reeducationPointOptions} = this.state;
        for (let i = 1; i <= 100; i++) {
            reeducationPointOptions.push(i);
        }

        this.setState({
            reeducationPointOptions: userActions.generateSelectLabelValue(reeducationPointOptions)
        })

    };



    create_period = () => {
        const {CourseTitle, CourseAuthor, CourseTarget, CourseContent, holdPlace, reeducationPoint} = this.state;
        const sluts = [];
        this.state.table.row.map((v, i) => {
            sluts.push(v.slut)
        })

        this.props.dispatch(
            userActions.question('ثبت دوره','دوره ی جدید ثبت شود؟')
        ).then(v => {
            if (v.value) {
                this.props.dispatch(
                    userActions.API(
                        'post',
                        '/v1/user/hospital/add_educational_period',
                        {
                            title: CourseTitle.value,
                            target: CourseTarget,
                            content: CourseContent,
                            tutor: CourseAuthor,
                            hold_place: holdPlace.location_name,
                            reeducation_point: reeducationPoint.value,
                            sluts
                        }
                    )
                )
            }
        })
    }

    AddToTable = () => {
        const {row} = this.state.table;
        row.push({
            add: true
        });
        this.setState({
            table: {
                ...this.state.table,
                row
            }
        });
        console.log(row, row.length)

    };

    componentDidMount() {
        this.getLocations();
        this.generateReeducationPoint();
        this.getAcceptedCourses();
    }


    render() {
        const {AcceptedCourse} = this.state;
        console.log(this.state.table)
        return (
            <div className="Cource">
                <div className="container shadow rounded bg-blue3  ">
                    <div className="row  ">
                        <div className="col-12 text-center   border-brown-bottom border-bottom py-3   ">
                            تعریف دوره آمـوزشی
                        </div>
                        <div className={"col-lg-12 mt-4 "}>
                            <p className="text-right" htmlFor="">
                                عنـوان دوره
                            </p>
                            <Select
                                options={AcceptedCourse}
                                value={this.state.CourseTitle}
                                name="CourseTitle"
                                onChange={userActions.handleChangeSelect.bind(this)}
                                className="w-100 custom-select-2"
                                placeholder={""}/>
                        </div>
                        <div className={"col-lg-6 col-md-12 mt-4 "}>
                            <p className="text-right" htmlFor="">
                                هــدف دوره
                            </p>
                            <input
                                value={this.state.CourseTarget}
                                name="CourseTarget"
                                onChange={userActions.handleChangeInput.bind(this)}
                                type="text-aria"
                                className="form-control shadow border-0 rounded h-100"
                            />
                        </div>
                        <div className={"col-lg-6 col-md-12 mt-4"}>
                            <p className="text-right" htmlFor="">
                                مــحتوا دوره
                            </p>
                            <input
                                value={this.state.CourseContent}
                                name="CourseContent"
                                onChange={userActions.handleChangeInput.bind(this)}
                                type="text-aria"
                                className="form-control shadow border-0 rounded h-100 "
                            />
                        </div>
                        <div className={"col-lg-6 col-md-12 mt-5 "}>
                            <p className="text-right" htmlFor="">
                                مــدرس دوره
                            </p>
                            <input
                                value={this.state.CourseAuthor}
                                name="CourseAuthor"
                                onChange={userActions.handleChangeInput.bind(this)}
                                type="text-aria"
                                className="form-control shadow border-0 rounded-pill"
                            />
                        </div>
                        <div className={"col-lg-6 col-md-12 mt-5 "}>
                            <p className="text-right" htmlFor="">
                                {" "}
                                امتیاز بازآمـوزی
                            </p>
                            <Select
                                name={'reeducationPoint'}
                                value={this.state.reeducationPoint}
                                onChange={userActions.handleChangeSelect.bind(this)}
                                className="w-100 custom-select-2"
                                options={this.state.reeducationPointOptions}
                                placeholder={" "}/>
                        </div>
                        <div className="d-flex justify-content-center mr-5 mt-3">
                            <HospitalTable
                                showPagination={false}
                                totalPage={2}
                                active={this.state.page}
                                title=""
                                minWidth="900px"
                                rows={this.state.table.row}
                                headers={this.state.table.headers}
                                addToTable={this.AddToTable}
                                // pageOnChange={this.getIndicator}
                                // loader={ loader}
                            />
                        </div>

                        <div className={"col-lg-6 col-md-12  text-center m-auto py-4 "}>
                            <p className="text-right" htmlFor="">
                                {" "}
                                مـــکان برگــزاری
                            </p>
                            <Select
                                value={this.state.holdPlace}
                                name="holdPlace"
                                onChange={userActions.handleChangeSelect.bind(this)}
                                className="w-100 custom-select-2"
                                options={this.state.holdPlaces}
                                getOptionLabel={opt => opt.location_name}
                                getOptionValue={opt => opt.id}
                                placeholder={""}/>
                        </div>
                    </div>
                    <div className="row justify-content-center pb-4">
                        <button onClick={this.create_period} className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">
                            ثبت
                        </button>
                        <button className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">
                            انصراف
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const SetCource = connect(state => ({
    globalStorage: state.globalStorage
}))(SetCource_);
export {SetCource};
