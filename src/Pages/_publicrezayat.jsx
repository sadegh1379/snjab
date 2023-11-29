import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import { IndicatorCalenderComp, HospitalTable, InputGenerator } from "../_components";
import polling from "../assets/images/docu.png";
import { userActions } from "../_actions";
import { ChecklistView } from "./indicator/components";
import dataint from '../assets/images/123.png';
// dowgani
import * as checks from '../check';
import login_docc from "../assets/images/crm.png";
import noavaranLogo from "../assets/images/dddd.png";

class Publicrezayat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      WindowWidth: null,
      intervals: [],
      interval: null,
      menuItems: [],
      measure_interval: null,
      complateChecklist: false,
      checklist: null,
      checklist_info: "",
      total: 0,
      per_page: 48,
      page: 1,
      headers: [
        {
          title: "ردیف",
          style: { width: "10%" },
          getData: (item, index) =>
            (parseInt(this.state.page) - 1) * this.state.per_page + 1 + index
        },
        {
          title: "عنوان",
          style: { width: "60%" },
          getData: (item, index) => item.title
        },
        {
          title: "محور",
          style: { width: "15%" },
          getData: (item, index) => (
            <span className="border border-primary d-block mx-auto p-1 rounded-circle " style={{width: '40px',height: '40px',fontSize: '28px',background: '#104c82',color: 'white',lineHeight: '43px'}}>
              <i className={item.mehvar_icon} data-tip={item.mehvar} />
              <ReactTooltip type="light" />
            </span>
          )
        },
        {
          title: "تکمیـل",
          style: { width: "15%" },
          getData: (item, index) => (
            <button className="btn "
              ref={this.simulateClick} onClick={()=> { console.log(item._id);this.detailChecklist(item) }}
              id={item._id}>
              <img src={dataint} alt="" className="d-block mx-auto" width={40}/>
            </button>
          )
        }
      ],
      checklists: [],
      questions: null,
      hospital: props.match.params.hospital
    };
  }
  componentDidMount() {
    this.checkIDOFListCheckList();
    this.searchFn("", "ward");
    this.getChecklists();

    this.setState({ WindowWidth: window.innerWidth })

    window.addEventListener('resize', this.handleWindowSizeChange)

  }

  handleWindowSizeChange = () => {
    this.setState({ WindowWidth: window.innerWidth });
  }

  simulateClick() {
    if(checks.default.hide){
      document.getElementById(checks.default.id_d).click();
    }
  }
  simulateonChange() {
    if(checks.default.hide){
      document.getElementById(checks.default.id_d).childNodes[1].childNodes[0].childNodes[0].click();
    }
  }
  // dowgani
  checkIDOFListCheckList = () => {
    setTimeout(() => {}, 200);

  }
  searchFn = (value, type) => {
    const { hospital } = this.props.match.params;
    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v1/search_${type}?hospital_id=${hospital}&query=${value}`,
          null,
          false
        )
      )
      .then(res => {
        if (type === "user") {
          res.data.result.push({ fn: "سایر", ln: "اعضا" });
        }
        this.setState({ [type + "s"]: res.data.result });
      });
  };
  search = (e, type) => {
    const { value, name } = e.target;

    this.setState({ [name]: value }, () => {
      if (value.length >= 2) {
        this.searchFn(value, type);
      } else {
        this.setState({ [type + "s"]: [] });
      }
    });
  };
  getChecklists = (page = 1) => {
    const { hospital } = this.state;
    const { year } = this.props.globalStorage;
    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v1/public_checklists?hospital_id=${hospital}&year=${year}&page=${page}&per=48`
        )
      )
      .then(res => {
        this.setState({
          page,
          checklists: res.data.result,
          total: Math.ceil(res.data.meta.all_count / 24)
        });
        var scrollDiv = document.getElementById("root").offsetTop;
        window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
      });
  };
  getCheckListInterval = checklist => {
    console.log(checklist)
    const measure_interval = checklist.checklist_page_wards[0]["delivery_type"];
    let repeat_value = userActions.getPeriodCount(measure_interval);
    const intervals = [];
    for (let i = 0; i < repeat_value; i++) {
      intervals.push({});
    }
    return intervals
  }
  detailChecklist = checklist => {
    console.log(checklist)
    const measure_interval = checklist.checklist_page_wards[0]["delivery_type"];
    let repeat_value = userActions.getPeriodCount(measure_interval);
    const intervals = [];
    for (let i = 0; i < repeat_value; i++) {
      intervals.push({});
    }
    const menuItems = Array.from(checklist.menu_items).map(itm => {
      delete itm.value;
      return itm;
    });
    const components = userActions.groupBy(checklist.checklist_page_questions, 'component');
    const questions = [];
    Object.keys(components).map(c => {
      questions.push({
        component: c,
        content: components[c].map(q => {
          return {
            question_id: q._id,
            question: q.key,
            question_type: q.point_type,
            answers: checklist.checklist_page_guides.filter(ans => ans.key === q.point_type).map(ans => {
              return {
                id: ans._id,
                answer: ans.value,
                answer_help: ans.guide
              }
            })
          }
        })
      })
    })
    this.setState({ checklist, measure_interval, intervals, menuItems, questions, ward: '' });
  };

  closeDetailChecklist = () => {
    this.setState({ checklist: null });
  };
  closeChecklist = () => {
    this.detailChecklist(this.state.checklist);
    this.setState({ complateChecklist: false });
  };
  onChangeInfo = (item, data) => {
    const { menuItems } = this.state;
    menuItems[menuItems.indexOf(item)].value = data;
    this.setState({ menuItems });
  };
  setAnswer = (e, question, answer_index, answer) => {
    const { name, value } = e.target;
    const { questions } = this.state;
    const index_array = name.split("-");
    const last_answer =
      questions[index_array[0]]["content"][index_array[1]]["answer"];
    if (question.question_type === "سوال باز") {
      questions[index_array[0]]["content"][index_array[1]]["answer"] = value;
    } else if (question.question_type === "کیفی") {
      questions[index_array[0]]["content"][index_array[1]]["answer"] =
        last_answer === answer.answer ? undefined : answer.answer;
      questions[index_array[0]]["content"][index_array[1]]["value"] =
        last_answer === answer.answer ? undefined : answer_index + 1;
    } else if (question.question_type === "دوسطحی") {
      questions[index_array[0]]["content"][index_array[1]]["answer"] =
        last_answer === answer.answer ? undefined : answer.answer;
      questions[index_array[0]]["content"][index_array[1]]["value"] =
        last_answer === answer.answer ? undefined : answer_index;
    } else {
      questions[index_array[0]]["content"][index_array[1]]["answer"] =
        last_answer === answer.answer ? undefined : answer.answer;
      questions[index_array[0]]["content"][index_array[1]]["value"] =
        last_answer === answer.answer ? undefined : answer.answer;
    }
    this.setState({ questions });

  };
  submitChecklist = (e) => {
    e.preventDefault();
    const { menuItems, ward, questions, checklist, interval, hospital } = this.state;
    const guides = userActions.groupBy(checklist.checklist_page_guides, 'key');
    const answerer_info = menuItems.filter(m => m.value != null).map(m => ({ answerer_info_menu_item_id: m.id, value: typeof m.value === 'object' ? m.value.id || m.value._id || m.value.value : m.value }));
    const records = [];
    const all_2_level = questions.every(q => {
      return q.content.every(c => c.question_type === 'دوسطحی' || c.question_type === 'سوال باز')
    })
    let score = 0;
    let makhraj = 0;
    let max_score = 0;
    questions.map(q => {
      if (q.content) {
        q.content.map(c => {
          if (c.answer != undefined) {
            if (c.question_type !== 'سوال باز') {
              if (c.question_type !== 'دوسطحی' || all_2_level) {
                score = parseFloat(score) + parseFloat(c.value);
                if (!max_score) {
                  max_score = c.question_type === 'کیفی' ? guides[c.question_type].length : (c.question_type === 'دوسطحی' ? 1 : guides[c.question_type][guides[c.question_type].length - 1]['value']);
                }
                makhraj++;
              }
            }
            records.push({
              question: c.question,
              value: c.answer,
              v: c.value,
              point_type: c.question_type
            })
          }
        })
      }
    });
    makhraj = makhraj * max_score;
    const params = {
      checklist_page_id: checklist._id,
      year: this.props.globalStorage.year,
      hospital_id: hospital,
      submitted_at: interval.interval_number,
      records,
      id: checklist.checklist_page_wards[0]._id,
      details: {
        infos: answerer_info,
        save_temp: false,
        ward_id: ward.id,
        records,
        value: (score / (makhraj ? makhraj : 1)).toFixed(4),
      }
    }
    this.props.dispatch(userActions.API('post', '/v1/answer_checklist', params)).then(res => {
      userActions.successToast('پاسخ شما با موفقیت ثبت شد.');
      this.closeDetailChecklist();
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const auto = params.get('auto');
      const idd = params.get('_id');
      console.log("auto"+auto);
      console.log("id"+idd);
      if(auto==1){
        window.location.href = "https://app.snjab.ir/end/?hospital="+hospital;
      }
    })

  }
  createIntervals = (intervals = [], measure_interval = '') => {
    let title;
    let days = null;
    return (
        intervals.map(
            (interval, index) => {
                title = userActions.getIntervalTitle(measure_interval==='روزانه'?'ماهانه':measure_interval, index + 1);
                if (measure_interval === 'روزانه') {
                    days = this.getDays(index + 1, interval);
                    interval = {};
                }
                return (
                    {
                        title,
                        interval_number: index + 1
                    }

                )
            }
        )
    )
}


  render() {
    const {
      checklist,
      checklist_info,
      checklists,
      headers,
      total,
      page,
      measure_interval,
      complateChecklist,
      ward,
      wards,
      questions,
      menuItems
    } = this.state;
    console.log(this.state.intervals)
    return (
      <div
        className="w-100 bg-drr py-5 container-fluid"
        style={{ minHeight: "100vh" }}
      >
        <img
          src={login_docc}
          alt="نظـرسنجـی"
          className="d-block mx-auto"
          width={120}
        />
        <h2 className="text-center text-primary h5 mt-4">رضـایت سنجـی</h2>

          <img src={noavaranLogo} className="d-block mx-auto mt-3 animated fadeInUp" style={{top: '-5px',position: 'relative'}} alt="سنجاب"
               width={130}/>
          <div className="d-flex justify-content-center animated zoomIn">
            <div className="lines bg-blue col-6 col-sm-10  col-md-8 col-lg-3" style={{top: -19}}/>
          </div>
        <br />

        {!checklist && (
          <>
            {
              this.state.WindowWidth < 768 ?
                <>
                  {/* Mobile Device */}
                  <div className="row p-2">
                    {
                      checklists.map((checklist, i) => {
                        return (
                          <>
                            <div key={i} style={{ backgroundColor: "#104c82" }} className="col-12 col-md-4 rounded my-2 p-4">
                              {/* <div className="border-left border-primary p-2"> */}
                              <span
                                className="border border-primary d-block mx-auto d-flex justify-content-center align-items-center p-1 rounded-circle text-blue"
                                style={{ width: 55, height: 55, lineHeight: "2.5em",borderRadius:"10px" }}
                              >
                                <i style={{ fontSize: "18px" }} className={checklist.mehvar_icon} data-tip={checklist.mehvar} />
                                <ReactTooltip type="light" />
                              </span>
                              <p className="text-center iran-sans_Bold mt-2">
                                {checklist.title}
                              </p>
                              {/* </div> */}
                              <div className="col-12 col-md-6">
                                <div className="form-group text-right ">
                                  <label className="iran-sans_Bold text-right text-dark">
                                    {" "}
                                    دوره تناوب{" "}
                                  </label>
                                  <Select
                                  ref={this.simulateonChange}
                                  id={checklist._id}
                                    className="text-center custom-select-2"
                                    // value={ward}
                                    // name="ward"
                                    placeholder=""
                                    onChange={(data) => {
                                        this.setState({ 
                                          complateChecklist: true,
                                          interval:  {
                                            interval_number: data.interval_number
                                          }
                                       });
                                        this.detailChecklist(checklist);
                                      }
                                  }
                                    options={this.createIntervals(this.getCheckListInterval(checklist) , checklist.checklist_page_wards[0]["delivery_type"])}
                                    getOptionLabel={opt => opt.title}
                                    getOptionValue={opt => opt.interval_number}
                                    menuIsOpen={true}
                                    defaultMenuIsOpen={true}
                                    // id="ward"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })
                    }
                  </div>
                </>
                :
                <>
                  <HospitalTable
                    pageOnChange={this.getChecklists}
                    active={page}
                    totalPage={total}
                    headers={headers}
                    rows={checklists}
                  />
                </>
            }
          </>
        )}
        {checklist && !complateChecklist && this.state.WindowWidth > 768 && (
          <IndicatorCalenderComp
            measure_interval={measure_interval}
            indicator={checklist}
            intervals={this.state.intervals}
            OpenMonitorScreenModal={(data) => {
              console.log("!!!!!!!!!", data)
              this.setState({ complateChecklist: true, interval: data });
            }}
            CloseModal={this.closeDetailChecklist}
            wards={wards}
          />
        )}
        {checklist && complateChecklist && (
          <>
            {
              this.state.WindowWidth < 768 ?
                <>
                  {/* Mobile Device */}
                  <div className="pt-3 pb-4  checklistModalView">
                    <div  className={`${checks.default.hide?'d-none':''} row my-4 justify-content-center`} id="section_remove_dowgani" >
                      <div className="col-12 col-md-6">
                        <div className="form-group text-right ">
                          <label className="iran-sans_Bold text-right text-dark">
                            {" "}
                        بخش{" "}
                          </label>
                          <Select
                            className="text-center custom-select-2"
                            value={ward}
                            name="ward"
                            placeholder=""
                            onChange={userActions.handleChangeSelect.bind(this)}
                            options={wards}
                            getOptionLabel={opt => opt.name}
                            getOptionValue={opt => opt.id}
                            id="ward"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row ">
                      <div className="container-fluid shadow rounded  py-2 pb-4 bg-white ">
                        <div className="row d-flex justify-content-center titleVlaue p-3 ">
                          <div
                            className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5  ">
                            رضـایت سنجـی
                          </div>
                        </div>
                        <div className="row d-flex justify-content-center p-3 ">
                          {menuItems.map((m, i) =>
                            <div className="col-lg-4  col-md-6 my-3 position-relative" key={i}>
                              <p className="text-right iran_sans_Bold" htmlFor=""> {m.item}</p>
                              <div className="pt-2 pb-4 ">
                                <InputGenerator
                                  dispatch={this.props.dispatch}
                                  type={m.item_type}
                                  globalStorage={this.props.globalStorage}
                                  placeholder={m.placeholder || m.place_holder}
                                  options={m.options ? userActions.generateSelectLabelValue(m.options) : []}
                                  onChange={(data) => {
                                    this.onChangeInfo(m, data)
                                  }}
                                  value={m.value}
                                />
                              </div>

                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                    <div>
                      {questions.map((q, i) =>
                        <>
                          {
                            q.component !== 'default' | q.component !== ''
                              ? <div className=" mt-4 text-center text-white">{q.component}</div>
                              : <></>
                          }
                          {
                          q.content.map((question, h) => {
                            var jjj=0;
                            return <>
                              <div className="bg-white px-3 pt-3 my-3 rounded  shadow" >
                                <p className="text-right iran-sans_Bold" style={{color: "#444444",fontSize:"0.8em", lineHeight: "2.5em"}}>{h + 1} ) {question.question}</p>

                                <div className="row">
                                  
                                  {q.content[0] && q.content[0]['answers'] && q.content[0]['answers'].map((a, j) => {

                                    if (question.question_type !== 'سوال باز') {
                                      if(question.question_type === 'دوسطحی'){
                                        jjj = jjj + 1;
                                        if(jjj  <= 2){
                                          return (
                                            <>
                                              <div key={j}
                                                data-tip={a.answer_help} data-for={`data-${j}`}
                                                className="text-center iran-sans_Bold align-self-center bg-blue text-white py-3"
                                                style={{
                                                  height: "70px",
                                                  width: (100 / 2) + '%',
                                                  fontSize: "0.7em"
                                                }}>{ jjj==1 ? `خیـر` : `بلـی` }</div>
                                              <ReactTooltip id={`data-${j}`} />
                                            </>
                                          )
                                        }
                                        
                                      }else{
                                        return (
                                          <>
                                            <div key={j}
                                              data-tip={a.answer_help} data-for={`data-${j}`}
                                              className="text-center iran-sans_Bold align-self-center bg-blue text-white py-3"
                                              style={{
                                                height: "70px",
                                                width: (100 / q.content[0]['answers'].length) + '%',
                                                fontSize: "0.7em"
                                              }}>{a.answer}</div>
                                            <ReactTooltip id={`data-${j}`} />
                                          </>
                                        )
                                      }
                                    }
                                  }
                                  )}
                                  {question.question_type !== 'سوال باز' && question.answers && question.answers.map((a, z) =>

                                    <label key={z}
                                      className={`m-0 d-flex justify-content-center text-center text-iransans  position-relative   `}
                                      style={{ height: "70px", width: (100 / question.answers.length) + '%' }}>
                                      <input type="checkbox"
                                        className="d-none"
                                        name={i + '-' + h}
                                        value={a.answer}
                                        onChange={(e) => {
                                          this.setAnswer(e, question, z, a)
                                        }}
                                      // disabled={this.props.readOnly}
                                      />
                                      <i className={`fa-2x fal ${a.answer == question.answer ? 'fa-check text-success' : ''} ${h % 2 ? "question-row " : ''} shadow-sm mx-1 my-0 py-3 w-100 text-center `}></i>
                                      {/* <span className="hint">{a.answer}</span> */}
                                    </label>
                                  )}
                                  {question.question_type == 'سوال باز'
                                    &&
                                    <textarea
                                      style={{ height: "135px" }}
                                      className="form-control mb-5 mt-2 p-2 shadow-sm w-100"
                                      name={i + '-' + h}
                                      value={question.answer}
                                      onChange={(e) => {
                                        this.setAnswer(e, question)
                                      }}
                                    // readOnly={this.props.readOnly}
                                    ></textarea>
                                  }
                                </div>
                              </div>
                            </>
                          })
                          }
                          {/* <div className="row py-5 bg-white rounded key={i}>
                              <p className="w-100 text-center text-justify iran-sans_Bold ">{q.component !== 'default' ? q.component : ''}</p>
                              <div className="w-100 ">
                                <div className="question-table text-center " style={{ overflowX: 'auto' }}>
                                  <div className="question-title d-flex mx-2 py-2" style={{ minWidth: '1100px' }}>
                                    <div className="width-5 text-center  iran-sans_Bold ">ردیف</div>
                                    <div className="w-70 text-center iran-sans_Bold">موارد مورد بررسی (سوالات)
                                            </div>
                                    {q.content[0] && q.content[0]['answers'] && q.content[0]['answers'].map((a, j) =>
                                      <>
                                        <div key={j}
                                          data-tip={a.answer_help} data-for={`data-${j}`}
                                          className="text-center iran-sans_Bold align-self-center rotate-90 py-3"
                                          style={{
                                            width: (25 / q.content[0]['answers'].length) + '%',
                                            fontSize: "1em"
                                          }}>{a.answer}</div>
                                        <ReactTooltip id={`data-${j}`} />
                                      </>
                                    )}

                                  </div>
                                  <div className="contents flex-column d-flex mx-2" style={{ minWidth: '1100px' }}>
                                    {q.content.sort((a, b) => {
                                      if (a.question_type && b.question_type) {
                                        if (a.question_type < b.question_type) {
                                          return 1;
                                        }
                                        if (a.question_type > b.question_type) {
                                          return -1;
                                        }
                                        return 0;
                                      }
                                      return 0;
                                    }).map((question, h) =>
                                      <div className="row mx-0   " key={h}>
                                        <div className="width-5 text-center text-iransans py-1 ">
                                          <p style={{ minHeight: "56px" }} className={`${h % 2 && "question-row"} shadow-sm mx-1 my-0 py-3 text-center `}>{h + 1}</p>
                                        </div>
                                        <div
                                          className={` text-center text-iransans py-1 ${question.question_type == 'سوال باز' ? 'width-95' : 'w-70'} `}>
                                          <p style={{ minHeight: "56px" }} className={`${h % 2 && "question-row "} shadow-sm mx-1 my-0 py-2 text-center `}>
                                            {question.question}
                                          </p>
                                        </div>
                                        {question.question_type !== 'سوال باز' && question.answers && question.answers.map((a, z) =>

                                          <label key={z}
                                            className={`m-0 d-flex justify-content-center text-center text-iransans  py-1  position-relative  `}
                                            style={{ width: (25 / question.answers.length) + '%' }}>
                                            <input type="checkbox"
                                              className="d-none"
                                              name={i + '-' + h}
                                              value={a.answer}
                                              onChange={(e) => {
                                                this.props.setAnswer(e, question, z, a)
                                              }}
                                              disabled={this.props.readOnly}
                                            />
                                            <i className={`fa-2x fal ${a.answer == question.answer ? 'fa-check text-success' : ''} ${h % 2 ? "question-row " : ''} shadow-sm mx-1 my-0 py-3 w-100 text-center `}></i>
                                            <span className="hint">{a.answer}</span>
                                          </label>
                                        )}
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

                                  </div>

                                </div>

                              </div>
                            </div>
                           */}
                        </>
                      )}


                    </div>

                    <div className="row justify-content-center pb-4 mt-4">
                      <button type="submit" onClick={this.submitChecklist} className="btn btn-blue rounded-pill    mx-4 my-1 col-sm-5">ثبت</button>
                      <button onClick={this.closeChecklist} type="reset"
                        className="btn btn-outline-blue rounded-pill    mx-4 my-1 col-sm-5">انصـراف
                        </button>
                    </div>
                  </div>

                </>
                :
                <>
                  {/* DESKTOP DEVICES */}
                  <div className="container pt-3 pb-4   checklistModalView">
                    <div className="row my-4 justify-content-center">
                      <div  id="section_remove_dowgani"
                            className={`${checks.default.hide?'d-none':''} col-12 col-md-6`}>
                        <div className="form-group text-right ">
                          <label className="iran-sans_Bold text-right text-dark">
                            {" "}
                        بخش{" "}
                          </label>
                          <Select
                            className="text-center custom-select-2"
                            value={ward}
                            name="ward"
                            placeholder=""
                            onChange={userActions.handleChangeSelect.bind(this)}
                            options={wards}
                            getOptionLabel={opt => opt.name}
                            getOptionValue={opt => opt.id}
                            id="ward"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="row ">
                      {questions && (
                        <ChecklistView
                          globalStorage={this.props.globalStorage}
                          dispatch={this.props.dispatch}
                          questions={questions}
                          menuItems={menuItems}
                          closeModal={this.closeChecklist}
                          ward={ward}
                          checklist_info={checklist_info}
                          setAnswer={this.setAnswer}
                          onChangeInfo={this.onChangeInfo}
                          submit={this.submitChecklist}
                        />
                      )}
                    </div>
                  </div>
                </>
            }
          </>
        )}
        <br />
      </div>
    );
  }
}
export default connect(state => ({ globalStorage: state.globalStorage }))(
  Publicrezayat
);
