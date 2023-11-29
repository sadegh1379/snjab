import React from 'react'
import { connect } from 'react-redux';
import { userActions } from "../../_actions";
import Popover, { ArrowContainer } from 'react-tiny-popover'
import ContentEditable from 'react-contenteditable'
import { SelectCollector, SelectMonitor, Print } from "../indicator/components"
import { HospitalTable, IndicatorCalenderComp, Routes,  CheckListCalenderComp, ChecklistViewComp } from "../../_components";
import moment from "jalali-moment";
import Modal from "react-modal";
import Loading from '../../assets/images/loading_2.gif';
import WardIcon from '../../assets/images/WardIcon.png';
import TakmilIcon from '../../assets/images/takmilchecklist.svg';
import ReactTooltip from 'react-tooltip';


Modal.setAppElement('#root');

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
        animationDuration: "0.4s",

    }
};

class checkListDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: null,
            DoneModal: false,
            isDetailModalOpen: false,
            isPopoverOpen: false,
            numerator_help_popover: false,
            denumerator_help_popover: false,
            users: [],
            CompletedCheckListHeaders: [
                {
                    title: 'ردیف',
                    getData: (item, index) => {
                        return index + 1 
                    },
                    style: {
                        width: '10%'
                    }
                },
                {
                    title: 'دوره ارزیابی',
                    getData: (item, index) => {
                        return userActions.intervalPerfix(this.state.checklist.delivery_type) + userActions.persianNumber(item.interval, true)
                        // return item.interval_title;
                    },
                    style: {
                        width: '15%'
                    }
                },
                {
                    title: 'تعداد کل ارزیابی ها',
                    getData: (item, index) => {
                        let text = "";
                        if (item.count - item.save_temp_count > 0) text += `ثبت نهایی=${item.count - item.save_temp_count}`;
                        if (item.save_temp_count > 0) text += `  ثبت موقت=${item.save_temp_count}`;
                        return text;
                    },
                    style: {
                        width: '20%'
                    }
                },
                {
                    title: 'امتیاز ارزیابی',
                    getData: (item, index) => {
                        return item.average
                    },
                    style: {
                        width: '15%'
                    }
                },
                {
                    title: 'بخش های ارزیابی شونده',
                    getData: (item, index) => (item.wards.length > 1 ? <Popover
                        isOpen={this.state.isPopoverOpen}
                        position={['top', 'right', 'left', 'bottom']} // preferred position
                        padding={10}
                        containerStyle={{zIndex: 9999}}
                        onClickOutside={() => userActions.toggleState.call(this, 'isPopoverOpen', null, index)}
                        content={({position, targetRect, popoverRect}) => (
                            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                position={position}
                                targetRect={targetRect}
                                popoverRect={popoverRect}
                                arrowColor={'#1c94e0'}
                                arrowSize={10}

                            >
                                <div className="bg-blue rounded p-4">
                                    <ul className="list-unstyled">
                                        {item.wards.map((w, i) => <li key={i}
                                                                      className="text-light w-100 text-center">{w}</li>)}
                                    </ul>
                                </div>
                            </ArrowContainer>
                        )}
                    >
                        <button
                            onClick={() => userActions.toggleState.call(this, 'isPopoverOpen', null, index)}
                            className="btn btn-link"><img src={WardIcon} alt="بخش" width={45}/></button>
                    </Popover>
                    :
                        item.wards[0]),
                    style: {
                        width: '20%'
                    }
                },
                {
                    title: 'عملیات',
                    getData: (item, index) => {
                        return (
                            <button className="btn btn-link" onClick={() => this.openDetailsModal(item)} data-tip="جزئیات">
                                <img src={TakmilIcon} alt="جزئیات" width={45}/><ReactTooltip type="dark" html={true}/>
                            </button>)
                    },
                    style: {
                        width: '20%'
                    }
                },
            ],
            DetailTableHeaders: [
                {
                    title: 'ردیف',
                    getData: (item, index) => {
                        return index + 1 
                    },
                    style: {
                        width: '10%',
                        padding:'10px',
                    }
                },
                {
                    title: 'ارزیابی کننده',
                    getData: (item, index) => {
                        return item.operator; 
                    },
                    style: {
                        width: '20%'
                    }
                },
                {
                    title: 'تاریخ ارزیابی',
                    getData: (item, index) => {
                        return  moment(item.created_at).format('jYYYY/jMM/jDD');
                    },
                    style: {
                        width: '15%'
                    }
                },
                {
                    title: 'میانگین ارزیابی',
                    getData: (item, index) => {
                        return item.average; 
                    },
                    style: {
                        width: '15%'
                    }
                },
                {
                    title: 'بخش',
                    getData: (item, index) => {
                        return item.ward;
                    },
                    style: {
                        width: '15%'
                    }
                },
                {
                    title: 'عملیات',
                    getData: (item, index) => {
                        return (
                            <button className="btn btn-link" onClick={() => this.openDetailRecordsModal(item)} data-tip="جزئیات">
                                <img src={TakmilIcon} alt="جزئیات" width={45}/><ReactTooltip type="dark" html={true}/>
                            </button>)
                    },
                    style: {
                        width: '20%'
                    }
                },
            ],
            boxes: null,
            loader: null,
            per_page: 24,
            total_average: null,
            intervals: [],
            Details: [],
            checklist: {},
            isDetailRecordsModalOpen: false,

        }
    }
    
    openDetailsModal = (item) => {
        const checklist_id = this.props.match.params.id;
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists/${checklist_id}/details/${item.interval}?ward_id=&user_id=&from=&to=`
            )
        ).then(res => {
            this.setState({
                Details: res.data,
                isDetailModalOpen: true,
            })
        })   
    }

    closeDetailModal = () => {
        this.setState({isDetailModalOpen: false})
    }


    openDetailRecordsModal = (item) => {
        const checklist_id = this.props.match.params.id;
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists/${checklist_id}/details/${item.id}/records`
            )
        ).then(res => {
            this.setState({
                Records: res.data.records,
                Guides: res.data.guides,
                Infos: res.data.infos,
                isDetailRecordsModalOpen: true,
            })
        })   
    }

    closeDetailRecords = () => {
        this.setState({isDetailRecordsModalOpen: false})
    }

    async componentDidMount() {
        if (!this.props.globalStorage.users.length && this.props.globalStorage.me) {
            this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
        }
        const checklist_id = this.props.match.params.id;
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        
        
        this.props.dispatch(userActions.API('get', `v1/user/hospital/checklists/${checklist_id}/average`)).then(
            res => {
                this.getIntervals(res.data)
                this.setState({
                    certificate: params.get('certificate'),
                    total_average: res.data.total,
                    intervals: res.data.intervals,
                    CompletedCheckListRows: res.data.intervals,
                })
                // this.props.dispatch(
                //     userActions.API(
                //         'get',
                //         `/v2/get_indicator_formula?indicator_id=${indicator_id}`)
                // ).then(formula_resualt => {
                //     const { formula } = formula_resualt.data;
                //     delete formula.id;
                //     for (let key in res.data) {
                //         if (res.data[key] === null) {
                //             res.data[key] = '---';
                //         }
                //     }
                //     const indicator_ = res.data;
                //     indicator_.logical_reasons_of_collecting = res.data.logical_reasons_of_collecting ? res.data.logical_reasons_of_collecting.split('\n') : '';
                //     indicator_.definition = res.data.definition ? res.data.definition.split('\n') : '';
                //     const indicator = Object.assign({}, indicator_, formula);
                //     indicator.numerator = formula.numerator.map((operand, i) => {
                //         let opt = formula.numerator_operators[i] || '';
                //         if (opt) {
                //             opt = '&nbsp;<span class="iran_sans_Bold text_muted">' + opt + '</span>&nbsp;'
                //         }
                //         return operand + opt
                //     }).join('');
                //     indicator.denumerator = formula.denumerator.map((operand, i) => {
                //         let opt = formula.denumerator_operators[i] || '';
                //         if (opt) {
                //             opt = '&nbsp;<span class="iran_sans_Bold text_muted">' + opt + '</span>&nbsp;'
                //         }
                //         return operand + opt
                //     }).join('');
                //     indicator.formula = formula;
                //     this.setState({
                //         indicator
                //     }, () => { this.getIntervals(indicator); })
                
                // });


            }
        )
    }

    numerator = React.createRef();
    denumerator = React.createRef();

    openDoneModal = () => {
        this.setState({ DoneModal: true })
    }
    closeDoneModal = () => {
        this.setState({ DoneModal: false })
    }
    
    checkMeasureInterval = (delivery_type) => {
        let repeat_value;
        switch (delivery_type) {
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
    getIntervals = (checklist, index) => {
        // check measure_interval
        
        let repeat_value = this.checkMeasureInterval(checklist.delivery_type);
        // create virtual interval based on measure_interval
        const boxes = [];//new Array(repeat_value).fill({});
        for (let i = 0; i < repeat_value; i++) {
            boxes.push({});
        }

        // get get_indicator_interval_averages?indicator_id=
        let { intervals, total } = checklist;
        if (intervals) {
            intervals.map(interval => {

                // set virtual interval average of interval from get_indicator_interval ...
                //
                if (checklist.delivery_type === 'روزانه') {
                    const m = moment(this.props.globalStorage.year + '/01/01', 'jYYYY/jMM/jDD').jDayOfYear(interval.interval);
                    const month = m.jMonth();
                    const day = m.jDate();
                    if (!boxes[month]) {
                        boxes[month] = [];
                    }
                    boxes[month][day] = Object.assign({}, interval);
                } else {
                    boxes[interval.interval - 1] = interval;
                }
            });

            if (total === null) {
                total = '-'
            }

        
        this.setState({
            total,
            intervals,
            boxes,
            checklist,
            isModalOpen: true,
        });
    }
        /*   this.props.dispatch(userActions.API('post', `/v2/indicator/count_by_ward_chart?id=${indicator.id}`,{},false)).then(res => {
               this.setState({total_answers:res.data.hospital})
           });*/
    }
    reloadInterval = () => {

        this.getIntervals(this.state.selectedIndicator)

    }
    render() {
        const { indicator, numerator_help_popover, denumerator_help_popover, boxes, loader, per_page } = this.state;
        return (
            <div className="p-5">
                <Routes page="checklist/detail" />
                {boxes && <CheckListCalenderComp
                    measure_interval={this.state.checklist.delivery_type}
                    total_average={this.state.total_average}
                    intervals={this.state.boxes}
                    openDoneModal={this.openDoneModal}
                    checklist_id={this.props.match.params.id}
                    certificate={this.state.certificate}
                    readOnly={true}
                    showDetails={true}
                    openDetailsModal={(interval) => this.openDetailsModal(interval)}
                    // only_me={false}
                    // detailFormula={indicator.report_type !== 'چک لیست' && indicator.report_type !== 'پرسشنامه' ? true : undefined}
                    // detailChecklist={indicator.report_type === 'چک لیست' || indicator.report_type === 'پرسشنامه' ? true : undefined}
                />
    }
                

                <Modal
                    isOpen={this.state.DoneModal}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeDoneModal}
                    contentLabel="Detail Modal"
                    portalClassName="full_screen_modal"
                    style={customStyles}
                >
                    <div className="bg-white p-3">
                        <div className="text-center h5">چک لیست های تکمیل شده</div>
                        <div className="container-fluid  bg-light">
                            
                            <HospitalTable
                                headers={this.state.CompletedCheckListHeaders}
                                rows={this.state.CompletedCheckListRows}
                            />
                            <button className="mx-auto px-5 my-5 d-block btn btn-outline-blue rounded-pill"
                                onClick={this.closeDoneModal}>
                                بازگشت
                            </button>
                        </div>
                    </div>
                  
                </Modal>


                <Modal
                    isOpen={this.state.isDetailModalOpen}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeDetailModal}
                    contentLabel="Detail Modal"
                    portalClassName="full_screen_modal"
                    style={customStyles}
                >
                    <div className="bg-white p-3">
                        <div className="text-center h5">جزئیات دوره ارزیابی</div>
                        <div className="container-fluid  bg-light">
                            
                            <HospitalTable
                                headers={this.state.DetailTableHeaders}
                                rows={this.state.Details}
                            />
                            <button className="mx-auto px-5 my-5 d-block btn btn-outline-blue rounded-pill"
                                onClick={this.closeDetailModal}>
                                بازگشت
                            </button>
                        </div>
                    </div>
                  
                </Modal>

                <Modal
                    isOpen={this.state.isDetailRecordsModalOpen}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeDetailRecords}
                    contentLabel="Detail Modal"
                    portalClassName="full_screen_modal"
                    style={customStyles}
                >
                    <div className="bg-white p-3">
                        <div className="container-fluid  bg-light">
                        {
                            this.state.Records && (
                            <ChecklistViewComp
                                records={this.state.Records}
                                guides={this.state.Guides}
                                menuItems={this.state.Infos}
                                readOnly={true}
                            />
                        )
                        }  
                            


                            <button className="mx-auto px-5 my-5 d-block btn btn-outline-blue rounded-pill"
                                onClick={this.closeDetailRecords}>
                                بازگشت
                            </button>
                        </div>
                    </div>
                  
                </Modal>
           

            </div>
                
        )
    }
}


const checkListDetailComponent = connect((state) => ({ globalStorage: state.globalStorage }))(checkListDetail);
export { checkListDetailComponent }
