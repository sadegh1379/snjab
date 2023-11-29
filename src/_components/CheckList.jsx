import React from 'react'
import Select from 'react-select'
import { Questions } from './Questions';
import {Routes} from "./Header";
export default class CheckList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            baseInfo: false,
            questionsNumber: 1,
        }
    }
    tstt = (e) => {
        console.log(e)
    }
    render() {
        return (
            <div className="p-5">

                {/*form check list*/}
                <div className="container-fluid shadow rounded  py-2 pb-4  ">
                    <div className="row d-flex justify-content-center   ">
                        <div className={'col-lg-9  '}>
                            <label htmlFor=""> عنوان</label>
                            <input type="text-aria" className='form-control  border-0 rounded-pill  boxshadow py-4'/>
                        </div>
                        <div className={'col-lg-3  '}>
                            <label htmlFor="">  شماره</label>
                            <input type="text-aria" className='form-control  border-0 rounded-pill boxshadow  py-4'/>
                        </div>
                        <div className={'col-lg-12 col-md-12 mt-4 text-right my-2'}>
                            <label htmlFor="" className='rounded-pill  px-4 py-1 titleInput bg-white'> هــدف</label>
                            {/*<input type="text-aria" className='form-control  border-0 rounded  inputCkeckList '/>*/}
                            <textarea className={'inputCkeckList boxshadow border-0'} cols="30" rows="10"></textarea>
                        </div>
                    </div>
                        <div className={'row d-flex justify-content-center mt-4'}>
                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <div className='bg-primary text-center py-2 checkListHeader'>
                                   <div className='d-flex justify-content-between  text-white py-2'>
                                         <label htmlFor="" className={'align-items-center d-flex justify-content-center  '}>
                                             <input onChange={this.tstt} type="checkbox" value={this.state.baseInfo} className={'d-none'}/>
                                             <i className="far fa-square fa-2x px-3 text-white "></i>
                                             چک لیست/پرسشنامه دارای اطلاعات پـایه است؟
                                         </label>
                                       <div>
                                           <button className={'btn bg-transparent text-white'}><i className="fas fa-window-minimize"/></button>
                                       </div>
                                   </div>
                                </div>
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
                            </div>
                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <div className='bg-primary text-center py-2 checkListHeader'>
                                    <div className='d-flex justify-content-between  py-2'>
                                        <label htmlFor="" className={'align-items-center d-flex justify-content-center text-white '}>
                                            <input type="text" className={'d-none'}/>
                                            <i className="far fa-square fa-2x px-3 text-white "></i>
                                            چک لیست/پرسشنامه دارای  اجزای مختلف است؟
                                        </label>
                                        <div>
                                            <button className={'btn bg-transparent text-white'}><i className="fas fa-window-minimize"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div className={'checkListBody boxshadow my-3  mx-1 align-item-center h-75'}>
                                 <div className={'row mx-3'}>
                                     <div className={'col-lg-10  col-md-12 mt-3'}>
                                         <input type="text-aria" className='form-control boxshadow  border-0 rounded-pill '/>
                                     </div>
                                     <div className={'col-lg-2  col-md-12 mt-3 d-flex justify-content-center'}>
                                         <button className={'btn text-white bg-success rounded-pill '}>تـــایید</button>
                                     </div>
                                 </div>
                                    <div className={'m-auto py-3 d-flex d-flex justify-content-center'}>
                                        <button className={'btn text-white bg-primary rounded-pill py-2 '}>افــزودن</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <br/>
                    <br/>
                    <span className={'my-3'} >تعریف ســوالات</span>
                    <div className="row mx-1 Define-questions boxshadow pb-4  py-4 px-4   ">
                        <Questions questionsNumber={this.state.questionsNumber} />
                        <button onClick={() => this.setState({questionsNumber: this.state.questionsNumber +1})}
                            className="align-items-center bg-primary btn circleButton d-flex justify-content-center text-white">
                                <i className='fas fa-plus '></i>
                        </button>
                    </div>
                    <br/>
                    <span className={'my-3'}>تعریف مقـادیر پاسخ دهی </span>
                    <div className="row mx-1  boxshadow   d-flex justify-content-center   ">
                        <p className={'text-justify text-center col-12 text-black-50 py-2 '}>کابر گرامی لطفا مقادیر به سوالات را انتخاب کنید</p>
                            <button className={'btn bg-dark    rounded-pill  text-white   col-lg-2 col-md-3 col-sm-12 mx-2 my-1'}>دو سطحــی</button>
                            <button className={'btn bg-primary rounded-pill   text-white  col-lg-2 col-md-3 col-sm-12 mx-2 my-1'}>کیفــی</button>
                        <p className={'text-justify text-center col-12 text-dark py-2 '}>توجه داشته باشید اگر مقادیر انتخاب شود رنگ به آبــی تغیر میکند</p>
                    </div>
                    <br/>
                    <div className='bg-primary text-white rounded-pill   text-center py-1 titleVlaue'>کیفــی</div>
                    <div className="row mx-1   boxshadow   d-flex justify-content-center  py-5   ">
                         جــــدول مقادیر
                    </div>


                </div>
            </div>
        )
    }
}


