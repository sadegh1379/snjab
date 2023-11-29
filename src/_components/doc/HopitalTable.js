import React, { Component } from 'react'

// import Gauge from '../assets/images/gauge.png';
import Gauge from '../../assets/images/gauge.png';

import backTable from '../assets/images/backs.png';
import fTable from '../assets/images/next.png';
export default class Table extends Component {
    render() {
        return (
            <div className="content bg-light py-3 px-3" style={{marginBottom: '100px'}}>
            {/*
            <!--Requested courses--> */}
            <div className="container-fluid">
                <div className="card border-0 shadow pb-4 requstedCourses">
                    <div className="row d-flex justify-content-between    px-4  ">
                        <div className="col-lg-6 text-right col-sm-8">
                            <span className="iran-sans text-right text-sm-center text-md-center">دوره های درخواست شده در بیمارستان
                            </span>
                        </div>
                        <div className="col-lg-6 text-left d-flex justify-content-end col-sm-8  ">
                            <ul className="pagination" style={{marginTop: '50px'}} >
                                <li className="page-item">
                                    <a className="page-link border-0 text-success bg-transparent " href="#" aria-label="Previous">
                                        <span aria-hidden="true" ><img src={fTable} style={{width: '35px',top: '-8px',position: 'relative'}}></img></span>
                                        <span className="sr-only">صفحه قبلی</span>
                                    </a>
                                </li>
                                <li className="page-item ">
                                    <button className="btn  btn-pages rounded-pill active iran-sans_Bold ">1</button>
                                </li>
                                <li className="page-item ">
                                    <button className="btn  btn-pages rounded-pill dactive iran-sans_Bold">2</button>
                                </li>
                                <li className="page-item ">
                                    <button className="btn btn-pages rounded-pill dactive iran-sans_Bold">3</button>
                                </li>
                                <li className="page-item ">
                                    <button className="btn btn-pages rounded-pill dactive iran-sans_Bold">4</button>
                                </li>
                                <li className="page-item ">
                                    <button className="btn  btn-pages rounded-pill dactive  iran-sans_Bold">5</button>
                                </li>
                                <li className="page-item ">
                                    <a href="#" className="page-link border-0 text-success bg-transparent" aria-label="Next">
                                        <span aria-hidden="true"><img src={backTable} style={{width: '35px',top: '-8px',position: 'relative'}}></img></span>
                                        <span className="sr-only">صفحه بعدی</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/*
                    <!--table--> */}
                    <div className="mx-lg-5" className='overflowX'>
                        <div className="table-title   d-flex text-white radius-5 m-2 py-2" style={{minWidth: '1200px',padding:'10px'}}>
                            <div className="width-5   text-center">ردیف</div>
                            <div className="width-15  text-center">نام و نام خـانوادگـی</div>
                            <div className="width-20  text-center"> تاریخ ثبت درخواست</div>
                            <div className="width-25  text-center"> دوره های درخواست شده</div>
                            <div className="width-20  text-center"> گـروه شغلی</div>
                            <div className="width-15  text-center">عملیات</div>
                        </div>
                        <div className="contentsTbl flex-column d-flex mx-2" style={{minWidth: '1200px'}}>
                            <div className="contents-row odd-contents-row row radius-5 my-2 py-1">
                                <div className="width-5 align-self-center text-center iran-sans_Bold">1</div>
                                <div className="width-15 align-self-center text-center iran-sans_Bold">رضایتمندی از بیماران</div>
                                <div className="width-20 align-self-center text-center iran-sans_Bold">
                                    23 شهریور 1398
                                </div>
                                <div className="width-25 align-self-center text-center iran-sans_Bold">
                                    <button className="btn "><img src={Gauge} alt='Gauge' /></button>
                                </div>
                                <div className="width-20 align-self-center text-center iran-sans_Bold">
                                    دفتــر پرستاری
                                </div>
                                <div className="width-15 align-self-center  text-center iran-sans_Bold">
                                    <button className="btn bg-blue rounded-pill px-5  text-white">اعمال نظر</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
