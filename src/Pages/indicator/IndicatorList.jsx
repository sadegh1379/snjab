import React from 'react';
import Select from 'react-select';
import Modal from "react-modal";
import {connect} from 'react-redux';
import {userActions} from "../../_actions";
import {AdminMessage, HospitalTable} from "../../_components";
import {Routes} from "../../_components";
import gaugeIcon from '../../assets/images/gauge.png';
import SEARCH_ICON from '../../assets/images/search-var-flat.png';
import {Print, SelectCollector, SelectMonitor} from "./components"
import Loading from '../../assets/images/loading_2.gif';
import {userConstants} from "../../_constants";
import ContentEditable from 'react-contenteditable'
import Popover,{ArrowContainer} from 'react-tiny-popover'
import edit from '../../assets/images/edit.png'
import trash from '../../assets/images/trash.png'
import printer  from '../../assets/images/printer (1).png'
import ersal from '../../assets/images/ersal.png'
import concept from '../../assets/images/concept.png'
import document from '../../assets/images/document.png'
import excel from '../../assets/images/excel.png'
import del from '../../assets/images/delete.png'
import checklist from '../../assets/images/checklist.png'
import { ActionCableConsumer, ActionCableProvider } from 'react-actioncable-provider';


Modal.setAppElement('#root');

class IndicatorList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
            numerator_help_popover:false,
            denumerator_help_popover:false,
            advance_search: false,
            loader: null,
            indicator_type: '',
            indicator_types: userActions.generateSelectLabelValue(['پیامدی', 'ساختاری', 'فرآیندی']),
            desirability: '',
            desirabilities: userActions.generateSelectLabelValue(['افزاینده', 'کاهنده']),
            keyword: '',
            query: props.globalStorage.lastList?props.globalStorage.lastList.query:'',
            status: '',
            statuses: [{label: 'ارسـال شده', value: true}, {label: 'ارسـال نشده', value: false}],
            ward: '',
            sources_1: '',
            sources_2: '',
            safety_related: '',
            per_page: 24,
            modal1: false,
            table: {
                headers: [
                    {
                        title: 'ردیف',
                        getData: (item, index) => {
                            return (((parseInt(this.state.page) - 1) * this.state.per_page) + 1) + index;


                        },
                        style: {
                            width: '5%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                            padding:'10px',
                        }
                    }, {
                        title: 'عنوان شـاخص',
                        getData: (item, index) => {
                            return item.title;
                        },
                        style: {
                            width: '23%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {

                        // حالتی که دکمه ارسال نشده عملیات ارسال به مسئولین از مودال را انجام میده
                        // title: 'وضعیت شاخص',
                        // getData: (item, index) => {
                        //     return item.send_to_kartabl ?
                        //         <span className="px-4 py-1 rounded-pill border-inherit border text-success iran-sans_Bold">ارسـال شده</span> :
                        //         <button className="px-4 py-1 rounded-pill border-inherit border text-danger iran-sans_Bold" onClick={() => this.sendIndicator(item)}>ارسـال نشده</button>;
                        // },
                        title: 'وضعیت شـاخص',
                        getData: (item, index) => {
                            return item.send_to_kartabl ?
                                <span
                                    className="px-4 py-1 rounded-pill  iran-sans_Bold" style={{background:'#5bb247',color:'#ffffff',fontSize:'13px'}}>ارسـال شده</span>
                                :
                                <span
                                     className="px-4 py-1 rounded-pill  iran-sans_Bold" style={{background:'#ff0000',color:'#ffffff',fontSize:'13px'}}>ارسـال نشده </span>
                                ;
                        },
                        style: {
                            width: '10%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'واحـد مربوطـه',
                        getData: (item, index) => {
                            return item.main_ward_name;
                        },
                        style: {
                            width: '15%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'مسئولین جمـع آوری',
                        getData: (item, index) => {
                            return <SelectCollector iconWidth={40} indicatorId={item.id}/>;
                        },
                        style: {
                            width: '11%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'مسئولیـن پایش',
                        getData: (item, index) => {
                            return <SelectMonitor iconWidth={40} indicatorId={item.id}/>;
                        },
                        style: {
                            width: '11%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'دوره تنـاوب',
                        getData: (item, index) => {
                            return item.measure_interval;
                        },
                        style: {
                            width: '8%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'تارگت',
                        getData: (item, index) => {
                            return item.target;
                        },
                        style: {
                            width: '4%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'حـد پاییـن',
                        getData: (item, index) => {
                            return item.lower_limit;
                        },
                        style: {
                            width: '4%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'حـد بـالا',
                        getData: (item, index) => {
                            return item.upper_limit;
                        },
                        style: {
                            width: '4%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }, {
                        title: 'عملیـات',
                        getData: (item, index) => {
                            return <button className="btn btn-blue  rounded-pill px-2  w-75" style={{padding:'10px',fontSize:'12px'}} onClick={() => {
                                this.detailIndicatorModal(item)
                            }
                            }>عملیات</button>;
                        },
                        style: {
                            width: '5%',
                            fontFamily:'iransansBold',
                            fontSize:'12px',
                        }
                    }
                ],
            },
            indicators: [],
            page: props.globalStorage.lastList?props.globalStorage.lastList.page:1,
            orderBy: props.globalStorage.lastList?props.globalStorage.lastList.orderBy:'created_at',
            count: 0
        }
        this.detailIndicatorModal = this.detailIndicatorModal.bind(this)
    }

    numerator = React.createRef();
    denumerator = React.createRef();

    componentDidMount() {
        if (!this.props.globalStorage.wards.length) {
            this.props.dispatch(userActions.getWards())
        }
        if (!this.props.globalStorage.users.length && this.props.globalStorage.me) {
            this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
        }


        // this.getCountIndicator();
        this.getIndicator(1);
        this.props.dispatch(userActions.getHospitals(false));
    }
   /* getCountIndicator=()=>{
        this.props.dispatch(userActions.API('get', `v2/indicator/count?year=${this.props.globalStorage.year}`)).then(res => {
            this.setState({count: res.data.count});
        })
    }*/


    openDetailModal = (id) => {
        this.get_indicator(id)
        this.setState({detailModal: true});
    };
    closeDetailModal = () => {
        this.setState({detailModal: false});
    };

    async detailIndicatorModal(indicator) {
        if (indicator) {

            const res = await this.props.dispatch(userActions.API('get', `/v2/get_indicator_collectors?indicator_id=${indicator.id}`, null, false));
            indicator.collectors = res.data.collectors;
            const res2 = await this.props.dispatch(userActions.API('get', `/v2/get_indicator_monitors?indicator_id=${indicator.id}`, null, false));
            indicator.monitors = res2.data.monitors;
            const formula_res = await this.props.dispatch(userActions.API('get', `/v2/get_indicator_formula?indicator_id=${indicator.id}`, null, false));
            indicator.formula = formula_res.data.formula;
            if (indicator.formula) {
                indicator.formula.numerator_formated = '';
                if (indicator.formula.numerator)
                    indicator.formula.numerator.map((n, i) => {
                        const opt = indicator.formula.numerator_operators[i];

                        indicator.formula.numerator_formated += n;
                        if (opt) {
                            indicator.formula.numerator_formated += opt;
                        }
                    });

                indicator.formula.denumerator_formated = '';
                if (indicator.formula.denumerator)
                    indicator.formula.denumerator.map((n, i) => {
                        const opt = indicator.formula.denumerator_operators[i];

                        indicator.formula.denumerator_formated += n;
                        if (opt) {
                            indicator.formula.denumerator_formated += opt;
                        }
                    });
            }
            this.setState({indicator, modal1: true})
        }

    }

    cacheIndicatorList=()=>{
        const {page,orderBy,query}=this.state;
        this.props.dispatch(userActions.setTemp({page,orderBy,query},'lastList'))
    }
    editIndicator = () => {
        this.cacheIndicatorList();
        const {indicator} = this.state;
        this.props.history.push(`/indicator/list/edit/${indicator.id}`);
    }
    checklistIndicator = () => {
        this.cacheIndicatorList();
        const {indicator} = this.state;
        this.props.history.push(`/indicator/list/checklist/${indicator.id}`);
    }
    detailIndicator = () => {
        this.cacheIndicatorList();
        const {indicator} = this.state;
        this.props.history.push(`/indicator/list/detail/${indicator.id}`);
    }
    getIndicator = (page, query) => {
        if (query) {
            const q = this.state.query;
            if (q.indexOf(query.split('=')[0]) === -1) {
                query += q;
            }
            this.setState({query})
        } else {
            query = this.state.query;
        }

        const {orderBy} = this.state;
        const loader = <img src={Loading} className="d-block m-auto" alt="در حال پردازش اطلاعات" width={200}/>;
        this.setState({loader,indicators:[]}, () => {
            this.props.dispatch(userActions.API('get', `/v2/get_indicator_list?year=${this.props.globalStorage.year}&page=${page}&perpage=${this.state.per_page}&order=${orderBy}${query}`, null, false)).then(res => {
                this.setState({page, indicators: res.data.result, loader: undefined,count:res.data.meta.records_count});
            })
        })

    }

    getExcel=(id)=>{
        this.props.dispatch(userActions.API('post','/v2/indicator/export_excel',{id})).then(res=>{
            window.open(userConstants.SERVER_URL_2+res.data.url,"_blank")

        })
    }
    deleteIndicator = () => {
        const {indicator, indicators} = this.state;
        this.props.dispatch(userActions.question('حذف شاخص', 'آیا از حذف شاخص مطمئن هستید؟')).then(r => {
            if (r.value) {
                this.props.dispatch(userActions.API('get', `/v2/delete_indicator?indicator_id=${indicator.id}`)).then(res => {
                    const i = indicators.indexOf(indicator);
                    indicators.splice(i, 1);
                    this.setState({indicators});
                    this.closeModal();
                });
            }
        })
    }
    sendIndicator = () => {
        const {indicator, indicators} = this.state;
        this.props.dispatch(userActions.question('ارسال شاخص', 'آیا تمایل به ارسال این شاخص برای مسئولین جمع آوری و پایش دارید؟')).then(r => {
            if (r.value) {
                this.props.dispatch(userActions.API('put', `/v2/send_indicator_to_responsibles?indicator_id=${indicator.id}`)).then(res => {
                    const i = indicators.indexOf(indicator);
                    indicators[i].send_to_kartabl = true;
                    this.setState({indicators});
                    userActions.successToast(res.data.message);
                    this.closeModal();
                });
            }
        })
    }
    closeModal = () => {
        this.setState({modal1: false, indicator: null})
    }
    print = () => {

    }
    searchByQuery = (query) => {
        this.getIndicator(1, '&by_query=' + query);
    }
    searchByWard = (ward) => {
        if (ward) {
            this.getIndicator(1, '&by_ward=' + ward._id);
        } else {
            this.getIndicator(1, '&by_ward=');
        }
    }
    searchBySaftyRelated = (safty_related) => {
        this.getIndicator(1, `&by_safty=${safty_related ? 'true' : ''}`);
    }
    searchByUser = (user) => {
        if (user) {
            this.getIndicator(1, `&by_collector=${user.id}` );
        } else {
            this.getIndicator(1, `&by_collector=`);
        }
    }
    searchByIndicatorType = (indicator_type) => {
        if (indicator_type) {
            this.getIndicator(1, `&by_indicator_type=${indicator_type.value}`);
        } else {
            this.getIndicator(1, `&by_indicator_type=`);
        }
    }
    searchByDesirability = (desirability) => {
        if (desirability) {
            this.getIndicator(1, `&by_desirability=${desirability.value}`);
        } else {
            this.getIndicator(1, `&by_desirability=`);
        }
    }
    searchByStatus = (status) => {
        if (status) {
            this.getIndicator(1, `&by_status=${status.value}`);
        } else {
            this.getIndicator(1, `&by_status=`);
        }
    }
    searchBySource_1 = (source) => {
        if (source) {
            this.getIndicator(1, `&by_source=${this.state.sources_2 ? ['الزامی (دانشگاه)', 'اختیاری (بیمارستان)'] : ['اختیاری (بیمارستان)']}`);
        } else {
            this.getIndicator(1, `&by_source=${this.state.sources_2 ? ['الزامی (دانشگاه)'] : ''}`);
        }
    }
    searchBySource_2 = (source) => {
        if (source) {
            this.getIndicator(1, `&by_source=${this.state.sources_1 ? ['الزامی (دانشگاه)', 'اختیاری (بیمارستان)'] : ['الزامی (دانشگاه)']}`);
        } else {
            this.getIndicator(1, `&by_source=${this.state.sources_1 ? ['اختیاری (بیمارستان)'] : ''}`);
        }
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


    getExcelWardCompare = (id) => {
        this.props.dispatch(userActions.API('post','v2/indicator/ward_compare_excel ',{id})).then(res=>{
            this.props.dispatch(userActions.start_request())
            setTimeout(() => {
                window.open(userConstants.SERVER_URL_2+res.data.url,"_blank");
                this.props.dispatch(userActions.finish_request());
            }, 60000)
            
        })
    }

    getFormulaExcel = (id) => {
        this.props.dispatch(userActions.API('get',`v2/indicator/formula_excel?id=${id}`)).then(res=>{
            this.props.dispatch(userActions.start_request())
            setTimeout(() => {
                window.open(userConstants.SERVER_URL_2+res.data.url,"_blank");
                this.props.dispatch(userActions.finish_request());
            }, 20000)
            
        })
    }
    onInitialized  = () => {
        console.log("WS INIT");
    }

    onRejected = (e) => {
        console.log("WS REJECTED",e);
    }

    onConnected  = () => {
        console.log("WS CONNECTED");
    }

    onDisconnected  = () => {
        console.log("WS DISCONNECTED");
    }

    handleReceived = (msg) => {
        console.log(msg)
    }

    render() {
        const {modal1, indicator_data, advance_search, indicator, per_page, loader, ward, keyword, status, statuses, desirabilities, desirability, indicator_types, indicator_type, sources_1, sources_2, safety_related,
            count,
            numerator_help_popover,
            denumerator_help_popover,
        
        } = this.state;
        console.log(this.props.globalStorage)
        return (
    // <ActionCableProvider url={"wss://etebarbakhshii.ir/cable"}>
    //     <ActionCableConsumer
    //         channel={`EopChannel_${this.props.globalStorage.me.id}`}
    //         onInitialized={this.onInitialized}
    //         onConnected={this.onConnected}
    //         onDisconnected={this.onDisconnected}
    //         onRejected={this.onRejected}
    //         onReceived={this.handleReceived}
    //         >
            <div className="content bg-light bg-drr py-3 px-3 pb-5">
                <Routes page="indicator/list"/>
                <div className="container-fluid">
                    <div className="note bg-white my-5 mx-sm-5 mx-3">
                        <AdminMessage/>
                    </div>
                    <div className="note bg-white mx-sm-5 mx-3 py-3">
                        <div className="row  ">
                            <div className="col-lg-10 m-auto  ">
                                <div className="form-group mt-3 ">
                                    <input type="text"
                                           name="keyword"
                                           value={keyword}
                                           onChange={e => userActions.handleChangeInput.call(this, e, this.searchByQuery)}
                                           className="form-control rounded-pill border-0 py-4   text-center text-blue"
                                           placeholder="نـام و کـد شـاخص، بخش هـای مرتبط و یـا هر یک از مشخصـه هـای شـاخص را وارد کنیـد"/>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-center my-4 " onClick={() => {
                            this.setState({advance_search: !advance_search})
                        }}>
                            <div className="bg-blue w-25 my-3" style={{height:'2px'}}></div>
                            <button  className="btn btn-link px-3 py-0"><img src={SEARCH_ICON} alt="" width="40" height="40"/></button>
                            <div className="bg-blue w-25 my-3" style={{height:'2px'}}></div>
                        </div>
                        {advance_search && <div className="animated fadeIn">
                            <div className="d-flex justify-content-center px-sm-5 ">
                                <div className="col-md-4  col-sm-8  ">
                                    <div className="select-wrapper">
                                        <div className="form-group text-right ">
                                            <label className="iran-sans_Bold text-right  py-2" style={{fontSize:'12px'}}>بخش یا واحد</label>
                                            <Select className="text-justify custom-select-2"
                                                    value={ward}
                                                    name="ward"
                                                    placeholder=""
                                                    onChange={(value, data) => userActions.handleChangeSelect.call(this, value, data, null, null, this.searchByWard)}
                                                    isClearable
                                                    options={this.props.globalStorage.wards}
                                                    getOptionLabel={opt => opt.name}
                                                    getOptionValue={opt => opt._id}
                                                    id="ward"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className=" col-md-4   col-sm-8  ">
                                    <div className="select-wrapper">
                                        <div className="form-group text-right ">
                                            <label className="iran-sans_Bold text-right  py-2" style={{fontSize:'12px'}}>نـوع شاخص</label>
                                            <Select className="text-justify custom-select-2"
                                                    value={indicator_type}
                                                    name="indicator_type"
                                                    placeholder=""
                                                    onChange={(value, data) => userActions.handleChangeSelect.call(this, value, data, null, null, this.searchByIndicatorType)}
                                                    isClearable
                                                    options={indicator_types}
                                                    getOptionLabel={opt => opt.label}
                                                    getOptionValue={opt => opt.value}
                                                    id="indicator_type"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" d-flex justify-content-center px-sm-5 my-3">
                                <div className="  col-md-4  col-sm-8  ">
                                    <div className="select-wrapper">
                                        <div className="form-group text-right ">
                                            <label className="iran-sans_Bold text-right  py-2" style={{fontSize:'12px'}}> مطلوبیت</label>
                                            <Select className="text-justify custom-select-2"
                                                    value={desirability}
                                                    name="desirability"
                                                    placeholder=""
                                                    onChange={(value, data) => userActions.handleChangeSelect.call(this, value, data, null, null, this.searchByDesirability)}
                                                    isClearable
                                                    options={desirabilities}
                                                    getOptionLabel={opt => opt.label}
                                                    getOptionValue={opt => opt.value}
                                                    id="desirability"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="  col-md-4  col-sm-8  ">
                                    <div className="select-wrapper">
                                        <div className="form-group text-right ">
                                            <label className="iran-sans_Bold text-right py-2" style={{fontSize:'12px'}}> وضعیت</label>
                                            <Select className="text-justify custom-select-2"
                                                    value={status}
                                                    name="status"
                                                    placeholder=""
                                                    onChange={(value, data) => userActions.handleChangeSelect.call(this, value, data, null, null, this.searchByStatus)}
                                                    isClearable
                                                    options={statuses}
                                                    getOptionLabel={opt => opt.label}
                                                    getOptionValue={opt => opt.value}
                                                    id="status"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" d-flex justify-content-center px-sm-5 my-3">
                                <div className="col-md-4  col-sm-8  ">
                                    <div className="select-wrapper">
                                        <div className="form-group text-right ">
                                            <label className="iran-sans_Bold text-right  py-2" style={{fontSize:'12px'}}>مسئـول جمع آوری</label>
                                            <Select className="text-justify custom-select-2"
                                                    value={this.state.selectedUser}
                                                    name="selectedUser"
                                                    placeholder=""
                                                    onChange={(value, data) => userActions.handleChangeSelect.call(this, value, data, null, null, this.searchByUser)}
                                                    isClearable
                                                    options={this.props.globalStorage.users}
                                                    getOptionLabel={opt => opt.fn + " " + opt.ln}
                                                    getOptionValue={opt => opt.id}
                                                    // id="status"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center BOXS my-4">
                                <div className="my-2 mx-1">
                                    <div className=" border  rounded shadow-sm mx-sm-1  IndexS Traingle-gradient ">
                                        <button className={`btn py-4  p-3  ${sources_1 ? 'ActiveState' : ''}`}
                                                style={{width: '100%', height: '100%'}} onClick={() => {
                                            userActions.toggleState.call(this, 'sources_1',null,null, this.searchBySource_1)
                                        }}>
                                            <span className="text-blue text-center mt-2 iran-sans_Bold d-block h6">شاخص
                                                های </span>
                                            <span className="text-blue text-center mt-4 iran-sans_Bold d-block h5">
                                                اختیـــاری</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="my-2 mx-1">
                                    <div className=" border  rounded shadow-sm mx-sm-1 Traingle-gradient  IndexS">
                                        <button className={`btn py-4  p-3  ${sources_2 ? 'ActiveState' : ''}`}
                                                style={{width: '100%', height: '100%'}} onClick={() => {
                                            userActions.toggleState.call(this, "sources_2",null,null, this.searchBySource_2)
                                        }}>
                                            <span className="text-blue text-center mt-2 iran-sans_Bold d-block h6">شاخص
                                                های </span>
                                            <span className="text-blue text-center mt-4 iran-sans_Bold d-block h5">
                                                الــزامی</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="my-2 mx-1 ">
                                    <div className="border  rounded shadow-sm mx-sm-1 Traingle-gradient IndexS  ">
                                        <button className={`btn py-4  p-3  ${safety_related ? 'ActiveState' : ''}`}
                                                onClick={() => {
                                                    userActions.toggleState.call(this, 'safety_related',null,null, this.searchBySaftyRelated)
                                                }}
                                                style={{width: '100%', height: '100%'}}>
                                            <span className="text-blue text-center mt-2 iran-sans_Bold d-block h6">شاخص
                                                های </span>
                                            <span className="text-blue text-center mt-4 iran-sans_Bold d-block h5">ایمنی
                                                بیمار</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="note bg-white my-5 mx-sm-5 mx-3 py-4 iran-sans_Bold" >
                        {count>0 && <HospitalTable
                            totalPage={Math.ceil(count / per_page)}
                            active={this.state.page}
                            title=" لیست شـاخص هـای ثبت شده در بیمـارستـان"
                            rows={this.state.indicators}
                            headers={this.state.table.headers}
                            pageOnChange={this.getIndicator}
                            loader={loader}
                        />}
                    </div>
                </div>

                <Modal
                    isOpen={modal1}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}

                    contentLabel="operator Modal"
                    portalClassName="full_screen_modal"
                >

                    {indicator && <div className="indicator_operation bg-white container">


                        <div className="bg-secondary row ">
                            <p style={{fontSize:'13px',paddingTop: '11px' }} className="text-center iran-sans_Bold text-white   w-100" >عملیـات شـاخص</p>
                        </div>

                        <div className="content ">

                            <div className="container-fluid">
                                <div className="operation-items row justify-content-center py-md-5 py-2">
                                    {indicator && (indicator.report_type == 'پرسشنامه' || indicator.report_type == 'چک لیست') == true ? (
                                        <>
                                            <div
                                                className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                                <button className="btn text-white p-3"
                                                        onClick={this.checklistIndicator}>
                                                    <img style={{width:70}} src={checklist} alt="checklist"/>

                                                </button>
                                                <span className="iran-sans_Bold my-2">مشاهده {indicator.report_type}</span>
                                            </div>
                                        {indicator.send_to_kartabl && indicator.measure_interval == "ماهانه" &&
                                        <div
                                                className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                                <button className="btn text-white p-3"
                                                        onClick={()=>this.getExcelWardCompare(indicator.id)}>
                                                    <img style={{width:70,}} src={excel} alt="excel"/>
                                                </button>
                                                <span className="iran-sans_Bold my-2" >خروجـی اکسـل</span>
                                            </div>}
                                        </>) : indicator.send_to_kartabl && (
                                            <div
                                            className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                            <button className="btn text-white p-3"
                                                    onClick={()=>this.getFormulaExcel(indicator.id)}>
                                                <img style={{width:70,}} src={excel} alt="excel"/>
                                            </button>
                                            <span className="iran-sans_Bold my-2" style={{fontSize:'13px'}}>خروجـی اکسـل</span>
                                        </div>
                                        ) 

                                    }
                                    

                                    <div
                                        className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                        <button className="btn text-white p-3"
                                                onClick={() => this.openDetailModal(indicator.id)}>
                                            <img style={{width:70,}} src={concept} alt="edit"/>
                                        </button>
                                        <span className="iran-sans_Bold text-center my-2" style={{fontSize:'13px'}}>شنـاسنـامـه شـاخص</span>
                                    </div>
                                    <div
                                        className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                        <button className="btn text-white p-3"
                                                onClick={this.editIndicator}>
                                            <img style={{width:70,}} src={edit} alt="edit"/>
                                        </button>
                                        <span className="iran-sans_Bold text-center my-2" style={{fontSize:'13px'}}>ویرایش شنـاسنـامـه </span>
                                    </div>
                                    {!indicator.send_to_kartabl &&
                                    <div
                                        className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                        <button className="btn text-white p-3"
                                                onClick={this.sendIndicator}>
                                            <img style={{width:70,}} src={ersal} alt="ersal"/>

                                        </button>
                                        <span className="iran-sans_Bold my-2" style={{fontSize:'13px'}}>ارسـال بـه مسئـولیـن</span>
                                    </div>}
                                    <div
                                        className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                        <button className="btn text-white p-3"
                                                onClick={this.detailIndicator}>
                                            <img style={{width:70,}} src={document} alt="doucment"/>
                                        </button>
                                            <span className="iran-sans_Bold my-2" style={{fontSize:'13px'}}>مشـاهـده وضعیت</span>
                                    </div>

                                    {/*<div*/}
                                    {/*    className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">*/}
                                        {/* <ReactToPrint
                                                trigger={() =>
                                                    <button className="btn btn-blue text-white p-3"

                                                          ><i
                                                        className="d-block fal fa-print fa-2x"
                                                        style={{width: 40, height: 40}}></i>

                                                    </button>

                                                }
                                                content={() => this.printRef}
                                            />*/}
                                        {/*  <ReactToPdf targetRef={this.printRef} filename={indicator.title+'.pdf'}>
                                                {
                                                    ({toPdf,targetRef})=>(
                                                        <button onClick={toPdf}  className="btn btn-blue text-white p-3" ><i
                                                            className="d-block fal fa-print fa-2x"
                                                            style={{width: 40, height: 40}}></i></button>
                                                    )
                                                }

                                            </ReactToPdf>*/}
                                    {/*    <button onClick={() => this.props.dispatch(userActions.print(this.printRef, indicator.title))}*/}
                                    {/*            className="btn text-white p-3">*/}
                                    {/*        <img style={{width:70,}} src={printer} alt="printer"/>*/}

                                    {/*    </button>*/}
                                    {/*    <span className="iran-sans_Bold my-2">چاپ</span>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="row d-flex justify-content-center">
                                    <div
                                        className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                        <button onClick={() => this.props.dispatch(userActions.print(this.printRef, indicator.title))}
                                                className="btn text-white p-3">
                                            <img style={{width:70,}} src={printer} alt="printer"/>
                                        </button>
                                        <span className="iran-sans_Bold my-2" style={{fontSize:'13px',color:'#595755'}}>چـاپ</span>
                                    </div>
                                    <div
                                        className="operation-item d-flex flex-column align-items-center col-xl-2 col-lg-3 col-md-6">
                                        <button className="btn text-white p-3"
                                                onClick={this.deleteIndicator}>
                                            <img style={{width:70,}} src={del} alt="trash"/>
                                        </button>
                                        <span className="iran-sans_Bold my-2" style={{fontSize:'13px',color:'#595755'}}>حذف شـاخص</span>
                                    </div>
                                </div>

                            </div>
                            <br></br>
                            <div className="container-fluid pb-5">
                                <div className="row justify-content-center my-4">
                                    <button
                                        className="btn btn-secondary rounded-pill iran-sans_Bold  mx-3 mt-4 my-1" style={{minWidth:'300px',fontSize:'14px',padding:'10px'}}
                                        onClick={this.closeModal}>بازگشت
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                    }
                </Modal>

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


                <div className={modal1 ? '' : 'd-none'} style={{zIndex: -999, position: 'fixed'}}>
                    <div ref={el => (this.printRef = el)}>
                        <Print indicator={indicator}
                               hospital={this.props.globalStorage.hospitals.find(h => h.id === this.props.globalStorage.me.hospital_id)}/>
                    </div>
                </div>

            </div>
        // </ActionCableConsumer>
        // </ActionCableProvider>
        )
    }
}

const IndicatorListComponent = connect((state) => ({globalStorage: state.globalStorage}))(IndicatorList);
export {IndicatorListComponent};
