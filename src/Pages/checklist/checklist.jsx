import React, {Component} from "react";
import {ToggleBotton} from "../../_components";
import {Routes, Questions, CollapseComp} from "../../_components";
import {userActions} from "../../_actions";
import * as _ from "lodash";
import {userConstants} from "../../_constants";
import Select from 'react-select';
import Modal from "react-modal";
import ReactTooltip from 'react-tooltip';
import {connect} from "react-redux";
import AddIcon from '../../assets/images/add.png';
import CollectorIcon from '../../assets/images/network.png';
import {UsersSelect, HospitalTable} from "../../_components";




class ChecklistCreate_ extends Component {
    handelToggle = toggle_state => {
        this.setState({toggle_state})
        this.getItems = this.getItems.bind(this);

    }
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            title: '',
            goal: '',
            number: '',
            is_public: {
                label: ' خیـــر',
                value: false
            },
            toggleBottons: [
                {
                    label: 'خیـــر',
                    value: false
                },
                {
                    label: ' بلــــه',
                    value: true
                }

            ],
            selectedItems: [],
            components: [],
            questions: [],
            range: ' ',
            delivery_type: ['هفتگـی', ' روزانه', 'ماهانه', 'سه ماه یکبار', 'شش ماه یکبار', 'سالانه '].map(a => ({title: a})),
            questionTypes: userActions.generateSelectLabelValue(['کیفی', 'دوسطحی', 'عددی', 'سوال باز']),
            selectedComponent: null,
            menu_items: [],
            required_answer_items: []

        }

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
        console.log(selectedComponent)
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
                        questions.splice(i, 1);
                        this.setState({questions});

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

                    if (type === 'دوسطحی' && !answers.find(a => a.type === type)) {
                        this.addAnswer();
                        this.addAnswer();
                    }
                })
            }, 300)
        })

    }
    handelToggle = toggle_state => {
        this.setState({toggle_state})
        this.getItems = this.getItems.bind(this);
        this.toggleItems = this.toggleItems.bind(this);
    }
    handleOptional = (item) => {
        console.log(item)
        const {selectedItems, items,required_answer_items} = this.state;
        const index = required_answer_items.indexOf(item.id)
        if(index>-1){
            required_answer_items.splice(index,1)
        }else {
            required_answer_items.push(item.id)
        }
        // console.log(console.log("!", index, items[index]['optional']))
        // items[index]['optional'] = !items[index]['optional']

        this.setState({
            required_answer_items
        })
    }
    async toggleItems(item) {
        const {selectedItems, items,menu_items} = this.state;
        const index = menu_items.indexOf(item.id)
        // console.log(console.log(index))
        // items[index]['checked'] = !items[index]['checked']
        if(index>-1){
            menu_items.splice(index,1)
        }
        else {
            menu_items.push(item.id)
        }

        this.setState({
            menu_items
        })

        // const index = selectedItems.findIndex(i => i.id === item.id);
        // if (index === -1) {
        //     selectedItems.push(item);
        // } else {
        //     if (selectedItems[index].checked) {
        //         await this.props.dispatch(userActions.API
        //         ('delete', `/v2/delete_indicator_answerer_info_menu_items?item_id=
        //         ${item.id}`, null, false))
        //     }
        //     selectedItems.splice(index, 1);
        // }
        // this.setState({selectedItems})

    }
    async getItems() {
        let items = [];
        if (!this.props.globalStorage.all_answerer_info_menu_items.length) {
            const res = await this.props.dispatch(userActions.Get_all_answerer_info_menu_items())
            items = res.data.items;
        } else {
            items = this.props.globalStorage.all_answerer_info_menu_items;
        }
        items.map( item => {
            item['checked'] = false;
            item['optional'] = false;

        })
        this.setState({items});



    }
    addComponent = (title = null) => {
        const {components} = this.state;
      // console.log(components)
        if (title) {
            components.push({title, last_title: title});
        } else {
            components.push({title: ''});
        }
        this.setState({components})
    }
    deleteComponent = (item, i) => {
        const {components} = this.state;
        this.props.dispatch(userActions.question('حذف اجزاء چک لیست/پرسشنامه', 'آیا از حذف اجزاء مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (item.id) {
                    components.splice(i, 1);
                    this.setState({components});
                } else {
                    components.splice(i, 1);
                    this.setState({components});
                }

            }
        })
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
    saveComponents = () => {
        const {indicator_id, components} = this.state;
        const component = [components.find(c => !c.id)]
        this.props.dispatch(userActions.API('post', `/v2/add_indicator_component`, {
            indicator_id,
            component
        })).then(res => {

        });
    }
    async componentDidMount() {
        try {
            await this.getItems();
        } catch (e) {
            console.error(e)
        }


    }
    saveChecklist=(e)=>{
        e.preventDefault();
        const {components} = this.state;
        const
            {title,
            number,
            goal,
            is_public,
            menu_items,
            required_answer_items,
                delivery_type,
            } = this.state;
        const component = components.filter(c => !c.id).map(c => ({title: c.title}));
        // const menu_items = selectedItems.filter(item => !item.checked).map(item => ({parent_item_id: item.id}))

        if (title === ""){
            return userActions.failure("عـنوان چک لیست را واارد کنید");
        }
        if (number === ""){
            return userActions.failure(" شمـاره چک لیست را واارد کنید");
        }
        if (goal === ""){
            return userActions.failure(" هـدف چک لیست را وارد کنید");
        }
        this.props
            .dispatch(userActions.question("ثبت  چک لیست جدید", " آیا از ثبت و ارسال چک لیست مورد نظر به مسئولین جمع آوری مطمئن هستید؟"))
            .then(v => {
                if (v.value) {
                    this.props
                        .dispatch(
                            userActions.API("post","/v1/user/hospital/checklist", {
                                title:title,
                                number:number,
                                goal:goal,
                                is_public:is_public.value,
                                components:component,
                                menu_items,
                                required_answer_items,

                            })
                        )
                        .then(res => {
                            console.log(res.data,"ckecklist")
                            userActions.successToast("چـک لیست جدید با موفقیت ایجاد شد!");
                        });
                }
            });


               }

    render() {
        console.log(this.state.required_answer_items,"required_answer_items")
        console.log(this.state.menu_items,"menu_items")
        console.log(this.state.questions,"questions")
        console.log(this.state.components,"components")

        const {title,number,goal,toggleBottons,isPublic,items,
            selectedItems,components,selectedComponent,questions,questionTypes,
            questionGroupByTypes, selectedType,delivery_type,range} = this.state;
        return (
            <>
                <div className="py-5 text-right bg-light">
                    <Routes page={"checklist/ChecklistCreate"}/>
                    <div className="container-fluid shadow rounded  py-4 px-3 px-lg-5 bg-white ">
                        <div className="row d-flex justify-content-center   ">
                            <div className={'col-lg-9  '}>
                                <label htmlFor="" className="iran-sans_Bold"> چک لیست عنوان</label>
                                <input type="text-aria"
                                       name="title"
                                       value={title}
                                       onChange={userActions.handleChangeInput.bind(this)}
                                       className="form-control  border-0 rounded-pill  boxshadow py-4"/>
                            </div>
                            <div className={'col-lg-3  '}>
                                <label htmlFor="" className="iran-sans_Bold"> شماره چک لیست</label>
                                <input type="text-aria"
                                       name="number"
                                       value={number}
                                       onChange={userActions.handleChangeInput.bind(this)}
                                       className="form-control  border-0 rounded-pill boxshadow  py-4"/>
                            </div>
                            <div className={'col-lg-12 col-md-12 mt-4 text-right my-2'}>
                                <label htmlFor=""
                                       className="rounded-pill  px-4 py-1 titleInput bg-white iran-sans_Bold"> هدف چک
                                    لیست</label>
                                <textarea className="inputCkeckList form-control rounded p-1 text-justify" cols="30"
                                          rows="10"
                                          name="goal"
                                          value={goal}
                                          onChange={userActions.handleChangeInput.bind(this)}
                               />
                            </div>
                        </div>
                        <br/>

                        <div className="col-12">
                            <p className="iran_sans_Bold text-center">آیا چک لیست/پرسشنامه مورد نظر به صورت همگانی است؟</p>
                            <ToggleBotton btns={toggleBottons} onClickHandel={this.handelToggle}
                                          isPublic={isPublic} color="primary"
                                          className="toggle_btn w-50 mx-auto text-center d-flex text-white align-items-center iransansBold "
                                          myBgColor={"#ffffff"}
                                          myColor={"btn-dark-outline"}
                              />
                        </div>
                        <br/>
                        <div className={'row d-flex justify-content-center mt-4'}>
                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <CollapseComp
                                    title='آیا چک لیست/پرسشنامه مورد نظر دارای اطلاعات پایه ای می باشد؟'
                                    className='btn-primary'
                                    isOpenedByDefault={selectedItems.length > 0}
                                >

                                    <div className={' my-3 checkListBody boxshadow row mx-1 p-4  '}>
                                        {items.map((itm, i) => {
                                                return (
                                                    <>
                                                        <div className="d-flex col-xl-6 col-lg-12 col-12  align-items-center">
                                                            <label key={i} htmlFor="" className={'d-flex  '}
                                                                            onClick={() => {this.toggleItems(itm);}}>
                                                            <i className={`far  fa-2x px-3  ${this.state.menu_items.includes(itm.id)== true?
                                                                'fa-check-square text-primary' : 'fa-square text-black-50'}`}/>
                                                            {itm.item}
                                                        </label>
                                                            <div>
                                                                {
                                                                    this.state.menu_items.includes(itm.id) == true ? (
                                                                        <>
                                                                            <label  htmlFor="" className={'mx-3'}
                                                                                    onClick={() => {this.handleOptional(itm);}}
                                                                                    style={{fontSize: '0.8em'}}>
                                                                                <i className={`far  fa-x mx-2 ${this.state.required_answer_items.includes(itm.id) == true ?
                                                                                    'fa-check-square text-primary'  : 'fa-square text-black-50'}`}/>اجباری
                                                                                <span className="text-danger ">*</span>
                                                                            </label>
                                                                        </>
                                                                    ) : <></>
                                                                }
                                                            </div>
                                                        </div>



                                                    </>
                                                )
                                            }
                                        )}


                                    </div>
                                </CollapseComp>

                            </div>

                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <CollapseComp
                                    title='آیا چک لیست/پرسشنامه مورد نظر از اجزای مختلفی تشکیل شده است؟'
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
                                                               userActions.handleChangeSelect.call(this, e.target.value,
                                                                   {name: e.target.name}, 'components', i)
                                                           }}
                                                           className='form-control boxshadow  border-0 rounded-pill '/>
                                                </div>
                                                <div className={'col-lg-2  col-md-12 mt-3 d-flex justify-content-center'}>
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
                        <br/>
                        <div className="col">
                            <Select className="w-100 text-center custom-select-2 "
                                    value={range}
                                    name="range "
                                    placeholder="انتخاب نحوه تحویل"
                                    onChange={userActions.handleChangeSelect.bind(this)}
                                    options={delivery_type}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.title}
                            />
                        </div>
                        <br/>
                        <br/>

                        <div className="d-flex justify-content-center align-items-center">
                            <button className="btn btn-outline-primary rounded-pill px-5 w-25" onClick={this.saveChecklist}>ثـبت</button>
                            <button className="btn btn-outline-primary rounded-pill px-5 w-25 mx-2">ثـبت موقت</button>
                        </div>
                </div>
                </div>

            </>
        )
    }
}


const ChecklistCreate = connect((state) => ({globalStorage: state.globalStorage}))(ChecklistCreate_);
export {ChecklistCreate}
