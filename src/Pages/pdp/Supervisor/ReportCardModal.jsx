import React, { Component } from "react";
import { Routes, HospitalTable } from '../../../_components';


export class ReportCardModal extends Component {
  
    state = {
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
                    title: 'تاریخ برگزاری دوره',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'30%'
                        }
                },
                {
                    title:'مدت برگزاری دوره(ساعت)',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'33%'
                        }
                },
                {
                    title:'امتیاز بازآموزی',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'25%'
                        }
                },
                {
                    title:'نمره آزمون pre Test',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'45%'
                        }    
                },
                {
                    title:'نمره آزمون post Test',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'40%'
                        }
                },
                {
                    title:'وضعیت دوره',
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
  
    render() {
        return (
      <>
        <div className="">
          <div className="container-fluid">
            <div className="row d-flex justify-content-center rounded-top   bg-blue">
              <div className="col-12">
                <h6 className="text-center text-white iran-sans_Bold py-3 ">
                  کـارنامـه پایان دوره آموزشــی هوش هیجــانی پرسنل بالین
                </h6>
              </div>
              <div className="col-md-5  col-sm-8  ">
                <div className="select-wrapper">
                  <div className="text-right text-white ">
                    <p> نام و نام خانوادگی:</p>
                    <span
                      className="form-control form-group  iran-sans p-2  rounded-pill text-center"
                    >
                      مهدی همتی
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-5  col-sm-8  ">
                <div className="select-wrapper">
                  <div className="form-group text-right text-white ">
                    <p> کدپرسنلی:</p>
                    <span
                      className="form-control form-group iran-sans p-2  rounded-pill text-center  "
                    >
                      3150
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-5  col-sm-8  ">
                <div className="select-wrapper">
                  <div className="form-group text-right text-white ">
                    <p> پست سازمانی:</p>
                    <span
                      type="text"
                      className="form-control form-group iran-sans p-2  rounded-pill text-center  "
                    >
                      کارشـناس آمـوزش
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-5  col-sm-8  ">
                <div className="select-wrapper">
                  <div className="form-group text-right text-white ">
                    <p> گروه شغلی:</p>
                    <span
                      type="text"
                      id="inputcode"
                      className="form-control form-group iran-sans p-2  rounded-pill text-center  "
                    >
                      اداری-پشتیبانـی
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card shadow border-0 mt-5 p-3 ">
              {/*table*/}
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
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-column justify-content-center align-items-center px-5 my-5   ">
                <div className="signiture bg-light align-items-center justify-content-center text-dark text-center ">
                  <div className="d-flex justify-content-center">امضا</div>
                </div>
                <div className="d-flex text-center my-1 ">
                  <span>سوپروایزر آموزشی :</span>
                  <span>مهناز مسعودی</span>
                </div>
                <div className="d-flex text-center my-1 ">
                  <span> تاریخ رویت کارنامه:</span>
                  <span>13شهریور 1398 </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
