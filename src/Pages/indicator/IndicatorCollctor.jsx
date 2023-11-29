import React, {Component} from 'react'
import {connect} from 'react-redux';
import Modal from 'react-modal';
import {userActions} from "../../_actions";
import {IntervalValue} from './components';
import {HospitalTable, IndicatorCalenderComp, Routes} from "../../_components";

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
    content: {
        animationName: 'animatetop',
        animationDuration: '0.4s'
    }
};


export class IndicatorCollctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            measure_interval: 0,
            total_average: '-',
            isModalOpen: false,
            IsMonitorScreenOpen: false,
            // has_seen: null,
            new_indicators: 0,
            total_indicators: 0,
            general_indicators_info: null,
            page: 1,
            per_page: 24,
            loader: undefined,
            indicator:null,
            intervals: [],
            interval_numbers: [],
            indicators: [],
            boxes: [],
            table: {
                headers: [
                    {
                        title: 'عنوان شاخص',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.title}</span>
                        },
                        style: {
                            width: '15%'
                        }
                    }, {
                        title: 'مبنای شاخص',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.basis}</span>
                        },
                        style: {
                            width: '14%'
                        }
                    }, {
                        title: 'جنبه ی شاخص',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.aspect}</span>
                        },
                        style: {
                            width: '13%'
                        }
                    }, {
                        title: 'دوره تناوب',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.measure_interval}</span>
                        },
                        style: {
                            width: '13%'
                        }
                    },
                    {
                        title: 'تارگت',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.target}</span>
                        },
                        style: {
                            width: '10%'
                        }
                    },
                    {
                        title: 'حد بالا',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.upper_limit}</span>
                        },
                        style: {
                            width: '10%'
                        }
                    }, {
                        title: 'حد پایین',
                        getData: (item, index) => {
                            return <span
                                className={`${!item.has_seen ? 'iran-sans_Bold' : 'iran-sans'}`}>{item.lower_limit}</span>
                        },
                        style: {
                            width: '10%'
                        }
                    },
                    {
                        title: 'عملیات',
                        getData: (item, index) => {
                            return <button onClick={(ev) => {
                                this.detailIndicator(item, index, ev)
                            }} className="btn btn-blue  rounded-pill px-2  w-75">جزییات</button>;
                        },
                        style: {
                            width: '15%'
                        }
                    },
                ],
            },
        }
    }

    detailIndicator = (indicator, index, ev) => {
        if (indicator.has_seen === false) {
            this.props.dispatch(
                userActions.API(
                    'put',
                    `/v2/burn_indicator_newness_for_collector?indicator_id=${indicator.id}`))
                .then(res => {
                    const {indicators} = this.state;
                    indicators[index]["has_seen"] = true;
                    this.setState({indicators})
                    this.openModal(indicator, index);
                })
        } else {
            this.openModal(indicator, index);
        }
    }


    componentDidMount() {
        this.getCollectorIndicatorsCount();
        this.getCollectorIndicators();

    }

    setIncicatorFromProps = (index) => {
        const {boxes} = this.state;
        this.state.intervals.map(
            (interval, indx) => {
                boxes[interval.interval_number - 1] = interval;
            }
        )
        //    console.log(boxes[index])
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


    OpenMonitorScreenModal = () => {
        this.setState({
            IsMonitorScreenOpen: true,
        })
    }


    closeMonitorScreenModal = () => {
        this.setState({
            IsMonitorScreenOpen: false,
        })
    }

    openModal = (indicator, index) => {
        // check measure_interval

        let repeat_value = this.checkMeasureInterval(indicator)
        // create virtual interval based on measure_interval
        const arr = new Array(repeat_value).fill({});
        this.setState(
            {
                boxes: arr,
                measure_interval: indicator.measure_interval,
                indicator_id: indicator.id,
                indicator
            });

        // get get_indicator_interval_averages?indicator_id= 
        this.props.dispatch(
            userActions.API(
                'get',
                `v2/get_indicator_interval_averages?indicator_id=${indicator.id}`))
            .then(
                res => {
                    res.data.intervals.map(interval => {
                        this.setState({
                            interval_numbers: [
                                ...this.state.interval_numbers,
                                interval.interval_number
                            ]
                        })
                    })
                    if (res.data.total_average === null) {
                        res.data.total_average = '-'
                    }
                    this.setState({
                        total_average: res.data.total_average,
                        intervals: res.data.intervals
                    })
                }
            )
        // set virtual interval average of interval from get_indicator_interval ...
        //  
        this.setState({
            isModalOpen: true,
        });

    }

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        })
    }

    getCollectorIndicators = (page) => {
        this.props.dispatch(
            userActions.API(
                'get',
                `v2/get_collector_indicators?year=${this.props.globalStorage.year}&page=${page}&per=${this.state.per_page}`))
            .then(res => {
                this.setState({
                    indicators: res.data.indicators, page
                });
            });
    }

    getCollectorIndicatorsCount = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                `/v2/get_collector_indicators_count?year=${this.props.globalStorage.year}`))
            .then(res => {
                this.setState({
                    new_indicators: res.data.new_indicators,
                    total_indicators: res.data.total_indicators
                });
            });
    }


    render() {
        const {per_page, loader, new_indicators, total_indicators,indicator} = this.state;
        return (
            <>
                <Routes page="indicator/collector"/>
                <div className="container-fluid pb-5">
                    <div className='d-flex justify-content-center container' >
                        <div className='col-md-4 col-12'>
                            <div className="mt-5 card text-center borderDarkpurple ">
                                <div className="card-body">
                                    <p className="card-title Darkpurple ">
                                        <small className="Darkpurple lalezar"> کل شاخص ها</small>
                                    </p>
                                    <h5 className="card-text Darkpurple iran-sans_Bold my-1">{total_indicators}</h5>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4 col-12'>
                            <div className="mt-5 card text-center borderlightBlue">
                                <div className="card-body">
                                    <p className=" card-title">
                                        <small className="lightBlue lalezar"> شاخص های دیده نشده</small>
                                    </p>
                                    <h5 className="card-text iran-sans_Bold lightBlue ">{new_indicators}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="note bg-white my-5 mx-sm-5 mx-3 py-4">
                        <HospitalTable
                            totalPage={Math.ceil(total_indicators / per_page)}
                            active={this.state.page}
                            title="جمع آوری شاخص ها"
                            rows={this.state.indicators}
                            headers={this.state.table.headers}
                            pageOnChange={this.getCollectorIndicators}
                            loader={loader}
                        />

                        <Modal
                            isOpen={this.state.IsMonitorScreenOpen}
                            onRequestClose={this.closeMonitorScreenModal}
                            style={customStyles}
                            shouldCloseOnOverlayClick={false}
                            portalClassName="full_screen_modal monitorScreenModal"
                        >
                            {indicator &&
                            <IntervalValue
                                CloseModal={this.closeMonitorScreenModal}
                                indicator_id={this.state.indicator_id}
                                indicator={indicator}
                            />
                                }

                        </Modal>

                        <Modal
                            isOpen={this.state.isModalOpen}
                            shouldCloseOnOverlayClick={false}
                            //   onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="User Modal"
                            portalClassName="full_screen_modal selelctUsers"
                        >
                            <IndicatorCalenderComp
                                CloseModal={this.closeModal}
                                indicator_id={this.state.indicator_id}
                                measure_interval={this.state.measure_interval}
                                indicator={this.state.total_average}
                                boxes={this.state.boxes}
                                intervals={this.state.intervals}
                                setIndicicator={this.setIncicatorFromProps}
                                OpenMonitorScreenModal={this.OpenMonitorScreenModal}
                                interval_numbers={this.state.interval_numbers}
                            />
                        </Modal>
                    </div>
                </div>

            </>
        )
    }
}


const IndicatorCollctorlComponent = connect((state) => ({globalStorage: state.globalStorage}))(IndicatorCollctor);
export {IndicatorCollctorlComponent}