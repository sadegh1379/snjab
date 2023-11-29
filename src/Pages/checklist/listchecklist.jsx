import React, {Component} from "react";
import {Routes, } from "../../_components";
import {userActions} from "../../_actions";
import ReactTooltip from "react-tooltip";
import Select from 'react-select';
import {connect} from "react-redux";
import edit from '../../assets/images/edit-flat.png';
import masoleanjam from '../../assets/images/masoleanjam.png';
import excel from '../../assets/images/excel.png';
import trash from '../../assets/images/trash.svg';
import document from '../../assets/images/document.png';
import goal from '../../assets/images/goal.png';
import takmilchecklist from '../../assets/images/takmilchecklist.svg';
import {UsersSelect,HospitalTable} from "../../_components";
import moment from "jalali-moment/jalali-moment";




class ChecklistState_ extends Component {

    constructor(props) {
        super(props);
        this.openCollectorModal = this.openCollectorModal.bind(this);
        this.state = {
            selectedUsers: [],
            keyword: '',
            selectState:'',
            selectedState: ['همه' ,' در دست تکمیل  ', 'ارسال نشده ', 'تکمیل شده '].map(a => ({title: a})),
            CollectorModal: false,
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
                            return(
                                <>
                                   <UsersSelect className="btn  rounded-pill"
                                                selectedUsers={this.state.selectedUsers} submit={this.addCollectors}>
                                       <img data-tip=" مسئول جمع آوری" src={masoleanjam} width="40px"
                                            height="40px" alt="افــزودن مسئول جمع آوری"/>
                                   </UsersSelect>
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
                            return item.checklist_page_wards[0].delivery_type
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
                                        <button className="btn  btn-link" data-tip=" خروجی اکسل ">
                                            <img width={30} src={excel} alt="exportexcle"  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <button className="btn  btn-link" data-tip=" فرم چک لیست ">
                                            <img width={30} src={document} alt="formChecklist"  />
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <button className="btn  btn-link" data-tip="مشاهده جزئیات ">
                                            <img width={30} src={takmilchecklist} alt="formChecklist"/>
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
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
                                        <button className="btn  btn-link" data-tip="  حذف ">
                                            <img width={30} src={trash} alt="del"/>
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
                                        <button className="btn  btn-link" data-tip="  ویرایش  ">
                                            <img width={30} src={edit} alt="edite"/>
                                            <ReactTooltip type="dark" html={true}/>
                                        </button>
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
                                            <img width={30} src={document} alt="formChecklist"  />
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

    }
    async openCollectorModal ()  {
    await  this.setState({CollectorModal: true});

    }

    addCollectors = (selectedUsers) => {
        console.log(selectedUsers)
        this.setState({selectedUsers})
    }

    getAllChecklist = () => {
        this.props
            .dispatch(userActions.API("get",`/v1/user/hospital/checklists?year=${this.props.globalStorage.year}
             &certificate=ارزیابی رضایت شغلی کارکنان|`)
            )
            .then(res => {
                this.setState({
                    checklistTable: {
                        ...this.state.checklistTable,
                        row: res.data
                    }
                });
            });
    };
    componentDidMount() {
        this.getAllChecklist();

    }
    render() {
        const {selectedUsers, keyword,selectState,selectedState} = this.state;

        console.log(selectedUsers,"useraye koofti...")


        return (
            <>
                <div className="py-5 text-right bg-light">
                    <Routes page={"checklist/ChecklistState"}/>

                    <div className="container-fluid">
                        <p className="text-justify text-center iran_sans_Bold">دبیر گرامی، لطفاً چک لیست ارزیابی فرآیند را تدوین نمایید و جهت تکمیل به اعضای مورد نظر ارسال نمایید.</p>
                        <div className="d-flex justify-content-center my-3">
                            <button className="btn  btn-link text-dark d-flex flex-column align-items-center" >
                                <img width={80} src={takmilchecklist} alt="createchecklist"  />
                                <span className="py-2">تدوین چک لیست</span>
                            </button>
                            <button className="btn  btn-link d-flex flex-column align-items-center" >
                                <img width={80} src={excel} alt="exportexcle"  />
                                <span className="py-2 text-dark ">خروجی اکسل</span>
                            </button>
                        </div>
                        <p className="text-justify text-center iran_sans_Bold py-2">مشاهده وضعیت چک لیست ارزیابی در بخش های مختلف تا به امروز</p>
                        <div className="row d-flex justify-content-center px-5    ">
                            <div className={'col-lg-8 my-1 '}>
                                <input type="text-aria"
                                       name="title"
                                       placeholder={"کلید واژه مورد نظر را وارد کنید (نام چک لیست، نام بخش یا مسئول پایش)..." }
                                       // value={title}
                                       onChange={userActions.handleChangeInput.bind(this)}
                                       className="form-control  border-0 rounded-pill  boxshadow text-center "

                                />
                            </div>
                            <div className={'col-lg-4 my-1 '}>
                                <Select className="w-100 text-center custom-select-2 "
                                        value={selectState}
                                        name="selectState "
                                        placeholder="انتخاب  وضعیت "
                                        onChange={userActions.handleChangeSelect.bind(this)}
                                        options={selectedState}
                                        getOptionLabel={opt => opt.title}
                                        getOptionValue={opt => opt.title}

                                />
                            </div>

                        </div>
                        <div className="box-shadow rounded bg-white">
                            <HospitalTable
                                minWidth={"1070px"}
                                rows={this.state.checklistTable.row}
                                headers={this.state.checklistTable.headers}
                            />
                        </div>

                    </div>
                </div>

            </>
        )
    }
}


const ChecklistState = connect((state) => ({globalStorage: state.globalStorage}))(ChecklistState_);
export {ChecklistState}
