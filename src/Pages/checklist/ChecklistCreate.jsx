import React, { Component } from "react";
import { ToggleBotton } from "../../_components";
import { Routes, Questions, CollapseComp } from "../../_components";
import { userActions } from "../../_actions";
import * as _ from "lodash";
import { userConstants } from "../../_constants";
import Select from 'react-select';
import Modal from "react-modal";
import ReactTooltip from 'react-tooltip';
import { connect } from "react-redux";
import AddIcon from '../../assets/images/plus.jpg';
import masoleanjam from '../../assets/images/masoleanjam.png';
import { UsersSelect, HospitalTable } from "../../_components";
import { history } from "../../_helpers";

class ChecklistCreate_ extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mehvar: "",
            id: undefined,
            has_info: undefined,
            mehvar_icon: "",
            certificate: "",
            has_component: false,
            CollectorModal: false,
            selectedUsers: [],
            keyword: '',
            allRanges: ['هفتگـی', 'روزانه', 'ماهانه', 'سه ماه یکبار', 'شش ماه یکبار', 'سالانه'].map(a => ({ title: a })),
            maximum_values: [],
            inquire_info: {},
            items: [],
            monitors: [],
            indicator_id: props.match.params.id,
            title: '',
            range: '',
            description: '',
            number: '',
            components: [],
            questions: [],
            selectedType: null,
            questionGroupByTypes: {},
            questionTypes: userActions.generateSelectLabelValue(['کیفی', 'دوسطحی', 'عددی', 'سوال باز']),
            valuesHeader: [
                {
                    title: 'مقــادیر امتیاز دهــی',
                    getData: (item, index) => {
                        const i = this.state.answers.findIndex(a => a === item)
                        return <input type="text"
                            className="form-control w-75 m-auto d-block rounded-pill text-center"
                            value={item["answer"]}
                            name={"answer"}
                            onChange={(e) => {
                                userActions.handleChangeSelect.call(this, e.target.value, { name: e.target.name }, 'answers', i)
                            }}
                        />
                    },
                    style: {
                        width: '40%'
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
                                userActions.handleChangeSelect.call(this, e.target.value, { name: e.target.name }, 'answers', i)
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
                        }}><i className="fal fa-trash-alt text-danger" /></button>


                    },
                    style: {
                        width: '10%'
                    }
                }
            ],
            answers: [],
            selectedComponent: null,
            selectedItems: [],
            required_answer_items: [],
            is_public: {
                label: 'خیـــر',
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
        }
    }


    handel_is_public = is_public => {
        this.setState({ is_public })
        this.getItems = this.getItems.bind(this);
        // this.getQuestions = this.getQuestions.bind(this);
        this.saveChecklist = this.saveChecklist.bind(this);
        this.toggleItems = this.toggleItems.bind(this);
        this.getAnswererItems = this.getAnswererItems.bind(this);
        // this.getInquireInfo = this.getInquireInfo.bind(this);
        // this.getCompoents = this.getCompoents.bind(this);
        // this.getMaximunValue = this.getMaximunValue.bind(this);
    }
    types = [];
    
    addComponent = (title = null) => {
        const { components } = this.state;
        if (title) {
            components.push({ title, last_title: title });
        } else {
            components.push({ title: '' });
        }
        this.setState({ components })
    }
    onChangeHasComponent = (state) => {
        if (state) {
            if (!this.state.components.length) {
                if (this.state.questions.length) {
                    this.setState({questions: []})
                }
                this.addComponent();
                this.addComponent();
                this.setState({has_component: true})
            }

        } else {
            if (this.state.components.length) {
                const c = this.state.components.filter(c => c.title);
                if (c.length) {
                    this.props.dispatch(userActions.question('حذف اجزاء چک لیست', 'آیا از حذف تمام اجزاء مطمئن هستید؟'))
                    .then(r => {
                        if (r.value) {
                            this.setState({ components: [], has_component: false });
                        }
                    })
                } else {
                    this.setState({ components: [], has_component: false });
                }
            }
        }
    }
    deleteComponent = (item, i) => {
        const { components } = this.state;
        this.props.dispatch(userActions.question('حذف اجزاء چک لیست/پرسشنامه', 'آیا از حذف اجزاء مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (item.id) {
                    this.props.dispatch(userActions.API('delete', `/v2/delete_indicator_component?component_id=${item.id}`)).then(res => {
                        components.splice(i, 1);
                        this.setState({ components });
                    });
                } else {
                    components.splice(i, 1);
                    this.setState({ components });
                }

            }
        })
    }
    deleteAnswer = (item) => {
        const { answers } = this.state;
        const i = answers.findIndex(a => a === item);
        this.props.dispatch(userActions.question('حذف مقادیر پاسخ دهی ', 'آیا از حذف پاسخ مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (item.id) {
                    const ans = this.state.AllAnswers.filter(a => a.type === item.type && a.answer === item.answer);
                    this.props.dispatch(userActions.API('put', `/v2/delete_answer`, { answers: ans.map(a => ({ answer_id: a.id })) })).then(res => {
                        answers.splice(i, 1);
                        this.setState({ answers });

                    });
                } else {
                    answers.splice(i, 1);
                    this.setState({ answers });
                }

            }
        })
    }
    groupTypes = () => {
        const questionsType = this.state.questions.map(q => q.select ? q.select.value : '').filter(q => q.length);

        if (questionsType.length) {
            const questionGroupByTypes_new = [...new Set(questionsType)];

            const { questionGroupByTypes } = this.state;
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
            this.setState({ questionGroupByTypes });
        }

    }
    onChangeQuestions = (questions_) => {
        console.log(questions_);
        const { selectedComponent, questions } = this.state;
        const questions_2 = questions.filter(q => q.component !== (selectedComponent ? selectedComponent.title : 'default'))
        this.setState({ questions: [...questions_2, ...questions_] }, this.groupTypes);
    }
    addQuestions = (q) => {
        const { selectedComponent } = this.state;
        console.log(selectedComponent)
        const question = q ? q : {
            title: '',
            select: '',
            component: selectedComponent ? selectedComponent.title : 'default'
        };
        this.setState({ questions: [...this.state.questions, question] })
    }
    deleteQuestion = (q) => {
        const { questions } = this.state;
        const i = questions.findIndex(qq => qq === q);
        this.props.dispatch(userActions.question('حذف سوال', 'آیا از حذف سوال مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (q.id) {
                    this.props.dispatch(userActions.API('get',
                        `/v2/remove_indicator_question?question_id=${q.id}`)).then(res => {
                            questions.splice(i, 1);
                            this.setState({ questions });

                        });
                } else {
                    questions.splice(i, 1);
                    this.setState({ questions });
                }

            }
        })
    }
    selectType = (type) => {
        this.setState({ selectedType: null }, () => {
            setTimeout(() => {
                this.setState({ selectedType: type }, () => {
                    const { answers } = this.state;

                    if (type === 'دوسطحی' && !answers.find(a => a.type === type)) {
                        this.addAnswer();
                        this.addAnswer();
                    }
                })
            }, 300)
        })

    }
    selectComponents = (selectedComponent) => {
        this.setState({ selectedComponent })
    }
    addAnswer = () => {
        const { answers, selectedType, questionGroupByTypes } = this.state;
        answers.push(Object.assign({}, { answer: '', answer_help: '', type: selectedType }));
        questionGroupByTypes[selectedType]['answers'] = answers;
        this.setState({ questionGroupByTypes, answers })
    }
    handleCloseModal = () => {
        this.setState({ CollectorModal: false, MonitorModal: false });
    }
    openCollectorModal = () => {
        this.setState({ CollectorModal: true });
    }


    handleOptional = (item) => {
        const { required_answer_items, selectedItems, items } = this.state;
        
        const index = required_answer_items.indexOf(item.id) 
        if ( index === -1) {
            required_answer_items.push(item.id)
        } else {
            required_answer_items.splice(index, 1)
        }
       
        const items_index = items.findIndex(i => i.id === item.id)
        items[items_index]['optional'] = !items[items_index]['optional']
        this.setState({
            items,
            required_answer_items
        })
    }

    async toggleItems(item) {
        const { selectedItems, items, required_answer_items } = this.state;
        const index = selectedItems.indexOf(item.id) 
        if ( index === -1) {
            selectedItems.push(item.id)
        } else {
            required_answer_items.splice(required_answer_items.indexOf(item.id), 1) 
            selectedItems.splice(index, 1)
        }

        const item_index = items.findIndex(i => i.id === item.id)
        items[item_index]['checked'] = !items[item_index]['checked']
        this.setState({
            items,
            selectedItems,
            required_answer_items
        })

    }



    saveChecklist = (save=false) => {
       const {
           has_info,
           has_component,
           number,
           description, // goal
           is_public,
           certificate,
           mehvar,
           title,
           components,
           selectedItems, // menu_items
           required_answer_items,
           questions,
           answers,
           selectedUsers,
           range
        } = this.state;
        
        const questions_data = new Array();
        const guides  = new Array();
        const wards = new Array();

        questions.map( (q,i)  => {
            questions_data.push({
                key: q.title,
                component: q.component,
                point_type: q.select.value,
            })
        })

        answers.map( (a,i) => {
            guides.push({
                // answer: "22", answer_help: "22222222222222", type: "دوسطحی"}
                key: a.type,
                value: a.answer,
                guide: a.answer_help
            })
        } )

        
        if (is_public.value === true) {
            const anonymous_ward = this.props.globalStorage.wards.find(ward => ward.name === "بخش ناشناس") 
            if (anonymous_ward) {
                wards.push({
                    ward_id: anonymous_ward["_id"],
                    operator: null,
                    delivery_type: range.title 
                })
            } else {
                return userActions.failure("بیمارستان شما بخش ناشناس ندارد!")
            }
        } else {
            selectedUsers.map( (user,i) => {
                wards.push({
                    operator: user.id,
                    delivery_type: range.title 
                })
            } )
        }
        

        
        

        if(save == false) {
            this.props.dispatch(
                userActions.question("تدوین چک لیست", "آیا از ثبت و ارسال چک لیست به مسئولین ارزیابی مطمئن هستید؟")
            ).then(v => {
                if (v.value) {
                    if (title === "") {
                        return userActions.failure("عنوان چک لیست را پر کنید")
                    }
            
                    if (number === "") {
                        return userActions.failure("شماره چک لیست را پر کنید")
                    }
            
                    if (description === "") {
                        return userActions.failure("هدف چک لیست را پر کنید")
                    }
            
                    if (!questions_data.length) {
                        return userActions.failure("لطفا سوالات چک لیست را تدوین کنید")
                    }
            
            
                    if (!guides.length) {
                        return userActions.failure("لطفا مقادیر امتیازدهی را مشخص کنید")
                    }
            
            
                    if (range === "") {
                        return userActions.failure("لطفا دوره تناوب چک لیست را انتخاب کنید")
                    }

                    let data = {
                        year: this.props.globalStorage.year,
                        mehvar_icon: this.state.mehvar_icon,
                        certificate,
                        mehvar,
                        title,
                        goal: description,
                        number,
                        has_component,
                        has_info,
                        is_public,
                        required_answer_items,
                        menu_items: selectedItems,
                        questions: questions_data,
                        guides,
                        wards,
                        components,
                        save
                    }
                    if (this.state.id !== undefined) {
                        data['id'] = this.state.id
                    }
    
                    this.props.dispatch(
                        userActions.API(
                            'post',
                            'v1/user/hospital/checklist',
                            data
                        )
                    ).then(res => {
                        userActions.successToast("چک لیست جدید با موفقیت ثبت شد.")
                        history.push(`/checklist?mehvar=${mehvar}&certificate=${certificate}&Year=${this.props.globalStorage.year}`)
                    })
                }
            })
        } else {
            let data = {
                year: this.props.globalStorage.year,
                mehvar_icon: this.state.mehvar_icon,
                certificate,
                mehvar,
                title,
                goal: description,
                number,
                has_component,
                has_info,
                is_public,
                required_answer_items,
                menu_items: selectedItems,
                questions: questions_data,
                guides,
                wards,
                components,
                save
            }
            if (this.state.id !== undefined) {
                data['id'] = this.state.id
            }

            this.props.dispatch(
                userActions.API(
                    'post',
                    'v1/user/hospital/checklist',
                    data
                )
            ).then(res => {
                userActions.successToast("چک لیست شما با موفقیت به صورت موقت ثبت گردید.")
                history.push(`/checklist?mehvar=${mehvar}&certificate=${certificate}&Year=${this.props.globalStorage.year}`)
            })
        }
        
    }

    async getItems() {
        let items = [];
        if (!this.props.globalStorage.all_answerer_info_menu_items.length) {
            const res = await this.props.dispatch(userActions.Get_all_answerer_info_menu_items())
            items = res.data.items;
        } else {
            items = this.props.globalStorage.all_answerer_info_menu_items;
        }
        items.map(item => {
            item['checked'] = false;
            item['optional'] = false;

        })
        this.setState({ items });

    }


    async getMaximunValue(question_id, question_type) {
        if (this.types.indexOf(question_type) === -1) {
            this.types.push(question_type);

            this.props.dispatch(userActions.API('get', `/v2/get_question_maximum_value?question_id=${question_id}`, null, false)).then(res => {
                const { maximum_value } = res.data;
                const { maximum_values } = this.state;
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
        return await
            this.props.dispatch(userActions.API
                ('get', `/v2/get_indicator_answerer_info_menu_items?indicator_id=${indicator_id}`))
    }

    

    async componentDidMount() {
        
        try {
            await this.getItems();
            await this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
            
        } catch (e) {
            console.error(e)
        }
        this.props.dispatch(userActions.getWards())
        
        
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        let is_editing = false;

        if (params.get("id") !== null) {
            is_editing = true
            this.props.dispatch(
                userActions.API(
                    "get",
                    `v1/user/hospital/checklists/${params.get("id")}`
                )
            ).then(res => {
                const data = res.data;
                const {answers, questions, selectedUsers, selectedItems,required_answer_items, items, components } = this.state;
                for (var key of Object.keys(data)) {
                    if (key === "checklist_page_components") {
                        data[key].map( comp => {
                            components.push({
                                title: comp.title
                            })
                        })
                        this.selectComponents(components[0])
                        this.setState({components})
                        continue;
                    }
                    
                    if (key === "checklist_page_guides") {
                        data[key].map( guide => {
                            answers.push({
                                answer: guide.value,
                                answer_help: guide.guide,
                                type: guide.key
                            })
                        })

                        this.selectType(answers[0]["key"]);
                        this.setState({answers});
                    } 


                    if (key === "checklist_page_wards") {
                        data[key].map(u => {
                            let user_data = this.props.globalStorage.users.find(user => {
                                return user.id == u.operator
                            })
                            selectedUsers.push({
                                id: user_data['id'],
                                firstname: user_data['fn'],
                                lastname: user_data['ln'],
                                avatar: user_data['avatar'],
                                post: user_data['post'],

                            })
                        })
                        this.setState({
                            selectedUsers,
                            range: {
                                title: data[key][0]["delivery_type"],
                            } 
                        }) 
                    }

                    if (key === "checklist_page_questions") {
                        data[key].map(q => {
                            questions.push({
                                title: q.key,
                                component: q.component,
                                select: q.point_type === null ? "" : {
                                    label: q.point_type,
                                    value: q.point_type
                                }
                            })
                           
                        })
                        this.setState({questions}, this.groupTypes)
                        continue;
                    }

                    if (key === "menu_items") {
                        data[key].map( (item) => {
                            const ItemIndex = items.findIndex(f => f.id === item.id );
                            items[ItemIndex]['checked'] = true;
                            selectedItems.push(item.id);

                            if (data['required_answer_items'].findIndex(i => item.id === i ) !== -1) {
                                items[ItemIndex]['optional'] = true;
                                required_answer_items.push(item.id)
                            }
                        })
                        this.setState({items})
                    }

                    if (key === "goal") {
                        this.setState({
                            description: data[key]
                        })
                        continue;
                    }

                    if (key === "is_public") {
                        if (data[key] === true) {
                            data[key] = {
                                label: ' بلــــه',
                                value: true
                            };
                        } else {
                            data[key] = {
                                label: 'خیـــر',
                                value: false
                            };
                        }
                    }

                    this.setState({[key]: data[key]})
                }
            })
        }

        this.setState({
            is_editing,
            certificate: params.get('certificate'),
            mehvar: params.get('mehvar'),
            mehvar_icon: params.get('mehvar_icon'),
            id: params.get("id")

        })

    }

    /* add collector and select users*/
    getCollector = () => {
        if (this.props.indicatorId) {
            this.props.dispatch(userActions.API('get', `/v2/get_indicator_collectors?indicator_id=
            ${this.props.indicatorId}`)).then(res => {
                const { collectors } = res.data;
                this.setState({ selectedUsers: collectors });
            })
        }

    }
    addCollectors = (selectedUsers) => {
        console.log(selectedUsers)
        this.setState({ selectedUsers })
    }
    save = () => {
        userActions.successToast("افراد مورد نظر انتخاب شدند");
        this.handleCloseModal();

    }
    deleteIndicatorCollector = (collector, i) => {
        const { selectedUsers } = this.state;
        this.props.dispatch(userActions.question('حذف مسئول جمع آوری', 'آیا از حذف مسئول جمع آوری مورد نظر مطمئن هستید؟')).then(r => {
            if (r.value) {
                if (collector.collector_id) {
                    this.props.dispatch(userActions.API('delete', `/v2/delete_indicator_collector?collector_id=${collector.collector_id}`)).then(res => {

                        selectedUsers.splice(i, 1);
                        this.setState({ selectedUsers });

                    });
                } else {
                    selectedUsers.splice(i, 1);
                    this.setState({ selectedUsers });
                }

            }
        })
    }
    /* add collector and select users*/



    render() {

        const {
            indicator_id, title, description, number, components, questions, questionTypes, questionGroupByTypes, selectedType,
            valuesHeader, answers, selectedComponent, selectedItems, items,
            is_public, allRanges, range, has_info,
            toggleBottons, selectedUsers, keyword } = this.state;
        console.log(this.state.questions)


        return (
            <>
                <div className="py-5 text-right bg-light">
                    <Routes page={"checklist/create"} />
                    <div className="container-fluid shadow rounded  py-4 px-3 px-lg-5 bg-white ">

                        <div className="row d-flex justify-content-center   ">
                            <div className={'col-lg-9  '}>
                                <label htmlFor="" className="iran-sans_Bold">عنوان چک لیست </label>
                                <input type="text-aria"
                                    name="title"
                                    value={title}
                                    onChange={userActions.handleChangeInput.bind(this)}
                                    className="form-control  border-0 rounded-pill  boxshadow py-4" />
                            </div>
                            <div className={'col-lg-3  '}>
                                <label htmlFor="" className="iran-sans_Bold"> شماره چک لیست</label>
                                <input type="text-aria"
                                    name="number"
                                    value={number}
                                    onChange={userActions.handleChangeInput.bind(this)}
                                    className="form-control  border-0 rounded-pill boxshadow  py-4" />
                            </div>
                            <div className={'col-lg-12 col-md-12 mt-4 text-right my-2'}>
                                <label htmlFor=""
                                    className="rounded-pill  px-4 py-1 titleInput bg-white iran-sans_Bold"> هدف چک
                                    لیست</label>
                                <textarea className="inputCkeckList form-control rounded p-1 text-justify" cols="30"
                                    rows="10"
                                    name="description"
                                    value={description}
                                    onChange={userActions.handleChangeInput.bind(this)}
                                ></textarea>
                            </div>
                        </div>
                        <br />
                        {/********select public check list ***********/}
                        <div className="col-12">
                            <p className="iran_sans_Bold text-center">
                                آیا چک لیست/پرسشنامه مورد نظر به صورت همگانی است؟
                            </p>
                            <ToggleBotton btns={toggleBottons} onClickHandel={this.handel_is_public}
                                toggle_state={is_public} color="primary"
                                className="toggle_btn w-50 mx-auto text-center d-flex text-white align-items-center iransansBold "
                                myBgColor={"#ffffff"}
                                myColor={"btn-dark-outline"}
                            />
                        </div>
                        <br />
                        <div className={'row d-flex justify-content-center mt-4'}>
                            <div className={'col-lg-6 col-md-10 col-sm-12'}>
                                <CollapseComp
                                    title='آیا چک لیست/پرسشنامه مورد نظر دارای اطلاعات پایه ای می باشد؟'
                                    className='btn-primary'
                                    isOpenedByDefault={selectedItems.length > 0}
                                    onChange={value => this.setState({ has_info: value }) }
                                >

                                    <div className={' my-3 checkListBody boxshadow row mx-1 p-4  '}>
                                        {items.map((itm, i) => {
                                            return (
                                                <>
                                                    <div className="d-flex col-xl-6 col-lg-12 col-12  align-items-center">
                                                        <label key={i} htmlFor="" className={'d-flex  '}
                                                            onClick={() => { this.toggleItems(itm); }}>
                                                            <i className={`far  fa-2x px-3  ${itm['checked'] == true ?
                                                                'fa-check-square text-primary' : 'fa-square text-black-50'}`} />
                                                            {itm.item}

                                                        </label>
                                                        <div>
                                                            {
                                                                itm['checked'] == true ? (
                                                                    <>
                                                                        <label htmlFor="" className={' mx-3'}
                                                                            onClick={() => { this.handleOptional(itm); }}
                                                                            style={{ fontSize: '0.8em' }}>
                                                                            <i className={`far  fa-x mx-2 ${itm['optional'] == true ?
                                                                                'fa-check-square text-primary' : 'fa-square text-black-50'}`} />اجباری
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
                                                                { name: e.target.name }, 'components', i)
                                                        }}
                                                        className='form-control boxshadow  border-0 rounded-pill ' />
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
                        <br />
                        <br />
                        {components.filter(c => c.title).length > 1 &&
                            <>
                                <p className="iran-sans_Bold my-3">انتخاب اجزاء </p>
                                <div className="row mx-1  boxshadow   d-flex justify-content-center   ">
                                    <p className={'text-center col-12 text-black-50 py-2 '}>کابر گرامی لطفاً اجزاء را برای تعریف سوالات انتخاب کنید</p>
                                    {components.filter(c => c.title).map((item, i) =>
                                        <div className="col-lg-2 col-md-3 col-sm-12 pb-2" key={i}>
                                            <button onClick={() => {
                                                this.selectComponents(item)
                                            }}
                                                className={`btn d-flex align-items-center justify-content-center
                                                 ${selectedComponent === item ? 'btn-primary' : 'btn-dark'}
                                                  rounded-pill  text-white  text-center w-100 mx-2 my-2`}>
                                                {item.title}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        }
                        <br />
                        <br />
                        {
                            (components.length === 0 || selectedComponent) &&
                            <>
                                <p className="iran-sans_Bold my-3">تعریف ســوالات</p>
                                <div className="row mx-1 Define-questions boxshadow  py-4 px-4   ">
                                    <Questions disabled={q => q.id} deleteQuestion={this.deleteQuestion}
                                        questions={questions.filter
                                            (q => q.component === (components.length === 0
                                                ? 'default' : selectedComponent.title))}
                                        onChange={this.onChangeQuestions}
                                        selectPlaceholder="انتخاب نوع پاسخ"
                                        selectOptions={questionTypes} />
                                    <button onClick={() => {
                                        this.addQuestions()
                                    }}
                                        className="align-items-center bg-primary btn circleButton
                                            d-flex justify-content-center text-white">
                                        <i className='fas fa-plus '></i>
                                    </button>
                                </div>
                                <br />
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
                        <br />
                        {selectedType && <div>
                            <div
                                className='bg-primary text-white rounded-pill  animated slideInRight text-center py-1 titleVlaue'
                                style={{ zIndex: 9 }}>{selectedType}</div>
                            <div
                                className="animated fadeIn d-flex mx-1 container-fluid  boxshadow   d-flex justify-content-center  py-5   ">
                                <HospitalTable totalPage={1} pageOnChange={() => {
                                }} rows={answers.filter(a => a.type === selectedType)} headers={valuesHeader}
                                    addToTable={selectedType !== 'دوسطحی' ? this.addAnswer : undefined} />
                            </div>
                        </div>
                        }
                        <>
                            <p className="iran-sans_Bold my-3"> بخش ها و مسئول پایش</p>
                            <div className="row mx-1  boxshadow  py-4 px-4   ">
                                <div className="text-center text-justify iran_sans_Bold mx-auto col-12 my-3">
                                    کاربر گرامی برای تکمیل چک لیست لطفاً بخش های مورد استفاده،
                                    مسئول تکمیل چک لیست در هر بخش و تاریخ تحویل آن را مشخص فرمایید.
                                </div>
                                <br />
                                <div className="col">
                                    <Select className="w-100 text-center custom-select-2 "
                                        value={range}
                                        name="range"
                                        placeholder="انتخاب نحوه تحویل"
                                        onChange={userActions.handleChangeSelect.bind(this)}
                                        options={allRanges}
                                        getOptionLabel={opt => opt.title}
                                        getOptionValue={opt => opt.title}
                                    />
                                </div>
                                
                                { this.state.is_public.value === false && <div className="col-md-12 d-flex justify-content-center my-3">
                                    <>
                                        <button className="btn  rounded-circle" onClick={this.openCollectorModal}>
                                            <img src={masoleanjam}
                                                width={60}
                                                height={60}
                                                alt="index" />
                                        </button>
                                        <Modal
                                            onAfterOpen={this.getCollector}
                                            isOpen={this.state.CollectorModal}
                                            onRequestClose={this.handleCloseModal}
                                            contentLabel="Collector Modal"
                                            portalClassName="full_screen_modal"
                                        >
                                            <div className="container bg-light rounded py-4 shadow-sm">
                                                <div className="row  ">
                                                    <div className="col-lg-10 m-auto  ">
                                                        <div className="form-group mt-3 ">
                                                            <input type="text"
                                                                name="keyword"
                                                                value={keyword}
                                                                onChange={userActions.handleChangeInput.bind(this)}
                                                                className="form-control rounded-pill border-0 py-4 shadow-sm  text-center text-blue"
                                                                placeholder="نام و  نام خانوادگی، و یا سمت شخص مورد نظر را جستجو کنید را وارد کنید" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row d-flex justify-content-around mt-3 ">
                                                    {
                                                        selectedUsers.filter(u => keyword ? (u.firstname.indexOf(keyword) >= 0 || u.lastname.indexOf(keyword) >= 0 || (u.post && u.post.indexOf(keyword) >= 0)) : true).map((user, i) =>
                                                            <div
                                                                className="fadeIn animated d-flex flex-column align-items-center col-lg-3 col-md-6 my-2"
                                                                key={i}>
                                                                <button onClick={() => {
                                                                    this.deleteIndicatorCollector(user, i)
                                                                }} data-tip="حذف"
                                                                    className="btn flipper rounded-circle overflow-hidden position-relative p-0"
                                                                    style={{
                                                                        minWidth: 50,
                                                                        maxWidth: 50,
                                                                        minHeight: 50,
                                                                        maxHeight: 50,
                                                                        zIndex: 9
                                                                    }} s>

                                                                    <div className="flip-box-inner bg-light"
                                                                        style={{ minHeight: 50 }}>
                                                                        <img className="front-face bg-light"
                                                                            src={userConstants.SERVER_URL + user.avatar.url}
                                                                            width="50"
                                                                            height="50" alt="" />
                                                                        <div
                                                                            className="back-face bg-danger text-center  d-flex align-items-center justify-content-center w-100 h-100 text-light">
                                                                            <i className="fal fa-trash-alt text-white fa-2x" />
                                                                        </div>
                                                                    </div>


                                                                </button>
                                                                <ReactTooltip type="light" />
                                                                <span>{user.firstname + ' ' + user.lastname}</span>
                                                                <span>  {user.post || ' '}</span>
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                                <div className="row d-flex justify-content-center mt-3">

                                                    <div className="d-flex flex-column align-items-center mb-3 ">
                                                        <UsersSelect className="btn animated bounceInUp rounded-pill"
                                                            selectedUsers={this.state.selectedUsers}
                                                            submit={this.addCollectors}>
                                                            <img data-tip="افــزودن مسئـول جمع آوری" src={AddIcon}
                                                                width="50px"
                                                                height="50px"
                                                                alt="افــزودن مسئـول جمـع آوری" />
                                                        </UsersSelect>
                                                        <ReactTooltip type="light" />
                                                    </div>
                                                </div>
                                                <div className="w-100 d-flex justify-content-center">

                                                    <button onClick={this.save} type="button"
                                                        className="btn btn-blue rounded-pill px-5 mx-2"
                                                        style={{ minWidth: 200 }}>ثبت
                                                    </button>
                                                    <button type="button"
                                                            className="btn btn-blue rounded-pill px-5  mx-2"
                                                            style={{ minWidth: 200 }}
                                                            onClick={this.handleCloseModal}>انصـراف
                                                    </button>
                                                </div>
                                            </div>
                                            <UsersSelect />
                                        </Modal>

                                    </>


                                </div>}
                            </div>
                            <br />
                        </>
                        <br />


                        <div className="d-flex justify-content-center align-items-center">
                            <button className="btn btn-outline-primary rounded-pill px-5 w-25 mx-2" onClick={() => this.saveChecklist(true)}>ثـبت موقت</button>
                            <button className="btn btn-outline-primary rounded-pill px-5 w-25" onClick={() => this.saveChecklist()}>ثبت</button>
                        </div>

                    </div>
                </div>

            </>
        )
    }
}


const ChecklistCreate = connect((state) => ({ globalStorage: state.globalStorage }))(ChecklistCreate_);
export { ChecklistCreate }
