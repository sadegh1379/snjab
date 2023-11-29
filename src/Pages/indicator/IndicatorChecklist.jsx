import React from 'react'
import {connect} from 'react-redux';
import {Routes, Questions, CollapseComp, HospitalTable} from "../../_components";
import {userActions} from "../../_actions";
import * as _ from "lodash";

class IndicatorChecklist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maximum_values: [],
            inquire_info: {},
            items: [],
            indicator_id: props.match.params.id,
            title: '',
            description: '',
            number: '',
            components: [],
            questions: [],
            selectedType: null,
            questionGroupByTypes: {},
            questionTypes: userActions.generateSelectLabelValue(['کیفی', 'دوسطحی', 'عددی', 'درصدی', 'سوال باز']),
            valuesHeader: [

                {
                    title: 'ردیف',
                    getData: (item, index) => {
                        return index+1
                    },
                    style: {
                        width: '5%',
                        padding:'10px',
                    }
                },
                {
                    title: 'مقــادیر امتیاز دهــی',
                    getData: (item, index) => {
                        const i = this.state.answers.findIndex(a => a === item)
                        return <input type="text"
                                      className="form-control w-75 m-auto d-block rounded-pill text-center"
                                      value={item["answer"]}
                                      name={"answer"}
                                      onChange={(e) => {
                                          userActions.handleChangeSelect.call(this, e.target.value.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (c) {
                                              return c.charCodeAt(0) & 0xf;
                                          }), {name: e.target.name}, 'answers', i)
                                      }}
                        />
                    },
                    style: {
                        width: '35%'
                    }
                },
                {
                    title: 'راهنمای پاسخ',
                    getData: (item, index) => {
                        const i = this.state.answers.findIndex(a => a === item)
                        return <input type="text"
                                      className="form-control w-100 rounded-pill text-center"
                                      value={item["answer_help"]}
                                      name={"answer_help"}
                                      onChange={(e) => {
                                          userActions.handleChangeSelect.call(this, e.target.value, {name: e.target.name}, 'answers', i)
                                      }}
                        />
                    },
                    style: {
                        width: '50%'
                    }
                },
                {
                    title: 'عملیات',
                    getData: (item, index) => {
                        return <button className="btn btn-link" onClick={() => {
                            this.deleteAnswer(item, index)
                        }}><i className="fal fa-trash-alt text-danger"/></button>


                    },
                    style: {
                        width: '10%'
                    }
                }
            ],
            answers: [],
            selectedComponent: null,
            selectedItems: []
        }
        this.getItems = this.getItems.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.saveChecklist = this.saveChecklist.bind(this);
        this.toggleItems = this.toggleItems.bind(this);
        this.getAnswererItems = this.getAnswererItems.bind(this);
        this.getInquireInfo = this.getInquireInfo.bind(this);
        this.getCompoents = this.getCompoents.bind(this);
        this.getMaximunValue = this.getMaximunValue.bind(this);
    }

    types = [];
    saveComponents = () => {
        const {indicator_id, components} = this.state;
        const component = [components.find(c => !c.id)]
        this.props.dispatch(userActions.API('post', `/v2/add_indicator_component`, {
            indicator_id,
            component
        })).then(res => {

        });
    }
    addComponent = (title = null) => {
        const {components} = this.state;
        if (title) {
            components.push({title, last_title: title});
        } else {
            components.push({title: ''});
        }
        this.setState({components})
    }
    onChangeHasComponent = (state) => {
        if (state) {
            if (!this.state.components.length) {
                this.addComponent();
                this.addComponent();
            }

        } else {
            if (this.state.components.length) {
                const c = this.state.components.filter(c => c.title);
                if (c.length) {
                    this.props.dispatch(userActions.question('حذف اجزاء چک لیست', 'آیا از حذف تمام اجزاء مطمئن هستید؟')).then(r => {

                    })
                } else {
                    this.setState({components: []});
                }
            }
        }
    }
    deleteComponent = (item, i) => {
        const {components} = this.state;
        this.props.dispatch(userActions.question('حذف اجزاء چک لیست/پرسشنامه', 'آیا از حذف اجزاء مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (item.id) {
                    this.props.dispatch(userActions.API('delete', `/v2/delete_indicator_component?component_id=${item.id}`)).then(res => {

                        components.splice(i, 1);
                        this.setState({components});

                    });
                } else {
                    components.splice(i, 1);
                    this.setState({components});
                }

            }
        })
    }
    deleteAnswer = (item) => {
        const {answers, selectedType} = this.state;
        const i = answers.findIndex(a => a === item);

        this.props.dispatch(userActions.question('حذف مقادیر پاسخ دهی ', 'آیا از حذف پاسخ مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (item.id) {
                    const ans = this.state.AllAnswers.filter(a => a.type === item.type && a.answer === item.answer);
                    this.props.dispatch(userActions.API('put', `/v2/delete_answer`, {answers: ans.map(a => ({answer_id: a.id}))})).then(res => {

                        answers.splice(i, 1);
                        this.setState({answers}, () => {
                            if (selectedType === 'دوسطحی') {
                                this.addAnswer();
                            } else if (answers.length < 3) {
                                this.addAnswer();
                            }

                        });

                    });
                } else {
                    answers.splice(i, 1);
                    this.setState({answers}, () => {
                        if (selectedType === 'دوسطحی') {
                            this.addAnswer();
                        } else if (answers.length < 3) {
                            this.addAnswer();
                        }

                    });


                }

            }
        })
    }
    groupTypes = () => {
        const questionsType = this.state.questions.map(q => q.select ? q.select.value : '').filter(q => q.length);

        if (questionsType.length) {
            const questionGroupByTypes_new = [...new Set(questionsType)];

            const {questionGroupByTypes} = this.state;
            const questionGroupByTypes_new_obj = {}
            questionGroupByTypes_new.map(key => {
                const obj = {
                    question_type: key,
                    answers: []
                }
                if (!questionGroupByTypes.hasOwnProperty(key)) {
                    questionGroupByTypes[key] = Object.assign({}, obj);
                    questionGroupByTypes_new_obj[key] = Object.assign({}, obj);
                } else {
                    questionGroupByTypes_new_obj[key] = Object.assign({}, questionGroupByTypes[key]);
                }
            })
            const diff = _.reduce(questionGroupByTypes, (result, value, key) => {
                return _.isEqual(value, questionGroupByTypes_new_obj[key]) ?
                    result : result.concat(key);
            }, []);
            if (diff.length) {
                diff.map(key => {
                    delete questionGroupByTypes[key];
                })
            }
            this.setState({questionGroupByTypes});
        }

    }
    onChangeQuestions = (questions_) => {
        const {selectedComponent, questions} = this.state;
        const questions_2 = questions.filter(q => q.component !== (selectedComponent ? selectedComponent.title : 'default'))
        this.setState({questions: [...questions_2, ...questions_]}, this.groupTypes);
    }
    addQuestions = (q) => {
        const {selectedComponent} = this.state;
        const question = q ? q : {
            title: '',
            select: '',
            component: selectedComponent ? selectedComponent.title : 'default'
        };
        this.setState({questions: [...this.state.questions, question]})
    }
    deleteQuestion = (q) => {
        const {questions} = this.state;
        const i = questions.findIndex(qq => qq === q);
        this.props.dispatch(userActions.question('حذف سوال', 'آیا از حذف سوال مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (q.id) {
                    this.props.dispatch(userActions.API('get', `/v2/remove_indicator_question?question_id=${q.id}`)).then(res => {

                        questions.splice(i, 1);
                        this.setState({questions});

                    });
                } else {
                    questions.splice(i, 1);
                    this.setState({questions});
                }

            }
        })
    }
    selectType = (type) => {
        this.setState({selectedType: null}, () => {
            setTimeout(() => {
                this.setState({selectedType: type}, () => {
                    const {answers} = this.state;
                    if (!answers.find(a => a.type === type)) {
                        this.addAnswer();
                        this.addAnswer();
                        if (type !== 'دوسطحی') {
                            this.addAnswer();
                        }
                    }

                })
            }, 300)
        })

    }
    selectComponents = (selectedComponent) => {
        this.setState({selectedComponent})
    }
    addAnswer = () => {
        const {answers, selectedType, questionGroupByTypes} = this.state;
        answers.push(Object.assign({}, {answer: '', answer_help: '', type: selectedType}));
        questionGroupByTypes[selectedType]['answers'] = answers;
        this.setState({questionGroupByTypes, answers})
    }

    async toggleItems(item) {
        const {selectedItems} = this.state;
        const index = selectedItems.findIndex(i => i.answerer_info_menu_item_id === item.id);
        if (index === -1) {
            const itm = Object.assign({answerer_info_menu_item_id: item.id}, item);

            selectedItems.push(itm);
        } else {
            if (selectedItems[index].checked) {
                await this.props.dispatch(userActions.API('delete', `/v2/delete_indicator_answerer_info_menu_items?item_id=${selectedItems[index].id}`, null, false))
            }
            selectedItems.splice(index, 1);


        }
        this.setState({selectedItems})
    }

    async saveChecklist() {
        const {indicator_id, components, title, description, number, selectedItems, maximum_values} = this.state;
        const questions_ = this.state.questions;
        const answers_ = this.state.answers;
        console.log(components)
        const component = components.filter(c => !c.id).map(c => ({title: c.title}));

        const edited_component = components.filter(c => c.id && c.title !== c.last_title);
        const inquire_info_id = this.state.inquire_info.id;
        const inquire_info = {title, description, number};
        const components_ = components.length > 1 ? [...components] : [{title: 'default'}];
        const maximum_values_ = [];
        const questions = components_.map(c => (
            {
                title: c.title,
                content: questions_.filter(q => q.component === c.title).map(q => {
                    if (q.title && q.select) {
                        const type = q.select.value;
                        const answers = answers_.filter(a => a.type === type);
                        const maximum_value = type === 'سوال باز' ? 0 : (type === 'دوسطحی' ? 1 : (type === 'کیفی' ? answers.length : (answers.length ? parseFloat(answers[answers.length - 1].answer) : 0)));
                        const mv = maximum_values.find(m => m.question_type === type);
                        if (mv && !q.id) {
                            if (mv.maximum_value !== maximum_value) {
                                maximum_values_.push(Object.assign({question_id: q.id}, mv));
                            }
                        }
                        return {
                            id: q.id,
                            question: q.title,
                            type,
                            answers,
                            maximum_value
                        }
                    } else {
                        return {}
                    }

                }).filter(q => q.question && !q.id)
            }
        )).filter(c => c.content.length);
        const menu_items = selectedItems.filter(item => !item.checked).map(item => ({parent_item_id: item.answerer_info_menu_item_id}));
        if (edited_component.length) {
            await edited_component.map(async c => {
                return await this.props.dispatch(userActions.API('post', '/v2/update_indicator_component', {
                    component_id: c.id,
                    title: c.title
                }));
            })
        }
        const resComponent = component.length ? await this.props.dispatch(userActions.API('post', '/v2/add_indicator_component', {
            indicator_id,
            component
        })) : null;
        const resInquireInfo = await this.props.dispatch(userActions.API('post', inquire_info_id ? '/v2/update_indicator_inquire_info' : '/v2/add_indicator_inquire_info', inquire_info_id ? {
            inquire_info_id,
            inquire_info
        } : {indicator_id, inquire_info}));
        const resAnswererInfo = menu_items.length ? await this.props.dispatch(userActions.API('post', '/v2/add_indicator_answerer_info_menu_items', {
            indicator_id,
            menu_items
        })) : null;
        const resQuestions = questions.length ? await this.props.dispatch(userActions.API('post', '/v2/add_indicator_question', {
            indicator_id,
            questions
        })) : null;
        if (maximum_values_.length) {
            this.props.dispatch(userActions.API('put', '/v2/edit_question_maximum_value', {questions: maximum_values_}, false))

        }
        this.props.history.goBack();

    }

    async getItems() {
        let items = [];
        if (!this.props.globalStorage.all_answerer_info_menu_items.length) {
            const res = await this.props.dispatch(userActions.Get_all_answerer_info_menu_items())
            items = res.data.items;
        } else {
            items = this.props.globalStorage.all_answerer_info_menu_items;
        }
        this.setState({items});

    }

    async getQuestions(indicator_id) {
        return await this.props.dispatch(userActions.API('get', `/v2/get_indicator_questions?indicator_id=${indicator_id}`))
    }

    async getMaximunValue(question_id, question_type) {
        if (this.types.indexOf(question_type) === -1) {
            this.types.push(question_type);

            this.props.dispatch(userActions.API('get', `/v2/get_question_maximum_value?question_id=${question_id}`, null, false)).then(res => {
                const {maximum_value} = res.data;
                const {maximum_values} = this.state;
                maximum_values.push({
                    maximum_value,
                    question_type
                })
                this.setState({
                    maximum_values
                })
            })
        }

    }

    async getAnswererItems(indicator_id) {
        return await this.props.dispatch(userActions.API('get', `/v2/get_indicator_answerer_info_menu_items?indicator_id=${indicator_id}`))
    }

    async getInquireInfo(indicator_id) {
        return await this.props.dispatch(userActions.API('get', `/v2/get_indicator_inquire_info?indicator_id=${indicator_id}`))
    }

    async getCompoents(indicator_id) {
        return await this.props.dispatch(userActions.API('get', `/v2/get_indicator_components?indicator_id=${indicator_id}`))
    }

    async componentDidMount() {
        try {
            this.types = [];
            const {indicator_id} = this.state;
            await this.getItems();
            const resItems = await this.getAnswererItems(indicator_id);
            const resComponents = await this.getCompoents(indicator_id);
            const resInquireInfo = await this.getInquireInfo(indicator_id);
            const {inquire_info} = resInquireInfo.data;
            const {items} = resItems.data;
            const {components} = resComponents.data;
            if (items) {
                this.setState({
                    selectedItems: items.map(item => {
                        item.checked = true;
                        return item;
                    })
                })
            }
            if (components.length > 1) {
                components.map(c => {
                    c.last_title = c.title
                });
                this.setState({components});
            }
            if (inquire_info) {
                const {title, description, number} = inquire_info;
                this.setState({inquire_info, title, description, number})
            }
            const AllAnswers = [];
            const res = await this.getQuestions(indicator_id);
            const answers = [];
            if (res.data.data) {
                res.data.data.map(d => {
                    if (d.component !== 'default' && !components.find(cc => cc.title === d.component)) {
                        this.addComponent(d.component)
                    }
                    d.content.map(q => {
                        this.getMaximunValue(q.question_id, q.question_type)
                        this.addQuestions({
                            title: q.question,
                            select: q.question_type ? userActions.generateSelectLabelValue([q.question_type])[0] : '',
                            id: q.question_id,
                            component: d.component
                        });
                        if (q.answers) {
                            q.answers.map(a => {
                                AllAnswers.push(Object.assign({}, a, {type: q.question_type}))
                                if (!answers.find(aa => aa.answer === a.answer && aa.type === q.question_type)) {
                                    answers.push(Object.assign({}, a, {type: q.question_type}));
                                }
                            })
                        }
                    })

                })
                this.setState({answers}, this.groupTypes);
            }
            console.log(components)
        } catch (e) {
            console.error(e)
        }


    }

    render() {
        const {indicator_id, title, description, number, components, questions, questionTypes, questionGroupByTypes, selectedType, valuesHeader, answers, selectedComponent, selectedItems, items} = this.state;
        return (
            indicator_id ?
                <div className="py-5 text-right bg-light">
                    <Routes page="indicator/list/checklist"/>
                    {/*form check list*/}
                    <div className="container-fluid shadow rounded  py-4 px-3 px-lg-5 bg-white ">
                        <div className="row d-flex justify-content-center   ">
                            <div className={'col-lg-9  '}>
                                <label htmlFor="" className="iran-sans_Bold"> عنوان</label>
                                <input type="text-aria"
                                       name="title"
                                       value={title}
                                       onChange={userActions.handleChangeInput.bind(this)}
                                       className="form-control  border-0 rounded-pill  boxshadow py-4"/>
                            </div>
                            <div className={'col-lg-3  '}>
                                <label htmlFor="" className="iran-sans_Bold"> شماره</label>
                                <input type="text-aria"
                                       name="number"
                                       value={number}
                                       onChange={userActions.handleChangeInput.bind(this)}
                                       className="form-control  border-0 rounded-pill boxshadow  py-4"/>
                            </div>
                            <div className={'col-lg-12 col-md-12 mt-4 text-right my-2'}>
                                <label htmlFor=""
                                       className="rounded-pill  px-4 py-1 titleInput bg-white iran-sans_Bold"> هــدف</label>
                                {/*<input type="text-aria" className='form-control  border-0 rounded  inputCkeckList '/>*/}
                                <textarea className="inputCkeckList form-control rounded p-1 text-justify" cols="30"
                                          rows="10"
                                          name="description"
                                          value={description}
                                          onChange={userActions.handleChangeInput.bind(this)}
                                ></textarea>
                            </div>
                        </div>
                        <div className={'row d-flex justify-content-center mt-4'}>
                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <CollapseComp
                                    title='چک لیست/پرسشنامه دارای اطلاعات پـایه است؟'
                                    className='btn-primary'
                                    isOpenedByDefault={selectedItems.length > 0}
                                >

                                    <div className={' my-3 checkListBody boxshadow row mx-1 p-4  '}>
                                        {items.map((itm, i) =>
                                            <label key={i} htmlFor="" className={'align-items-center d-flex col-lg-6  '}
                                                   onClick={() => {
                                                       this.toggleItems(itm);
                                                   }}>
                                                <i className={`far  fa-2x px-3  ${selectedItems.find(item => item.answerer_info_menu_item_id === itm.id) ? 'fa-check-square text-primary' : 'fa-square text-black-50'}`}></i>
                                                {itm.item}
                                            </label>
                                        )}
                                    </div>

                                </CollapseComp>

                            </div>
                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <CollapseComp
                                    title='چک لیست/پرسشنامه دارای  اجزای مختلف است؟'
                                    className='btn-primary'
                                    isOpenedByDefault={components.length >= 1}
                                    onChange={this.onChangeHasComponent}
                                >
                                    <div className="checkListBody boxshadow my-3  mx-1 align-item-center h-75">

                                        {components.map((item, i) =>
                                            <div className={'row mx-3'} key={i}>
                                                <div className={'col-lg-10  col-md-12 mt-3'}>
                                                    <input type="text"
                                                           name="title"
                                                           value={item.title}
                                                           onChange={(e) => {
                                                               userActions.handleChangeSelect.call(this, e.target.value, {name: e.target.name}, 'components', i)
                                                           }}
                                                           className='form-control boxshadow  border-0 rounded-pill '/>
                                                </div>
                                                <div
                                                    className={'col-lg-2  col-md-12 mt-3 d-flex justify-content-center'}>
                                                    <button className="btn text-white btn-danger rounded-pill "
                                                            onClick={() => {
                                                                this.deleteComponent(item, i)
                                                            }}>حــذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <div className={'m-auto py-3 d-flex d-flex justify-content-center'}>
                                            <button className={'btn text-white btn-primary rounded-pill py-2 '}
                                                    onClick={() => {
                                                        this.addComponent()
                                                    }}>افــزودن
                                            </button>
                                        </div>
                                    </div>
                                </CollapseComp>


                            </div>
                        </div>
                        <br/>
                        {components.filter(c => c.title).length > 1 &&
                        <>
                            <p className="iran-sans_Bold my-3">انتخاب اجزاء </p>
                            <div className="row mx-1  boxshadow   d-flex justify-content-center   ">
                                <p className={'text-center col-12 text-black-50 py-2 '}>کابر گرامی لطفاً اجزاء را برای
                                    تعریف سوالات انتخاب کنید</p>
                                {components.filter(c => c.title).map((item, i) =>
                                    <div className="col-lg-2 col-md-3 col-sm-12 pb-2" key={i}>
                                        <button onClick={() => {
                                            this.selectComponents(item)

                                        }}
                                                className={`btn d-flex align-items-center justify-content-center ${selectedComponent === item ? 'btn-primary' : 'btn-dark'}  rounded-pill  text-white  text-center w-100 mx-2 my-2`}>{item.title}</button>
                                    </div>
                                )}

                            </div>
                        </>
                        }
                        <br/>
                        <br/>
                        {
                            (components.length === 0 || selectedComponent) &&
                            <>
                                <p className="iran-sans_Bold my-3">تعریف ســوالات</p>
                                <div className="row mx-1 Define-questions boxshadow  py-4 px-4   ">
                                    <Questions disabled={q => q.id} deleteQuestion={this.deleteQuestion}
                                               questions={questions.filter(q => q.component === (components.length === 0 ? 'default' : selectedComponent.title))}
                                               onChange={this.onChangeQuestions} selectPlaceholder="انتخاب نوع پاسخ"
                                               selectOptions={questionTypes}/>
                                    <button onClick={() => {
                                        this.addQuestions()
                                    }}
                                            className="align-items-center bg-primary btn circleButton d-flex justify-content-center text-white">
                                        <i className='fas fa-plus '></i>
                                    </button>
                                </div>
                                <br/>
                            </>
                        }

                        {Object.keys(questionGroupByTypes).length > 0 &&
                        <>
                            <p className="iran-sans_Bold my-3">تعریف مقـادیر پاسخ دهی </p>
                            <div className="row mx-1 boxshadow   d-flex justify-content-center   ">
                                <p className={'text-center col-12 text-black-50 py-2 '}>کابر گرامی لطفا مقادیر پاسخ
                                    دهــی به سوالات را انتخاب کنید</p>
                                {Object.keys(questionGroupByTypes).filter(t => t !== 'سوال باز').map((item, i) =>
                                    <div className="col-lg-2 col-md-3 col-sm-12 pb-2" key={i}>
                                        <button onClick={() => {
                                            this.selectType(item)

                                        }}
                                                className={`btn d-flex animated zoomIn align-items-center justify-content-center ${selectedType === item ? 'btn-primary' : 'btn-dark'}  rounded-pill  text-white  text-center w-100 mx-2 my-2`}>{item}</button>
                                    </div>
                                )}

                            </div>
                        </>
                        }
                        <br/>
                        {selectedType && <div>
                            <div
                                className='bg-primary text-white rounded-pill  animated slideInRight text-center py-1 titleVlaue'
                                style={{zIndex: 9}}>{selectedType}</div>
                            <div
                                className="animated fadeIn d-flex mx-1 container-fluid  boxshadow   d-flex justify-content-center  py-5   ">
                                <HospitalTable totalPage={1} pageOnChange={() => {
                                }} rows={answers.filter(a => a.type === selectedType)} headers={valuesHeader}
                                               addToTable={selectedType !== 'دوسطحی' ? this.addAnswer : undefined}/>
                            </div>
                        </div>
                        }

                        <br/>
                        <div className="d-flex justify-content-center align-items-center">
                            <button className="btn btn-outline-primary rounded-pill px-5"
                                    onClick={this.saveChecklist}>ثبت
                            </button>
                        </div>
                    </div>
                </div>
                :
                ''
        )
    }
}


const IndicatorChecklistComponent = connect((state) => ({globalStorage: state.globalStorage}))(IndicatorChecklist);
export {IndicatorChecklistComponent}
