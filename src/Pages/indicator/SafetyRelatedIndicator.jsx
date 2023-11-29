import React from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from "react-modal";

import { connect } from 'react-redux';
import Select from 'react-select';
import { userActions } from "../../_actions";
import { userConstants } from "../../_constants";
import CollectorIcon from '../../assets/images/network.png';
import MonitorIcon from '../../assets/images/job.png';
import DeleteIcon from '../../assets/images/trash.png';
import EditIcon from '../../assets/images/edit.png';
import DocumentIcon from '../../assets/images/document.png';
import ReportIcon from '../../assets/images/report.png';
import Concept from '../../assets/images/concept.png';
import ContentEditable from 'react-contenteditable'
import Popover,{ArrowContainer} from 'react-tiny-popover'
import {Print, SelectCollector, SelectMonitor} from "./components"


import { Routes, ToggleBotton, AdminMessage, Chart } from "../../_components";

class SafetyRelatedIndicator extends React.Component {
    state = {
        year: 1399,
        Query: "",
        Indicators: [],
        indicator_data: null,
        indicator_data: false,
        numerator_help_popover:false,
        denumerator_help_popover:false,
    }

    getSafetyRelatedIndicators = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                `/v2/safety_related_indicators?year=${this.props.globalStorage.year}`
            )
        ).then(res => {
            this.setState({ Indicators: res.data })
        })
    }


    editIndicator = (indicator_id) => {
        this.props.history.push(`/indicator/list/edit/${indicator_id}`);
    }

    deleteIndicator = (indicator_id) => {
        const {Indicators} = this.state;
        const indicator = Indicators.find(f => f.id === indicator_id)
        
        this.props.dispatch(userActions.question('حذف شاخص', 'آیا از حذف شاخص مطمئن هستید؟')).then(r => {
            if (r.value) {
                this.props.dispatch(userActions.API('get', `/v2/delete_indicator?indicator_id=${indicator_id}`)).then(res => {
                    const i = Indicators.indexOf(indicator);
                    Indicators.splice(i, 1);
                    this.setState({Indicators});
                });
            }
        })
    }

    get_indicator = (indicator_id) => {
        
        this.props.dispatch(userActions.API('get', `/v2/get_indicator?indicator_id=${indicator_id}`)).then(
            res => {
                this.props.dispatch(userActions.API('get', `/v2/get_indicator_formula?indicator_id=${indicator_id}`)).then(formula_resualt => {

                    const {formula} = formula_resualt.data;
                    delete formula.id;
                    for (let key in res.data) {
                        if (res.data[key] === null) {
                            res.data[key] = '---';
                        }
                    }
                    const indicator_ = res.data;
                    indicator_.logical_reasons_of_collecting = res.data.logical_reasons_of_collecting ? res.data.logical_reasons_of_collecting.split('\n') : '';
                    indicator_.definition = res.data.definition ? res.data.definition.split('\n') : '';
                    const indicator = Object.assign({}, indicator_, formula);
                    indicator.numerator = formula.numerator.map((operand, i) => {
                        let opt = formula.numerator_operators[i] || '';
                        if (opt) {
                            opt = '&nbsp;<span class="iran_sans_Bold text_muted">' + opt + '</span>&nbsp;'
                        }
                        return operand + opt
                    }).join('');
                    indicator.denumerator = formula.denumerator.map((operand, i) => {
                        let opt = formula.denumerator_operators[i] || '';
                        if (opt) {
                            opt = '&nbsp;<span class="iran_sans_Bold text_muted">' + opt + '</span>&nbsp;'
                        }
                        return operand + opt
                    }).join('');
                    indicator.formula=formula;
                    this.setState({
                        indicator_data: indicator
                    })
                });


            }
        )
    }

    openDetailModal = (id) => {
        this.get_indicator(id)
        this.setState({detailModal: true});
    };

    closeDetailModal = () => {
        this.setState({detailModal: false});
    };

    detailIndicator = (indicator_id) => {
        this.props.history.push(`/indicator/list/detail/${indicator_id}`);
    }

    componentDidMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);

        if (params.get('Year') !== null) {
            this.setState({ year: parseInt(params.get('Year')) })
        }

        this.getSafetyRelatedIndicators()
    }



    render() {
        const {indicator_data, denumerator_help_popover, numerator_help_popover} = this.state;
        return (
        <>
            <div className="safety-related h-100">
                <div className="row m-0 p-2">
                    <div className="col-md-8 mt-2">
                        <div className="d-flex justify-content-center align-items-center ">
                            <p style={{ marginRight: "250px" }} className={` text-blue iran-sans_Bold text-center pr-md-5 mt-1 `}>
                                مشاهده ایمنی بیمار
                                    </p>
                        </div>
                    </div>
                    <div className="col-md-4 ">
                        <button className="mt-2 btn btn-blue rounded-pill w-50">بازگشت</button>
                    </div>


                </div>
                <div style={{ minHeight: '100vh' }} className="bg-blue full-height">
                    <div className="d-flex justify-content-end p-3 ">
                        <Select
                            placeholder="مرتب سازی براساس"
                            className="width-15 text-justify custom-select-2 placeholder_font "
                            name="sort_by"
                        />
                    </div>
                    <div className="bg-white rounded shadow m-4 p-5">
                        <div
                            style={{ position: "absolute", top: "142px" }}
                            className="bg-white rounded-pill p-2 text-blue iran-sans_Bold shadow">جستجو در شاخص های ایمنی</div>
                        <input
                            type="text"
                            name="Query"
                            value={this.state.Query}
                            onChange={  userActions.handleChangeInput.bind(this)}
                            className="form-control bg-white rounded-pill shadow"
                            placeholder="نام شاخص مورد نظر را وارد کنید..."
                        />
                    </div>
                    <div className="row p-5">
                        {
                            this.state.Query !== "" 
                            ?
                                this.state.Indicators.filter(f => f.title.includes(this.state.Query) )  
                            : this.state.Indicators
                            
                            .map((ind, i) => {
                                console.log(ind.target)
                                 
                                return (
                                    <>
                                        <div key={i} className="col-12 col-md-4 mt-2">
                                            <div style={{position: "relative"}} className="bg-white rounded ">
                                                <p style={{fontSize: "1.5em"}} className="text-right text-blue lalezar p-1">{ind.title}</p>
                                                <div style={{position: "absolute", top: "-3%", left: "3%"}} className="badge badge-danger p-2">1</div>
                                                
                                                <Chart
                                                    height={300}
                                                    exporting={{
                                                        enabled: false
                                                    }}
                                                    className="gauge-chart-container"
                                                    pane={{
                                                        center: ["50%", "50%"],
                                                        size: "100%",
                                                        startAngle: -90,
                                                        endAngle: 90,
                                                        background: {
                                                            innerRadius: "60%",
                                                            outerRadius: "100%",
                                                            shape: "arc"
                                                        }
                                                    }}
                                                    tooltip={{
                                                        enabled: false
                                                    }}
                                                    yAxis={{
                                                        min: parseFloat(ind.lower_limit),
                                                        max: parseFloat(ind.upper_limit),
                                                        stops: ind.upper_limit != null && ind.lower_limit != null && ind.lower_limit !== ind.upper_limit ? [

                                                            [ind.lower_limit, ind.desirability == "افزاینده"
                                                                ? "#DF5353"
                                                                : "#55BF3B"],
                                                            [
                                                                ind.upper_limit,
                                                                ind.desirability == "افزاینده"
                                                                    ? "#55BF3B"
                                                                    : "#DF5353"
                                                            ] // green
                                                        ] : undefined,
                                                        lineWidth: 0,
                                                        tickWidth: 0,
                                                        minorTickInterval: null,
                                                        tickAmount: 1,
                                                        title: {
                                                            y: -70,

                                                        },
                                                        labels: {
                                                            y: 16,

                                                        }
                                                    }}
                                                    data={
                                                        [
                                                            {
                                                                name: "test",
                                                                data: [parseFloat(ind.target)],
                                                                dataLabels: {
                                                                    format:
                                                                        '<div style="text-align:center;white-space: normal;width: 103px;">' +
                                                                        '<span class="text-blue" style="font-size:2em">{y:.2f}</span><br/>' +
                                                                        '<span style="font-size:.8em;">' +
                                                                        // " مقدار شاخص در " +
                                                                        // ind.title +
                                                                        "</span>" +
                                                                        "</div>"
                                                                }
                                                            }
    
                                                        ]
                                                    }
                                                    chartType={"solidgauge"}
                                                />
                                                <div className="row rounded-pill shadow mx-5 mb-3">
                                                    <div className="col-3" data-tip="مسئولین پایش" >
                                                        <SelectMonitor iconWidth={40} indicatorId={ind.id} />
                                                        {/* <button  className="btn text-blue lalezar">
                                                            <img width={40} height={40} src={MonitorIcon} />
                                                            
                                                        </button> */}
                                                        <ReactTooltip type="dark" />

                                                    </div>
                                                    <div className="col-3" data-tip="مسئولین اندازه گیری">
                                                        <SelectCollector  iconWidth={40} indicatorId={ind.id}/>
                                                        {/* <button data-tip="مسئولین اندازه گیری" className="btn text-blue lalezar">
                                                            <img width={40} height={40} src={CollectorIcon} />
                                                        </button> */}
                                                        <ReactTooltip type="dark" />
                                                    </div>
                                                    <div className="col-3">
                                                        <button onClick={() => this.deleteIndicator(ind.id)} data-tip="حذف" className="btn text-blue lalezar">
                                                            <img width={40} height={40} src={DeleteIcon} />
                                                        </button>
                                                        <ReactTooltip type="dark" />
                                                    </div>
                                                    <div className="col-3">
                                                        <button onClick={() => this.editIndicator(ind.id)} data-tip="ویرایش" className="btn text-blue lalezar">
                                                            <img width={40} height={40} src={EditIcon} />
                                                        </button>
                                                        <ReactTooltip type="dark" />

                                                    </div>
                                                </div>
                                                <div className="line"></div>
                                                <div className="row my-2 ">
                                                    <div className="col-4 border-left">
                                                        <button onClick={() => this.detailIndicator(ind.id)} className="btn text-blue lalezar">
                                                            <img className="w-50 d-block text-center d-flex flex-column justify-content-center align-items-center" src={DocumentIcon} />
                                                            مشاهده وضعیت
                                                        </button>                                                    
                                                    </div>
                                                    <div className="col-4 border-left">
                                                        <button 
                                                        onClick={() => {
                                                        this.props.history.push(`/indicator/dashboard?id=${ind.id}`);
                                                            
                                                        }}
                                                        className="btn text-blue lalezar">
                                                            <img className="w-50 d-block text-center d-flex flex-column justify-content-center align-items-center" src={ReportIcon} />
                                                            گزارش های آماری
                                                        </button>
                                                    </div>
                                                    <div className="col-4">
                                                        <button onClick={() =>  this.openDetailModal(ind.id)} className="btn text-blue lalezar">
                                                            <img className="w-50 d-block text-center d-flex flex-column justify-content-center align-items-center" src={Concept} />
                                                            شناسنامه شاخص
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
            
            <Modal
                    isOpen={this.state.detailModal}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeDetailModal}
                    contentLabel="Detail Modal"
                    portalClassName="full_screen_modal"
                >
                { indicator_data &&
                <div className="Cource  indicator_detail">

                    {/*headerIndeicator*/}
                    <div className='container-fluid headerIndeicator'>
                        <div className={'row d-flex justify-content-around   my-4 '}>
                            <div className='col-lg-3    my-2 '>
                                <div
                                    className='text-center  rounded-pill py-2 text-dark shadow iran-sans_Bold bg-white '>{indicator_data.title}</div>
                            </div>
                            {indicator_data.code && <div className='col-lg-3    my-2 '>
                                <div
                                    className='text-center  rounded-pill  text-white shadow bg-navy-blue  py-2 iran-sans_Bold'>{indicator_data.code}</div>
                            </div>}
                        </div>
                    </div>
                    {/*form indicator state*/}
                    <div className="container-fluid shadow rounded  py-5  bg-white" >
                        <div className="row d-flex justify-content-center  ">

                            {indicator_data.creation_date &&
                            <div className={'col-lg-3 mt-4 '}>
                                <p className='text-right' htmlFor=""> تاریخ تدوین</p>
                                <div
                                    className='rounded-pill py-2 dateBox d-flex justify-content-around align-items-center'>
                                    <p className='dateText'>{indicator_data.creation_date}</p>
                                    <i className="fal fa-calendar-alt fa-2x"></i>
                                </div>
                            </div>
                            }
                            {indicator_data.edit_date &&
                                <div className={'col-lg-3 mt-4 '}>
                                    <p className='text-right' htmlFor=""> تاریخ بازنگری</p>
                                    <div
                                        className='rounded-pill py-2 dateBox d-flex justify-content-around align-items-center'>
                                        <p className='dateText'>{indicator_data.edit_date}</p>
                                        <i className="fal fa-calendar-alt fa-2x"></i>
                                    </div>
                                </div>
                            }

                        </div>
                        <div className={'row d-flex justify-content-center  my-4 p-xl-4 '}>
                            {indicator_data.quality_dimension && <div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                <div className='text-center bg-pink rounded-pill py-2 text-white '><span
                                    className={'iransansBold'}>بعد کیفیت:</span>
                                    {indicator_data.quality_dimension.map((q,j)=><span key={j}> {q} {j+1<indicator_data.quality_dimension.length?',':''} </span>)}
                                    </div>
                            </div>}
                            {indicator_data.report_type &&<div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                <div className='text-center bg-warning rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}> نحوه ی گزارش:</span>
                                    <span> {indicator_data.report_type} </span></div>
                            </div>}
                            {indicator_data.source && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-success rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}> منبع شاخص:</span>
                                    <span> {indicator_data.source} </span></div>
                            </div>}
                            {indicator_data.measurement_unit && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-light-blue rounded-pill py-2  text-white'><span
                                    className={'iransansBold'}> واحد اندازه گیری:</span>
                                    <span> {indicator_data.measurement_unit} </span></div>
                            </div>}
                            {indicator_data.desirability && <div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                <div className='text-center bg-danger rounded-pill py-2 text-white '><span
                                    className={'iransansBold'}> مطلوبیت شاخص:</span>
                                    <span> {indicator_data.desirability} </span></div>
                            </div>}
                            {indicator_data.basis && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-purple rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}>   مبنـا شاخص:</span>
                                    <span>  {indicator_data.basis} </span></div>
                            </div>}
                            {indicator_data.aspect && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-navy-blue rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}> جنبه شاخص:</span> <span> {indicator_data.aspect}</span>
                                </div>
                            </div>}
                            {indicator_data.indicator_type && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-light-green rounded-pill py-2  text-white'><span
                                    className={'iransansBold'}>   نـوع شاخص:</span>
                                    <span> {indicator_data.indicator_type}</span></div>
                            </div>}
                        </div>

                        <div className={'row  p-4'}>
                            {indicator_data.definition && <div className={'col-lg-12 col-md-12 mt-4 text-center my-2'}>
                                <label htmlFor="" className='rounded-pill  px-4 py-1 titleInput bg-white'>
                                    تعریف شاخص و اهمیت موضوع
                                </label>
                                <div className="rounded box-border ">
                                <p style={{textAlign: 'justify'}} 
                                               className='p-10 mt-4 mb-4'>{indicator_data.definition}</p>
                                    {/* {indicator.definition.map((item, index) => {
                                        return (
                                            <p style={{textAlign: 'justify'}} key={index}
                                               className='p-10 mt-4 mb-4'>{item}</p>
                                        )
                                    })} */}
                                </div>

                            </div>}
                            {indicator_data.logical_reasons_of_collecting && <div className={'col-lg-12 col-md-12 mt-4 text-center my-2 '}>
                                <label htmlFor="" className="rounded-pill  px-4 py-1 titleInput bg-white"> دلایل
                                    منطقـی جمع آوری شـاخص </label>
                                <div className="rounded box-border ">
                                    {indicator_data.logical_reasons_of_collecting && indicator_data.logical_reasons_of_collecting.map((item, index) => {
                                        return (
                                            <p style={{textAlign: 'justify'}} key={index}
                                               className='p-10 mt-4 mb-4'>{item}</p>
                                        )
                                    })}
                                </div>

                            </div>}
                        </div>
                        <div className="row justify-content-center">

                            <div className="calculation d-flex flex-wrap flex-column col-lg-8 align-items-center py-5 my-5 mx-auto" >

                                <div className="row justify-content-end w-100">
                                    <ContentEditable
                                        innerRef={this.numerator}
                                        name="numerator"
                                        html={indicator_data.numerator} // innerHTML of the editable div
                                        disabled={true} // use true to disable edition
                                        onChange={(e)=>userActions.maskInput.call(this,e,'numerator',{className:"iran_sans_Bold text_muted"})} // handle innerHTML change
                                        className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
                                        tagName='div'
                                    />

                                    <div className="d-flex justify-content-center col-2">
                                        <Popover
                                            isOpen={numerator_help_popover}
                                            position={['top', 'right', 'left', 'bottom']} // preferred position
                                            padding={10}
                                            onClickOutside={() => this.setState({ numerator_help_popover: false })}
                                            content={({ position, targetRect, popoverRect }) =>(
                                                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                    position={position}
                                                    targetRect={targetRect}
                                                    popoverRect={popoverRect}
                                                    arrowColor={'#1c94e0'}
                                                    arrowSize={10}
                                                >
                                                    <div className="bg-blue rounded p-4">
                                                        <p className="text-center pb-1 text-white">راهنمای صورت</p>
                                                        <textarea className={`form-control ${indicator_data.numerator_help.indexOf('\n')>=0?'rounded':'rounded-pill'} border-0 `}
                                                                  name="numerator_help"
                                                                  value={indicator_data.numerator_help}
                                                                  rows={indicator_data.numerator_help.split('\n').length || 1}

                                                                  readOnly={true}
                                                        />
                                                    </div>
                                                </ArrowContainer>
                                            )}
                                        >
                                            <button onClick={()=>{
                                                this.setState({numerator_help_popover:!numerator_help_popover})
                                            }} className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center" style={{width:34,height:34}}><i
                                                className="fas fa-question text-white"></i></button>
                                        </Popover>
                                    </div>
                                </div>
                                <div
                                    className="row align-items-center justify-content-center w-100 pl-sm-5">
                                    <input type="text" className="rounded-pill border-0 py-2 col-2 shadow-sm text-center"
                                           name="multiplier"
                                           readOnly={true}
                                           value={indicator_data.multiplier}

                                    />
                                    <div className="text-center col-1 px-0">
                                        <i className="fas fa-times"></i>
                                    </div>
                                    <div className="h-line col-7"></div>
                                </div>
                                <div className="row justify-content-end w-100">
                                    <ContentEditable
                                        innerRef={this.denumerator}
                                        name="denumerator"
                                        html={indicator_data.denumerator} // innerHTML of the editable div
                                        disabled={true} // use true to disable edition
                                        onChange={(e)=>userActions.maskInput.call(this,e,'denumerator',{className:"iran-sans_Bold text-muted"})} // handle innerHTML change
                                        className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
                                        tagName='div'
                                    />
                                    <div className="d-flex justify-content-center col-2">
                                        <Popover
                                            isOpen={denumerator_help_popover}
                                            position={['bottom', 'left','right','top']} // preferred position
                                            padding={10}
                                            onClickOutside={() => this.setState({ denumerator_help_popover: false })}
                                            content={({ position, targetRect, popoverRect }) =>(
                                                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                    position={position}
                                                    targetRect={targetRect}
                                                    popoverRect={popoverRect}
                                                    arrowColor={'#1c94e0'}
                                                    arrowSize={10}
                                                >
                                                    <div className="bg-blue rounded p-4 ">
                                                        <p className="text-center pb-1 text-white">راهنمای مخرج</p>
                                                        <textarea className={`form-control ${indicator_data.denumerator_help.indexOf('\n')>=0?'rounded':'rounded-pill'} border-0 `}
                                                                  name="denumerator_help"
                                                                  value={indicator_data.denumerator_help}
                                                                  rows={indicator_data.denumerator_help.split('\n').length || 1}
                                                                  readOnly={true}
                                                        />
                                                    </div>
                                                </ArrowContainer>
                                            )}
                                        >
                                            <button onClick={()=>{
                                                this.setState({denumerator_help_popover:!denumerator_help_popover})
                                            }} className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center" style={{width:34,height:34}}><i
                                                className="fas fa-question text-white"></i></button>
                                        </Popover>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row d-flex justify-content-center ">
                            <div
                                className='d-flex flex-column align-items-center justify-content-center align-self-center col-lg-2'>
                                <SelectCollector iconWidth={90} iconHeight={90} indicatorId={indicator_data.id}/>
                                <span className='iran-sans_Bold my-2'>مسئولین جمع آوری</span>

                            </div>
                            {indicator_data.target!==null || indicator_data.upper_limit!==null || indicator_data.lower_limit!==null ?<div className="calculation-inputs flex-wrap d-flex justify-content-around col-lg-8 py-5 my-5">

                                {indicator_data.target!==null && <div
                                    className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                    <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">تارگت</h4>
                                    <div className='box-target text-center py-3 mt-3'>
                                        {indicator_data.target}
                                    </div>
                                </div>}

                                {indicator_data.upper_limit!==null && <div
                                    className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                    <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد بالا</h4>
                                    <div className='box-target text-center py-3 mt-3'>
                                        {indicator_data.upper_limit}
                                    </div>
                                </div>}

                                {indicator_data.lower_limit!==null && <div
                                    className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                    <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد
                                        پایین</h4>
                                    <div className='box-target text-center py-3 mt-3'>
                                        {indicator_data.lower_limit}
                                    </div>
                                </div>}
                            </div>
                                :''}
                            <div
                                className='d-flex flex-column align-items-center justify-content-center align-self-center col-lg-2'>

                                <SelectMonitor iconWidth={90} iconHeight={90} indicatorId={indicator_data.id}/>

                                <span className='iran-sans_Bold my-2'>مسئولین پایش</span>
                            </div>
                        </div>
                        <button onClick={this.closeDetailModal} className="btn rounded-pill btn-outline-primary d-block mx-auto my-5 px-5">
                            بازگشت
                        </button>
                    </div>
                    {/*indicator formol*/}


                </div>
                }
                </Modal>


        </>
        )
    }
}


const SafetyRelatedIndicatorComponent = connect((state) => ({ globalStorage: state.globalStorage }))(SafetyRelatedIndicator);
export { SafetyRelatedIndicatorComponent }
