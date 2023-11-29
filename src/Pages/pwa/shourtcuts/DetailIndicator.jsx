import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import moment from "jalali-moment";
import Popover, { ArrowContainer } from "react-tiny-popover";
import ContentEditable from "react-contenteditable";
import { userActions } from "../../../_actions";
 import { IntervalValue } from "../../indicator/components";
import {
  HospitalTable,
  IndicatorCalenderComp,
  Routes
} from "../../../_components";

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
    animationDuration: "0.4s"
  }
};

export class DetailIndicator_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
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
      monitorTable: {
        headers: [
          {
            title: "عنوان شاخص",
            getData: (item, index) => {
              return (
                <span
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.title}
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
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.basis}
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
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.aspect}
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
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.measure_interval}
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
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.target}
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
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.upper_limit}
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
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {item.indicator.lower_limit}
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
                    this.detailIndicator(item.indicator, index, ev);
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
      numerator_help_popover: false,
      denumerator_help_popover: false
    };

    this.OpenMonitorScreenModal = this.OpenMonitorScreenModal.bind(this);
  }

  numerator = React.createRef();
  denumerator = React.createRef();

  componentDidMount() {
    const isCollector =
      this.props.history.location.pathname.indexOf("collector") >= 0;

    this.setState({ isCollector });
    if (isCollector) {
      this.getCollectorIndicatorsCount();
      this.getCollectorIndicators();
    } else {
      this.getMonitorIndicatorsCount();
      this.getMonitorIndicators();
    }
  }

  openDetailModal = () => {
    this.setState({ detailModal: true });
  };
  closeDetailModal = () => {
    this.setState({ detailModal: false });
  };
  detailIndicator = (indicator, index, ev) => {
    if (indicator.has_seen === false) {
      this.props
        .dispatch(
          userActions.API(
            "put",
            `/v2/burn_indicator_newness_for_${
              this.state.isCollector ? "collector" : "monitor"
            }?indicator_id=${indicator.id}`
          )
        )
        .then(res => {
          const { indicators } = this.state;
          if (this.state.isCollector) {
            indicators[index]["has_seen"] = true;
          } else {
            indicators[index]["indicator"]["has_seen"] = true;
          }
          this.setState({ indicators });
          this.openModal(indicator, index);
        });
    } else {
      this.openModal(indicator, index);
    }
  };
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
    let repeat_value = userActions.getPeriodCount(indicator.measure_interval);
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
        delete formula.id;

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

        const indicator = Object.assign({}, indicator_, formula);
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
          indicator.formula=formula;
        this.setState({
          indicator
        });
      });
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_indicator_interval_averages?indicator_id=${indicator.id}${this.state.isCollector?'&user_id='+this.props.globalStorage.me.id:''}`
        )
      )
      .then(res => {
        let { intervals, total_average } = res.data;
        if (intervals) {
          intervals.map(interval => {
            // set virtual interval average of interval from get_indicator_interval ...
            //
            if (indicator.measure_interval === "روزانه") {
              const m = moment(
                this.props.globalStorage.year + "/01/01",
                "jYYYY/jMM/jDD"
              ).jDayOfYear(interval.interval_number);
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
  getCollectorIndicators = (page = 1) => {
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_collector_indicators?year=${this.props.globalStorage.year}&page=${page}&per=${this.state.per_page}`
        )
      )
      .then(res => {
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
          `/v2/get_collector_indicators_count?year=${this.props.globalStorage.year}`
        )
      )
      .then(res => {
        this.setState({
          new_indicators: res.data.new_indicators,
          total_indicators: res.data.total_indicators
        });
      });
  };
  getMonitorIndicators = (page = 1) => {
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_monitor_indicators?year=${this.props.globalStorage.year}&page=${page}&per=${this.state.per_page}`
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

  async OpenMonitorScreenModal(interval) {
    let { formula } = this.state;

    if (!formula) {
      const formula_resualt = await this.props.dispatch(
        userActions.API(
          "get",
          `/v2/get_indicator_formula?indicator_id=${this.state.indicator.id}`
        )
      );

      formula = formula_resualt.data.formula;
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
    }

    this.setState({
      IsMonitorScreenOpen: true,
      interval,
      formula
    });
  }

  render() {
    const {
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
      denumerator_help_popover
    } = this.state;
    return (
      <>
        <Routes
          page={isCollector ? "indicator/collector" : "indicator/monitor"}
        />
        <div className="container-fluid pb-5">
          <div className="d-flex justify-content-center container">
            <div className="col-md-4 col-12">
              <div className="mt-5 card text-center borderDarkpurple ">
                <div className="card-body">
                  <p className="card-title Darkpurple ">
                    <small className="Darkpurple lalezar"> کل شاخص ها</small>
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
                      شاخص های دیده نشده
                    </small>
                  </p>
                  <h5 className="card-text iran-sans_Bold lightBlue ">
                    {new_indicators}
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div className="note bg-white my-5 mx-sm-5 mx-3 py-4">
            <HospitalTable
              totalPage={Math.ceil(total_indicators / per_page)}
              active={page}
              title={isCollector ? "جمع آوری شاخص ها" : "پایش شاخص ها"}
              rows={indicators}
              headers={
                isCollector ? collectorTable.headers : monitorTable.headers
              }
              pageOnChange={this.getCollectorIndicators}
              loader={loader}
            />


          </div>
        </div>
          {/*Insert Value Of Indicator*/}
          <Modal
              isOpen={this.state.IsMonitorScreenOpen}
              onRequestClose={this.closeMonitorScreenModal}
              style={customStyles}
              shouldCloseOnOverlayClick={false}
              portalClassName="full_screen_modal monitorScreenModal"
          >
              {indicator && interval && (
                  <IntervalValue
                      addNewInterval={this.addNewInterval}
                      CloseModal={this.closeMonitorScreenModal}
                      indicator_id={indicator.id}
                      indicator={indicator}
                      interval={interval}
                      formula={formula}
                      isCollector={isCollector}
                  />
              )}
          </Modal>
          {/*Calender Screen*/}
          <Modal
              isOpen={this.state.isModalOpen}
              shouldCloseOnOverlayClick={false}
              //   onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="User Modal"
              portalClassName="full_screen_modal selelctUsers"
          >
              {indicator && (
                  <IndicatorCalenderComp
                      isIndicator={true}
                      CloseModal={this.closeModal}
                      measure_interval={indicator.measure_interval}
                      total_average={this.state.total_average}
                      indicator={indicator}
                      intervals={this.state.boxes}
                      only_me={true}
                      OpenMonitorScreenModal={this.OpenMonitorScreenModal}
                      openDetailModal={this.openDetailModal}
                      detailFormula={indicator.report_type!=='چک لیست' && indicator.report_type!=='پرسشنامه'?true:undefined}
                      detailChecklist={indicator.report_type==='چک لیست' || indicator.report_type==='پرسشنامه'?true:undefined}
                  />
              )}
          </Modal>
          <Modal
              isOpen={this.state.detailModal}
              shouldCloseOnOverlayClick={false}
              //   onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeDetailModal}
              contentLabel="Detail Modal"
              portalClassName="full_screen_modal"
          >
              {indicator && (
                  <div className="Cource  indicator_detail">
                      {/*headerIndeicator*/}
                      <div className="container-fluid headerIndeicator">
                          <div
                              className={"row d-flex justify-content-around   my-4 "}
                          >
                              <div className="col-lg-3    my-2 ">
                                  <div className="text-center  rounded-pill py-2 text-dark shadow iran-sans_Bold bg-white ">
                                      {indicator.title}
                                  </div>
                              </div>
                              {indicator.code && (
                                  <div className="col-lg-3    my-2 ">
                                      <div className="text-center  rounded-pill  text-white shadow bg-navy-blue  py-2 iran-sans_Bold">
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
                                      <div className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
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
                                      <div className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
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
                              {indicator.quality_dimension && <div className='col-xl-3 col-lg-3 col-md-6  my-3 '>
                                  <div className='text-center bg-pink rounded-pill py-2 text-white '><span
                                      className={'iransansBold'}>بعد کیفیت:</span>
                                      {indicator.quality_dimension.map((q,j)=><span key={j}> {q} {j+1<indicator.quality_dimension.length?',':''} </span>)}
                                  </div>
                              </div>}
                              {indicator.report_type && (
                                  <div className="col-xl-3 col-lg-3 col-md-6  my-3 ">
                                      <div className="text-center bg-warning rounded-pill py-2 text-white">
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
                                      <div className="text-center bg-success rounded-pill py-2 text-white">
                                          <span className={"iransansBold"}> منبع شاخص:</span>
                                          <span> {indicator.source} </span>
                                      </div>
                                  </div>
                              )}
                              {indicator.measurement_unit && (
                                  <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                      <div className="text-center bg-light-blue rounded-pill py-2  text-white">
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
                                      <div className="text-center bg-danger rounded-pill py-2 text-white ">
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
                                      <div className="text-center bg-purple rounded-pill py-2 text-white">
                                          <span className={"iransansBold"}> مبنـا شاخص:</span>
                                          <span> {indicator.basis} </span>
                                      </div>
                                  </div>
                              )}
                              {indicator.aspect && (
                                  <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                      <div className="text-center bg-navy-blue rounded-pill py-2 text-white">
                                          <span className={"iransansBold"}> جنبه شاخص:</span>{" "}
                                          <span> {indicator.aspect}</span>
                                      </div>
                                  </div>
                              )}
                              {indicator.indicator_type && (
                                  <div className="col-xl-3 col-lg-3 col-md-6  my-3">
                                      <div className="text-center bg-light-green rounded-pill py-2  text-white">
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
                              <div className="calculation d-flex flex-wrap flex-column col-lg-8 align-items-center py-5 my-5 mx-auto">
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
                                          className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
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
                                                              className={`form-control ${
                                                                  indicator.numerator_help.indexOf(
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
                                  <div className="row align-items-center justify-content-center w-100 pl-sm-5">
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
                                          className="rounded-pill border-0 col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2"
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
                                                              className={`form-control ${
                                                                  indicator.denumerator_help.indexOf(
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
                          <div className="row d-flex justify-content-center ">
                              {indicator.target!==null || indicator.upper_limit!==null || indicator.lower_limit!==null ?<div className="calculation-inputs flex-wrap d-flex justify-content-around col-lg-8 py-5 my-5">

                                      {indicator.target!==null && <div
                                          className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                          <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">تارگت</h4>
                                          <div className='box-target text-center py-3 mt-3'>
                                              {indicator.target}
                                          </div>
                                      </div>}

                                      {indicator.upper_limit!==null && <div
                                          className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                          <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد بالا</h4>
                                          <div className='box-target text-center py-3 mt-3'>
                                              {indicator.upper_limit}
                                          </div>
                                      </div>}

                                      {indicator.lower_limit!==null && <div
                                          className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                          <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">حد
                                              پایین</h4>
                                          <div className='box-target text-center py-3 mt-3'>
                                              {indicator.lower_limit}
                                          </div>
                                      </div>}
                                  </div>
                                  :''}
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
              )}
          </Modal>
      </>
    );
  }
}

const DetailIndicator = connect(state => ({
  globalStorage: state.globalStorage
}))(DetailIndicator_);
export { DetailIndicator };
