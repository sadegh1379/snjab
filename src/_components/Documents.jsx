import React, { Component } from 'react';
import moment from 'jalali-moment';
import {HospitalTable} from './HospitalTable';
import {FormHeader} from './FormHeader.jsx';
import {UsersSelect} from './UsersSelect';
import Gauge from '../assets/images/gauge.png';
import HamkaranIcon from '../assets/images/job.png';
import {Step1} from "../Pages/indicator/create";
import { CalendarInterval } from './CalendarInterval';
import {IndicatorCalenderComp} from './IndicatorCalender';

import {IntervalValue} from '../Pages/indicator/components';


import Select from 'react-select'
import CheckList from './CheckList';
import {Questions} from './Questions';
import {CollapseComp} from './CollapseComp';

class DocumentsCopm extends Component {
    state = {
        questionsNumber: 1,
        intervals: [
            {
                month: 'فروردین',
                day: '22',
                status: undefined,
                theme: '#317B08'
            },
            {
                month: 'اردیبهشت',
                day: '23',
                status: undefined,
            //    theme: '#343a40'
            },
            {
                month: 'خرداد',
                day: '24',
                status: undefined,
                theme: '#317B08'
            },
        ],
        parts: [
            {
                title: 'اطلاعـات اولیه شاخص',
                background: 'bg-navy-blue',
                icon:' <i class="fas fa-home fa-4x"></i>',
                component:<Step1/>
            },
            {
                title: 'اطلاعات تکمیلی',
                background: 'bg-purple',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
            {
                title: 'زمان تحویل شاخص',
                background: 'bg-pink',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
            {
                title: 'سوالات شاخص',
                background: 'bg-dark-orange',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
            {
                title: 'بخش ها و مسئول پایش',
                background: 'bg-light-green',
                icon:' <i class="fas fa-home fa-4x"></i>',
            },
        ],
        table:{
            headers:[
                {
                    title:'ردیف',
                    getData:(item,index)=>{
                        return index+1;
                    },
                    style:{
                        width:'5%'
                    }
                },{
                    title:'نام و نام خـانوادگـی',
                    getData:(item,index)=>{
                        return item.firstname+''+item.lastname;
                    },
                    style:{
                        width:'15%'
                    }
                },{
                    title:' تاریخ ثبت درخواست',
                    getData:(item,index)=>{
                        return moment(item.created_at).format('jDD jMMMM jYYYY');
                    },
                    style:{
                        width:'20%'
                    }
                },{
                    title:' دوره های درخواست شده',
                    getData:(item,index)=>{
                        return <button className="btn " onClick={()=>{alert(item.requested)}}><img src={Gauge} alt='Gauge' /></button>;
                    },
                    style:{
                        width:'25%'
                    }
                },{
                    title:'گـروه شغلی',
                    getData:(item,index)=>{
                        return '';
                    },
                    style:{
                        width:'20%'
                    }
                },{
                    title:'عملیات',
                    getData:(item,index)=>{
                        return <button className="btn btn-blue  rounded-pill px-5  ">اعمال نظر</button>;
                    },
                    style:{
                        width:'15%'
                    }
                }
            ],
            rows:[
                {
                    firstname:'فرزاد',
                    lastname:'ریانی',
                    created_at:moment(),
                    requested:'تست',
                }
            ]
        }

    }
    CanendarBTNHandler = (e) => {
        // calender button handler here
        console.log('btn calendar');
    }

    render() {

        return (
            <>
        <div className="pb-5">
            <HospitalTable
                totalPage={10}
                active={1}
                title="دوره های درخواست شده در بیمارستان"
                rows={this.state.table.rows}
                headers={this.state.table.headers}
                pageOnChange={(page)=>{alert(`Page Changed to ${page}`)}}
            />
            <FormHeader parts={this.state.parts} submit={()=>{alert('submitted')}}/>
            <div className="d-flex justify-content-center w-100">
                <UsersSelect className="btn btn-outline-primary rounded-pill">
                    <>
                        <img src={HamkaranIcon} alt="همکاران" width={40} className="ml-2"/>
                        <span>انتخاب همکاران</span>

                    </>
                </UsersSelect>
            </div>

            <div style={{
                height: '20px',
                width: '100%',
                backgroundColor: 'red'
            }} className='mt-5 mb-5'></div>

            <div className='mt-5'>
                {/* <IndicatorCalenderComp  indicator='57,000' intervals={this.state.intervals} /> */}
            </div>
        </div>
            <CheckList />
            {/* <CheckList /> */}
            <div className='text-center mb-5 mt-5'>
                <CollapseComp
                    title='چک لیست/پرسشنامه دارای  اجزای مختلف است؟'
                    colorClassName='bg-primary'
                    isOpenedByDefault={false}
                    >
                    <div className={' my-3 checkListBody boxshadow row mx-1 p-4  '}>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6  '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3 text-primery     "></i>
                            نـــام
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            نـــام
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6   '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                                نــام خـانوادگـی
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            نــام خـانوادگـی
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            سـن
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            سـن
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            نام پـدر
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6   '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            نام پـدر
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            بخش بستری
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            بخش بستری
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            نام مـادر
                        </label>
                        <label htmlFor="" className={'align-items-center d-flex col-lg-6    '}>
                            <input type="text" className={'d-none'}/>
                            <i className="far fa-square fa-2x px-3  text-primery   "></i>
                            نام مـادر
                        </label>
                    </div>
                </CollapseComp>
                
            </div>

            <div style={{
                height: '20px',
                width: '100%',
                backgroundColor: 'red'
            }} className='mt-5 mb-5'></div>
            <div className='mb-5 mt-4'>
            <div className="row mx-1 Define-questions boxshadow pb-4  py-4 px-4   ">
                        <Questions questionsNumber={this.state.questionsNumber} />
                        <button onClick={() => this.setState({questionsNumber: this.state.questionsNumber +1})}
                            className='text-white bg-primary circleButton'>
                                <i className='fas fa-plus 5-px'></i>
                        </button>
                    </div>
            </div>
            
            <IntervalValue />

        </>
        )
    }
}


export default DocumentsCopm;