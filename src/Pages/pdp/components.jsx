import React, { Component } from 'react'
import Modal from 'react-modal';
import Select from 'react-select'

import {HospitalTable, Routes} from "../../_components";
Modal.setAppElement('#root');

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

export class  RequestedModal extends Component {
    state = {
        table: {
            row: [],
            headers: [
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
                            width:'25%'
                        }
                },
                {
                    title:'تاریخ ثبت درخواست',
                    getData:(item,index)=>{
                        return item.title;
                        },
                        style:{
                            width:'25%'
                        }
                },
                {
                    title:'تاریخ پیشنهاد',
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
                            width:'25%'
                        }
                }
            ],
        }
    }

    render() {
        return (
            <>
                <Modal 
                    isOpen={this.props.isModalOpen}
                    onRequestClose={() => this.props.closemodal()}
                    style={customStyles}
                    contentLabel="Requested Modal"
                    portalclassNameName="full_screen_modal selelctUsers"
                >
                    <HospitalTable
                        // totalPage={Math.ceil(total_indicators/per_page)}
                        totalPage={2}
                        active={this.state.page}
                        title={"دوره های درخواست شده مطابق نظر " + this.props.viewer}
                        rows={this.state.table.row}
                        headers={this.state.table.headers}
                        // pageOnChange={this.getIndicator}
                        // loader={ loader}
                    />
            
                </Modal>  
            </>
        )
    }
}


export class SetCourseModal extends Component {
    render() {
        const options = [
            {value: 'course1', label: 'عنوان دوره1'},
            {value: 'course2', label: 'عنوان دوره2'},
            {value: 'course3', label: 'عنوان دوره3'},
        ];
        return (
            <>
             <Modal 
                    isOpen={this.props.isModalOpen}
                    onRequestClose={() => this.props.closemodal()}
                    style={customStyles}
                    contentLabel="Requested Modal"
                    portalclassNameName="full_screen_modal selelctUsers"
                >
                 <div className="Cource">
                <div className="container shadow rounded bg-blue3  ">
                    <div className="row  ">
                        <div className="col-12 text-center   border-brown-bottom border-bottom py-3   ">
                            تعریف دوره آمـوزشی
                        </div>
                        <div className={'col-lg-12 mt-4 '}>
                            <label htmlFor="">عنـوان دوره</label>
                            <Select options={options} placeholder={''}/>
                        </div>
                        <div className={'col-lg-6 col-md-12 mt-4 '}>
                            <label htmlFor="">هــدف دوره</label>
                            <input type="text-aria" className='form-control shadow border-0 rounded h-100'/>
                        </div>
                        <div className={'col-lg-6 col-md-12 mt-4'}>
                            <label htmlFor="">مــحتوا دوره</label>
                            <input type="text-aria" className='form-control shadow border-0 rounded h-100 '/>
                        </div>
                        <div className={'col-lg-6 col-md-12 mt-5 '}>
                            <label htmlFor="">مــدرس دوره</label>
                            <input type="text-aria" className='form-control shadow border-0 rounded-pill'/>
                        </div>
                        <div className={'col-lg-6 col-md-12 mt-5 '}>
                            <label htmlFor=""> امتیاز بازآمـوزی</label>
                            <Select className='shadow border-0' placeholder={' '}/>
                        </div>
                        <div className={'col-lg-12 bg-white mt-5 text-center'}>جــدول</div>

                        <div className={'col-lg-6 col-md-12  text-center m-auto py-4 '}>
                            <label htmlFor=""> مـــکان برگــزاری</label>
                            <Select className='shadow border-0' placeholder={''} styles={customStyles}/>
                        </div>
                    </div>
                    <div className="row justify-content-center pb-4">
                        <button className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">ثبت</button>
                        <button
                            className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1">انصراف
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
            </>
        )
    }
}
