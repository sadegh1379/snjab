import React from 'react';
import moment from 'jalali-moment';
import {globalStorage} from "../../_reducers/globalStorage.reducer";
import {connect} from 'react-redux';
import {userActions} from "../../_actions";
import {OPERATOR_REGEX} from "../../_constants";
import {ToggleBotton, FormHeader, AdminMessage} from "../../_components";
import {Routes} from "../../_components";
import addIcon from '../../assets/images/add.png';
import {Breadcrumbs, BreadcrumbsItem} from 'react-breadcrumbs-dynamic';
import {Step1, Step2, Step3, Step4, Step5} from './create';
import {Prompt} from 'react-router-dom';
import * as _ from "lodash";

let createCanceled = false;

class IndicatorCreate extends React.Component {
    componentWillUnmount() {
        createCanceled = true;

    }

    constructor(props) {
        super(props);
        this.state = {
            currentPart: 1,
            indicator_id: "",
            save: true,

            indicator: {
                items:[],
                selectedItems:[],
                indicator_id: '',
                ward_id: '',
                indicator_type: '',
                indicator_types: userActions.generateSelectLabelValue(['پیامدی', 'ساختاری', 'فرآیندی']),
                edit_date: '',
                creation_date: '',
                title: '',
                logical_reasons_of_collecting: '',
                definition: '',
                code: '',
                numerator: '',
                denumerator: '',
                target: '',
                upper_limit: '',
                lower_limit: '',
                multiplier: '',
                ward_list: '',
                numerator_help: "",
                numerator_indicator_id: "",
                denumerator_help: "",
                denumerator_indicator_id: "",
                numerator_help_popover: false,
                denumerator_help_popover: false,
                formula: {},
                quality_dimension: [],
                quality_dimensions: userActions.generateSelectLabelValue(['ایمنی', 'به موقع بودن خدمات', 'اثربخشی', 'کارایی', 'عدالت', 'بیمار محوری', 'رضایتمندی']),
                desirability: '',
                desirabilities: userActions.generateSelectLabelValue(['افزاینده', 'کاهنده']),
                measurement_unit: '',
                other_measurement_unit: '',
                measurement_units: userActions.generateSelectLabelValue(['متر', 'لیتر', 'دقیقه', 'درصد', 'ساعت', 'دفعه', 'روز', 'تعداد', 'کیلوگرم', 'تومان', 'در هزار', 'سایر موارد']),
                report_type: '',
                other_report_type: '',
                report_types: userActions.generateSelectLabelValue(['چک لیست', 'پرسشنامه', 'HIS', 'سایر موارد']),
                basis: '',
                basises: userActions.generateSelectLabelValue(['عملکردی', 'فرآیندهای اصلی', 'برنامه ای', 'عملکردی-فرآیندهای اصلی', 'عملکردی-برنامه ای', 'برنامه ای-فرآیندهای اصلی', 'مقطعی', 'برنامه استراتژیک'
                    ,
                    'برنامه بهبود کیفیت'
                    ,
                    'مطالبات سازمان‌های بالا دستی'
                    ,
                    'مطالبات مدیریتی و فرآیندهای اصلی']),
                aspect: '',
                aspectes: userActions.generateSelectLabelValue(['بالینی', 'غیربالینی', 'مدیریتی']),
                source: '',
                other_source: '',
                sources: userActions.generateSelectLabelValue(['الزامی (دانشگاه)', 'اختیاری (بیمارستان)', 'سایر موارد']),
                score_card_aspect: '',
                score_card_aspects: userActions.generateSelectLabelValue(['جامعه و عرضه خدمات', 'مالی', 'فرآیندهای داخلی', 'رشد و یادگیری']),
                measure_interval: '',
                delivery_date_respite: '',
                safety_related: '',
                safety_relatedes: [
                    {value: true, label: 'بـله'},
                    {value: false, label: 'خیـــر'},
                ],
                see_bsc: '',
                see_bsces: [
                    {value: true, label: 'بـله'},
                    {value: false, label: 'خیـــر'},
                ],
                bsc_weight: '',
                has_menu_item:false
            },
            parts: [],
            page: ''
        }


    }

    goBack = () => {
        this.props.history.goBack();
    }
    step1Condition = () => {
        const indicator = Object.assign({}, this.props.globalStorage.temp);


        if (indicator && Object.keys(indicator).length) {
            if (indicator.ward_list) {
                if (indicator.creation_date) {
                    if (indicator.edit_date) {
                        if (indicator.title) {
                            if (indicator.definition) {
                                return true;
                            } else {
                                userActions.failure('لطفاً تعریف شاخص و اهمیت موضوع را وارد کنید.')
                            }
                        } else {
                            userActions.failure('لطفاً عنوان شاخص را وارد کنید.')
                        }
                    } else {
                        userActions.failure('لطفاً تاریخ بازنگری شاخص را وارد کنید.')
                    }
                } else {
                    userActions.failure('لطفاً تاریخ تدوین شاخص را وارد کنید.')
                }
            } else {
                userActions.failure('لطفاً بخش یا واحد مرتبط با این شاخص را انتخاب کنید.')
            }

        } else {
            userActions.failure('لطفاً اطلاعات شاخص را وارد کنید.')
        }
        return false;
    }
    step2Condition = () => {
        const indicator = Object.assign({}, this.props.globalStorage.temp);


        if (indicator && Object.keys(indicator).length) {
            if (indicator.basis) {

                if (indicator.source) {
                    if (indicator.desirability) {
                        if (indicator.measurement_unit) {
                            if (indicator.report_type !== '') {
                                return true;
                            } else {
                                userActions.failure('لطفاً  نحوه گزارش دهی  را وارد کنید.')
                            }
                        } else {
                            userActions.failure('لطفاً  واحد اندازه گیری شاخص  را وارد کنید.')
                        }
                    } else {
                        userActions.failure('لطفاً  مطلوبیت شاخص  را وارد کنید.')
                    }
                } else {
                    userActions.failure('لطفاً  منبع شاخص  را وارد کنید.')
                }

            } else {
                userActions.failure('لطفاً  مبنای شاخص  را وارد کنید.')
            }

        } else {
            userActions.failure('لطفاً اطلاعات شاخص را وارد کنید.')
        }
        return false;
    }
    step3Condition = () => {
        const indicator = Object.assign({}, this.props.globalStorage.temp);


        if (indicator && Object.keys(indicator).length) {
            if (indicator.measure_interval) {
                return true

            } else {
                userActions.failure('لطفاً  زمان تحویل شاخص  را انتخاب کنید.')
            }

        } else {
            userActions.failure('لطفاً اطلاعات شاخص را وارد کنید.')
        }
        return false;
    }
    step4Condition = () => {
        const indicator = Object.assign({}, this.props.globalStorage.temp);


        if (indicator && Object.keys(indicator).length) {
            if (indicator.safety_related) {
                return true

            } else {
                userActions.failure('لطفاً سوال مربوط به ایمنی بیمار بودن را پاسخ دهید.')
            }

        } else {
            userActions.failure('لطفاً اطلاعات شاخص را وارد کنید.')
        }
        return false;
    }

    save = (isFinal) => {


        const {indicator_id} = this.state;
        return new Promise((resolve, reject) => {
            if (this.step1Condition()) {
                if (this.step2Condition()) {
                    if (this.step3Condition()) {
                        if (this.step4Condition()) {

                            /*const indicator=Object.assign({},this.props.globalStorage.temp);*/

                            const indicator = Object.assign({}, this.props.globalStorage.temp);
                            indicator.ward_id = indicator.ward_list._id;
                            delete indicator.wards;
                            delete indicator.ward_list;
                            indicator.basis = indicator.basis.value;
                            delete indicator.basises;
                            indicator.aspect = indicator.aspect.value;
                            delete indicator.aspectes;
                            indicator.source = indicator.other_source ? indicator.other_source : indicator.source.value;
                            delete indicator.sources;
                            if (indicator.indicator_type) {
                                indicator.indicator_type = indicator.indicator_type.value;

                            }
                            delete indicator.indicator_types;
                            if (indicator.quality_dimension) {
                                indicator.quality_dimension = indicator.quality_dimension.map(itm => itm.value);

                            }
                            delete indicator.quality_dimensions;
                            indicator.desirability = indicator.desirability.value;
                            delete indicator.desirabilities;
                            indicator.measurement_unit = indicator.other_measurement_unit ? indicator.other_measurement_unit : indicator.measurement_unit.value;
                            delete indicator.measurement_units;
                            indicator.report_type = indicator.other_report_type ? indicator.other_report_type : indicator.report_type.value;
                            delete indicator.report_types;
                            delete indicator.users;
                            if (indicator.score_card_aspect) {
                                indicator.score_card_aspect = indicator.score_card_aspect.value;

                            }
                            delete indicator.score_card_aspects;

                            indicator.safety_related = indicator.safety_related.value;
                            delete indicator.safety_relatedes;
                            indicator.see_bsc = indicator.see_bsc.value;
                            delete indicator.see_bsces;

                            /* const reg=new RegExp(/<span\b[^>]*>[^<>]<\/span>/g);
                             const reg2=new RegExp(/<span\b[^>]*>/g);
                             const reg3=new RegExp(/<\/span>/g);*/
                            /* const  numerator_operators=indicator.numerator?indicator.numerator.replace(/&nbsp;/g,'').replace(reg2,'').replace(reg3,'').match(OPERATOR_REGEX):[];
                             const denumerator_operators=indicator.denumerator?indicator.denumerator.replace(/&nbsp;/g,'').replace(reg2,'').replace(reg3,'').match(OPERATOR_REGEX):[]*/
                            const numerator_operators = indicator.numerator ? indicator.numerator.match(OPERATOR_REGEX) : [];
                            const denumerator_operators = indicator.denumerator ? indicator.denumerator.match(OPERATOR_REGEX) : [];
                            let formula = {
                                numerator: indicator.numerator ? indicator.numerator.split(OPERATOR_REGEX) : [1],
                                denumerator: indicator.denumerator ? indicator.denumerator.split(OPERATOR_REGEX) : [1],
                                numerator_operators: numerator_operators || [],
                                denumerator_operators: denumerator_operators || [],
                                multiplier: indicator.multiplier || 1,
                                numerator_indicator_id: indicator.numerator_indicator_id ? indicator.numerator_indicator_id.id : null,
                                denumerator_indicator_id: indicator.denumerator_indicator_id ? indicator.denumerator_indicator_id.id : null,
                                numerator_help: indicator.numerator_help,
                                denumerator_help: indicator.denumerator_help
                            }

                            indicator.year = this.props.globalStorage.year;
                            indicator.hospital_id = this.props.globalStorage.me.hospital_id;
                            const menu_items = indicator.selectedItems.filter(item => !item.checked).map(item => ({parent_item_id: item.answerer_info_menu_item_id}));
                            if (indicator_id) {
                                //in Create new Indicator
                                for (let key in formula) {
                                    if (formula.hasOwnProperty(key) && this.state.formula.hasOwnProperty(key)) {

                                        if (formula[key] !== this.state.formula[key]) {
                                            this.props.dispatch(userActions.API('get', `/v2/delete_indicator_formula?indicator_id=${indicator_id}`, null, false)).then(res => {
                                                this.props.dispatch(userActions.API('post', `/v2/add_indicator_formula`, {
                                                    indicator_id,
                                                    formula
                                                }, false)).then(res => {
                                                    this.setState({formula});
                                                })
                                            });
                                            break;
                                        }
                                    }
                                }

                                if(menu_items.length){
                                    this.props.dispatch(userActions.API('post', '/v2/add_indicator_answerer_info_menu_items', {
                                        indicator_id,
                                        menu_items
                                    }))
                                }
                                this.props.dispatch(userActions.API('post', '/v2/update_indicator', {
                                    indicator,
                                    indicator_id
                                })).then(res => {
                                    //   this.setState({indicator_id:res.data.indicator_id});
                                    /*
                    userActions.successToast('اطلاعات شاخص باموفقیت ثبت شد.');*/
                                    this.setState({save: true})
                                    if (isFinal) {
                                        this.goBack();
                                    }
                                    resolve(res)
                                }).catch(err => {
                                    reject(err)
                                })
                            } else {
                                // in Update Indicator
                                this.props.dispatch(userActions.API('post', '/v2/make_indicator', {
                                    indicator,
                                    formula
                                })).then(res => {
                                    if(menu_items.length){
                                        this.props.dispatch(userActions.API('post', '/v2/add_indicator_answerer_info_menu_items', {
                                            indicator_id:res.data.indicator_id,
                                            menu_items
                                        }))
                                    }
                                    this.setState({formula});
                                    const {indicator} = this.state;
                                    indicator.indicator_id = res.data.indicator_id;
                                    this.setState({indicator_id: res.data.indicator_id, indicator}, () => {
                                        console.log(this.state.indicator)
                                        this.props.dispatch(userActions.setTemp({temp: this.state.indicator}))
                                    });
                                    /*
                                                        userActions.successToast('اطلاعات شاخص باموفقیت ثبت شد.');*/

                                    this.setState({save: true})
                                    if (isFinal) {
                                        this.goBack();
                                    }

                                    resolve(res)
                                }).catch(err => {
                                    reject(err)
                                })
                            }
                        }
                    }
                }
            }

        })


    }
    submit = (isFinal) => {

        this.setState({save: false})
        return this.save(isFinal)


    }
    searchFn = (value, type) => {
        if (this.props.globalStorage.me) {
            const {hospital_id} = this.props.globalStorage.me;

            this.props.dispatch(userActions.API('get', `/v1/search_${type}?hospital_id=${hospital_id}&query=${value}`, null, false)).then(res => {
                this.setState({[type + 's']: res.data.result});
            });
        }

    }
    search = (e, type) => {
        const {value, name} = e.target;

        this.setState({[name]: value}, () => {
            if (value.length >= 2) {
                this.searchFn(value, type);
            } else {
                this.setState({[type + 's']: []});
            }

        })
    }
    async getAnswererItems(indicator_id) {
        return await this.props.dispatch(userActions.API('get', `/v2/get_indicator_answerer_info_menu_items?indicator_id=${indicator_id}`))
    }
    async getItems() {
        let items = [];
        if (!this.props.globalStorage.all_answerer_info_menu_items.length) {
            const res = await this.props.dispatch(userActions.Get_all_answerer_info_menu_items())
            items = res.data.items;
        } else {
            items = this.props.globalStorage.all_answerer_info_menu_items;
        }
        const {indicator}= this.state;
        indicator.items=items;
        this.setState({indicator});
    }
    async componentDidMount() {
        const indicator_id = this.props.match.params.id;
        const page = indicator_id === undefined ? "indicator/list/create" : "indicator/list/edit";
        await this.getItems();
        this.setState({page})
        if (!this.props.globalStorage.wards.length) {
            await this.props.dispatch(userActions.getWards())
        }
        if (!this.props.globalStorage.indicators.length) {
            await this.props.dispatch(userActions.getIndicator(this.props.globalStorage.year))
        }
        if (!this.props.globalStorage.users.length && this.props.globalStorage.me) {
            this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
        }
        if (indicator_id) {

            const resualt = await this.props.dispatch(userActions.API('get', `/v2/get_indicator?indicator_id=${indicator_id}`));
            const formula_resualt = await this.props.dispatch(userActions.API('get', `/v2/get_indicator_formula?indicator_id=${indicator_id}`));
            const {formula} = formula_resualt.data;
            this.setState({formula});
            const indicator = Object.assign({}, this.state.indicator, resualt.data, formula);
            const resItems = await this.getAnswererItems(indicator_id);
            const {items} = resItems.data;
            if (items) {
               indicator.selectedItems=items.map(item => {
                    item.checked = true;
                    return item;
                })
            }
            indicator.numerator = formula.numerator ? formula.numerator.map((operand, i) => {
                let opt = formula.numerator_operators[i] || '';
                /*if(opt){
                    opt='&nbsp;<span class="iran_sans_Bold text_muted">'+opt+'</span>&nbsp;'
                }*/
                return operand + opt
            }).join('') : [];
            indicator.denumerator = formula.denumerator ? formula.denumerator.map((operand, i) => {
                let opt = formula.denumerator_operators[i] || '';
                /*if(opt){
                    opt='&nbsp;<span class="iran_sans_Bold text_muted">'+opt+'</span>&nbsp;'
                }*/
                return operand + opt
            }).join('') : [];
            indicator.ward_list = this.props.globalStorage.wards.find(w => w.name === indicator.main_ward_name);
            indicator.numerator_indicator_id = this.props.globalStorage.indicators.find(w => w.id === formula.numerator_indicator_id);
            indicator.denumerator_indicator_id = this.props.globalStorage.indicators.find(w => w.id === formula.denumerator_indicator_id);

            indicator.basis = indicator.basises.find(b => b.value === indicator.basis);
            indicator.aspect = indicator.aspectes.find(b => b.value === indicator.aspect);
            indicator.source = indicator.sources.find(b => b.value === indicator.source);
            if (!indicator.source && resualt.data.source) {
                indicator.source = indicator.sources.find(b => b.value === 'سایر موارد');
                indicator.other_source = resualt.data.source;
            }
            indicator.indicator_type = indicator.indicator_types.find(b => b.value === indicator.indicator_type);
            indicator.quality_dimension = indicator.quality_dimensions.filter(b => indicator.quality_dimension.find(q => q === b.value));
            indicator.desirability = indicator.desirabilities.find(b => b.value === indicator.desirability);
            indicator.measurement_unit = indicator.measurement_units.find(b => b.value === indicator.measurement_unit);
            if (!indicator.measurement_unit && resualt.data.measurement_unit) {
                indicator.measurement_unit = indicator.measurement_units.find(b => b.value === 'سایر موارد');
                indicator.other_measurement_unit = resualt.data.measurement_unit;
            }
            indicator.report_type = indicator.report_types.find(b => b.value === indicator.report_type);
            if (!indicator.report_type && resualt.data.report_type) {
                indicator.report_type = indicator.report_types.find(b => b.value === 'سایر موارد');
                indicator.other_report_type = resualt.data.report_type;
            }
            indicator.score_card_aspect = indicator.score_card_aspects.find(b => b.value === indicator.score_card_aspect);
            indicator.safety_related = indicator.safety_relatedes.find(b => b.value === indicator.safety_related);
            indicator.see_bsc = indicator.see_bsces.find(b => b.value === indicator.see_bsc);
            indicator.indicator_id = indicator_id;

            this.setState({indicator, indicator_id}, () => {
                this.props.dispatch(userActions.setTemp({temp: this.state.indicator}))
            })


        } else {
            this.props.dispatch(userActions.setTemp({temp: this.state.indicator}))
        }


        this.setState({
            parts: [
                {
                    title: 'اطلاعـات اولیـه',
                    background: 'bg-navy-blue',
                    icon: ' <i class="fas fa-home fa-3x"></i>',
                    component: <Step1 parent={this}/>,
                    onLeave: this.step1Condition
                },
                {
                    title: 'اطلاعـات تکمیلـی',
                    background: 'bg-purple',
                    icon: ' <i class="fas fa-pen fa-3x"></i>',
                    component: <Step2/>,
                    onLeave: this.step2Condition

                },
                {
                    title: 'زمان تحویـل شـاخص',
                    background: 'bg-pink',
                    icon: ' <i class="fas fa-clock fa-3x"></i>',
                    component: <Step3/>,
                    onLeave: this.step3Condition
                },
                {
                    title: 'سوالات شـاخص',
                    background: 'bg-dark-orange',
                    icon: ' <i class="fas fa-question-circle fa-3x"></i>',
                    component: <Step4/>,
                    onLeave: this.step4Condition
                },
                {
                    title: 'بخش هـا و مسئـول پـایش',
                    background: 'bg-light-green',
                    icon: ' <i class="fas fa-bed fa-3x"></i>',
                    component: <Step5 parent={this} indicatorId={this.state ? this.state.indicator_id : ''}/>

                },
            ]
        });
    }

    componentDidUpdate(props) {
        if (!this.state.save) {
            const diff = _.reduce(props.globalStorage.temp, (result, value, key) => {
                return _.isEqual(value, this.state.indicator[key]) ?
                    result : result.concat(key);
            }, []);
            if (diff.length) {
                this.setState({indicator: props.globalStorage.temp}, () => {
                    this.setState({save: false})
                })

            }
        }

    }

    render() {
        const {save, parts, page} = this.state;
        return (
            <div className="content bg-light py-3 px-3 ">

                <Routes page={page}/>

                {/* <BreadcrumbsItem icon={addIcon} to="indicator/list/create">
                    افــزودن شاخص
                </BreadcrumbsItem>*/}
                <div className="container-fluid">
                    <div className="note bg-white my-5 mx-sm-5 mx-3">
                        <AdminMessage text="کاربـر گرامـی: بـا توجـه بـه پیچیـدگـی و حجیـم
                            بودن اطلاعـات، ثبت شنـاسنـامـه شـاخص بـه 5 بخش تقسیـم شـده است. لطفـاً توجـه داشتـه باشیـد کـه هـر 5 بخش را
                            تکمیـل نماییـد"/>
                    </div>
                    <Prompt
                        when={!save}
                        message="آیا از عدم ثبت تغییـرات مطمئـن هستیـد؟"
                    />
                    {parts.length > 0 && Object.keys(this.props.globalStorage.temp).length > 0 &&
                    <FormHeader parts={parts} currentStep={this.state.currentPart} submit={this.submit}
                                submitStep={4}/>}

                </div>


            </div>


        )
    }
}

const IndicatorCreateComponent = connect((state) => ({globalStorage: state.globalStorage}))(IndicatorCreate);
export {IndicatorCreateComponent};
