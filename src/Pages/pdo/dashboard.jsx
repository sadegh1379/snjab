import React, { Component } from 'react';
import Modal from 'react-modal';

import {userActions} from "../../_actions";
import {HospitalTable} from "../../_components";
import Concept from '../../assets/images/concept.png';
import IdCard from '../../assets/images/id-card.png';



const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        
      },
    content : {
        animationName: 'animatetop',
        animationDuration: '0.5s',
        // top                   : '50%',
        // left                  : '50%',
        // right                 : 'auto',
        // bottom                : 'auto',
        // marginRight           : '-50%',
        // transform             : 'translate(-50%, -50%)'
    }
  };



export class Dashboard extends React.Component{
    state = {
        isModalOpen: false,
        table: {
            row: [],
            headers: [
                {
                    title:'ردیف',
                    getData:(item,index)=>{
                        return (((parseInt(this.state.page)-1)*this.state.per_page)+1)+index;
                        },
                    style:{
                        width:'15%'
                    }
                },
                {
                    title:'عنوان دوره',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'25%'
                        }
                },
                {
                    title: 'نوع دوره',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'26%'
                        }
                },
                {
                    title:'تاریـــخ پیشنهاد',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'28%'
                        }
                },
                {
                    title:'تاریــخ ثبــت درخــواست',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'40%'
                        }
                },
                {
                    title:'گــروه شغلــی',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'25%'
                        }
                },
                {
                    title:'وضعیت',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'23%'
                        }
                },
                {
                    title:'عملیات',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'23%'
                        }
                },
                
            ]
        }
    }

    openModal = () => {
        this.setState({
            isModalOpen: true,
        })
    }

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        })
    }

    render(){
        return(
           <>
           {/* <button className="btn btn-blue rounded-pill py-2 px-4 text-white">ویرایش</button>
                            <button className="btn btn-blue rounded-pill py-2 px-4 text-white mx-2">ارسال</button>
                            <button className="btn bg-danger rounded-pill py-2 px-4 text-white">حــذف</button> */}
           <nav className="navbar navbar-expand-lg navbar-light bg-light header-Sec">
    <div className="container-fluid">
        <a className="btn title" href="#">
            <img className="" src="assets/images/gauge.png" width="50px" height="50px"/>
            <span className="lalezar h5 mx-2">برنامه توسعه فردی</span>
        </a>
        <a href="#" className="btn btn-return bg-blue iran-sans text-white px-5 rounded-pill">بازگشت</a>
    </div>
</nav>
<div className="content bg-light py-3 px-3">
    <div className="container-fluid">
        <div className="card bg-white shadow text-center border-0">
            <div className="card-body iran-sans_Bold text-dark">پیام مدیــر سنجــاب: برای بازگشت به صفحه اصلی از دکمه
                بازگشت بالا استفاده کنید
            </div>
        </div>
    </div>
    <br/>
    <div className="container">
        <div className="row d-flex justify-content-center ">
            <div className="col-lg-4 col-md-6 card-deck">
                <div className="card borderDarkpurple my-md-2 my-sm-2 my-1 py-1">
                    <div className="card-body text-center">
                        <p className="card-title Darkpurple">
                            <span className="Darkpurple lalezar">کل های دوره های درخواستی شما</span>
                        </p>
                        <h4 className="card-text Darkpurple iran-sans_Bold ">7800</h4>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 card-deck">
                <div className="card borderbluecolor my-md-2 my-sm-2 my-1 py-1 ">
                    <div className="card-body text-center">
                        <p className=" card-title">
                            <span className="bluecolor lalezar"> دوره های تایید شده</span>
                        </p>
                        <h4 className="card-text bluecolor iran-sans_Bold ">1359</h4>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 card-deck">
                <div className="card borderlightBlue my-md-2 my-sm-2 my-1 py-1">
                    <div className="card-body text-center">
                        <p className=" card-title">
                            <span className="lightBlue lalezar">دوره های تایید نشده</span>
                        </p>
                        <h4 className="card-text iran-sans_Bold lightBlue ">34</h4>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div className="container-fluid chart-section my-3">
        <div className="row">
            <div className="col-lg-8 my-2">
                <div className="card-deck h-100">
                    <div className="card border-0 shadow bg-gray2">
                        <div className="card-body">
                            <div className="row d-flex justify-content-between     my-lg-1 pb-2">
                                <div className="iran-sans text-white col-lg-5 col-md-12 text-md-center ">   فراوانی دوره های درخواست شده بر اساس نوع دوره  </div>
                                <div className="d-flex justify-content-center col-lg-7 col-md-12 ">
                                    <button className="btn  btnOrange mx-1 my-sm-2   px-lg-3">همه موارد</button>
                                    <button className="btn  btnOrange my-sm-2 mx-1 active px-lg-3 ">برون سازمانی </button>
                                    <button className="btn  btnOrange my-sm-2  mx-1 active px-lg-3 ">درون سازمانی </button>
                                    <button className="btn  btnOrange my-sm-2 mx-1 active px-lg-3 ">درون بخشی </button>
                                </div>
                            </div>
                            <div className="bg-light SalesChart"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-4 shadow d-flex justify-content-center">
                <button onClick={() => this.openModal()} className="request btn">
                    <img className="" src={Concept}  alt='' height="100px" />
                    <p className="lalezar ">درخــواست دوره آمــوزشــی</p>
                </button> 
                <button className="request btn">
                    <img className="" src={IdCard}   alt='' height="100px" />
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
                            <h4 className="lalezar mt-3 pb-2">درخــواست دوره آموزشی</h4>
                            <div style={{height: '2px'}} className='w-100 bg-blue'></div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <form className="row justify-content-center">
                            <div className="custom-select-box form-group text-right col-12">
                                    <label className="color-dark iran-sans_Bold my-3">عنوان دوره</label>
                                    <select className="form-control rounded-pill ">
                                        <option></option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </div>

                            <div className="custom-select-box form-group text-right col-sm-6 col-12">
                                    <label className="color-dark iran-sans_Bold my-3">بخش مــورد نظر</label>
                                    <select className="form-control rounded-pill">
                                        <option></option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </div>

                            <div className="custom-select-box form-group text-right col-sm-6 col-12">
                                <label className="color-dark iran-sans_Bold my-3"> بخش مورد نظر</label>
                                <select className="form-control rounded-pill ">
                                    <option></option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                </select>
                            </div>
                            <div className="d-flex flex-column justify-content-center text-right col-sm-6 col-12">
                                <label className="color-dark iran-sans_Bold my-3"> گـروه شغلـی</label>
                                <div className="input-group-prepend">
                                    <i className="fas fa-calendar-alt color-dark"></i>
                                </div>
                                <input type="text" className="form-control rounded-pill " />
                            </div>
                            <div className="d-flex flex-column justify-content-center text-right col-sm-6 col-12">
                                <label className="color-dark iran-sans_Bold my-3">تاریخ پیشنهادی</label>
                                <div className="input-group-prepend">
                                    <i className="fas fa-calendar-alt color-dark"></i>
                                </div>
                                <input type="text" className="form-control rounded-pill" />
                            </div>

                            <div className="row justify-content-around col-12 my-5">
                                <button className="btn btn-blue rounded-pill col-sm-5 my-1">ثبت درخواست</button>
                                <button onClick={() => this.closeModal()} className="btn btn-outline-blue rounded-pill col-sm-5 my-1" data-dismiss="modal">بــازگـشـــت</button>
                            </div>
                        </form>
                    </div>

                </div>
    </Modal>
        <div className='mb-5'>
            <HospitalTable
                // totalPage={Math.ceil(total_indicators/per_page)}
                totalPage={2}
                active={this.state.page}
                title="دوره های درخواست شده در بیمارستان"
                rows={this.state.table.row}
                headers={this.state.table.headers}
                // pageOnChange={this.getIndicator}
                // loader={ loader}
                />
        </div>
</div>
           </>
        )
    }
}