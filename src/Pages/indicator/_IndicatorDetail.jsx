// افزودن کامپوننت هایی که نیاز هستند
import React from 'react'
import {connect} from 'react-redux';
import {userActions} from "../../_actions";
import Popover,{ArrowContainer} from 'react-tiny-popover'
import ContentEditable from 'react-contenteditable'
import {SelectCollector,SelectMonitor,Print} from "./components"
import {HospitalTable, IndicatorCalenderComp, Routes} from "../../_components";
import moment from "jalali-moment";
import Modal from "react-modal";
import Loading from '../../assets/images/loading_2.gif';
Modal.setAppElement('#root');
class IndicatorDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: null,
            numerator_help_popover:false,
            denumerator_help_popover:false,
            users:[],
            boxes:null,
            loader:null,
            per_page:24,

        }
    }


    async componentDidMount() {
        if (!this.props.globalStorage.users.length && this.props.globalStorage.me) {
            this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
        }
        const indicator_id = this.props.match.params.id;
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
                        indicator
                    },()=>{this.getIntervals(indicator);})
                });


            }
        )
    }
    numerator = React.createRef();
    denumerator = React.createRef();

    openDetailModal=()=>{
        this.setState({detailModal:true})
    }
    closeDetailModal=()=>{
        this.setState({detailModal:false})
    }
    checkMeasureInterval = (indicator) => {
        let repeat_value;
        switch (indicator.measure_interval) {
            case 'روزانه':
                repeat_value = 12;
                break;
            case 'هفتگی':
                repeat_value = 52;
                break;

            case 'ماهانه':
                repeat_value = 12;
                break;
            case 'سه ماه یکبار':
                repeat_value = 4;
                break;
            case 'شش ماه یکبار':
                repeat_value = 2;
                break;
            case 'سالانه':
                repeat_value = 1;
                break;
            default:
                break;
        }

        return repeat_value;
    }
    getIntervals = (indicator, index) => {
        // check measure_interval
        this.setState({selectedIndicator:indicator})
        let repeat_value = this.checkMeasureInterval(indicator)
        // create virtual interval based on measure_interval
        const boxes = [];//new Array(repeat_value).fill({});
        for(let i=0;i<repeat_value;i++){
            boxes.push({});
        }

        // get get_indicator_interval_averages?indicator_id=
        this.props.dispatch(
            userActions.API(
                'get',
                `v2/get_indicator_interval_averages?indicator_id=${indicator.id}`))
            .then(
                res => {
                    let {intervals,total_average}=res.data;
                    if(intervals){
                        if(['چک لیست','پرسشنامه','HIS'].indexOf(indicator.report_type)===-1){

                             const groupIntervals=userActions.groupBy(intervals,'interval_number');
                             intervals=[];

                             Object.keys(groupIntervals).map(g=>{
                                 const l=groupIntervals[g].length;
                                 const average=groupIntervals[g].reduce((a,b)=>({['average']:parseFloat(a['average'])+parseFloat(b['average'])}))['average']/(indicator.measurement_unit==='تعداد'?1:l);

                                 intervals.push({
                                     interval_number:g,
                                     average,
                                     id:groupIntervals[g][l-1]['id']
                                 })
                             })
                        }
                        intervals.map(interval => {

                            // set virtual interval average of interval from get_indicator_interval ...
                            //
                            if(indicator.measure_interval==='روزانه'){
                                const m=moment(this.props.globalStorage.year+'/01/01','jYYYY/jMM/jDD').jDayOfYear(interval.interval_number);
                                const month=m.jMonth();
                                const day=m.jDate();
                                if(!boxes[month]){
                                    boxes[month]=[];
                                }
                                boxes[month][day]=Object.assign({},interval);
                            }else{
                                boxes[interval.interval_number-1]=interval;
                            }
                        });

                        if (total_average === null) {
                            total_average = '-'
                        }

                    }
                    this.setState({
                        total_average,
                        intervals,
                        boxes,
                        indicator,
                        isModalOpen: true,
                    });
                }
            )
     /*   this.props.dispatch(userActions.API('post', `/v2/indicator/count_by_ward_chart?id=${indicator.id}`,{},false)).then(res => {
            this.setState({total_answers:res.data.hospital})
        });*/
    }
    reloadInterval=()=>{

            this.getIntervals(this.state.selectedIndicator)


    }
    render() {
        const {indicator,numerator_help_popover,denumerator_help_popover,boxes,loader,per_page} = this.state;
        return (
            indicator ?<div className="p-5">
                    <Routes page="indicator/list/detail"/>
                {boxes && <IndicatorCalenderComp
                        showDetails={true}
                        isIndicator={true}
                        reloadInterval={this.reloadInterval}
                        CloseModal={this.closeModal}
                        measure_interval={indicator.measure_interval}
                        total_average={this.state.total_average}
                        indicator={indicator}
                        intervals={boxes}
                        only_me={false}
                        openDetailModal={this.openDetailModal}
                        detailFormula={indicator.report_type!=='چک لیست' && indicator.report_type!=='پرسشنامه'?true:undefined}
                        detailChecklist={indicator.report_type==='چک لیست' || indicator.report_type==='پرسشنامه'?true:undefined}
                    />}
                    {/*Detail Of Indicator*/}
                <Modal
                    isOpen={this.state.detailModal}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeDetailModal}
                    contentLabel="Detail Modal"
                    portalClassName="full_screen_modal"
                >
                <div className="Cource  indicator_detail">

                    {/*headerIndeicator*/}
                    <div className='container-fluid headerIndeicator'>
                        <div className={'row d-flex justify-content-around   my-4 '}>
                            <div className='col-lg-3    my-2 '>
                                <div
                                    className='text-center  rounded-pill py-2 text-dark shadow iran-sans_Bold bg-white '>{indicator.title}</div>
                            </div>
                            {indicator.code && <div className='col-lg-3    my-2 '>
                                <div
                                    className='text-center  rounded-pill  text-white shadow bg-navy-blue  py-2 iran-sans_Bold'>{indicator.code}</div>
                            </div>}
                        </div>
                    </div>
                    {/*form indicator state*/}
                    <div className="container-fluid shadow rounded  py-5  bg-white" >
                        <div className="row d-flex justify-content-center  ">

                            {indicator.creation_date &&
                            <div className={'col-lg-3 mt-4 '}>
                                <p className='text-right' htmlFor=""> تاریخ تدوین</p>
                                <div
                                    className='rounded-pill py-2 dateBox d-flex justify-content-around align-items-center'>
                                    <p className='dateText'>{indicator.creation_date}</p>
                                    <i className="fal fa-calendar-alt fa-2x"></i>
                                </div>
                            </div>
                            }
                            {indicator.edit_date &&
                                <div className={'col-lg-3 mt-4 '}>
                                    <p className='text-right' htmlFor=""> تاریخ بازنگری</p>
                                    <div
                                        className='rounded-pill py-2 dateBox d-flex justify-content-around align-items-center'>
                                        <p className='dateText'>{indicator.edit_date}</p>
                                        <i className="fal fa-calendar-alt fa-2x"></i>
                                    </div>
                                </div>
                            }

                        </div>
                        <div className={'row d-flex justify-content-center  my-4 p-xl-4 '}>
                            {indicator.quality_dimension && <div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                <div className='text-center bg-pink rounded-pill py-2 text-white '><span
                                    className={'iransansBold'}>بعد کیفیت:</span>
                                    {indicator.quality_dimension.map((q,j)=><span key={j}> {q} {j+1<indicator.quality_dimension.length?',':''} </span>)}
                                    </div>
                            </div>}
                            {indicator.report_type &&<div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                <div className='text-center bg-warning rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}> نحوه ی گزارش:</span>
                                    <span> {indicator.report_type} </span></div>
                            </div>}
                            {indicator.source && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-success rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}> منبع شاخص:</span>
                                    <span> {indicator.source} </span></div>
                            </div>}
                            {indicator.measurement_unit && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-light-blue rounded-pill py-2  text-white'><span
                                    className={'iransansBold'}> واحد اندازه گیری:</span>
                                    <span> {indicator.measurement_unit} </span></div>
                            </div>}
                            {indicator.desirability && <div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                <div className='text-center bg-danger rounded-pill py-2 text-white '><span
                                    className={'iransansBold'}> مطلوبیت شاخص:</span>
                                    <span> {indicator.desirability} </span></div>
                            </div>}
                            {indicator.basis && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-purple rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}>   مبنـا شاخص:</span>
                                    <span>  {indicator.basis} </span></div>
                            </div>}
                            {indicator.aspect && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-navy-blue rounded-pill py-2 text-white'><span
                                    className={'iransansBold'}> جنبه شاخص:</span> <span> {indicator.aspect}</span>
                                </div>
                            </div>}
                            {indicator.indicator_type && <div className='col-xl-3 col-lg-3 col-md-6  my-3'>
                                <div className='text-center bg-light-green rounded-pill py-2  text-white'><span
                                    className={'iransansBold'}>   نـوع شاخص:</span>
                                    <span> {indicator.indicator_type}</span></div>
                            </div>}
                        </div>

                        <div className={'row  p-4'}>
                            {indicator.definition && <div className={'col-lg-12 col-md-12 mt-4 text-center my-2'}>
                                <label htmlFor="" className='rounded-pill  px-4 py-1 titleInput bg-white'>
                                    تعریف شاخص و اهمیت موضوع
                                </label>
                                <div className="rounded box-border ">
                                    {indicator.definition.map((item, index) => {
                                        return (
                                            <p style={{textAlign: 'justify'}} key={index}
                                               className='p-10 mt-4 mb-4'>{item}</p>
                                        )
                                    })}
                                </div>

                            </div>}
                            {indicator.logical_reasons_of_collecting && <div className={'col-lg-12 col-md-12 mt-4 text-center my-2 '}>
                                <label htmlFor="" className="rounded-pill  px-4 py-1 titleInput bg-white"> دلایل
                                    منطقـی جمع آوری شـاخص </label>
                                <div className="rounded box-border ">
                                    {indicator.logical_reasons_of_collecting && indicator.logical_reasons_of_collecting.map((item, index) => {
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
                                        html={indicator.numerator} // innerHTML of the editable div
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
                                                        <textarea className={`form-control ${indicator.numerator_help.indexOf('\n')>=0?'rounded':'rounded-pill'} border-0 `}
                                                                  name="numerator_help"
                                                                  value={indicator.numerator_help}
                                                                  rows={indicator.numerator_help.split('\n').length || 1}

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
                                           value={indicator.multiplier}

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
                                        html={indicator.denumerator} // innerHTML of the editable div
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
                                                        <textarea className={`form-control ${indicator.denumerator_help.indexOf('\n')>=0?'rounded':'rounded-pill'} border-0 `}
                                                                  name="denumerator_help"
                                                                  value={indicator.denumerator_help}
                                                                  rows={indicator.denumerator_help.split('\n').length || 1}
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
                                <SelectCollector iconWidth={90} iconHeight={90} indicatorId={indicator.id}/>
                                <span className='iran-sans_Bold my-2'>مسئولین جمع آوری</span>

                            </div>
                            {indicator.target!==null || indicator.upper_limit!==null || indicator.lower_limit!==null ?<div className="calculation-inputs flex-wrap d-flex justify-content-around col-lg-8 py-5 my-5">

                                {indicator.target!==null && <div
                                    className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                    <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">تارگت</h4>
                                    <div className='box-target text-center py-3 mt-3'>
                                        {indicator.target}
                                    </div>
                                </div>}

                                {indicator.upper_limit!==null && <div
                                    className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                    <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد بالا</h4>
                                    <div className='box-target text-center py-3 mt-3'>
                                        {indicator.upper_limit}
                                    </div>
                                </div>}

                                {indicator.lower_limit!==null && <div
                                    className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                    <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد
                                        پایین</h4>
                                    <div className='box-target text-center py-3 mt-3'>
                                        {indicator.lower_limit}
                                    </div>
                                </div>}
                            </div>
                                :''}
                            <div
                                className='d-flex flex-column align-items-center justify-content-center align-self-center col-lg-2'>

                                <SelectMonitor iconWidth={90} iconHeight={90} indicatorId={indicator.id}/>

                                <span className='iran-sans_Bold my-2'>مسئولین پایش</span>
                            </div>
                        </div>
                        <button onClick={this.closeDetailModal} className="btn rounded-pill btn-outline-primary d-block mx-auto my-5 px-5">
                            بازگشت
                        </button>
                    </div>
                    {/*indicator formol*/}



                </div>
                </Modal>

                </div>
                :
                ''
        )
    }
}


const IndicatorDetailComponent = connect((state) => ({globalStorage: state.globalStorage}))(IndicatorDetail);
export {IndicatorDetailComponent}
