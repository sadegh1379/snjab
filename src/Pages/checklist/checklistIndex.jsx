
import React from 'react';
import ReactTooltip from "react-tooltip";
import moment from 'jalali-moment';
import {HospitalTable, UsersSelect} from "../../_components"
import { globalStorage } from "../../_reducers/globalStorage.reducer";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import { userActions } from "../../_actions";
import { userConstants } from "../../_constants";
import { Routes, ToggleBotton, AdminMessage, Chart } from "../../_components";
import conceptIcon from '../../assets/images/concept.png';
import addIcon from '../../assets/images/plus.jpg';
import reportIcon from '../../assets/images/report.png';
import excelIcon from '../../assets/images/excel.png';
import masoleanjam from '../../assets/images/masoleanjam.png';
import excel from '../../assets/images/excel.png';
import trash from '../../assets/images/trash.svg';
import document from '../../assets/images/document.png';
import goal from '../../assets/images/goal.png';
import takmilchecklist from '../../assets/images/takmilchecklist.svg';
import edit from '../../assets/images/edit-flat.png';
import success from '../../assets/images/success.png';
import axios from "axios";
import Modal from "react-modal";
import CollectorIcon from '../../assets/images/network.png';


import { Link } from "react-router-dom";

const options = {
    chart: {
        type: "column"
    },
    title: {
        text: "",
        align: "center"
    },
    subtitle: {
        text: ""
    },
    series: [
        {
            data: []
        }
    ],
    xAxis: [{
        categories: [

        ]
    }]
};

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
      height: "50%",
      width: "40%"
      // top                   : '50%',
      // left                  : '50%',
      // right                 : 'auto',
      // bottom                : 'auto',
      // marginRight           : '-50%',
      // transform             : 'translate(-50%, -50%)'
    }
  };


  const exportStyles = {
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
      height: "30%",
      width: "20%"
      // top                   : '50%',
      // left                  : '50%',
      // right                 : 'auto',
      // bottom                : 'auto',
      // marginRight           : '-50%',
      // transform             : 'translate(-50%, -50%)'
    }
  };

  const customStylespwa = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '0px'


    },
    content: {
        animationName: 'animatetop',
        animationDuration: '0.4s',
        padding: '0px'
    }
};

  class Collector_Monitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CollectorModal: false,
            MonitorModal: false,
        };

    }

    handleCloseModal = () => {
        this.setState({CollectorModal: false, MonitorModal: false});
    }
    openCollectorModal = () => {
        this.setState({CollectorModal: true});
    }
    openMonitorModal = () => {
        this.setState({MonitorModal: true});
    }
}

class SelectUser_ extends Collector_Monitor {

    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            keyword: ''
        };

    }

    setUsers = () => {
                this.setState({selectedUsers: this.props.users});
            }

    
    addCollectors = (selectedUsers) => {
        console.log(selectedUsers)
        this.setState({selectedUsers})
    }
    save = () => {
        const {selectedUsers} = this.state;
        if (selectedUsers.length) {
            const params = {
                wards: selectedUsers.map(user => {
                    return {operator: user.id, ward_id: null, delivery_type: this.props.delivery_type}
                }),
                year: this.props.year,
                id: this.props.checklist_id,
            }
            this.props.dispatch(userActions.API('post', 'v1/user/hospital/checklist/ward', params)).then(res => {
                userActions.successToast('همکاران مورد نظر با موفقیت اضافه شدند');
                this.props.updateTable();
                this.handleCloseModal();
            })
        } else {
            userActions.failure('لطفاً همکاران مورد نظر را انتخاب کنید.')
        }
    }
    deleteIndicatorCollector = (user, i) => {
        const {selectedUsers} = this.state;
        this.props.dispatch(userActions.question('حذف مسئول جمع آوری', 'آیا از حذف مسئول جمع آوری مورد نظر مطمئن هستید؟')).then(r => {
            if (r.value) {
                    this.props.dispatch(userActions.API('delete', `v1/user/hospital/checklist/${this.props.checklist_id}/ward/${user.id}`)).then(res => {
                       this.props.updateTable();
                        selectedUsers.splice(i, 1);
                        userActions.successToast("با موفقیت حذف شد")
                        this.setState({selectedUsers});

                    });
            }
        })
    }

    render() {
        const {selectedUsers, keyword} = this.state;
        return (
            <>
                <button className="btn  rounded-circle" onClick={this.openCollectorModal}>
                    <img src={CollectorIcon}
                         width={this.props.iconWidth}
                         height={this.props.iconHeight}
                         alt="collector"/>
                </button>
                <Modal
                    onAfterOpen={this.setUsers}
                    isOpen={this.state.CollectorModal}
                    onRequestClose={this.handleCloseModal}
                    contentLabel="Collector Modal"
                    portalClassName="full_screen_modal"
                    // style={this.props.pwa === "pwastyle" ? customStylespwa : customStyles}
                >
                    <div className="container bg-light rounded py-4 shadow-sm">
                        <div className="row  ">
                            <div className="col-lg-10 m-auto  ">
                                <div className="form-group mt-3 ">
                                    <input type="text"
                                           name="keyword"
                                           value={keyword}
                                           onChange={userActions.handleChangeInput.bind(this)}
                                           className="form-control rounded-pill border-0 py-4 shadow-sm  text-center text-blue"
                                           placeholder="نام و  نام خانوادگی، و یا سمت شخص مورد نظر را جستجو کنید را وارد کنید"/>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-around mt-3 ">
                            {
                                selectedUsers.filter(u => keyword ? (u.firstname.indexOf(keyword) >= 0 || u.lastname.indexOf(keyword) >= 0 || (u.post && u.post.indexOf(keyword) >= 0)) : true).map((user, i) => {
                                    const user_name = user.firstname === undefined ? user.name : user.firstname + ' ' + user.lastname ; 
                                        return (
                                            <div
                                            className="fadeIn animated d-flex flex-column align-items-center col-lg-3 col-md-6 my-2"
                                            key={i}>
                                            <button onClick={() => {
                                                this.deleteIndicatorCollector(user, i)
                                            }} data-tip="حذف"
                                                    className="btn flipper rounded-circle overflow-hidden position-relative p-0"
                                                    style={{
                                                        minWidth: 50,
                                                        maxWidth: 50,
                                                        minHeight: 50,
                                                        maxHeight: 50,
                                                        zIndex: 9
                                                    }}>
    
                                                <div className="flip-box-inner bg-light" style={{minHeight: 50}}>
                                                    <img className="front-face bg-light"
                                                         src={userConstants.SERVER_URL_2 + user.avatar.url} width="50"
                                                         height="50" alt=""/>
                                                    <div
                                                        className="back-face bg-danger text-center  d-flex align-items-center justify-content-center w-100 h-100 text-light">
                                                        <i className="fal fa-trash-alt text-white fa-2x"/>
                                                    </div>
                                                </div>
    
    
                                            </button>
                                            <ReactTooltip type="light"/>
                                            <span>{user_name}</span>
                                            <span>  {user.post || ' '}</span>
                                        </div>
                                        )
                                    }
                                    
                                )
                            }

                        </div>
                        <div className="row d-flex justify-content-center mt-3">

                            <div className="d-flex flex-column align-items-center mb-3 ">
                                <UsersSelect className="btn animated bounceInUp rounded-pill"
                                             selectedUsers={this.state.selectedUsers} submit={this.addCollectors}>
                                    <img data-tip="افــزودن مسئـول جمـع آوری" src={addIcon} width="50px"
                                         height="50px" alt="افــزودن مسئـول جمـع آوری"/></UsersSelect>
                                <ReactTooltip type="light"/>
                            </div>
                        </div>
                        <div className="w-100 d-flex justify-content-center">

                            <button onClick={this.save} type="button" className="btn btn-blue rounded-pill px-5 mx-2"
                                    style={{minWidth: 200}}>ثبت
                            </button>
                            <button type="button" className="btn btn-blue rounded-pill px-5  mx-2"
                                    style={{minWidth: 200}}
                                    onClick={this.handleCloseModal}>انصـراف
                            </button>
                        </div>
                    </div>
                </Modal>
            </>

        )
    }
}

class CheckListIndex extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            intervalCount: 0,
            checkLists: [],
            chartData:  undefined,
            checklist_select: undefined,
            certificate: "",
            statistics: undefined,
            Page: 1,
            Per: 10,
            toal_records: null,
            wards: [],
            users: [],
            UsersModal: false,
            ward: '',
            general_indicators_info: null,
            chart1: null,
            chart2: null,
            indicator: '',
            checklistTable: {
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
                        title: "عنــوان چک لیست",
                        getData: (item, index) => {
                            return item.title;
                        },
                        style: {
                            width: "15%"
                        }
                    },
                    {
                        title: "مسئولین جمع آوری چک لیست",
                        getData: (item, index) => {
                            return (
                                <>
                                   <SelectUser updateTable={this.getAllChecklist} year={this.props.globalStorage.year} checklist_id={item._id} delivery_type={item.delivery_type} users={item.users} />
                                   <ReactTooltip type="dark"/>
                                   </>
                             )
                        },
                        style: {
                            width: "15%"
                        }
                    },
                    {
                        title: "تاریخ ارسال",
                        getData: (item, index) => {
                           if(item.sent_to_at!==null){
                               return moment(item.sent_to_at).locale("fa").format(" DD MMMM YYYY")
                           }else {
                               return "-"
                           }
                        },
                        style: {
                            width: "10%"
                        }
                    },
                    {
                        title: "نحوه تحویل",
                        getData: (item, index) => {
                            return item.delivery_type
                        }

                    ,
                        style: {
                            width: "10%"
                        }
                    },
                    {
                        title: "وضعیت",
                        getData: (item, index) => {
                            if(item.status==="complete"){
                                  return(
                                    <span className="px-3 py-1 rounded-pill border-inherit border text-success iran-sans_Bold">تکمیل شده </span>
                                     )
                            }
                            if(item.status==="not_send"){
                                return(
                                    <span className="px-3 py-1 rounded-pill border-inherit border text-danger iran-sans_Bold"> ارسال نشده </span>
                                )
                            }
                            if(item.status==="incomplete"){
                                return(
                                    <span className="px-3 py-1 rounded-pill border-inherit border text-warning iran-sans_Bold"> در دست تکمیل </span>
                                )
                            }

                        },
                        style: {
                            width: "15%"
                        }
                    },
                    {

                        title: "عملیات",
                        getData: (item, index) => {
                            var expr = item.status;
                            if (expr==="complete") {
                                return(
                                    <>
                                        <button onClick={() => this.exportExcel(item._id)} className="btn  btn-link" data-tip=" خروجی اکسل ">
                                            <img width={30} src={excel} alt="exportexcle"  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <button className="btn  btn-link" data-tip=" فرم چک لیست ">
                                            <img width={30} src={takmilchecklist} alt="formChecklist"  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <Link to={`/checklist/detail/${item._id}?certificate=${this.state.certificate}`} className="btn  btn-link" data-tip="مشاهده جزئیات ">
                                            <img width={30} src={document} alt="formChecklist"/>
                                            <ReactTooltip type="dark" html={true}/>
                                        </Link>
                                        <button className="btn  btn-link" data-tip=" اقدام اصلاحی  ">
                                            <img width={30} src={goal} alt="اقدام اصاحی "  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                    </>
                                )
                            }
                             if (expr==="not_send") {
                                return(
                                    <>
                                        <button onClick={() => this.deleteChecklist(item._id)} className="btn  btn-link" data-tip="  حذف ">
                                            <img width={30} src={trash} alt="del"/>
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <Link data-tip="ویرایش" to={`/checklist/create?certificate=${this.state.certificate}&id=${item._id}`} className="btn  btn-link" >
                                            <img width={30} src={edit} alt="edite"/>
                                            <ReactTooltip type="dark" html={true}/>
                                        </Link>
                                        <button className="btn  btn-link" data-tip=" اقدام اصلاحی  ">
                                            <img width={30} src={goal} alt="اقدام اصاحی "  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>

                                    </>
                                )
                            }   if(expr==="incomplete") {
                                return(
                                    <>
                                        <button className="btn  btn-link" data-tip=" فرم چک لیست ">
                                            <img width={30} src={takmilchecklist} alt="formChecklist"  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <button className="btn  btn-link" data-tip=" اقدام اصلاحی  ">
                                            <img width={30} src={goal} alt="اقدام اصاحی "  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                     </>
                                )
                            }

                            },
                        style: {
                            width: "25%"
                        }
                    }
                ]
            },

        }
        this.myRef = React.createRef();
    }


    

    exportExcel = (checklist_id) => {
        
        this.props.dispatch(
            userActions.API(
                'post',
                `v1/user/hospital/checklists/${checklist_id}/export_excel`
            )
        )
        .then(res => {
            this.setState({ExportModal: true})
            setTimeout(() => {
                window.open(userConstants.SERVER_URL_2+res.data.url,"_blank");
                this.setState({ExportModal: false})

        }, 60000)
            
        })

    }


    closeExportModal = () => {
        this.setState({ExportModal: false})
    }

    handleCloseModal = () => {
        this.setState({
            UsersModal: false
        })
    }

    handleOpenModal = (users) => {
        this.setState({
            users,
            UsersModal: true,
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }


    getCheckListStatistics = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists_statices?Year=${this.props.globalStorage.year}&certificate=${this.state.certificate}`
            )
        ).then(res => {
            this.setState({
                statistics: res.data
            })
        })
    }


    componentDidMount() {
        if (!this.props.globalStorage.indicators.length) {
            this.props.dispatch(userActions.getIndicator(this.props.globalStorage.year))
        }
        this.props.dispatch(userActions.API('get', `/v2/get_general_indicators_info?year=${this.props.globalStorage.year}`)).then(res => {
            this.setState({ general_indicators_info: res.data });
        })
        this.getWardChart()
        if (!this.props.globalStorage.wards.length) {
            this.props.dispatch(userActions.getWards()).then(res => {
                this.setState({ wards: res.data })
            })
        } else {
            this.setState({ wards: this.props.globalStorage.wards })
        }
        
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        if (!this.props.globalStorage.users.length && this.props.globalStorage.me) {
            this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
        }


        this.setState({
            certificate: params.get('certificate'),
            mehvar: params.get('mehvar'),
            mehvar_icon: params.get('mehvar_icon'),
        }, () => {
        this.getAllChecklist();
        this.getCheckListStatistics();
        this.getAllCheckListsCompact();
        
    })

    }

    
    getAllCheckListsCompact = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists_compact?year=${this.props.globalStorage.year}&certificate=${this.state.certificate}`,
            )
        ).then(r => {
            this.setState({
                checkLists: r.data
            })
        })
    }

    getWardChart = () => {
        this.props.dispatch(userActions.API('get', `/v2/indicator/ward_chart?year=${this.props.globalStorage.year}`)).then(res => {
            const chart1 = {
                data: [{ name: '', data: res.data.map(d => d.count) }],
                categories: res.data.map(d => d.ward)
            }
            this.setState({ chart1 })
        })
    }
    getIntervalChart = (indicator) => {
        this.props.dispatch(userActions.API('get', `/v2/indicator/interval_chart?id=${indicator.id}&year=${this.props.globalStorage.year}`)).then(res => {
            const categories = userActions.getIntervalTitles(indicator.measure_interval, this.props.globalStorage.year).map(d => d.name)
            const data = [
                {
                    name: 'مجموع دفعات اندازه گیری',
                    data: res.data.map(d => ({
                        y: d.data.users.length,
                        name: d.data.users.map(
                            user => user.firstname + ' ' + user.lastname + (user.post ? '(' + user.post + ')' : '')
                        ).join('</br>')
                    })),
                    dataLabels: {
                        enabled: true,
                        y: 10
                    }

                },
                {
                    name: 'تعداد دفعات اندازه گیری شده',
                    data: res.data.map(d => ({
                        y: d.data.collected_users.length,
                        name: d.data.collected_users.map(
                            user => user.firstname + ' ' + user.lastname + (user.post ? '(' + user.post + ')' : '')
                        ).join('</br>')
                    })),
                    dataLabels: {
                        enabled: true,
                        y: 10
                    }

                }
            ]
            /*const tooltipFormatter=function(){
                console.log(this,this.point)
                if(this.point && this.point.myData){
                    return '<p>'+this.point.myData.join('</br>')+'</p>'
                }

            }*/
            const chart2 = {
                data,
                categories,
                tooltipFormatter: undefined
            }
            this.setState({ chart2 })
        })
    }
    componentDidUpdate(Props, State) {
        if (State.indicator !== this.state.indicator && this.state.indicator) {
            this.getIntervalChart(this.state.indicator);
        }
        
    }
   

    getAllChecklist = () => {
        this.props
            .dispatch(userActions.API("get",`v1/user/hospital/checklists_v2?year=${this.props.globalStorage.year}
             &certificate=${this.state.certificate}&page=${this.state.Page}&per=${this.state.Per}`)
            )
            .then(res => {
                this.setState({
                    toal_records: res.data.meta.records_count,
                    checklistTable: {
                        ...this.state.checklistTable,
                        row: res.data.result
                    }
                });
            });
    };


    deleteChecklist = (id) => {
        this.props.dispatch(
            userActions.question('حذف چک لیست', "چک لیست مورد نظر حذف شود؟")
        ).then(v => {
            if (v.value) {
                this.props.dispatch(
                    userActions.API(
                        'delete',
                        `v1/user/hospital/checklist/${id}`
                    )
                ).then(res => {
                    this.getAllChecklist();
                    userActions.successToast('با موفقیت حذف شد.');
                })
            }
        })
    } 

    getCheckListChart = (checklist_id) => {
        const {chartData} = this.state;
        this.props.dispatch(
            userActions.API(
                'post',
                `/v1/user/hospital/checklists/${checklist_id}/answered_count_by_interval`
            )
        ).then(res => {
            const categories = new Array();
            const data = [
                {
                    name:'تعداد افراد پاسخ داده',
                    data: res.data.map( (intv) => ({
                        y: intv.answered,
                        name: ""
                    }) ),
                    dataLabels:{
                        enabled:true,
                        y:10
                    }
                },
                {
                    name:'تعداد کل',
                    data: res.data.map( (intv) => ({
                        y: intv.total,
                        name: ""
                    }) ),
                    dataLabels:{
                        enabled:true,
                        y:10
                    }
                },
            ];
            res.data.map( (interval,i) => {
                categories.push(interval.interval_title)
                
            } )

            const chartData = {
                categories,
                data,
            } 
            this.setState({chartData})
            
        })
    }

    handleChangeChecklist = (selected) => {
        this.setState({checklist_select: selected});
        this.getCheckListChart(selected['id'])
    }


    OnTablePageChange = (page=1) => {
        this.setState({
            Page: page
        },() => {
            this.getAllChecklist()
        })
    }

    render() {
        const { general_indicators_info, indicator, ward, wards, statistics } = this.state;
        const { indicators } = this.props.globalStorage;
        return (
        <>
            <div className="content bg-light pt-3 pb-5 px-3 ">
                <Routes page="checklist" />
                <div className="container-fluid">
                    <div className="card  bg-white shadow  text-center  border-0  ">

                        <AdminMessage />
                    </div>
                </div>
                <br />
                {statistics &&
                    <div className="container-fluid mb-4" >
                        <div className="d-flex justify-content-center">
                            <div className="card text-center ml-4 width-15 borderDarkpurple ">
                                <div className="card-body">
                                    <p className="card-title Darkpurple ">
                                        <small className="Darkpurple lalezar"> کل چک لیست ها</small>
                                    </p>
                                    <h5 className="card-text Darkpurple iran-sans_Bold my-1">{statistics.total}</h5>
                                </div>
                            </div>
                            <div className="card text-center ml-4 width-15 borderbluecolor">
                                <div className="card-body">
                                    <p className=" card-title">
                                        <small className="bluecolor lalezar">چک لیست های ارسال نشده</small>
                                    </p>
                                    <h5 className="card-text bluecolor iran-sans_Bold ">{statistics.not_send}</h5>
                                </div>
                            </div>
                            <div className="card text-center ml-4 width-15 borderlightBlue">
                                <div className="card-body">
                                    <p className=" card-title">
                                        <small className="lightBlue lalezar"> چک لیست های تکمیل شده</small>
                                    </p>
                                    <h5 className="card-text iran-sans_Bold lightBlue ">{statistics.complete}</h5>
                                </div>
                            </div>
                            <div className="card text-center width-15 borderDarkpurple ">
                                <div className="card-body">
                                    <p className="card-title Darkpurple ">
                                        <small className="Darkpurple lalezar"> چک لیست های در دست تکمیل</small>
                                    </p>
                                    <h5 className="card-text Darkpurple iran-sans_Bold my-1">{statistics.incomplete}</h5>
                                </div>
                            </div>
                        </div>

                    </div>

                }
                {general_indicators_info &&
                    <div className="container-fluid">
                        <div className="row my-2">
                            <div  className="col-lg-2   indexSec my-1 ">
                                <div className="card-deck border-0 h-100 ">
                                    <div className="card border-0 shadow">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-center flex-column align-items-center">
                                                {/* <div className="card-deck "> */}
                                                    <div className="card text-center border-0">
                                                        <div className="card-body border-0">
                                                            <NavLink className="d-flex flex-column align-items-center      indexs btn"
                                                                to={`/checklist/create?certificate=${this.state.certificate}&mehvar=${this.state.mehvar}&Year=${this.props.globalStorage.year}`}>
                                                                <img style={{width: "60%"}} src={addIcon} alt="" />
                                                                <span className="lalezar text-center text-dark my-2">  تدوین چک لیست</span>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                    <div className="card text-center border-0">
                                                        <div className="card-body border-0">
                                                            <NavLink className="d-flex flex-column align-items-center      indexs btn"
                                                                to={`/checklist/dashboard?certificate=${this.state.certificate}`}>
                                                                <img src={reportIcon} alt="" style={{width: "60%"}}/>
                                                                <span className="lalezar text-center text-dark my-2">داشبورد چک لیست</span>
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                    <div className="card text-center border-0">
                                                        <div className="card-body border-0">
                                                            <button onClick={() => userActions.failure("Soon ...")} className="d-flex flex-column align-items-center      indexs btn"
                                                            >
                                                                <img src={excelIcon} alt="" style={{width: "60%"}} />
                                                                <span className="lalezar text-center text-dark my-2">خروجی اکسل</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div  className="col-lg-10 my-2  ">
                                <div className="card-deck h-100">
                                    <div className="card border-0 shadow ">
                                        <div className="card-body text-center  ">
                                            <div className="py-1 d-flex justify-content-center">
                                                <label className="py-1 mx-2 w-100 d-block" style={{ maxWidth: 350, fontSize: '.8em' }}>
                                                    <Select className="text-justify custom-select-2"
                                                        value={this.state.checklist_select}
                                                        name="checklist_select"
                                                        placeholder="چک لیست مورد نظر را انتخاب کنید"
                                                        onChange={this.handleChangeChecklist}
                                                        options={this.state.checkLists}
                                                        getOptionLabel={opt => opt.title}
                                                        getOptionValue={opt => opt.id}

                                                    />
                                                </label>
                                            </div>
                                            <div className="bg-light SalesChart dirLTR" >
                                                {this.state.chartData &&
                                                    <Chart
                                                        data={this.state.chartData.data}
                                                        categories={this.state.chartData.categories}
                                                        // tooltipFormatter={this.state.chart2.tooltipFormatter}
                                                        chartType={"column"}
                                                        legend={true}
                                                        chartMargin={[60, 50, 150, 80]}
                                                    />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>}
                <div className="container-fluid chart-section my-3">
                    <div className="row ">
                        <div className="col-lg-12">
                            <div className="box-shadow rounded bg-white">
                                <HospitalTable
                                    totalPage={Math.ceil(this.state.toal_records / this.state.Per)}
                                    pageOnChange={this.OnTablePageChange}
                                    active={this.state.Page}
                                    minWidth={"1070px"}
                                    rows={this.state.checklistTable.row}
                                    headers={this.state.checklistTable.headers}
                                />
                                       <Modal
                                            isOpen={this.state.UsersModal}
                                            onRequestClose={this.handleCloseModal}
                                            styles={customStyles}
                                            contentLabel="Collector Modal"
                                            portalClassName="user_modal"
                                        >
                                            
                                            <div className="row d-flex justify-content-around mt-3 bg-white">
                                                  {this.state.users.map( (u,i) => {
                                                      return (
                                                          <div key={i}>
                                                              <p>
                                                                    {u}
                                                              </p>
                                                          </div>
                                                      )
                                                  })}  
                                            </div>

                                            <div className="d-flex justify-content-center mt-5">
                                                <button onClick={this.handleCloseModal} className="btn btn-blue rounded-pill w-25">
                                                        بازگـشت
                                                </button>
                                            </div>
                                        </Modal>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Modal
                isOpen={this.state.ExportModal}
                onRequestClose={this.closeExportModal}
                styles={exportStyles}
                shouldCloseOnEsc={false}
                shouldCloseOnOverlayClick={false}
                contentLabel="Collector Modal"
                portalClassName="export_modal"
            >   
                <h1 className="text-center bg-blue text-white p-3">درخواست شما ثبت شد!</h1>
                <div className="d-flex justify-content-center">
                    <img src={success} />
                </div>
                <p className="text-center iran-sans_Bold h5 mx-4 mt-4">فایل شما در دست آماده سازی میباشد و به محض آماده شدن دانلود فایل شروع میشود. لطفا صبور باشید...</p>
                                            
            </Modal>

        </>


        )
    }
}

const SelectUser = connect()(SelectUser_)
const CheckListIndexComponent = connect((state) => ({ globalStorage: state.globalStorage }))(CheckListIndex);
export { CheckListIndexComponent }
