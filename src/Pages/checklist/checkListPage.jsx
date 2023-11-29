import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import Modal from "react-modal";
import moment from "jalali-moment";
import Popover, { ArrowContainer } from "react-tiny-popover";
import ContentEditable from "react-contenteditable";
import { userActions } from "../../_actions";
import { IntervalValue } from "./components";
import Media from 'react-media';
import WardIcon from '../../assets/images/WardIcon.png';
import TakmilIcon from '../../assets/images/takmilchecklist.svg';
import edit from '../../assets/images/edit.png'

import ReactTooltip from 'react-tooltip'

// import Marquee from "react-smooth-marquee";
import backIcon from '../../assets/images/back.png'
import {
    HospitalTable,
    ChecklistViewComp,
    CheckListCalenderComp,
    Routes,
    Chart,
    InputGenerator
} from "../../_components";
import { Navbar } from '../pwa/Navbar';

Modal.setAppElement("#root");

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

const customStylespwa = {
    overlay: {
        position: "fixed",
        top: "6%",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    content: {
        animationName: "animatetop",
        animationDuration: "0.4s",
        padding: '0px',
        inset: '20px',
        borderRadius: '.5em'
    }
};

export class CheckListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Records: [],
            Infos: [],
            Guides: [],
            Details: [],
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
            CompletedCheckListRows: [],
            DetailTableHeaders: [
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
                            <>
                            <button className="btn btn-link" onClick={() => this.openDetailRecordsModal(item, true)} data-tip="جزئیات">
                                <img src={TakmilIcon} alt="جزئیات" width={45}/><ReactTooltip type="dark" html={true}/>
                            </button>
                            {/*<button className="btn btn-link" data-tip="ویرایش"  onClick={()=>this.editFormulaRecord(item)}><img src={EDIT} alt="ویرایش" width={30}/></button>*/}
                            {
                                item.save_temp === true &&
                                <button onClick={() => this.openDetailRecordsModal(item, false)} className="btn btn-link" data-tip="ویرایش"><img src={edit} alt="ویرایش" width={45} /></button>
                            }
                            <ReactTooltip type="dark" />
                            </>
                            )
                    },
                    style: {
                        width: '20%'
                    }
                },
            ],
            // boxes: null,
            isChartModalOpen: false,
            detailModal: false,
            formula: null,
            interval: "",
            isCollector: false,
            measure_interval: 0,
            total_average: "-",
            isModalOpen: false,
            IsMonitorScreenOpen: false,
            // has_seen: null,
            new_indicators: 0,
            total_indicators: 0,
            general_indicators_info: null,
            page: 1,
            per_page: 24,
            loader: undefined,
            indicator: null,
            intervals: [],
            interval_numbers: [],
            indicators: [],
            boxes: [],
            collectorTable: {
                headers: [
                    {
                        title: "عنوان شاخص",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.title}
                                </span>
                            );
                        },
                        style: {
                            width: "35%"
                        }
                    },
                    {
                        title: "مبنای شاخص",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.basis}
                                </span>
                            );
                        },
                        style: {
                            width: "14%"
                        }
                    },
                    {
                        title: "جنبه ی شاخص",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.aspect}
                                </span>
                            );
                        },
                        style: {
                            width: "13%"
                        }
                    },
                    {
                        title: "دوره تناوب",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.measure_interval}
                                </span>
                            );
                        },
                        style: {
                            width: "13%"
                        }
                    },
                    {
                        title: "تارگت",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.target}
                                </span>
                            );
                        },
                        style: {
                            width: "5%"
                        }
                    },
                    {
                        title: "حد بالا",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.upper_limit}
                                </span>
                            );
                        },
                        style: {
                            width: "5%"
                        }
                    },
                    {
                        title: "حد پایین",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.has_seen ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.lower_limit}
                                </span>
                            );
                        },
                        style: {
                            width: "5%"
                        }
                    },
                    {
                        title: "عملیات",
                        getData: (item, index) => {
                            return (
                                <button
                                    onClick={ev => {
                                        this.detailIndicator(item, index, ev);
                                    }}
                                    className="btn btn-blue  rounded-pill px-2  w-75"
                                >
                                    جزییات
                                </button>
                            );
                        },
                        style: {
                            width: "10%"
                        }
                    }
                ]
            },
            Table: {
                headers: [
                    {
                        title: "ارجـاع دهنده",
                        getData: (item, index) => {
                            let user = userActions.find_user(this.props.globalStorage.users, item.submitted_by)
                            return (
                                <span
                                    className={`${!item.seen == true ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {
                                        user && user['fn'] + " " + user['ln']
                                    }
                                </span>
                            );
                        },
                        style: {
                            width: "35%"
                        }
                    },
                    {
                        title: "عنوان",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.seen === true ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.object.title}
                                </span>
                            );
                        },
                        style: {
                            width: "20%"
                        }
                    },
                    {
                        title: "محور",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.seen == true ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {item.object.mehvar}
                                </span>
                            );
                        },
                        style: {
                            width: "15%"
                        }
                    },
                    {
                        title: "تاریخ ارسال",
                        getData: (item, index) => {
                            return (
                                <span
                                    className={`${!item.seen == true ? "iran-sans_Bold" : "iran-sans"
                                        }`}
                                >
                                    {moment(item.created_at).format('jYYYY/jMM/jDD')}
                                </span>
                            );
                        },
                        style: {
                            width: "14%"
                        }
                    },
                    {
                        title: "عملیات",
                        getData: (item, index) => {
                            return (
                                <button
                                    onClick={ev => {
                                        this.openCheckListDetail(item, index);
                                    }}
                                    className="btn btn-blue  rounded-pill px-2  w-75"
                                >
                                    جزییات
                                </button>
                            );
                        },
                        style: {
                            width: "15%"
                        }
                    }
                ]
            },
            TableRow: [],
            numerator_help_popover: false,
            denumerator_help_popover: false,
            keyword: '',
            query: '',
            wards: [],
            ward: null,
            chart: null,
            gauges1: null,
            gauges1Config: {},
            chartType: "column",
            filter_by_ward_id: '',
            checklist: {},
            checklist_id: null,
            isPopoverOpen: false,
        };

        this.OpenMonitorScreenModal = this.OpenMonitorScreenModal.bind(this);
        this.getChart = this.getChart.bind(this);
    }

    numerator = React.createRef();
    denumerator = React.createRef();

    openCheckListDetail = (item, index) => {
        let checklist_id;
        if (typeof item === "object") {
            checklist_id =  item.object_id;
        } else {
            checklist_id = item
        }
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists/${checklist_id}/average?user_id=${this.props.globalStorage.me.id}`
            )
        ).then(res => {
            this.getIntervals(res.data)
            this.setState({
                checklist_id,
                total_average: res.data.total,
                intervals: res.data.intervals,
                CompletedCheckListRows: res.data.intervals,
            })
        })
    }

    componentDidMount() {
        if (!this.props.globalStorage.wards.length) {
            this.props.dispatch(userActions.getWards())
        }

        this.props.dispatch(
            userActions.getUsers(this.props.globalStorage.me.hospital_id)
        )

        this.getKartableCheckLists()

    }

    getKartableCheckLists = () => {
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/kartabl?year?${1398}&page=1&per=10&menu=checklist_page&submenu=`
            )
        ).then(res => {
            this.setState({
                TableRow: res.data
            })
        })
    }


    setAnswer = (e, question, guide_index, guide, text_area_value = "") => {
        const { name, value } = e.target;
        const { Records, Guides } = this.state;
        const index_array = name.split('-');

        
        const last_answer = Records[index_array[0]]['questions'][index_array[1]]['value'];
        
        if (question.point_type === 'سوال باز') {
            Records[index_array[0]]['questions'][index_array[1]]['value'] = text_area_value;
            Records[index_array[0]]['questions'][index_array[1]]['v'] = text_area_value;
        } else if (question.point_type === 'کیفی') {
            Records[index_array[0]]['questions'][index_array[1]]['value'] = last_answer === guide['value'] ? undefined : guide['value'];
            Records[index_array[0]]['questions'][index_array[1]]['v'] = last_answer === guide['value'] ? undefined : guide_index + 1;
        } else if (question.question_type === 'دوسطحی') {
                Records[index_array[0]]['questions'][index_array[1]]['value'] = last_answer === guide['value'] ? undefined : guide['value'];
                Records[index_array[0]]['questions'][index_array[1]]['v'] = last_answer === guide['value'] ? undefined : guide_index;
            } else {
                Records[index_array[0]]['questions'][index_array[1]]['value'] = last_answer === guide['value'] ? undefined : guide['value'];    
                Records[index_array[0]]['questions'][index_array[1]]['v'] = last_answer === guide['value'] ? undefined : guide['value'];    
                // questions[index_array[0]]['content'][index_array[1]]['value'] = last_answer === answer.answer ? undefined : answer.answer;
            }

        this.setState({ Records })     
    }

    openDetailModal = () => {
        this.setState({ detailModal: true });
    };
    closeDetailModal = () => {
        this.setState({ detailModal: false });
    };


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

        let repeat_value = this.checkMeasureInterval(checklist.delivery_type.trim());
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

    closeMonitorScreenModal = () => {
        this.setState(
            {
                IsMonitorScreenOpen: false
            },
            () => {
                this.closeModal();
                this.openModal(this.state.selectedIndicator);
            }
        );
    };

    openModal = (indicator, index) => {
        // check measure_interval
        this.setState({ selectedIndicator: indicator });
        let repeat_value = indicator.measure_interval === 'روزانه' ? 12 : userActions.getPeriodCount(indicator.measure_interval);
        // create virtual interval based on measure_interval
        const boxes = []; //new Array(repeat_value).fill({});
        for (let i = 0; i < repeat_value; i++) {
            boxes.push({});
        }

        // get get_indicator_interval_averages?indicator_id=
        const indicator_ = indicator;
        this.props
            .dispatch(
                userActions.API(
                    "get",
                    `/v2/get_indicator_formula?indicator_id=${indicator.id}`
                ),
                false
            )
            .then(formula_resualt => {
                const { formula } = formula_resualt.data;

                if (formula.numerator_indicator_id) {
                    const indic = this.props.globalStorage.indicators.find(i => i.id == formula.numerator_indicator_id);
                    formula.numerator_indicator_name = indic ? indic.title : '';
                }
                if (formula.denumerator_indicator_id) {
                    const indic = this.props.globalStorage.indicators.find(i => i.id == formula.denumerator_indicator_id);
                    formula.denumerator_indicator_name = indic ? indic.title : '';
                }
                formula.numerator_mask = [];
                formula.denumerator_mask = [];
                formula.numerator_placeholder = formula.numerator
                    .map((operand, i) => {
                        let opt = formula.numerator_operators[i] || "";
                        if (opt) {
                            opt =
                                '&nbsp;<span class="iran_sans_Bold text_muted">' +
                                opt +
                                "</span>&nbsp;";
                        }
                        return operand + opt;
                    })
                    .join("");
                formula.denumerator_placeholder = formula.denumerator
                    .map((operand, i) => {
                        let opt = formula.denumerator_operators[i] || "";
                        if (opt) {
                            opt =
                                '&nbsp;<span class="iran_sans_Bold text_muted">' +
                                opt +
                                "</span>&nbsp;";
                        }
                        return operand + opt;
                    })
                    .join("");
                for (let key in indicator_) {
                    if (indicator_[key] === null) {
                        indicator_[key] = "---";
                    }
                }
                if (!Array.isArray(indicator_.logical_reasons_of_collecting)) {
                    indicator_.logical_reasons_of_collecting = indicator_.logical_reasons_of_collecting
                        ? indicator_.logical_reasons_of_collecting.split("\n")
                        : "";
                }
                if (!Array.isArray(indicator_.definition)) {
                    indicator_.definition = indicator_.definition
                        ? indicator_.definition.split("\n")
                        : "";
                }
                const f = Object.assign({}, formula);
                delete f.id;
                const indicator = Object.assign({}, indicator_, f);
                indicator.formula = formula;
                if (Array.isArray(formula.numerator)) {
                    indicator.numerator = formula.numerator
                        .map((operand, i) => {
                            let opt = formula.numerator_operators[i] || "";
                            if (opt) {
                                opt =
                                    '&nbsp;<span class="iran_sans_Bold text_muted">' +
                                    opt +
                                    "</span>&nbsp;";
                            }
                            return operand + opt;
                        })
                        .join("");
                }
                if (Array.isArray(formula.denumerator)) {
                    indicator.denumerator = formula.denumerator
                        .map((operand, i) => {
                            let opt = formula.denumerator_operators[i] || "";
                            if (opt) {
                                opt =
                                    '&nbsp;<span class="iran_sans_Bold text_muted">' +
                                    opt +
                                    "</span>&nbsp;";
                            }
                            return operand + opt;
                        })
                        .join("");
                }

                this.setState({
                    indicator, formula
                });
            });
        this.props
            .dispatch(
                userActions.API(
                    "get",
                    `v2/get_indicator_interval_averages?indicator_id=${indicator.id}&user_id=${this.props.globalStorage.me.id}&is_collector=${this.state.isCollector}`
                )
            )
            .then(res => {
                let { intervals, total_average } = res.data;
                if (intervals) {
                    intervals.map(interval => {
                        // set virtual interval average of interval from get_indicator_interval ...
                        //
                        console.log(indicator.measure_interval)
                        if (indicator.measure_interval === "روزانه") {
                            const m = moment(
                                this.props.globalStorage.year + "/01/01",
                                "jYYYY/jMM/jDD"
                            ).jDayOfYear(interval.interval_number);
                            console.log(m)
                            const month = m.jMonth();
                            const day = m.jDate();
                            if (!boxes[month]) {
                                boxes[month] = [];
                            }
                            boxes[month][day] = Object.assign({}, interval);
                        } else {
                            boxes[interval.interval_number - 1] = interval;
                        }
                    });
                    if (total_average === null) {
                        total_average = "-";
                    }
                }
                this.setState({
                    total_average,
                    intervals,
                    boxes,
                    isModalOpen: true
                });
            });
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            formula: null
        });
    };

    getCollectorIndicators = (page = 1, query = this.state.query, filter_by_ward_id = this.state.filter_by_ward_id) => {
        this.setState({ query })
        this.props
            .dispatch(
                userActions.API(
                    "get",
                    `v2/get_collector_indicators?year=${this.props.globalStorage.year}&page=${page}&per=${this.state.per_page}${query || ''}${filter_by_ward_id ? '&filter_by_ward_id=' + filter_by_ward_id._id : ''}`
                )
            )
            .then(res => {
                this.getCollectorIndicatorsCount();
                this.setState({
                    indicators: res.data.indicators,
                    page
                });
            });
    };

    getCollectorIndicatorsCount = () => {
        this.props
            .dispatch(
                userActions.API(
                    "get",
                    `/v2/get_collector_indicators_count?year=${this.props.globalStorage.year}${this.state.filter_by_ward_id ? '&filter_by_ward_id=' + this.state.filter_by_ward_id._id : ''}`, null, false
                )
            )
            .then(res => {
                this.setState({
                    new_indicators: res.data.new_indicators,
                    total_indicators: res.data.total_indicators
                });
            });
    };

    getMonitorIndicators = (page = 1, query = this.state.query) => {
        this.setState({ query })
        this.props
            .dispatch(
                userActions.API(
                    "get",
                    `v2/get_monitor_indicators?year=${this.props.globalStorage.year}&page=${page}&per=${this.state.per_page}${query}`
                )
            )
            .then(res => {
                this.setState({
                    indicators: res.data.indicators,
                    page
                });
            });
    };

    getMonitorIndicatorsCount = () => {
        this.props
            .dispatch(
                userActions.API(
                    "get",
                    `/v2/get_monitor_indicators_count/?year=${this.props.globalStorage.year}`
                )
            )
            .then(res => {
                this.setState({
                    new_indicators: res.data.new_indicators,
                    total_indicators: res.data.total_indicators
                });
            });
    };

    addNewInterval = async interval => {
        const res = await this.props.dispatch(
            userActions.API("post", `/v2/add_indicator_interval`, interval),
            null,
            false
        );
        interval.id = res.data.interval_id;
        const boxes = [...this.state.boxes];
        if (this.state.indicator.measure_interval === "روزانه") {
            const m = moment(
                this.props.globalStorage.year + "/01/01",
                "jYYYY/jMM/jDD"
            ).jDayOfYear(interval.interval_number);
            const month = m.jMonth();
            const day = m.jDate();
            if (!boxes[month]) {
                boxes[month] = [];
            }
            boxes[month][day] = interval;
        } else {
            boxes[interval.interval_number - 1] = interval;
        }
        this.setState({ boxes });
        return interval;
    };

    openReport = () => {
        if (this.state.isCollector) {
            this.getWards(this.state.indicator.id).then(res => {
                const wards = res.data.map(w => {
                    w.id = w._id;
                    return w;
                });
                this.setState({ wards }, () => {
                    if (wards.length == 1) {
                        this.setState({ ward: [wards[0]] }, () => {
                            this.getChart();
                        });
                    } else {
                        this.getChart();
                    }

                    this.setState({ isChartModalOpen: true });
                });
            });

        } else {
            const { wards } = this.state;
            if (wards.length == 1) {
                this.setState({ ward: [wards[0]] }, () => {
                    this.getChart();
                });
            } else {
                this.getChart();
            }

            this.setState({ isChartModalOpen: true });
        }

    }

    async getChart() {
        const { indicator, ward } = this.state;

        this.getGauge1(indicator.id, ward ? ward.map(w => w.id) : null)
        const res = await this.chart0(indicator.id, ward ? ward.map(w => w.id) : null);
        if (res) {
            const chart = {};
            chart.data = Object.keys(res.chart_data).map(d => {
                const data = res.chart_data[d];
                const name = d;
                return Object.assign({
                    dataLabels: {
                        enabled: true,
                        y: 10
                    }
                }, { data, name });
            })
            chart.categories = res.chart_category.map(c => c.name)

            this.setState({ chart });
        }
    }

    closeReport = () => {

        this.setState({ isChartModalOpen: false })
    }

    async OpenMonitorScreenModal(interval) {

        this.setState({
            IsMonitorScreenOpen: true,
            interval,
        });
    }


    openInsertValuesModal = (data, interval_number) => {
        const { checklist_id } = this.state;
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists/${checklist_id}/records?submitted_at=${interval_number}`
            )
        ).then(res => {
            this.setState({
                readOnly: false,
                interval_number,
                Records: res.data.records,
                Guides: res.data.guides,
                Infos: res.data.infos,
                isDetailRecordsModalOpen: true,
            })
        })
    }

    closeDetailRecords = () => {
        this.setState({ isDetailRecordsModalOpen: false, detail_id: null, ward: null})
    }

    searchByQuery = (query) => {
        if (this.state.isCollector) {
            this.getCollectorIndicators(1, '&by_query=' + query);
        } else {
            this.getMonitorIndicators(1, '&by_query=' + query);
        }

    };

    getGauge1 = (id, wards = null) => {
        this.setState({ gauges1: null }, () => {
            this.props
                .dispatch(
                    userActions.API(
                        "post",
                        `/v2/indicator/average_by_ward_chart?id=${id}&user_id=${this.props.globalStorage.me.id}`,
                        {
                            wards
                        }
                    )
                )
                .then(res => {
                    const gauges1 = {};
                    gauges1["کل بیمارستان"] = res.data.hospital
                        ? parseFloat(userActions.fixed(res.data.hospital))
                        : 0;
                    if (res.data.wards) {
                        res.data.wards.map(w => {
                            gauges1[w.name] = parseFloat(userActions.fixed(w.value));
                        });
                    }
                    let max = 0;
                    let min = 0;
                    Object.keys(gauges1).forEach(d => {
                        if (gauges1[d] >= max) {
                            max = gauges1[d];
                        }
                        if (gauges1[d] <= min) {
                            min = gauges1[d];
                        }
                    });
                    const gauges1Config = {
                        min,
                        max
                    };
                    console.log(gauges1, gauges1Config)
                    this.setState({ gauges1, gauges1Config });
                });
        });
    };

    chart0 = (id, wards = null) => {
        return new Promise((resolve, rej) => {
            this.props
                .dispatch(
                    userActions.API("post", `/v2/indicator/interval_by_ward?id=${id}&user_id=${this.props.globalStorage.me.id}`, {
                        wards
                    })
                )
                .then(res => {
                    const chart_data = {};
                    const chart_category = [];
                    const { measure_interval, indicator } = this.state;
                    const period = measure_interval
                        ? measure_interval.value
                        : indicator.measure_interval;
                    for (let i = 1; i <= userActions.getPeriodCount(period); i++) {
                        chart_category.push({
                            name:
                                period === "ماهانه" ? userActions.persianMonth(i)
                                    : (period === "سالانه" ? this.props.globalStorage.year
                                        : (period === "روزانه" ? moment().jDayOfYear(i).format("jMMMM jDD")
                                            : userActions.intervalPerfix(period) + userActions.persianNumber(i, true)
                                        )
                                    )
                            ,
                            interval_number: i
                        });
                    }
                    chart_data["کل بیمارستان"] = [];
                    const wards = {};
                    if (res.data.wards) {
                        res.data.wards.map(w => {
                            chart_data[w.name] = [];
                            wards[w.name] = w.values;
                        });
                    }
                    chart_category.map(cat => {
                        Object.keys(chart_data).map(key => {
                            let value = null;
                            if (key === "کل بیمارستان") {
                                if (['چک لیست', 'پرسشنامه', 'HIS'].indexOf(indicator.report_type) === -1) {
                                    console.log(indicator)
                                    const groupIntervals = userActions.groupBy(res.data.hospital, 'interval_number');
                                    let intervals = [];

                                    Object.keys(groupIntervals).map(g => {
                                        const l = groupIntervals[g].length;
                                        const value = groupIntervals[g].reduce((a, b) => ({ ['value']: parseFloat(a['value']) + parseFloat(b['value']) }))['value'] / l;

                                        intervals.push({
                                            interval_number: g,
                                            value,
                                        })
                                    })
                                    console.log(intervals)
                                    res.data.hospital = intervals;
                                }
                                const data = res.data.hospital.find(d => d.interval_number.toString() === cat.interval_number.toString());
                                if (data) {
                                    value = parseFloat(userActions.fixed(data.value));
                                }
                            } else {
                                if (res.data.wards) {
                                    const data = wards[key].find(d => d.interval_number === cat.interval_number);
                                    if (data) {
                                        value = parseFloat(userActions.fixed(data.value));
                                    }
                                }
                            }
                            chart_data[key].push(
                                value
                            )
                        })
                        //  res.data.hospital.map(d => {

                        //     // if(d.interval_name==cat.interval_name){
                        //     //   chart_data["کل بیمارستان"]
                        //     // }
                        //   })
                    });



                    resolve({ chart_data, chart_category });
                });
        });
    };

    reloadInterval = () => {
        this.setState({ indicator: null }, () => {
            setTimeout(() => {
                this.openModal(this.state.selectedIndicator)
            }, 500)

        })

    };

    getWards = id => {
        return this.props
            .dispatch(userActions.API("get", `/v2/indicator/answers/wards?id=${id}&user_id=${this.props.globalStorage.me.id}`));

    };


    onChangeInfo = (item, data) => {
        const { Infos } = this.state;
        Infos[Infos.indexOf(item)].value = data;
        this.setState({ Infos });
    }


    submitChecklist = (e, save_temp) => {
        e.preventDefault();
        const {Infos, Records, checklist_id, ward, interval_number} = this.state;
        const infos = new Array();
        const records = new Array();
        
        if (ward === null) {
            return userActions.failure(`لطفا  بخش را انتخاب کنید.`);
        }

        for (const info in Infos) {
            // check required infos 
            if (Infos[info]['required'] === true) {
                if (Infos[info]['value'] === null) {
                    return userActions.failure(`لطفا ${Infos[info]['key']} را انتخاب کنید.`);
                } 
            }
            if (typeof Infos[info]['value'] === "object") {
                
                Infos[info]['value']  = Infos[info]['value'] === null ? null : Infos[info]['value']['value'];
            } 
            infos.push({answerer_info_menu_item_id: Infos[info]['answerer_info_menu_item_id'], value: Infos[info]['value']});
        }

        Records.map( (record, i) => {
            record.questions.map( (question, q_i) => {
                if (question['value'] !== null) {
                    records.push({question: question['key'], value: question['value'], v: question['v']})
                }
            } )
            
        })

        const details = {
            save_temp,
            records,
            infos,
            ward_id: ward['_id'],
        }

        if (this.state.detail_id !== null) {
            details['_id'] = this.state.detail_id; 
        }

        this.props.dispatch(
            userActions.API(
                'put',
                'v1/user/hospital/answer_checklist', 
                {
                    checklist_page_id: checklist_id,
                    submitted_at: interval_number,
                    year: this.props.globalStorage.year,
                    details,

                }
            )
        ).then(res => {
            this.closeModal();
            this.closeDetailRecords();
            this.closeDetailModal();
            this.closeDoneModal();
            this.openCheckListDetail(checklist_id);
            userActions.successAlert("ثبت موفق", "مقادیر پاسخ با موفقیت ثبت شدند");
        })
        
    }


    openDoneModal = () => {
        this.setState({ DoneModal: true })
    }

    closeDoneModal = () => {
        this.setState({ DoneModal: false })
    }
        

    openDetailsModal = (item) => {
        const checklist_id = this.state.checklist_id;
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists/${checklist_id}/details/${item.interval}?ward_id=&user_id=${this.props.globalStorage.me.id}&from=&to=`
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


    openDetailRecordsModal = (item, readOnly = false) => {
        const {checklist_id} = this.state;
        this.props.dispatch(
            userActions.API(
                'get',
                `v1/user/hospital/checklists/${checklist_id}/details/${item.id}/records`
            )
        ).then(res => {
            this.setState({
                readOnly,
                detail_id: res.data.detail_id,
                Records: res.data.records,
                Guides: res.data.guides,
                Infos: res.data.infos,
                isDetailRecordsModalOpen: true,
            })
        })   
    }


    render() {
        const {
            keyword,
            boxes,
            per_page,
            loader,
            new_indicators,
            total_indicators,
            indicator,
            isCollector,
            collectorTable,
            monitorTable,
            indicators,
            page,
            interval,
            formula,
            numerator_help_popover,
            denumerator_help_popover,
            wards, ward, chart, filter_by_ward_id,
            Records
        } = this.state;
        console.log(Records)
        return (

            <>
                {!this.props.match.params.pwa && <Routes
                    page={"checklist_page"}
                />}

                <div className="container-fluid pb-5">

                    {!this.props.match.params.pwa &&
                        <>

                            <div className="row  ">
                                <div className="col-lg-10 m-auto ">
                                    <div className="form-group mt-3 ">
                                        <input type="text"
                                            name="keyword"
                                            value={keyword}
                                            onChange={e => userActions.handleChangeInput.call(this, e, this.searchByQuery)}
                                            className="form-control rounded-pill border-0 py-4   text-center text-blue"
                                            placeholder="نام چک لیست را وارد کنید..." />
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center  mt-4">

                                <label className="py-1 mx-2 w-100 d-block"
                                    style={{ maxWidth: 350, fontSize: '.8em' }}>
                                    <Select className="text-justify custom-select-2"
                                        value={filter_by_ward_id}
                                        name="filter_by_ward_id"
                                        placeholder=" بخش مورد نظر را انتخاب کنید"
                                        isClearable
                                        onChange={(v, d) => {
                                            userActions.handleChangeSelect.call(this, v, d, null, null, (f) => {
                                                this.getCollectorIndicators(1, null, f || '')
                                            })
                                        }}
                                        options={this.props.globalStorage.wards}
                                        getOptionLabel={opt => opt.name}
                                        getOptionValue={opt => opt._id}

                                    />
                                </label>


                            </div>
                            <div className="d-flex justify-content-center row">
                                <div className="col-md-4 col-12">
                                    <div className="mt-5 card text-center borderDarkpurple ">
                                        <div className="card-body">
                                            <p className="card-title Darkpurple ">
                                                <small className="Darkpurple lalezar"> کل چک لیست ها</small>
                                            </p>
                                            <h5 className="card-text Darkpurple iran-sans_Bold my-1">
                                                {total_indicators}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="mt-5 card text-center borderlightBlue">
                                        <div className="card-body">
                                            <p className=" card-title">
                                                <small className="lightBlue lalezar">
                                                    {" "}
                                                چک لیست های دیده نشده
                                            </small>
                                            </p>
                                            <h5 className="card-text iran-sans_Bold lightBlue ">
                                                {new_indicators}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {this.props.match.params.pwa ?
                        <>
                            <Navbar name={isCollector ? "اندازه گیری شاخص" : "پایش شاخص"} url={`/pwa`} />
                            <div className="col-12 indicator_agahi  px-0 " style={{ paddingTop: "5em" }}>

                                {indicators.map((item, index) => {
                                    return (
                                        <div className="card my-3 " key={isCollector ? item.id : item.indicator.id}>
                                            <div className="card-body px-3 py-0">
                                                <div
                                                    className="row text-center title py-2">{isCollector ? item.title : item.indicator.title}</div>
                                                <div className="row border_item">
                                                    <div className="col-6 text-center py-2"
                                                        style={{ borderLeft: "1px solid #ccc" }}>
                                                        <lable className="lable">دوره تنـاوب</lable>
                                                        <div
                                                            className="item">{isCollector ? item.measure_interval : item.indicator.measure_interval}</div>
                                                    </div>
                                                    <div className="col-6 text-center py-2">
                                                        <lable className="lable">مبنـای شاخـص</lable>
                                                        <div
                                                            className="item">{isCollector ? item.basis : item.indicator.basis}</div>
                                                    </div>
                                                </div>
                                                <div className="row border_item">
                                                    <div className="col-4 text-center py-2"
                                                        style={{ borderLeft: "1px solid #ccc" }}>
                                                        <lable className="lable">حـد پایین</lable>
                                                        <div
                                                            className="item">{isCollector ? item.lower_limit : item.indicator.lower_limit}</div>
                                                    </div>
                                                    <div className="col-4 text-center py-2"
                                                        style={{ borderLeft: "1px solid #ccc" }}>
                                                        <lable className="lable">تارگـت</lable>
                                                        <div
                                                            className="item">{isCollector ? item.target : item.indicator.target}</div>
                                                    </div>
                                                    <div className="col-4 text-center py-2">
                                                        <lable className="lable">حـد بالا</lable>
                                                        <div
                                                            className="item">{isCollector ? item.upper_limit : item.indicator.upper_limit}</div>
                                                    </div>

                                                </div>
                                                <div className="row d-flex justify-content-center">
                                                    <button
                                                        className="col-11  btn rounded-pill btn-primary my-3 detail_style"
                                                        onClick={ev => {
                                                            this.detailIndicator(isCollector ? item : item.indicator, index, ev);
                                                        }}>

                                                        جزییـات

                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </>

                        :
                        <div className="note bg-white my-5 mx-sm-5 mx-3 py-4">
                            <HospitalTable
                                totalPage={Math.ceil(total_indicators / per_page)}
                                active={page}
                                title={"چک لیست ها"}
                                rows={this.state.TableRow}
                                headers={
                                    this.state.Table.headers
                                }
                                pageOnChange={isCollector ? this.getCollectorIndicators : this.getMonitorIndicators}
                                loader={loader}
                            />
                        </div>

                    }

                </div>

                {/*Calender Screen*/}
                <Modal
                    isOpen={this.state.isModalOpen}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={this.props.match.params.pwa ? customStylespwa : customStyles}
                    contentLabel="User Modal"
                    portalClassName="full_screen_modal selelctUsers"

                >
                    {boxes && <CheckListCalenderComp
                        CloseModal={this.closeModal}
                        measure_interval={this.state.checklist.delivery_type}
                        total_average={this.state.total_average}
                        intervals={this.state.boxes}
                        openDoneModal={this.openDoneModal}
                        checklist_id={this.props.match.params.id}
                        readOnly={false}
                        insertValuesModal={(data, interval_number) => this.openInsertValuesModal(data, interval_number)}
                    // only_me={false}
                    // detailFormula={indicator.report_type !== 'چک لیست' && indicator.report_type !== 'پرسشنامه' ? true : undefined}
                    // detailChecklist={indicator.report_type === 'چک لیست' || indicator.report_type === 'پرسشنامه' ? true : undefined}
                    />
                    }
                </Modal>
                <Modal
                    isOpen={this.state.isChartModalOpen}
                    shouldCloseOnOverlayClick={false}
                    onRequestClose={this.closeReport}
                    style={this.props.match.params.pwa ? customStylespwa : customStyles}
                    contentLabel="Chart Modal"
                    portalClassName="full_screen_modal"
                >

                    <div className="container-fluid shadow px-5 pb-5 bg-light ">
                        <button className="btn btn-link float-right" onClick={this.closeReport}><i className="fal fa-times text-danger" /> </button>
                        <div className="row py-3 pb-5">

                            <div className="col-12 text-center   d-flex flex-wrap">
                                {
                                    wards.length > 1 &&
                                    <div className="custom-select-box form-group text-right w-100">
                                        <label
                                            className="color-dark text-iransansBold my-3"
                                            style={{ fontSize: "0.8em" }}
                                        >
                                            بخــش 
                                            </label>
                                        <Select
                                            options={wards}
                                            className="text-center custom-select-2"
                                            isClearable
                                            getOptionLabel={opt => opt.name}
                                            getOptionValue={opt => opt.id}
                                            onChange={(value, data) => userActions.handleChangeSelect.call(this, value, data, null, null, this.getChart)}
                                            value={ward}
                                            name="ward"
                                            autoFocus={false}
                                            isMulti={true}
                                            //   onChange={userActions.handleChangeSelect.bind(this)}
                                            placeholder={"انتخاب کنید"}
                                        //   options={type_options}
                                        />
                                    </div>
                                }
                                {this.state.gauges1 && (

                                    <div className="w-100 bg-white box-shadow d-flex flex-wrap overflow-auto" style={{ height: 300 }}>
                                        {Object.keys(this.state.gauges1).map((g, i) => (
                                            <div className="col-6" key={i}>
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
                                                        min: this.state.gauges1Config.min !== this.state.gauges1Config.max ? this.state.gauges1Config.min : this.state.gauges1Config.min,
                                                        max: this.state.gauges1Config.min !== this.state.gauges1Config.max ? this.state.gauges1Config.max : this.state.gauges1Config.max + 1,
                                                        stops: indicator.upper_limit != null && indicator.lower_limit != null && indicator.lower_limit !== indicator.upper_limit ? [

                                                            [indicator.lower_limit, indicator.desirability == "افزاینده"
                                                                ? "#DF5353"
                                                                : "#55BF3B"],
                                                            [
                                                                indicator.upper_limit,
                                                                indicator.desirability == "افزاینده"
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

                                                    data={[
                                                        {
                                                            name: g,
                                                            data: [this.state.gauges1[g]],
                                                            dataLabels: {
                                                                format:
                                                                    '<div style="text-align:center;white-space: normal;width: 103px;">' +
                                                                    '<span style="font-size:1.5em">{y:.2f}</span><br/>' +
                                                                    '<span style="font-size:.8em;">' +
                                                                    " مقدار شاخص در " +
                                                                    g +
                                                                    "</span>" +
                                                                    "</div>"
                                                            }
                                                        }
                                                    ]}
                                                    chartType={"solidgauge"}
                                                />
                                            </div>

                                        ))}
                                    </div>

                                )}
                                {this.state.chart && (
                                    <div
                                        className=" col-12 "
                                        style={{ borderRadius: "12px", padding: "60px", maxHeight: 500 }}
                                    >
                                        <div
                                            style={{ position: "relative" }}
                                            className="bg-white box-shadow"
                                        >
                                            <div className="w-100  text-center">
                                                <Chart
                                                    data={this.state.chart.data}
                                                    categories={this.state.chart.categories}
                                                    tooltipFormatter={this.state.chart.tooltipFormatter}
                                                    chartType={this.state.chartType}
                                                    legend={true}
                                                    chartMargin={[60, 50, 100, 60]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary rounded-pill" onClick={this.closeReport}> بازگشت</button>
                        </div>
                    </div>

                </Modal>


                <Modal
                    isOpen={this.state.detailModal}
                    shouldCloseOnOverlayClick={false}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeDetailModal}
                    contentLabel="Detail Modal"
                    portalClassName="full_screen_modal"
                    style={this.props.match.params.pwa ? customStylespwa : customStyles}
                >

                    {indicator && (
                        <>
                            <Media query="(min-width: 770px)" render={() =>
                                (
                                    <>
                                        <div className="Cource  indicator_detail pwa_styles_indicator">
                                            {/*headerIndeicator*/}
                                            <div className="container-fluid headerIndeicator">
                                                <div
                                                    className={"row d-flex justify-content-around   my-4 "}
                                                >
                                                    <div className="col-lg-3    my-2 ">
                                                        <div
                                                            className="text-center  rounded-pill py-2 text-dark shadow iran-sans_Bold bg-white ">
                                                            {indicator.title}
                                                        </div>
                                                    </div>
                                                    {indicator.code && (
                                                        <div className="col-lg-3    my-2 ">
                                                            <div
                                                                className={`text-center  rounded-pill  text-white shadow bg-navy-blue  py-2 iran-sans_Bold ${this.props.match.params.pwa ? 'indicator_detail_joziat' : ''}`}>
                                                                {indicator.code}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {/*form indicator state*/}

                                            <div className="container-fluid shadow rounded  py-5  bg-white">

                                                <div className="row d-flex justify-content-center  ">
                                                    {indicator.creation_date && (
                                                        <div className={"col-lg-3 mt-4 "}>
                                                            <p className="text-right" htmlFor="">
                                                                {" "}
                                                                تاریخ تدوین
                                                            </p>
                                                            <div
                                                                className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
                                                                <p className="dateText">
                                                                    {indicator.creation_date}
                                                                </p>
                                                                <i className="fal fa-calendar-alt fa-2x"></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.edit_date && (
                                                        <div className={"col-lg-3 mt-4 "}>
                                                            <p className="text-right" htmlFor="">
                                                                {" "}
                                                                تاریخ بازنگری
                                                            </p>
                                                            <div
                                                                className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
                                                                <p className="dateText">{indicator.edit_date}</p>
                                                                <i className="fal fa-calendar-alt fa-2x"></i>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className={
                                                        "row d-flex justify-content-center  my-4 p-xl-4 "
                                                    }
                                                >
                                                    {indicator.quality_dimension &&
                                                        <div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                                            <div
                                                                className='text-center bg-pink rounded-pill py-2 text-white '><span
                                                                    className={'iransansBold'}>بعد کیفیت:</span>
                                                                {indicator.quality_dimension.map((q, j) => <span
                                                                    key={j}> {q} {j + 1 < indicator.quality_dimension.length ? ',' : ''} </span>)}
                                                            </div>
                                                        </div>}
                                                    {indicator.report_type && (
                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3 ">
                                                            <div
                                                                className="text-center bg-warning rounded-pill py-2 text-white">
                                                                <span className={"iransansBold"}>
                                                                    {" "}
                                نحوه ی گزارش:
                            </span>
                                                                <span> {indicator.report_type} </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.source && (
                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                                            <div
                                                                className="text-center bg-success rounded-pill py-2 text-white">
                                                                <span className={"iransansBold"}> منبع شاخص:</span>
                                                                <span> {indicator.source} </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.measurement_unit && (
                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                                            <div
                                                                className="text-center bg-light-blue rounded-pill py-2  text-white">
                                                                <span className={"iransansBold"}>
                                                                    {" "}
                                واحد اندازه گیری:
                            </span>
                                                                <span> {indicator.measurement_unit} </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.desirability && (

                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3 ">
                                                            <div
                                                                className="text-center bg-danger rounded-pill py-2 text-white ">
                                                                <span className={"iransansBold"}>
                                                                    {" "}
                                مطلوبیت شاخص:
                            </span>
                                                                <span> {indicator.desirability} </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.basis && (
                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                                            <div
                                                                className="text-center bg-purple rounded-pill py-2 text-white">
                                                                <span className={"iransansBold"}> مبنـا شاخص:</span>
                                                                <span> {indicator.basis} </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.aspect && (
                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                                            <div
                                                                className="text-center bg-navy-blue rounded-pill py-2 text-white">
                                                                <span className={"iransansBold"}> جنبه شاخص:</span>{" "}
                                                                <span> {indicator.aspect}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.indicator_type && (
                                                        <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                                            <div
                                                                className="text-center bg-light-green rounded-pill py-2  text-white">
                                                                <span className={"iransansBold"}> نـوع شاخص:</span>
                                                                <span> {indicator.indicator_type}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={"row  p-4"}>
                                                    {indicator.definition && (
                                                        <div
                                                            className={
                                                                "col-lg-12 col-md-12 mt-4 text-center my-2"
                                                            }
                                                        >
                                                            <label
                                                                htmlFor=""
                                                                className="rounded-pill  px-4 py-1 titleInput bg-white"
                                                            >
                                                                تعریف شاخص و اهمیت موضوع
                                                            </label>
                                                            <div className="rounded box-border ">
                                                                {indicator.definition.map((item, index) => {
                                                                    return (
                                                                        <p
                                                                            style={{ textAlign: "justify" }}
                                                                            key={index}
                                                                            className="p-10 mt-4 mb-4"
                                                                        >
                                                                            {item}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {indicator.logical_reasons_of_collecting && (
                                                        <div
                                                            className={
                                                                "col-lg-12 col-md-12 mt-4 text-center my-2 "
                                                            }
                                                        >
                                                            <label
                                                                htmlFor=""
                                                                className="rounded-pill  px-4 py-1 titleInput bg-white"
                                                            >
                                                                {" "}
                                                                دلایل منطقـی جمع آوری شـاخص{" "}
                                                            </label>
                                                            <div className="rounded box-border ">
                                                                {indicator.logical_reasons_of_collecting &&
                                                                    indicator.logical_reasons_of_collecting.map(
                                                                        (item, index) => {
                                                                            return (
                                                                                <p
                                                                                    style={{ textAlign: "justify" }}
                                                                                    key={index}
                                                                                    className="p-10 mt-4 mb-4"
                                                                                >
                                                                                    {item}
                                                                                </p>
                                                                            );
                                                                        }
                                                                    )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="row justify-content-center">
                                                    <div
                                                        className="calculation d-flex flex-wrap flex-column col-lg-8 align-items-center py-5 my-5 mx-auto">
                                                        <div className="row justify-content-end w-100">
                                                            <ContentEditable
                                                                innerRef={this.numerator}
                                                                name="numerator"
                                                                html={indicator.numerator} // innerHTML of the editable div
                                                                disabled={true} // use true to disable edition
                                                                onChange={e =>
                                                                    userActions.maskInput.call(this, e, "numerator", {
                                                                        className: "iran_sans_Bold text_muted"
                                                                    })
                                                                } // handle innerHTML change
                                                                className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2 pwa_test_compute"
                                                                tagName="div"
                                                            />

                                                            <div className="d-flex justify-content-center col-2">
                                                                <Popover
                                                                    isOpen={numerator_help_popover}
                                                                    position={["top", "right", "left", "bottom"]} // preferred position
                                                                    padding={10}
                                                                    onClickOutside={() =>
                                                                        this.setState({ numerator_help_popover: false })
                                                                    }
                                                                    content={({
                                                                        position,
                                                                        targetRect,
                                                                        popoverRect
                                                                    }) => (
                                                                            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                                                position={position}
                                                                                targetRect={targetRect}
                                                                                popoverRect={popoverRect}
                                                                                arrowColor={"#1c94e0"}
                                                                                arrowSize={10}
                                                                            >
                                                                                <div className="bg-blue rounded p-4">
                                                                                    <p className="text-center pb-1 text-white">
                                                                                        راهنمای صورت
                                                                                </p>
                                                                                    <textarea
                                                                                        className={`form-control ${indicator.numerator_help.indexOf(
                                                                                            "\n"
                                                                                        ) >= 0
                                                                                            ? "rounded"
                                                                                            : "rounded-pill"
                                                                                            } border-0 `}
                                                                                        name="numerator_help"
                                                                                        value={indicator.numerator_help}
                                                                                        rows={
                                                                                            indicator.numerator_help.split("\n")
                                                                                                .length || 1
                                                                                        }
                                                                                        readOnly={true}
                                                                                    />
                                                                                </div>
                                                                            </ArrowContainer>
                                                                        )}
                                                                >
                                                                    <button
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                numerator_help_popover: !numerator_help_popover
                                                                            });
                                                                        }}
                                                                        className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                                        style={{ width: 34, height: 34 }}
                                                                    >
                                                                        <i className="fas fa-question text-white"></i>
                                                                    </button>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="row align-items-center justify-content-center w-100 pl-sm-5">
                                                            <input
                                                                type="text"
                                                                className="rounded-pill border-0 py-2 col-2 shadow-sm text-center"
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
                                                                onChange={e =>
                                                                    userActions.maskInput.call(
                                                                        this,
                                                                        e,
                                                                        "denumerator",
                                                                        { className: "iran-sans_Bold text-muted" }
                                                                    )
                                                                } // handle innerHTML change
                                                                className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2 pwa_test_compute"
                                                                tagName="div"
                                                            />
                                                            <div className="d-flex justify-content-center col-2">
                                                                <Popover
                                                                    isOpen={denumerator_help_popover}
                                                                    position={["bottom", "left", "right", "top"]} // preferred position
                                                                    padding={10}
                                                                    onClickOutside={() =>
                                                                        this.setState({
                                                                            denumerator_help_popover: false
                                                                        })
                                                                    }
                                                                    content={({
                                                                        position,
                                                                        targetRect,
                                                                        popoverRect
                                                                    }) => (
                                                                            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                                                position={position}
                                                                                targetRect={targetRect}
                                                                                popoverRect={popoverRect}
                                                                                arrowColor={"#1c94e0"}
                                                                                arrowSize={10}
                                                                            >
                                                                                <div className="bg-blue rounded p-4 ">
                                                                                    <p className="text-center pb-1 text-white">
                                                                                        راهنمای مخرج
                                                                                </p>
                                                                                    <textarea
                                                                                        className={`form-control ${indicator.denumerator_help.indexOf(
                                                                                            "\n"
                                                                                        ) >= 0
                                                                                            ? "rounded"
                                                                                            : "rounded-pill"
                                                                                            } border-0 `}
                                                                                        name="denumerator_help"
                                                                                        value={indicator.denumerator_help}
                                                                                        rows={
                                                                                            indicator.denumerator_help.split("\n")
                                                                                                .length || 1
                                                                                        }
                                                                                        readOnly={true}
                                                                                    />
                                                                                </div>
                                                                            </ArrowContainer>
                                                                        )}
                                                                >
                                                                    <button
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                denumerator_help_popover: !denumerator_help_popover
                                                                            });
                                                                        }}
                                                                        className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                                        style={{ width: 34, height: 34 }}
                                                                    >
                                                                        <i className="fas fa-question text-white"></i>
                                                                    </button>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-11 d-flex justify-content-center ">
                                                    {indicator.target !== null || indicator.upper_limit !== null || indicator.lower_limit !== null ?
                                                        <div
                                                            className="calculation-inputs flex-wrap d-flex justify-content-around col-lg-8 py-5 my-5">

                                                            {indicator.target !== null && <div
                                                                className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                                                <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">تارگت</h4>
                                                                <div className='box-target text-center py-3 mt-3'>
                                                                    {indicator.target}
                                                                </div>
                                                            </div>}

                                                            {indicator.upper_limit !== null && <div
                                                                className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                                                <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد
                                                                    بالا</h4>
                                                                <div className='box-target text-center py-3 mt-3'>
                                                                    {indicator.upper_limit}
                                                                </div>
                                                            </div>}

                                                            {indicator.lower_limit !== null && <div
                                                                className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                                                <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد
                                                                    پایین</h4>
                                                                <div className='box-target text-center py-3 mt-3'>
                                                                    {indicator.lower_limit}
                                                                </div>
                                                            </div>}
                                                        </div>
                                                        : ''}
                                                </div>
                                                <button
                                                    onClick={this.closeDetailModal}
                                                    className="btn rounded-pill btn-outline-primary d-block mx-auto my-5 px-5"
                                                >
                                                    بازگشت
                                                </button>


                                            </div>

                                            {/*indicator formol*/}
                                        </div>
                                    </>
                                )}
                            />
                            <Media query="(max-width: 769px)" render={() => (
                                <>


                                    <div className="Cource  indicator_detail pwa_styles_indicator">
                                        {/*headerIndeicator*/}
                                        <img src={backIcon} alt="backIcon" onClick={this.closeDetailModal}
                                            className="col-7btn d-block mx-auto my-2 px-5"
                                            style={{ width: '125px', cursor: "pointer" }} />

                                        <div className="container-fluid headerIndeicator">
                                            <div
                                                className={"row d-flex justify-content-around   my-4 "}
                                            >
                                                <div className="col-lg-3    my-2 ">
                                                    <div
                                                        className="text-center   py-2 text-dark iran-sans_Bold bg-white "
                                                        style={{ fontSize: '.9em' }}>
                                                        {indicator.title}
                                                    </div>
                                                </div>
                                                {indicator.code && (
                                                    <div className="col-lg-3    my-2 ">
                                                        <div
                                                            className={`text-center  rounded-pill  text-white shadow bg-navy-blue  py-2 iran-sans_Bold ${this.props.match.params.pwa ? 'indicator_detail_joziat' : ''}`}>
                                                            {indicator.code}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row d-flex justify-content-center  ">

                                            {indicator.creation_date && (
                                                <div className={"col-6 mt-4 "}>
                                                    <p className="text-right pwa_date_review" htmlFor="">
                                                        {" "}
                                                        تاریخ تدویـن
                                                    </p>
                                                    <div
                                                        className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
                                                        <p className="dateText">
                                                            {indicator.creation_date}
                                                        </p>
                                                        <i className="fal fa-calendar-alt fa-1x"></i>
                                                    </div>
                                                </div>
                                            )}
                                            {indicator.edit_date && (
                                                <div className={"col-6 mt-4 "}>
                                                    <p className="text-right pwa_date_review" htmlFor="">
                                                        {" "}
                                                        تاریخ بازنگـری
                                                    </p>
                                                    <div
                                                        className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
                                                        <p className="dateText">{indicator.edit_date}</p>
                                                        <i className="fal fa-calendar-alt fa-1x"></i>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                        <div
                                            className={
                                                "row d-flex justify-content-center  my-4 p-xl-4 "
                                            }
                                        >
                                            {indicator.quality_dimension &&
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className='iransansBold text-right title_pwa_indicator'>بعـد
                                                    کیفیت
                                                </div>
                                                    <div
                                                        className='text-center bg-pink rounded-pill py-2 text-white  overflow-hidden text_pwa_indicator_colorful'>
                                                        {indicator.quality_dimension.map((q, j) => (<span
                                                            key={j}> {q} {j + 1 < indicator.quality_dimension.length ? ',' : ''} </span>))}
                                                    </div>
                                                </div>}
                                            {indicator.report_type && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className="iransansBold text-right title_pwa_indicator">نحـوه
                                                    گـزارش
                                                    </div>
                                                    <div
                                                        className="text-center bg-warning rounded-pill py-2 text-white text_pwa_indicator_colorful">
                                                        <span> {indicator.report_type} </span>
                                                    </div>
                                                </div>
                                            )}
                                            {indicator.source && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className="iransansBold text-right title_pwa_indicator">منبـع
                                                    شـاخص
                                                    </div>
                                                    <div
                                                        className="text-center bg-success rounded-pill py-2 text-white text_pwa_indicator_colorful">
                                                        <span> {indicator.source} </span>
                                                    </div>
                                                </div>
                                            )}
                                            {indicator.measurement_unit && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className="iransansBold text-right title_pwa_indicator">واحـد
                                                    اندازه گیـری
                                                    </div>
                                                    <div
                                                        className="text-center bg-light-blue rounded-pill py-2  text-white text_pwa_indicator_colorful ">
                                                        <span> {indicator.measurement_unit} </span>
                                                    </div>
                                                </div>
                                            )}
                                            {indicator.desirability && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className="iransansBold text-right title_pwa_indicator">مطلوبیت
                                                    شـاخص
                                                    </div>
                                                    <div
                                                        className="text-center bg-danger rounded-pill py-2 text-white text_pwa_indicator_colorful ">
                                                        <span> {indicator.desirability} </span>
                                                    </div>
                                                </div>
                                            )}
                                            {indicator.basis && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className="iransansBold text-right title_pwa_indicator">مبنـا
                                                    شـاخص
                                                    </div>
                                                    <div
                                                        className="text-center bg-purple rounded-pill py-2 text-white text_pwa_indicator_colorful">
                                                        <span> {indicator.basis} </span>
                                                    </div>
                                                </div>
                                            )}
                                            {indicator.aspect && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2 '>
                                                    <div className="iransansBold text-right title_pwa_indicator">جنبـه
                                                    شـاخص
                                                    </div>
                                                    <div
                                                        className="text-center bg-navy-blue rounded-pill py-2 text-white text_pwa_indicator_colorful">
                                                        <span> {indicator.aspect}</span>
                                                    </div>
                                                </div>

                                            )}
                                            {indicator.indicator_type && (
                                                <div className='col-xl-3 col-lg-3 col-md-6  my-2'>
                                                    <div className="iransansBold  text-right title_pwa_indicator">نـوع
                                                    شـاخص
                                                    </div>
                                                    <div
                                                        className="text-center bg-light-green rounded-pill py-2  text-white text_pwa_indicator_colorful">
                                                        <span> {indicator.indicator_type}</span>
                                                    </div>
                                                </div>

                                            )}
                                            <div className="col-12 px-0">
                                                {indicator.definition && (
                                                    <div
                                                        className={
                                                            "col-lg-12 col-md-12  text-center my-2"
                                                        }
                                                    >
                                                        <label
                                                            htmlFor=""
                                                            className="rounded-pill  px-4 py-1 titleInput bg-white"
                                                        >
                                                            تعریف شاخص و اهمیت موضوع
                                                        </label>
                                                        <div className="rounded box-border pwa_titleInput">
                                                            {indicator.definition.map((item, index) => {
                                                                return (
                                                                    <p
                                                                        style={{ textAlign: "justify" }}
                                                                        key={index}
                                                                        className="p-2"
                                                                    >
                                                                        {item}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                                {indicator.logical_reasons_of_collecting && (
                                                    <div
                                                        className={
                                                            "col-lg-12 col-md-12  text-center mb-1"
                                                        }
                                                        style={{ marginTop: '-1.5em ' }}
                                                    >
                                                        <label
                                                            htmlFor=""
                                                            className="rounded-pill  px-4 py-1 titleInput bg-white"
                                                        >
                                                            {" "}
                                                            دلایل منطقـی جمع آوری شـاخص{" "}
                                                        </label>
                                                        <div className="rounded box-border pwa_titleInput ">
                                                            {indicator.logical_reasons_of_collecting &&
                                                                indicator.logical_reasons_of_collecting.map(
                                                                    (item, index) => {
                                                                        return (
                                                                            <p
                                                                                style={{ textAlign: "justify" }}
                                                                                key={index}
                                                                                className="p-2"
                                                                            >
                                                                                {item}
                                                                            </p>
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-12 justify-content-center text-center">
                                                <label for="" class="rounded-pill  px-4 py-1 titleInput bg-white">فرمول
                                                    محاسباتی</label>
                                                <div
                                                    className="calculation d-flex flex-wrap flex-column rounded box-border align-items-center py-4"
                                                    style={{ boxShadow: "unset" }}>
                                                    <div className="row justify-content-end w-100 px-2">
                                                        <ContentEditable
                                                            innerRef={this.numerator}
                                                            name="numerator"
                                                            html={indicator.numerator} // innerHTML of the editable div
                                                            disabled={true} // use true to disable edition
                                                            onChange={e =>
                                                                userActions.maskInput.call(this, e, "numerator", {
                                                                    className: "iran_sans_Bold text_muted"
                                                                })
                                                            } // handle innerHTML change
                                                            className="border-0 col-9 bg-white d-flex flex-wrap align-items-center text-center justify-content-center py-2 pwa_test_compute"
                                                            tagName="div"
                                                        />

                                                        <div
                                                            className="d-flex justify-content-center col-2 item_hidden_pwa">
                                                            <Popover
                                                                isOpen={numerator_help_popover}
                                                                position={["top", "right", "left", "bottom"]} // preferred position
                                                                padding={10}
                                                                onClickOutside={() =>
                                                                    this.setState({ numerator_help_popover: false })
                                                                }
                                                                content={({
                                                                    position,
                                                                    targetRect,
                                                                    popoverRect
                                                                }) => (
                                                                        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                                            position={position}
                                                                            targetRect={targetRect}
                                                                            popoverRect={popoverRect}
                                                                            arrowColor={"#1c94e0"}
                                                                            arrowSize={10}
                                                                        >
                                                                            <div className="bg-blue rounded p-4">
                                                                                <p className="text-center pb-1 text-white">
                                                                                    راهنمای صورت
                                                                            </p>
                                                                                <textarea
                                                                                    className={`form-control ${indicator.numerator_help.indexOf(
                                                                                        "\n"
                                                                                    ) >= 0
                                                                                        ? "rounded"
                                                                                        : "rounded-pill"
                                                                                        } border-0 `}
                                                                                    name="numerator_help"
                                                                                    value={indicator.numerator_help}
                                                                                    rows={
                                                                                        indicator.numerator_help.split("\n")
                                                                                            .length || 1
                                                                                    }
                                                                                    readOnly={true}
                                                                                />
                                                                            </div>
                                                                        </ArrowContainer>
                                                                    )}
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            numerator_help_popover: !numerator_help_popover
                                                                        });
                                                                    }}
                                                                    className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                                    style={{ width: 34, height: 34 }}
                                                                >
                                                                    <i className="fas fa-question text-white"></i>
                                                                </button>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="row align-items-center justify-content-center w-100 pl-sm-5">
                                                        <input
                                                            type="text"
                                                            className=" py-2 col-2 text-center pwa_test_compute"
                                                            name="multiplier"
                                                            readOnly={true}
                                                            value={indicator.multiplier}
                                                        />
                                                        <div className="text-center col-1 px-0">
                                                            <i className="fas fa-times"></i>
                                                        </div>
                                                        <div className="h-line col-12"></div>
                                                    </div>
                                                    <div className="row justify-content-end w-100 px-2">
                                                        <ContentEditable
                                                            innerRef={this.denumerator}
                                                            name="denumerator"
                                                            html={indicator.denumerator} // innerHTML of the editable div
                                                            disabled={true} // use true to disable edition
                                                            onChange={e =>
                                                                userActions.maskInput.call(
                                                                    this,
                                                                    e,
                                                                    "denumerator",
                                                                    { className: "iran-sans_Bold text-muted" }
                                                                )
                                                            } // handle innerHTML change
                                                            className="border-0 col-9 bg-white d-flex flex-wrap align-items-center justify-content-center py-2 pwa_test_compute"
                                                            tagName="div"
                                                        />
                                                        <div
                                                            className="d-flex justify-content-center col-2  item_hidden_pwa">
                                                            <Popover
                                                                isOpen={denumerator_help_popover}
                                                                position={["bottom", "left", "right", "top"]} // preferred position
                                                                padding={10}
                                                                onClickOutside={() =>
                                                                    this.setState({
                                                                        denumerator_help_popover: false
                                                                    })
                                                                }
                                                                content={({
                                                                    position,
                                                                    targetRect,
                                                                    popoverRect
                                                                }) => (
                                                                        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                                                                            position={position}
                                                                            targetRect={targetRect}
                                                                            popoverRect={popoverRect}
                                                                            arrowColor={"#1c94e0"}
                                                                            arrowSize={10}
                                                                        >
                                                                            <div className="bg-blue rounded p-4 ">
                                                                                <p className="text-center pb-1 text-white">
                                                                                    راهنمای مخرج
                                                                            </p>
                                                                                <textarea
                                                                                    className={`form-control ${indicator.denumerator_help.indexOf(
                                                                                        "\n"
                                                                                    ) >= 0
                                                                                        ? "rounded"
                                                                                        : "rounded-pill"
                                                                                        } border-0 `}
                                                                                    name="denumerator_help"
                                                                                    value={indicator.denumerator_help}
                                                                                    rows={
                                                                                        indicator.denumerator_help.split("\n")
                                                                                            .length || 1
                                                                                    }
                                                                                    readOnly={true}
                                                                                />
                                                                            </div>
                                                                        </ArrowContainer>
                                                                    )}
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            denumerator_help_popover: !denumerator_help_popover
                                                                        });
                                                                    }}
                                                                    className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                                    style={{ width: 34, height: 34 }}
                                                                >
                                                                    <i className="fas fa-question text-white"></i>
                                                                </button>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 justify-content-center text-center ">
                                                <label for="" class="rounded-pill  px-4 py-1  titleInput bg-white"
                                                    style={{ zIndex: "1" }}>حد مجاز</label>
                                                {indicator.target !== null || indicator.upper_limit !== null || indicator.lower_limit !== null ?
                                                    <div
                                                        className="pt-4 rounded box-border calculation-inputs flex-wrap d-flex justify-content-around col-12 py-2 my-1 px-0"
                                                        style={{ boxShadow: "unset" }}>

                                                        {indicator.target !== null && <div
                                                            className="d-flex flex-column align-items-center input-group-lg  col-4">
                                                            <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2 pwa_target_font">تارگت</h4>
                                                            <div className='text-center py-1 mt-1'>
                                                                {indicator.target}
                                                            </div>
                                                        </div>}

                                                        {indicator.upper_limit !== null && <div
                                                            className="d-flex flex-column align-items-center input-group-lg col-4">
                                                            <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2 pwa_target_font">حد
                                                                بالا</h4>
                                                            <div className='text-center py-1 mt-1'>
                                                                {indicator.upper_limit}
                                                            </div>
                                                        </div>}

                                                        {indicator.lower_limit !== null && <div
                                                            className="d-flex flex-column align-items-center input-group-lg col-4">
                                                            <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2 pwa_target_font">حد
                                                                پایین</h4>
                                                            <div className='text-center py-1 mt-1'>
                                                                {indicator.lower_limit}
                                                            </div>
                                                        </div>}

                                                    </div>
                                                    : ''}
                                            </div>


                                        </div>
                                    </div>
                                </>
                            )}
                            />
                        </>
                    )}
                </Modal>


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
                
                        {/*Insert Value */}

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
                                Records && (
                                    <form onSubmit={this.props.submit} className="p-4  text-right">
                                        <div className="container-fluid shadow rounded  py-2 pb-4 bg-white mt-5 ">
                                            <div style={{ position: "relative", bottom: "40px", right: "20px" }} className="row d-flex justify-content-center  p-3 ">
                                                <div
                                                    className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5  ">اطلاعات
                                                    پــایه
                        </div>
                                            </div>
                                            <div className="custom-select-box form-group text-right d-flex flex-column justify-content-center align-items-center">
                                                <label
                                                    className="color-dark text-iransansBold my-3"
                                                    style={{ fontSize: "0.8em" }}
                                                >
                                                    بخــش 
                                                </label>
                                                <Select
                                                    isSearchable={this.state.readOnly}
                                                    options={this.props.globalStorage.wards}
                                                    className="text-center custom-select-2 w-25"
                                                    isClearable
                                                    getOptionLabel={opt => opt.name}
                                                    getOptionValue={opt => opt._id}
                                                    onChange={userActions.handleChangeSelect.bind(this)}
                                                    value={this.state.ward}
                                                    name="ward"
                                                    autoFocus={false}
                                                    isMulti={false}
                                                    //   onChange={userActions.handleChangeSelect.bind(this)}
                                                    placeholder={"انتخاب کنید"}
                                                //   options={type_options}
                                                />
                                            </div>
                                            <div className="row d-flex justify-content-center p-3 ">
                                                {this.state.Infos.map((m, i) =>
                                                    <div className="col-lg-4  col-md-6 my-3 position-relative" key={i}>
                                                        <label htmlFor=""> {m.key}</label>
                                                        <div className="pt-2 pb-4 ">
                                                            <InputGenerator
                                                                readOnly={this.state.readOnly}
                                                                dispatch={this.props.dispatch}
                                                                type={m.item_type}
                                                                globalStorage={this.props.globalStorage}
                                                                placeholder={m.placeholder || m.place_holder}
                                                                options={m.options ? userActions.generateSelectLabelValue(m.options) : []}
                                                                onChange={(data) => {
                                                                    this.onChangeInfo(m, data)
                                                                }}
                                                                value={
                                                                        this.state.readOnly === true?
                                                                            m.value : m.item_type === "Select"
                                                                                ?  {label: m.value, value: m.value}
                                                                                : m.value}
                                                            />
                                                        </div>

                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        <br />
                                        <br />
                                        <div className="container-fluid shadow rounded  py-2 pb-4 bg-white ">
                                            {/* {this.props.report_type && this.props.checklist_info &&
                    <>
                        <div className="row d-flex justify-content-center titleVlaue p-3 ">
                            <div
                                className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5 ">
                                {this.props.report_type}
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center p-3  ">
                            <div className="col-lg-9 ">
                                <label htmlFor=""> عنـوان</label>
                                <input type="text-aria"
                                       className="form-control  border-0 rounded-pill  boxshadow py-4 bg-white" readOnly
                                       value={this.props.checklist_info.title}/>
                            </div>
                            <div className="col-lg-3 ">
                                <label htmlFor=""> شمــاره</label>
                                <input type="text-aria"
                                       className="form-control  border-0 rounded-pill boxshadow  py-4 bg-white" readOnly
                                       value={this.props.checklist_info.number}/>
                            </div>
                            <div className="col-lg-12 col-md-12 mt-4 text-right my-2 ">
                                <label htmlFor=""
                                       className="rounded-pill  px-4 py-1 titleInput bg-white"> توضیحات/هــدف</label>
                                <textarea className="inputCkeckList boxshadow border-0" cols="30" rows="10" readOnly
                                          value={this.props.checklist_info.description}></textarea>
                            </div>
                        </div>

                    </>
                    } */}
                                            <div className="container-fluid  ">
                                                {this.state.Records.map((record, i) =>
                                                    <div className="row py-5 " key={i}>
                                                        <p className="w-100 text-center text-justify iran-sans_Bold bg-blue rounded text-white py-1">{record.component !== 'default' ? record.component : ''}</p>
                                                        <div className="w-100 ">
                                                            <div className="question-table text-center " >
                                                                <div className="question-title d-flex mx-2 py-2" style={{ minWidth: '1100px' }}>
                                                                    <div className="width-5 text-center  iran-sans_Bold ">ردیف</div>
                                                                    <div className="w-70 text-center iran-sans_Bold">موارد مورد بررسی (سوالات)
                                            </div>
                                                                    {this.state.Guides.map((guide, j) =>
                                                                    <>
                                                                        <div key={j}
                                                                            data-tip={guide.guide} data-for={`data-${j}`}
                                                                            className="text-center iran-sans_Bold align-self-center rotate-90 "
                                                                            style={{
                                                                                width: (25 / this.state.Guides.length) + '%',
                                                                                fontSize: "1em"
                                                                            }}>{guide.value}</div>
                                                                            <ReactTooltip id={`data-${j}`} />
                                                                    </>
                                                                    )}

                                                                </div>
                                                                <div className="contents flex-column d-flex mx-2" style={{ minWidth: '1100px' }}>
                                                                    {
                                                                        record.questions.map((question, q_i) => {
                                                                            return (
                                                                                <div key={q_i} className="row mx-0   " >
                                                                                    <div className="width-5 text-center text-iransans py-1 ">
                                                                                        <p className={`${q_i % 2 && "question-row"} shadow-sm mx-1 my-0 py-3 text-center CustomHeight`}>{q_i + 1}</p>
                                                                                    </div>

                                                                                    <div
                                                                                        className={` text-center text-iransans py-1 ${question.point_type == 'سوال باز' ? 'width-95' : 'w-70'} `}>
                                                                                        <p className={`${q_i % 2 && "question-row "} shadow-sm mx-1 my-0 py-2 text-center CustomHeight`}>
                                                                                            {question.key}
                                                                                        </p>
                                                                                    </div>
                                                                                    {this.state.Guides.map( (guide, j) => {
                                                                                            if (question.point_type !== 'سوال باز') {
                                                                                               return <label key={j}
                                                                                                    className={`m-0 d-flex justify-content-center text-center text-iransans    position-relative  `}
                                                                                                    style={{ width: (25 / this.state.Guides.length) + '%' }}>
                                                                                                    <input type="checkbox"
                                                                                                        className="d-none"
                                                                                                        name={i + '-' + q_i}
                                                                                                        value={question.value === null ? undefined : question.value}
                                                                                                        onChange={(e) => {
                                                                                                            this.setAnswer(e, question, j, guide)
                                                                                                        }}
                                                                                                        disabled={this.state.readOnly}
                                                                                                    />
                                                                                                    <i className={`fa-2x fal ${guide.value == question.value ? 'fa-check text-success' : ''} ${q_i % 2 ? "question-row " : ''} shadow-sm mx-1 my-0 py-3 w-100 text-center `}></i>
                                                                                                    <span className="hint">{guide.value}</span>
                                                                                                </label>
                                                                                            }
                                                                                        }
                                                                                    )}
                                                                                    {question.point_type == 'سوال باز' &&
                                                                                            <textarea
                                                                                                className="border-0 form-control mb-5 mt-2 p-5 shadow w-100"
                                                                                                name={i + '-' + q_i}
                                                                                                value={question.value}
                                                                                                onChange={(e) => {
                                                                                                    this.setAnswer(e, question, null, null, e.target.value )
                                                                                                }}
                                                                                                readOnly={this.state.readOnly}
                                                                                            ></textarea>
                                                                                            }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }

                                                                </div>
                                                                {/* 
                                            }).map((question, h) =>
                                                
                                                    
                                                    
                                                    
                                                    {question.question_type == 'سوال باز'
                                                    &&
                                                    <textarea
                                                        className="border-0 form-control mb-5 mt-2 p-2 shadow-sm w-100"
                                                        name={i + '-' + h}
                                                        value={question.answer}
                                                        onChange={(e) => {
                                                            this.props.setAnswer(e, question)
                                                        }}
                                                        readOnly={this.props.readOnly}
                                                    ></textarea>
                                                    }
                                                </div>
                                            )}

                                        </div> */}

                                                            </div>

                                                        </div>
                                                    </div>
                                                )}


                                            </div>


                                            {/* <div className="row justify-content-center pb-4 mt-4">
                        {this.props.submit &&
                        <button type="submit" className="btn btn-blue rounded-pill    mx-4 my-1 col-sm-5">ثبت</button>}
                        <button onClick={this.props.closeModal} type="reset"
                                className="btn btn-outline-blue rounded-pill    mx-4 my-1 col-sm-5">انصراف
                        </button>
                    </div> */}
                                        </div>
                                        <div className="d-flex justify-content-center py-5">
                                            {
                                                this.state.readOnly !== true && 
                                                <>
                                                    <button onClick={(e) => this.submitChecklist(e, false)} className="btn btn-blue rounded-pill    mx-4 my-1 col-sm-3">ثبت</button>
                                                    <button  onClick={(e) => this.submitChecklist(e, true)} className="btn btn-outline-blue  rounded-pill    mx-4 my-1 col-sm-3">ثبت موقت</button>
                                                </>
                                            }
                                            <button className="btn btn-outline-blue rounded-pill col-sm-3"
                                                onClick={this.closeDetailRecords}>
                                                بازگشت
                                            </button>
                                        </div>
                                    </form>
                                )
                            }



                            
                        </div>
                    </div>

                </Modal>
        
            </>
        );
    }
}

const CheckListPageComponent = connect(state => ({
    globalStorage: state.globalStorage
}))(CheckListPage);
export { CheckListPageComponent };
