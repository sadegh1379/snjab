import React, { Component } from "react";
import { GiftedChat, Send } from "react-gifted-chat";
import Select from "react-select";
import moment from "jalali-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Popover, { ArrowContainer } from "react-tiny-popover";
import Modal from "react-modal";
import ReactTooltip from "react-tooltip";
import Loading from "../assets/images/loading_2.gif";
import WardIcon from "../assets/images/WardIcon.png";
import DocIcon from "../assets/images/document.png";
import trash from "../assets/images/trash.svg";
import EDIT from "../assets/images/edit-flat.png";
import TakmilIcon from "../assets/images/takmilchecklist.svg";
import Gauge from "../assets/images/gauge.png";
import DoctorIcon from "../assets/images/doctor.png";
import { CalendarInterval, HospitalTable, InputGenerator } from "./index";
import { userActions } from "../_actions";
import { ChecklistView, IntervalValue } from "../Pages/indicator/components";
import Media from "react-media";
import backIcon from "../assets/images/back.png";
import { userConstants } from "../_constants";
Modal.setAppElement("#root");

class IndicatorCalender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailAnswerer: false,
      filterward: "",
      intervals: [],
      filter: "",
      indicator: this.props.indicator,
      numerator_help_popover: false,
      denumerator_help_popover: false,
      users: [],
      boxes: null,
      detailModal: false,
      detailFormula: false,
      formulaHeaders: [
        {
          title: "ردیف",
          getData: (item, index) => {
            return (
              (parseInt(this.state.pageForFormula) - 1) * this.state.per_page +
              1 +
              index
            );
          },
          style: {
            width: "5%",
            padding:'10px',
          },
        },
        {
          title: "دوره ارزیابی",
          getData: (item, index) =>
            userActions.getIntervalTitle(
              this.state.indicator.measure_interval,
              item.interval_number
            ),
          style: {
            width: "15%",
          },
        },
        {
          title: "تاریخ ثبت",
          getData: (item, index) =>
            moment(item.created_at).format("jYYYY/jMM/jDD"),
          style: {
            width: "10%",
          },
        },
        {
          title: "نام بخش",
          getData: (item, index) => item.ward,
          style: {
            width: "10%",
          },
        },
        {
          title: "مسئول اندازه گیری",
          getData: (item, index) => item.user,
          style: {
            width: "15%",
          },
        },
        {
          title:
            " صورت " +
            '<p style="font-size: .7em">(' +
            props.indicator.numerator +
            ") </p>",
          getData: (item, index) => {
            let res = "";
            if (item.numerator) {
              item.numerator.map((n, i) => {
                res += n;
                if (props.indicator.numerator_operators[i]) {
                  res += props.indicator.numerator_operators[i];
                }
              });
            } else {
              res = "1";
            }

            return res;
          },
          style: {
            width: "15%",
          },
        },
        {
          title:
            " مخرج " +
            '<p style="font-size: .7em">(' +
            props.indicator.denumerator +
            ") </p>",
          getData: (item, index) => {
            let res = "";
            if (item.denumrator) {
              item.denumrator.map((n, i) => {
                res += n;
                if (props.indicator.denumerator_operators[i]) {
                  res += props.indicator.denumerator_operators[i];
                }
              });
            } else {
              res = 1;
            }

            return res;
          },
          style: {
            width: "15%",
          },
        },
        {
          title: "عدد شاخص",
          getData: (item, index) => this.calc(item.numerator, item.denumrator),
          style: {
            width: "5%",
          },
        },
        {
          title: "عملیات",
          getData: (item, index) => {
            return (
              <div className="d-flex justify-content-center align-items-center">
                {!this.props.only_me && (
                  <button
                    className="btn btn-link"
                    data-tip="حذف"
                    onClick={() => this.deleteFormulaRecord(item.id)}
                  >
                    <img src={trash} alt="حذف" width={30} />
                  </button>
                )}
                {/*<button className="btn btn-link" data-tip="ویرایش"  onClick={()=>this.editFormulaRecord(item)}><img src={EDIT} alt="ویرایش" width={30}/></button>*/}
                <button
                  onClick={() => this.showMessages(item)}
                  className="btn btn-link"
                  data-tip="مکاتبـات"
                >
                  <img src={DoctorIcon} alt="مکاتبات" width={30} />
                </button>
                {this.props.indicator.has_menu_item && (
                  <button
                    onClick={() => this.showDetailRecod(item)}
                    className="btn btn-link"
                    data-tip="جزئیات"
                  >
                    <img src={TakmilIcon} alt="جزئیات" width={30} />
                  </button>
                )}
                <ReactTooltip type="dark" />
              </div>
            );
          },
          style: {
            width: "10%",
          },
        },
      ],
      checklistHeaders: [
        {
          title: "ردیف",
          getData: (item, index) => {
            return index + 1;
          },
          style: {
            width: "10%",
            padding:'10px',
          },
        },
        {
          title: "دوره ارزیابی",
          getData: (item, index) => {
            return userActions.getIntervalTitle(
              this.state.indicator.measure_interval,
              item.interval_number
            );
          },
          style: {
            width: "15%",
          },
        },
        {
          title: "تعداد کل ارزیابی ها",
          getData: (item, index) => item.answers_count,
          style: {
            width: "15%",
            padding: '10px',
          },
        },
        {
          title: "امتیاز ارزیابی",
          getData: (item, index) => {
            return item.average !== null ? item.average.toFixed(2) + "%" : "-";
          },
          style: {
            width: "20%",
          },
        },
        {
          title: "بخش ارزیابی شونده",
          getData: (item, index) =>
            item.wards.length > 1 ? (
              <Popover
                isOpen={item.popOver_open}
                position={["top", "right", "left", "bottom"]} // preferred position
                padding={10}
                containerStyle={{ zIndex: 9999 }}
                onClickOutside={() =>
                  userActions.toggleState.call(
                    this,
                    "popOver_open",
                    "byChecklistRecords",
                    index
                  )
                }
                content={({ position, targetRect, popoverRect }) => (
                  <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                    position={position}
                    targetRect={targetRect}
                    popoverRect={popoverRect}
                    arrowColor={"#1c94e0"}
                    arrowSize={10}
                  >
                    <div className="bg-blue rounded p-4">
                      <ul className="list-unstyled">
                        {item.wards.map((w, i) => (
                          <li key={i} className="text-light w-100 text-center">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ArrowContainer>
                )}
              >
                <button
                  onClick={() =>
                    userActions.toggleState.call(
                      this,
                      "popOver_open",
                      "byChecklistRecords",
                      index
                    )
                  }
                  className="btn btn-link"
                >
                  <img src={WardIcon} alt="بخش" width={30} />
                </button>
              </Popover>
            ) : (
              item.wards[0]
            ),
          style: {
            width: "20%",
          },
        },
        {
          title: "عملیات",
          getData: (item, index) => (
            <button
              className="btn btn-link"
              onClick={() => this.openDetailRecords(item)}
              data-tip="جزئیات"
            >
              <img src={TakmilIcon} alt="جزئیات" width={30} />
              <ReactTooltip type="dark" html={true} />
            </button>
          ),
          style: {
            width: "20%",
          },
        },
      ],
      byFormulaRecords: [],
      byChecklistRecords: [],
      detailRecord: [],
      loader: null,
      per_page: 24,
      total_answers: 0,
      pageForChecklist: 0,
      pageForFormula: 0,
      detailRecordModal: false,
      total_answer_record: 0,
      selectedDetailRecode: null,
      value_two_side: true,
      detailChecklistValue: null,
      checklist: false,
      IsMonitorScreenOpen: false,
      commentsModal: false,
      comments: [],
      currentRecord: null,
      menuItems: [],
    };
    /*   this.openDetailRecordChecklist=this.openDetailRecordChecklist.bind(this);*/
  }

  componentDidMount() {
    let intervals = this.props.intervals;
    this.setState({
      intervals: this.showIntervals(intervals, this.props.measure_interval),
    });
    if (this.props.isIndicator) {
      if (!this.props.globalStorage.wards.length) {
        this.props.dispatch(userActions.getWards()).then((res) => {
          this.setState({ wards: res.data });
        });
      } else {
        this.setState({ wards: this.props.globalStorage.wards });
      }
    } else {
      this.setState({ wards: this.props.wards });
    }
  }
  serializer = (c) => ({
    ...c,
    _id: c.id,
    text: c.text,
    createdAt: c.created_at,
    user: c.user
      ? {
          _id: c.user.id,
          name: c.user.firstname + " " + c.user.lastname,
          avatar: userConstants.SERVER_URL + c.user.avatar.url,
        }
      : {
          _id: c.user_id,
          name: c.firstname + " " + c.lastname,
          avatar: userConstants.SERVER_URL + c.avatar.url,
        },
  });
  showMessages = (item) => {
    console.log(item);

    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/indicator/answers/formula_record_comments?id=${item.id}`
        )
      )
      .then((res) => {
        this.setState({
          currentRecord: item,
          commentsModal: true,
          comments: res.data.result.map(this.serializer),
        });
      });
  };
  /* editFormulaRecord=(interval)=>{
        console.log(interval);
        this.setState({
            interval,IsMonitorScreenOpen:true
        })
    }*/
  deleteFormulaRecord = (id) => {
    this.props
      .dispatch(
        userActions.question(
          "حذف رکورد",
          "آیا از حذف رکورد مورد نظر مطمئن هستید؟"
        )
      )
      .then((res) => {
        if (res.value) {
          this.props
            .dispatch(
              userActions.API(
                "delete",
                `/v2/indicator/answers/formula_records/${id}`
              )
            )
            .then((r) => {
              this.getByFormula();
              if (this.props.reloadInterval) this.props.reloadInterval();
            });
        }
      });
  };
  deleteChecklistRecord = (certificate) => {
    this.props
      .dispatch(
        userActions.question(
          "حذف رکورد",
          "آیا از حذف رکورد مورد نظر مطمئن هستید؟"
        )
      )
      .then((res) => {
        if (res.value) {
          this.props
            .dispatch(
              userActions.API(
                "delete",
                `/v2/indicator/answers/checklist_records/detail/${certificate}`
              )
            )
            .then((r) => {
              this.getByChecklist();

              if (this.props.reloadInterval) this.props.reloadInterval();
            });
        }
      });
  };
  calc = (data_numerators, data_denumerators) => {
    const numerators = [];
    const denumerators = [];
    if (this.props.indicator.formula.numerator)
      this.props.indicator.formula.numerator.map((num, i) => {
        if (
          data_numerators &&
          data_numerators[i] !== null &&
          data_numerators[i] !== undefined
        ) {
          let opt = this.props.indicator.formula.numerator_operators[i] || "";
          numerators.push(parseFloat(data_numerators[i]));
          if (opt) {
            numerators.push(opt);
          }
        } else {
          numerators.push(1);
        }
      });
    if (this.props.indicator.formula.denumerator)
      this.props.indicator.formula.denumerator.map((num, i) => {
        if (
          data_denumerators &&
          data_denumerators[i] !== null &&
          data_denumerators[i] !== undefined
        ) {
          let opt = this.props.indicator.formula.denumerator_operators[i] || "";
          denumerators.push(parseFloat(data_denumerators[i]));
          if (opt) {
            denumerators.push(opt);
          }
        } else {
          denumerators.push(1);
        }
      });
    const eq_num = numerators.length > 0 ? userActions.math_map(numerators) : 1;
    const eq_denum =
      denumerators.length > 0 ? userActions.math_map(denumerators) : 1;
    const res =
      (eq_num / (eq_denum || 1)) *
      parseFloat(this.props.indicator.formula.multiplier);
    //console.log(eq_num,eq_denum,this.props.indicator.formula.multiplier)
    return userActions.fixed(res);

    /*const is2Float=parseFloat(res.toFixed(2))?res.toFixed(2):0;
        const is4Float=parseFloat(res.toFixed(4))?res.toFixed(4):0;
        const is6Float=parseFloat(res.toFixed(6))?res.toFixed(6):0;
        if(is2Float){
            return is2Float;
        }else if(is4Float){
            return is4Float;
        }else{
            return is6Float
        }*/
  };
  insertValues = (data, interval_number) => {
    const indicator_id = this.props.indicator.id;

    if (!data || !data.hasOwnProperty("id")) {
      const interval = {
        indicator_id,
        interval_number,
      };

      this.props.OpenMonitorScreenModal(interval);
    } else {
      this.props.OpenMonitorScreenModal(data);
    }

    // console.log(index, indicator_id, day)
  };

  openDetailRecordsModal = (interval) => {
    if (this.props.detailFormula) {
      this.openDetailFormulaModal(interval.interval_number);
    } else {
      interval["interval_id"] = interval["id"];
      this.openDetailRecords(interval);
    }
  };

  showIntervals = (intervals = [], measure_interval = "") => {
    let title;
    let days = null;
    return intervals.map((interval, index) => {
      title = userActions.getIntervalTitle(
        measure_interval === "روزانه" ? "ماهانه" : measure_interval,
        index + 1
      );
      if (measure_interval === "روزانه") {
        days = this.getDays(index + 1, interval);
        interval = {};
      }
      const colorTheme = this.getTheme(interval);
      const status = this.getStatus(interval, index, intervals);
      return {
        colorTheme,
        component: (
          <CalendarInterval
            openDetailRecords={(interval) =>
              this.openDetailRecordsModal(interval)
            }
            measure_interval={measure_interval}
            days={days}
            boxIndex={index}
            title={title}
            key={index}
            interval={interval}
            btnHandler={this.insertValues}
            readOnly={this.props.OpenMonitorScreenModal === undefined}
            showDetails={this.props.showDetails}
            status={status}
            colorTheme={colorTheme}
            year={this.props.globalStorage.year}
            pwa={this.props.pwa}
          />
        ),
      };
    });
  };
  getTheme = (interval) => {
    if (interval && interval.average !== undefined) {
      const { desirability, lower_limit, upper_limit } = this.props.indicator;
      if (lower_limit !== null && upper_limit !== null) {
        if (desirability === "افزاینده") {
          return interval.average < lower_limit
            ? "#bd2130"
            : interval.average >= upper_limit
            ? "#1e7e34"
            : "#ffc107";
        } else {
          return interval.average > lower_limit &&
            interval.average < upper_limit
            ? "#ffc107"
            : interval.average <= lower_limit
            ? "#1e7e34"
            : "#bd2130";
        }
      } else {
        return "#6c6c6c";
      }
    }

    return undefined;
  };
  showDetailRecod = (record) => {
    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v2/indicator/answers/formula_records/${record.id}/answerers`
        )
      )
      .then((res) => {
        this.setState({ detailAnswerer: true, menuItems: res.data.result });
      });
  };
  getStatus = (interval, index, intervals) => {
    if (
      index &&
      interval.average !== undefined &&
      intervals[index - 1].average !== undefined
    ) {
      return intervals[index - 1].average > interval.average
        ? "icon-font icon-kahesh_shakhes"
        : "icon-font icon-afzayesh_shakhes";
    }
    return undefined;
  };
  getDays = (monthIndex, interval = null) => {
    /*number of days in month by monthIndex*/
    const year = this.props.globalStorage.year;
    const m = moment(`${year}/${monthIndex}/01`, "jYYYY/jMM/jDD");
    const daysNum = m.jDaysInMonth();
    const days = [];
    for (let i = 1; i <= daysNum; i++) {
      const data = interval && interval[i] ? interval[i] : {};

      days.push({
        day: i,
        data,
      });
    }
    return days;
  };
  selectFilter = (filter) => {
    if (this.state.filter !== filter) {
      this.setState({ filter });
    } else {
      this.setState({ filter: "" });
    }
  };
  /*async getQuestions(indicator_id){
        return await this.props.dispatch(userActions.API('get',`/v2/get_indicator_questions?indicator_id=${indicator_id}`))
    }*/
  async openDetailRecordChecklist(item) {
    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v2/indicator/answers/checklist_records/detail/records?certificate=${item.certificate}`
        )
      )
      .then((res) => {
        const questions = [];
        const menuItems = [];
        let ward = "";
        res.data.map((q) => {
          const q_i = questions.findIndex(
            (qq) => qq.component === q.component.title
          );
          if (!ward && q.answer && q.answer.answerer) {
            ward = q.answer.answerer.ward_id;
          }
          if (!menuItems.length && q.answerers) {
            q.answerers.map((ans) => {
              const menu_item = ans.indicator_answerer_info_menu_item.menu_item;
              if (ans.value !== null && ans.value !== "") {
                menuItems.push({
                  value: ans.value,
                  //value:menu_item.options && menu_item.options.length>=2?userActions.generateSelectLabelValue([ans.value])[0]: ans.value,
                  ...menu_item,
                });
              }
            });
          }
          const question = {
            question_type: q.question_type,
            question: q.question,
            answer: q.answer ? q.answer.answer : "",
            answers: q.answers,
          };
          if (q_i >= 0) {
            questions[q_i].content.push(question);
          } else {
            questions.push({
              component: q.component.title,
              content: [question],
            });
          }
        });
        console.log(menuItems);
        this.setState({
          detailChecklistValue: res.data,
          checklist: true,
          questions,
          readOnly: true,
          menuItems,
        });
      });
  }
  openDetailRecords = (item) => {
    const checklistDetailHeaders = [
      {
        title: "ردیف",
        getData: (item, index) => {
          return index + 1;
        },
        style: {
          width: "10%",
          padding:'10px',
        },
      },
      {
        title: "تاریخ ارزیابی",
        getData: (item, index) => {
          return moment(item.created_at).format("jYYYY/jMM/jDD");
        },
        style: {
          width: "15%",
        },
      },
      {
        title: "ارزیابی کننده",
        getData: (item, index) => {
          return item.uploader;
        },
        style: {
          width: "15%",
        },
      },
      {
        title: "بخش ارزیابی شونده",
        getData: (item, index) => item.ward,
        style: {
          width: "15%",
        },
      },
      {
        title: "میانگین سؤالات ",
        getData: (item, index) =>
          item.value !== null ? item.value.toFixed(2) + "%" : "-",
        style: {
          width: "15%",
        },
      },
      {
        title: "میانگین سؤالات دوسطحی ",
        getData: (item, index) => {
          return item.value_two_side !== null
            ? item.value_two_side.toFixed(2) + "%"
            : "-";
        },
        style: {
          width: "15%",
        },
      },
      {
        title: "عملیات",
        getData: (item, index) => (
          <>
            {!this.props.only_me && (
              <button
                className="btn btn-link"
                data-tip="حذف"
                onClick={() => this.deleteChecklistRecord(item.certificate)}
              >
                <img src={trash} alt="حذف" width={30} />
              </button>
            )}
            <button
              className="btn btn-link"
              onClick={() => this.openDetailRecordChecklist(item)}
              data-tip="جزئیات"
            >
              <img src={DocIcon} alt="جزئیات" width={30} />
              <ReactTooltip type="dark" html={true} />
            </button>
          </>
        ),
        style: {
          width: "15%",
        },
      },
    ];
    this.setState({ checklistDetailHeaders, detailRecordModal: true }, () => {
      this.getDetailRecords(item);
    });
  };
  getDetailRecords = (item, page = 1) => {
    const loader = (
      <img
        src={Loading}
        className="d-block m-auto"
        alt="در حال پردازش اطلاعات"
        width={200}
      />
    );
    this.setState({ loader }, () => {
      let q = "";
      if (this.props.only_me) {
        q += "&user_id=" + this.props.globalStorage.me.id;
      }
      this.props
        .dispatch(
          userActions.API(
            "get",
            `/v2/indicator/answers/checklist_records/detail?interval_id=${
              item.interval_id
            }&page=${page}&per=${this.state.per_page}${q}&ward=${
              this.state.filterward ? this.state.filterward._id : ""
            }`,
            null,
            false
          )
        )
        .then((res) => {
          this.setState({
            loader: undefined,
            detailRecord: res.data,
            total_answer_record: item.answers_count,
            selectedDetailRecode: item,
            pageDetailRecode: page,
          });
        });
    });
  };
  closeDetailRecords = () => {
    this.setState({ detailRecordModal: false, selectedDetailRecode: null });
  };
  openDetailChecklistModal = () => {
    this.getTotal().then((total) => {
      const total_answers = total.data.hospital;
      this.setState({ detailChecklist: true, total_answers }, () =>
        this.getByChecklist()
      );
    });
  };
  openDetailFormulaModal = (interval_number = null) => {
    this.getTotal().then((total) => {
      const total_answers = total.data.hospital;
      this.setState({ detailFormula: true, total_answers }, () =>
        this.getByFormula(1, interval_number)
      );
    });
  };
  closeDetailChecklistModal = () => {
    this.setState({ detailChecklist: false });
  };
  closeDetailFormulaModal = () => {
    this.setState({ detailFormula: false });
  };
  getByChecklist = (pageForChecklist = 1) => {
    const loader = (
      <img
        src={Loading}
        className="d-block m-auto"
        alt="در حال پردازش اطلاعات"
        width={200}
      />
    );
    this.setState({ loader }, () => {
      let q = "";
      if (this.props.only_me) {
        q +=
          "&user_id=" +
          this.props.globalStorage.me.id +
          `&is_collector=${this.props.isCollector}`;
      }
      this.props
        .dispatch(
          userActions.API(
            "get",
            `/v2/indicator/answers/checklist_records?indicator_id=${
              this.state.indicator.id
            }&page=${pageForChecklist}&per=${this.state.per_page}${q}&ward=${
              this.state.filterward ? this.state.filterward._id : ""
            }`,
            null,
            false
          )
        )
        .then((res) => {
          this.setState(
            {
              pageForChecklist,
              byChecklistRecords: res.data,
              loader: undefined,
            },
            () => {
              if (res.data.length && this.state.selectedDetailRecode) {
                this.getDetailRecords(this.state.selectedDetailRecode);
              } else {
                this.closeDetailRecords();
              }
            }
          );
        });
    });
  };
  getByFormula = (pageForFormula = [0], interval_number = [null]) => {
    const loader = (
      <img
        src={Loading}
        className="d-block m-auto"
        alt="در حال پردازش اطلاعات"
        width={200}
      />
    );
    this.setState({ loader }, () => {
      let q = "";
      if (this.props.only_me) {
        q += "&user_id=" + this.props.globalStorage.me.id;
      }
      this.props
        .dispatch(
          userActions.API(
            "get",
            `/v2/indicator/answers/formula_records?interval_number=${
              interval_number === null ? "" : interval_number
            }&indicator_id=${
              this.state.indicator.id
            }&page=${pageForFormula}&per=${this.state.per_page}${q}&ward=${
              this.state.filterward ? this.state.filterward._id : ""
            }`,
            null,
            false
          )
        )
        .then((res) => {
          this.setState({
            pageForFormula,
            byFormulaRecords: res.data,
            loader: undefined,
          });
        });
    });
  };
  getTotal = () => {
    let q = "";
    if (this.props.only_me) {
      q += "&user_id=" + this.props.globalStorage.me.id;
    }
    return this.props.dispatch(
      userActions.API(
        "post",
        `/v2/indicator/count_by_ward_chart?id=${this.state.indicator.id}${q}`,
        { wards: null }
      )
    );
  };
  closeChecklist = () => {
    this.setState({ checklist: false, questions: null });
  };
  closeMonitorScreenModal = () => {
    this.setState({ IsMonitorScreenOpen: false });
  };
  closeComments = () => {
    this.setState({
      comments: [],
      commentsModal: false,
    });
  };
  onSend = (messages) => {
    this.props
      .dispatch(
        userActions.API(
          "post",
          `v2/indicator/answers/formula_record_comments`,
          {
            id: this.state.currentRecord.id,
            text: messages[0].text,
            post: this.props.isCollector
              ? "مسئول اندازه گیری"
              : this.props.only_me
              ? "مسئول پایش"
              : "دبیر",
          }
        )
      )
      .then((res) => {
        this.setState({
          comments: [...this.state.comments, this.serializer(res.data)],
        });
      });
  };
  closeDetailAnswerer = () => {
    this.setState({ detailAnswerer: false });
  };
  render() {
    const {
      questions,
      menuItems,
      filter,
      ward,
      filterward,
      wards,
      checklist_info,
      interval,
      indicator,
      selectedDetailRecode,
      total_answer_record,
      detailRecordModal,
      detailRecord,
      checklistDetailHeaders,
      formulaHeaders,
      byFormulaRecords,
      loader,
      per_page,
      total_answers,
      checklistHeaders,
      byChecklistRecords,
    } = this.state;
    return (
      <>
        <div className="container shadow position-relative">
          <div className="Spring"></div>
          {/*در کول 12 قسمت آبی بالا تسکیل شده - شروع */}
          <div className="row">
            <div
              className="col-lg-12 bg-blue pb-3"
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            >
              {/*بخش اول که با col-sm-3 سمت راست را تشکیل داده داخل بکگراند آبی- شروع*/}
              {this.props.isIndicator && (
                <>
                  <div className="col-sm-3 card align-items-center mt-5 ">
                    {this.props.CloseModal && (
                      <div className="d-flex justify-content-center mb-4">
                        <Media
                          query="(max-width:700px)"
                          render={() => (
                            <img
                              src={backIcon}
                              alt="backIcon"
                              onClick={() => this.props.CloseModal()}
                              className="col-7btn d-block mx-auto my-2 px-5"
                              style={{ width: "125px", cursor: "pointer" }}
                            />
                          )}
                        ></Media>
                      </div>
                    )}
                    <div className="card-title border-bottom w-75 text-center iran-sans_Bold py-2">
                      وضعیت کل شاخص
                    </div>
                    <span
                      className="iran-sans_Bold text-center "
                      style={{ fontSize: "25px", padding: "74px" }}
                    >
                      {this.props.total_average &&
                      !isNaN(this.props.total_average) &&
                      this.props.intervals &&
                      this.props.intervals.length >= 0 &&
                      this.props.measurement_unit !== "تعداد"
                        ? (
                            this.props.total_average /
                            this.props.intervals.length
                          ).toFixed(3) + ""
                        : this.props.total_average}
                    </span>
                  </div>
                  {/*بخش اول که با col-sm-3 سمت راست را تشکیل داده داخل بکگراند آبی- پایان*/}

                  {/*بخش وسط-نوشته ها و دکمه ها که با col-sm-6 را تشکیل داده داخل بکگراند آبی- شروع*/}
                  <div className="text-center mt-5 col-sm-6">
                    <h6 className="iran-sans_Bold text-white">
                      کاربــر گرامــی
                    </h6>
                    <p className="iran-sans text-center text-justify text-white">
                      برای مشـاهـده گزارش آمـاری این شـاخص بـه صفحـه زیـر وارد
                      شویـد
                    </p>

                    {/*دکمه ها 2 2 کنار هم نمایش داده می شوند- شروع */}
                    <div className="row">
                      <div className="col-md-6">
                        <button
                          onClick={this.props.openDetailModal}
                          className="btn text-blue bg-white rounded-pill px-4 py-2 my-2 w-100 text-center iran-sans_Bold"
                        >
                          مشاهده شناسنامه شاخص
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          onClick={this.props.openReport}
                          className="btn  bg-white rounded-pill px-4 py-2 my-2 w-100 text-center  iran-sans_Bold text-blue"
                        >
                          {" "}
                          گزارش آماری
                        </button>
                      </div>
                      {/*<div className="col-md-6">*/}
                      {/*    <button  className="btn bg-white rounded-pill px-4 py-2 my-2 w-100 text-center text-black-50"> اقدامات اصلاحی (بزودی)</button>*/}
                      {/*</div>*/}
                      <div className="w-100" style={{ margin: "17px" }}>
                        {this.props.detailFormula && (
                          <button
                            onClick={() => this.openDetailFormulaModal(null)}
                            className="btn text-blue bg-white rounded-pill px-4 py-2 my-2 w-100  text-center iran-sans_Bold "
                          >
                            مقادیر اندازه‌گیری شده
                          </button>
                        )}
                      </div>
                      <div className="row"></div>{" "}
                    </div>
                    {this.props.detailChecklist && (
                      <Media
                        query="(min-width: 770px)"
                        render={() => (
                          <button
                            onClick={this.openDetailChecklistModal}
                            className="btn text-blue bg-white rounded-pill  px-4 py-2 my-2 w-100 text-center iran-sans_Bold"
                          >{`${this.props.indicator.report_type} های تکمیل شده`}</button>
                        )}
                      />
                    )}
                  </div>
                </>
              )}
              {/*دکمه ها 2 2 کنار هم نمایش داده میشوند-پایان*/}

              {/*باکس سفید راهنمای تقویم که امکان فیلتر کردن دارد - شروع*/}
              <div className="col-sm-3 card align-items-center mt-5 py-3">
                <div className="card-title border-bottom w-75 text-center iran-sans_Bold py-2">
                  راهنمــا و فیلتـر
                </div>
                {this.props.pwa === "pwastyle" ? (
                  <div className="row" style={{ width: "95%" }}>
                    <button
                      onClick={() => {
                        this.selectFilter("#bc2130");
                      }}
                      className={`btn text-white  rounded-pill  py-1 my-2 ${
                        this.props.pwa === "pwastyle" ? "fontpwacalender" : ""
                      } ${
                        this.props.pwa === "pwastyle" ? "" : "w-75"
                      } text-center ${
                        !filter || filter === "#bb2130"
                          ? "bg-danger"
                          : "bg-dark"
                      }`}
                    >
                      نیاز به کنترل
                    </button>
                    <button
                      onClick={() => {
                        this.selectFilter("#fdc007");
                      }}
                      className={`btn text-white  rounded-pill  py-1 my-2 ${
                        this.props.pwa === "pwastyle" ? "fontpwacalender" : ""
                      } ${
                        this.props.pwa === "pwastyle" ? "" : "w-75"
                      } text-center ${
                        !filter || filter === "#f5ba07"
                          ? "bg-warning"
                          : "bg-dark"
                      }`}
                    >
                      قابل ارتقاء
                    </button>
                    <button
                      onClick={() => {
                        this.selectFilter("#1e7e34");
                      }}
                      className={`btn text-white  rounded-pill  py-1 my-2 ${
                        this.props.pwa === "pwastyle" ? "fontpwacalender" : ""
                      } ${
                        this.props.pwa === "pwastyle" ? "" : "w-75"
                      } text-center ${
                        !filter || filter === "#1e7e34"
                          ? "bg-success"
                          : "bg-dark"
                      }`}
                    >
                      مطلوب
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        this.selectFilter("#ba2130");
                      }}
                      className={`btn text-white  rounded-pill  py-1 my-2 ${
                        this.props.pwa === "pwastyle" ? "w-25" : "w-75"
                      } text-center ${
                        !filter || filter === "#ba2130"
                          ? "bg-danger"
                          : "bg-dark"
                      }`}
                    >
                      نیاز به کنترل
                    </button>
                    <button
                      onClick={() => {
                        this.selectFilter("#fcbf07");
                      }}
                      className={`btn text-white  rounded-pill  py-1 my-2 ${
                        this.props.pwa === "pwastyle" ? "w-25" : "w-75"
                      } text-center ${
                        !filter || filter === "#fdc007"
                          ? "bg-warning"
                          : "bg-dark"
                      }`}
                    >
                      قابل ارتقاء
                    </button>
                    <button
                      onClick={() => {
                        this.selectFilter("#1e7e34");
                      }}
                      className={`btn text-white  rounded-pill  py-1 my-2 ${
                        this.props.pwa === "pwastyle" ? "w-25" : "w-75"
                      } text-center ${
                        !filter || filter === "#1e7e34"
                          ? "bg-success"
                          : "bg-dark"
                      }`}
                    >
                      مطلوب
                    </button>
                  </>
                )}
              </div>
            </div>
            {/*باکس سفید راهنمای تقویم که امکان فیلتر کردن دارد - پایان*/}

            {/*شروع مقادیر ماه ها و جدول*/}
            <div className="col-lg-12 bg-white">
              <div
                className="card-deck mt-4 pb-4 d-flex justify-content-center"
                style={{ minHeight: "200px" }}
              >
                {this.state.intervals
                  .filter((i) => !filter || i.colorTheme === filter)
                  .map((c, i) => c.component)}
              </div>

              {this.props.CloseModal && (
                <div className="d-flex justify-content-center mb-4">
                  <Media
                    query="(min-width: 770px)"
                    render={() => (
                      <button
                        onClick={() => this.props.CloseModal()}
                        className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1"
                      >
                        بازگـشــت
                      </button>
                    )}
                  ></Media>
                </div>
              )}
            </div>
          </div>
        </div>
        {/*کول 12 و قسمت آبی در اینجا تمام شده -اتمام*/}
        {/*Detail Of Inserted Value By formula*/}
        <Modal
          isOpen={this.state.detailFormula}
          shouldCloseOnOverlayClick={false}
          //   onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeDetailFormulaModal}
          contentLabel="Formula Modal"
          portalClassName="full_screen_modal"
        >
          {this.state.detailFormula && (
            <div className="container-fluid py-5 bg-light">
              <label
                className="py-1 mx-auto w-100 d-block"
                style={{ maxWidth: 350, fontSize: ".8em" }}
              >
                <Select
                  className="text-justify custom-select-2"
                  value={filterward}
                  name="filterward"
                  placeholder="بخش"
                  isClearable
                  onChange={(v, d) => {
                    userActions.handleChangeSelect.call(
                      this,
                      v,
                      d,
                      null,
                      null,
                      () => {
                        this.getByFormula();
                      }
                    );
                  }}
                  options={wards}
                  getOptionLabel={(opt) => opt.name}
                  getOptionValue={(opt) => opt._id}
                />
              </label>
              <HospitalTable
                totalPage={Math.ceil(total_answers / per_page)}
                pageOnChange={this.getByFormula}
                active={this.state.pageForFormula}
                headers={formulaHeaders}
                rows={byFormulaRecords}
                loader={loader}
              />
              <button
                className="mx-auto px-5 my-5 d-block btn btn-outline-blue rounded-pill"
                onClick={this.closeDetailFormulaModal}
              >
                بازگشت
              </button>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={this.state.detailAnswerer}
          shouldCloseOnOverlayClick={false}
          onRequestClose={this.closeDetailAnswerer}
          contentLabel="Formula Modal"
          portalClassName="full_screen_modal"
        >
          {this.state.detailAnswerer && (
            <div className="container-fluid py-5 bg-light">
              <div className="row d-flex text-right justify-content-center p-3 ">
                {this.state.detailAnswerer &&
                  this.state.menuItems &&
                  this.state.menuItems.map(
                    (m, i) =>
                      m && (
                        <div
                          className="col-lg-4  col-md-6 my-3 position-relative"
                          key={i}
                        >
                          <label htmlFor="">
                            {m.indicator_answerer_info_menu_item
                              ? m.indicator_answerer_info_menu_item.menu_item
                                  .item
                              : ""}
                          </label>
                          {m.indicator_answerer_info_menu_item.menu_item ? (
                            <div className="pt-2 pb-4 ">
                              <InputGenerator
                                readOnly={true}
                                dispatch={this.props.dispatch}
                                type={
                                  m.indicator_answerer_info_menu_item.menu_item
                                    .item_type
                                }
                                globalStorage={this.props.globalStorage}
                                placeholder={
                                  m.placeholder ||
                                  m.indicator_answerer_info_menu_item.menu_item
                                    .place_holder
                                }
                                options={
                                  m.options
                                    ? userActions.generateSelectLabelValue(
                                        m.options
                                      )
                                    : []
                                }
                                onChange={(data) => {}}
                                value={m.value}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      )
                  )}
              </div>
              <div className="row d-flex justify-content-center p-3 ">
                <button
                  className="btn btn-outline-primary px-5 rounded-pill"
                  onClick={this.closeDetailAnswerer}
                >
                  بازگشت
                </button>
              </div>
            </div>
          )}
        </Modal>
        {/*Detail Of Inserted Value By Checklist (1)*/}
        <Modal
          isOpen={this.state.detailChecklist}
          shouldCloseOnOverlayClick={false}
          //   onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeDetailChecklistModal}
          contentLabel="Formula Modal"
          portalClassName="full_screen_modal "
        >
          <div className="row bg-light py-3 flex-column justify-content-center align-items-center">
            <label
              className="py-1 mx-auto w-100 d-block"
              style={{ maxWidth: 350, fontSize: ".8em" }}
            >
              <Select
                className="text-justify custom-select-2"
                value={filterward}
                name="filterward"
                placeholder="بخش"
                isClearable
                onChange={(v, d) => {
                  userActions.handleChangeSelect.call(
                    this,
                    v,
                    d,
                    null,
                    null,
                    () => {
                      this.getByChecklist();
                    }
                  );
                }}
                options={wards}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt._id}
              />
            </label>
            <HospitalTable
              /*totalPage={Math.ceil(total_answers / per_page)}*/
              pageOnChange={this.getByChecklist}
              active={this.state.pageForChecklist}
              headers={checklistHeaders}
              rows={byChecklistRecords}
              loader={loader}
            />
            <button
              className="mx-auto px-5 my-5 d-block btn btn-outline-blue rounded-pill"
              onClick={this.closeDetailChecklistModal}
            >
              بازگشت
            </button>
          </div>
        </Modal>
        {/*Detail Of Selected Record in [1]*/}
        <Modal
          isOpen={detailRecordModal}
          shouldCloseOnOverlayClick={false}
          onRequestClose={this.closeDetailRecords}
          contentLabel="Detail Record Modal"
          portalClassName="full_screen_modal"
        >
          {detailRecordModal && (
            <div className="container-fluid py-5 rounded bg-light">
              <label
                className="py-1 mx-auto w-100 d-block"
                style={{ maxWidth: 350, fontSize: ".8em" }}
              >
                <Select
                  className="text-justify custom-select-2"
                  value={filterward}
                  name="filterward"
                  placeholder="بخش"
                  isClearable
                  onChange={(v, d) => {
                    userActions.handleChangeSelect.call(
                      this,
                      v,
                      d,
                      null,
                      null,
                      () => {
                        this.getDetailRecords(selectedDetailRecode);
                      }
                    );
                  }}
                  options={wards}
                  getOptionLabel={(opt) => opt.name}
                  getOptionValue={(opt) => opt._id}
                />
              </label>
              <HospitalTable
                totalPage={Math.ceil(total_answer_record / per_page)}
                pageOnChange={(page) =>
                  this.getDetailRecords(selectedDetailRecode, page)
                }
                active={this.state.pageDetailRecode}
                headers={checklistDetailHeaders}
                rows={detailRecord}
                loader={loader}
              />
              <button
                className="mx-auto px-5 my-5 d-block btn btn-outline-blue rounded-pill"
                onClick={this.closeDetailRecords}
              >
                بازگشت
              </button>
            </div>
          )}
        </Modal>
        {/*Check list value*/}
        <Modal
          isOpen={this.state.checklist}
          onRequestClose={this.closeChecklist}
          shouldCloseOnOverlayClick={false}
          portalClassName="full_screen_modal checklistModalView"
        >
          {questions && (
            <ChecklistView
              globalStorage={this.props.globalStorage}
              dispatch={this.props.dispatch}
              questions={questions}
              menuItems={menuItems}
              closeModal={this.closeChecklist}
              ward={ward}
              report_type={this.props.indicator.report_type}
              pwa={this.props.pwa}
              readOnly={this.state.readOnly}
            />
          )}
        </Modal>
        <Modal
          isOpen={this.state.commentsModal}
          onRequestClose={this.closeComments}
          shouldCloseOnOverlayClick={false}
          portalClassName="full_screen_modal checklistModalView"
        >
          {this.state.commentsModal && (
            <div className="bg-light container pb-5 pt-1 h-100 rounded-lg dirLTR text-right">
              <button
                className="btn btn-link text-danger"
                onClick={this.closeComments}
              >
                <i className="fa fa-times" />{" "}
              </button>
              <GiftedChat
                renderSend={(props) => <Send label="ارسال" {...props} />}
                renderAvatar={(item) => {
                  return (
                    <>
                      <div
                        className="overflow_image rounded-circle mx-auto my-2"
                        style={{ width: 40, height: 40 }}
                      >
                        <img
                          src={item.currentMessage.user.avatar}
                          className=""
                        />
                      </div>
                      <small style={{ fontSize: ".8em" }}>
                        {item.currentMessage.user.name}
                      </small>
                    </>
                  );
                }}
                renderAllAvatars={true}
                showUserAvatar={true}
                renderDay={(itm) => {
                  if (
                    itm.previousMessage &&
                    itm.previousMessage.createdAt &&
                    moment(itm.currentMessage.createdAt).isSame(
                      moment(itm.previousMessage.createdAt),
                      "d"
                    )
                  ) {
                    return <></>;
                  } else {
                    return (
                      <p className="text-muted text-center">
                        {moment(itm.currentMessage.createdAt)
                          .clone()
                          .locale("fa")
                          .format("dddd DD MMMM YYYY")}
                      </p>
                    );
                  }
                }}
                renderAvatarOnTop
                renderTime={(item) => (
                  <small
                    className="text-white-50 px-2 text-right"
                    style={{ fontSize: ".7em" }}
                  >
                    {(item.currentMessage.post || "") + " - "}{" "}
                    {moment(item.currentMessage.createdAt).format("HH:mm")}
                  </small>
                )}
                placeholder="متن شما ..."
                messages={[...this.state.comments].reverse()}
                onSend={(messages) => this.onSend(messages)}
                user={{
                  _id: this.props.globalStorage.me
                    ? this.props.globalStorage.me.id
                    : "",
                }}
              />
            </div>
          )}
        </Modal>
        {/*<Modal
                    isOpen={this.state.IsMonitorScreenOpen}
                    onRequestClose={this.closeMonitorScreenModal}
                    shouldCloseOnOverlayClick={false}
                    portalClassName="full_screen_modal monitorScreenModal"
                >
                    {indicator && interval && (
                        <IntervalValue

                            CloseModal={this.closeMonitorScreenModal}
                            indicator_id={indicator.id}
                            indicator={indicator}
                            interval={interval}
                            formula={formula}
                            isCollector={isCollector}
                        />
                    )}
                </Modal>*/}
      </>
    );
  }
}

IndicatorCalender.propTypes = {
  openReport: PropTypes.func,
};
IndicatorCalender.defaultProps = {
  openReport: () => {},
};
const IndicatorCalenderComp = connect((state) => ({
  globalStorage: state.globalStorage,
}))(IndicatorCalender);
export { IndicatorCalenderComp };
