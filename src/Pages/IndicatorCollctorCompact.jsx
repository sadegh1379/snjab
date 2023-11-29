import moment from "jalali-moment";
import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import Media from "react-media";
import Modal from "react-modal";
import { connect } from "react-redux";
import Select from "react-select";
import Popover, { ArrowContainer } from "react-tiny-popover";
import { userActions } from "../../_actions";
import { IntervalValue } from "./components";
import backIcon from "../../assets/images/back.png";
import checkListIcon from "../../assets/images/checklist.png";
import moreIcon from "../../assets/images/data.png";
import loadingGif from "../../assets/images/loading.gif";

import {
  Chart,
  IndicatorCalenderComp,
  Pagination,
  Routes,
} from "../../_components";
import { Navbar } from "../pwa/Navbar";
import { CollectorCalendarInterval } from "../../_components/CollectorCalendarInterval";
import ExcelLoading from "../../_components/ExcelLoading";
import { userConstants } from "../../_constants";
import { CollectorsIndicatorCalender } from "../../_components/CollectorsIndicatorCalender";

Modal.setAppElement("#root");

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    animationName: "animatetop",
    animationDuration: "0.4s",
  },
};

const customStylespwa = {
  overlay: {
    position: "fixed",
    top: "6%",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    animationName: "animatetop",
    animationDuration: "0.4s",
    padding: "0px",
    inset: "20px",
    borderRadius: ".5em",
  },
};

export class IndicatorCollectorOrMonitor extends Component {
  constructor(props) {
    super(props);
    this.timeout = React.createRef(null);
    this.interval = React.createRef(null);
    this.state = {
      // changed
      excelLoading: false,
      periodicityModal: false,
      periodData: [],
      PPageInfo: null,
      p_page: 1,
      currentIndicator: null,
      //
      isChartModalOpen: false,
      detailModal: false,
      formula: null,
      interval: "",
      isCollector: false,
      measure_interval: 0,
      total_average: "-",
      isModalOpen: false,
      IsMonitorScreenOpen: false,
      has_seen: null,
      new_indicators: 0,
      total_indicators: 0,
      general_indicators_info: null,
      page: 1,
      per_page: 24,
      loader: undefined,
      indicator: null,
      intervals: [],
      intervals_2: [],
      interval_numbers: [],
      indicators: [],
      boxes: [],
      boxes_2: [],
      collectorTable: {
        headers: [
          {
            title: "ردیف",
            getData: (item, index) => {
              return (
                <span
                  className={`${
                    !item.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {index + 1}
                </span>
              );
            },
            style: {
              width: "10%",
            },
          },
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
              width: "25%",
            },
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
              width: "14%",
            },
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
              width: "13%",
            },
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
              width: "13%",
            },
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
              width: "5%",
            },
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
              width: "5%",
            },
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
              width: "5%",
            },
          },
          {
            title: "عملیات",
            getData: (item, index) => {
              return (
                <button
                  onClick={(ev) => {
                    this.detailIndicator(item, index, ev);
                  }}
                  className="btn btn-blue  rounded-pill px-2  w-75"
                >
                  جزییات
                </button>
              );
            },
            style: {
              width: "10%",
            },
          },
        ],
      },
      monitorTable: {
        headers: [
          {
            title: "ردیف",
            getData: (item, index) => {
              return (
                <span
                  className={`${
                    !item.indicator.has_seen ? "iran-sans_Bold" : "iran-sans"
                  }`}
                >
                  {index + 1}
                </span>
              );
            },
            style: {
              width: "10%",
            },
          },
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
              width: "25%",
            },
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
              width: "14%",
            },
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
              width: "13%",
            },
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
              width: "13%",
            },
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
              width: "5%",
            },
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
              width: "5%",
            },
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
              width: "5%",
            },
          },
          {
            title: "عملیات",
            getData: (item, index) => {
              return (
                <button
                  onClick={(ev) => {
                    this.setState({ wards: item.duty_wards });
                    this.detailIndicator(item.indicator, index, ev);
                  }}
                  className="btn btn-blue  rounded-pill px-2  w-75"
                >
                  جزییات
                </button>
              );
            },
            style: {
              width: "10%",
            },
          },
        ],
      },
      numerator_help_popover: false,
      denumerator_help_popover: false,
      keyword: "",
      query: "",
      wards: [],
      ward: null,
      chart: null,
      gauges1: null,
      gauges1Config: {},
      chartType: "column",
      filter_by_ward_id: "",
      indicator_loading: false,
    };

    this.OpenMonitorScreenModal = this.OpenMonitorScreenModal.bind(this);
    this.getChart = this.getChart.bind(this);
  }

  numerator = React.createRef();
  denumerator = React.createRef();

  getTheme = (interval, indicator) => {
    if (interval && interval.average !== undefined) {
      const { desirability, lower_limit, upper_limit } = indicator;
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

  componentDidMount() {
    console.log("this is a compact");
    const isCollector =
      this.props.history.location.pathname.indexOf("collector") >= 0;
    if (!this.props.globalStorage.wards.length) {
      this.props.dispatch(userActions.getWards());
    }
    this.setState({ isCollector });
    if (isCollector) {
      this.getCollectorIndicators();
      if (!this.props.globalStorage.indicators.length) {
        this.props.dispatch(
          userActions.getIndicator(this.props.globalStorage.year, true)
        );
      }
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
        .then((res) => {
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
        IsMonitorScreenOpen: false,
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
    let repeat_value =
      indicator.measure_interval === "روزانه"
        ? 12
        : userActions.getPeriodCount(indicator.measure_interval);
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
      .then((formula_resualt) => {
        const { formula } = formula_resualt.data;

        if (formula.numerator_indicator_id) {
          const indic = this.props.globalStorage.indicators.find(
            (i) => i.id == formula.numerator_indicator_id
          );
          formula.numerator_indicator_name = indic ? indic.title : "";
        }
        if (formula.denumerator_indicator_id) {
          const indic = this.props.globalStorage.indicators.find(
            (i) => i.id == formula.denumerator_indicator_id
          );
          formula.denumerator_indicator_name = indic ? indic.title : "";
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
          indicator_.logical_reasons_of_collecting =
            indicator_.logical_reasons_of_collecting
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
          indicator,
          formula,
        });
      });
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_indicator_interval_averages?indicator_id=${indicator.id}&user_id=${this.props.globalStorage.me.id}&is_collector=${this.state.isCollector}`
        )
      )
      .then((res) => {
        let { intervals, total_average } = res.data;
        if (intervals) {
          intervals.map((interval) => {
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
          isModalOpen: true,
        });
      });
  };
  closeModal = () => {
    this.setState({
      isModalOpen: false,
      formula: null,
    });
  };
  getCollectorIndicators = (
    page = 1,
    query = this.state.query,
    filter_by_ward_id
  ) => {
    this.setState({ indicator_loading: true });
    this.setState({ query });
    const user = this.props.globalStorage.me;
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_collector_indicators_with_data?is_collector=true&user_id=${
            user?.id
          }&year=${this.props.globalStorage.year}&page=${page}&per=${
            this.state.per_page
          }${query || ""}${
            filter_by_ward_id ? "&filter_by_ward_id=" + filter_by_ward_id : ""
          }`,
          null,
          false
        )
      )
      .then((res) => {
        this.getCollectorIndicatorsCount();
        this.setState({
          indicators: res.data.indicators,
          page,
          indicator_loading: false,
        });
      });
  };
  getCollectorIndicatorsCount = () => {
    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v2/get_collector_indicators_count?year=${
            this.props.globalStorage.year
          }${
            this.state.filter_by_ward_id
              ? "&filter_by_ward_id=" + this.state.filter_by_ward_id._id
              : ""
          }`,
          null,
          false
        )
      )
      .then((res) => {
        this.setState({
          new_indicators: res.data.new_indicators,
          total_indicators: res.data.total_indicators,
        });
      });
  };
  getMonitorIndicators = (page = 1, query = this.state.query) => {
    this.setState({ query });
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_monitor_indicators?year=${this.props.globalStorage.year}&page=${page}&per=${this.state.per_page}${query}`
        )
      )
      .then((res) => {
        this.setState({
          indicators: res.data.indicators,
          page,
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
      .then((res) => {
        this.setState({
          new_indicators: res.data.new_indicators,
          total_indicators: res.data.total_indicators,
        });
      });
  };
  addNewInterval = async (interval) => {
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
  openReport = (indicator_id) => {
    // window.location.href=`/indicator/dashboard/${indicator_id}`;

    if (this.state.isCollector) {
      this.getWards(this.state.indicator.id).then((res) => {
        const wards = res.data.map((w) => {
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
  };
  async getChart() {
    const { indicator, ward } = this.state;

    this.getGauge1(indicator.id, ward ? ward.map((w) => w.id) : null);
    const res = await this.chart0(
      indicator.id,
      ward ? ward.map((w) => w.id) : null
    );
    if (res) {
      const chart = {};
      chart.data = Object.keys(res.chart_data).map((d) => {
        const data = res.chart_data[d];
        const name = d;
        return Object.assign(
          {
            dataLabels: {
              enabled: true,
              y: 10,
            },
          },
          { data, name }
        );
      });
      chart.categories = res.chart_category.map((c) => c.name);

      this.setState({ chart });
    }
  }
  closeReport = () => {
    this.setState({ isChartModalOpen: false });
  };
  async OpenMonitorScreenModal(interval) {
    this.setState({
      IsMonitorScreenOpen: true,
      interval,
    });
  }
  searchByQuery = (query) => {
    if (this.state.isCollector) {
      this.getCollectorIndicators(1, "&by_query=" + query);
    } else {
      this.getMonitorIndicators(1, "&by_query=" + query);
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
              wards,
            }
          )
        )
        .then((res) => {
          const gauges1 = {};
          gauges1["کل بیمارستان"] = res.data.hospital
            ? parseFloat(userActions.fixed(res.data.hospital))
            : 0;
          if (res.data.wards) {
            res.data.wards.map((w) => {
              gauges1[w.name] = parseFloat(userActions.fixed(w.value));
            });
          }
          let max = 0;
          let min = 0;
          Object.keys(gauges1).forEach((d) => {
            if (gauges1[d] >= max) {
              max = gauges1[d];
            }
            if (gauges1[d] <= min) {
              min = gauges1[d];
            }
          });
          const gauges1Config = {
            min,
            max,
          };
          this.setState({ gauges1, gauges1Config });
        });
    });
  };
  chart0 = (id, wards = null) => {
    return new Promise((resolve, rej) => {
      this.props
        .dispatch(
          userActions.API(
            "post",
            `/v2/indicator/interval_by_ward?id=${id}&user_id=${this.props.globalStorage.me.id}`,
            {
              wards,
            }
          )
        )
        .then((res) => {
          const chart_data = {};
          const chart_category = [];
          const { measure_interval, indicator } = this.state;
          const period = measure_interval
            ? measure_interval.value
            : indicator.measure_interval;
          for (let i = 1; i <= userActions.getPeriodCount(period); i++) {
            chart_category.push({
              name:
                period === "ماهانه"
                  ? userActions.persianMonth(i)
                  : period === "سالانه"
                  ? this.props.globalStorage.year
                  : period === "روزانه"
                  ? moment().jDayOfYear(i).format("jMMMM jDD")
                  : userActions.intervalPerfix(period) +
                    userActions.persianNumber(i, true),
              interval_number: i,
            });
          }
          chart_data["کل بیمارستان"] = [];
          const wards = {};
          if (res.data.wards) {
            res.data.wards.map((w) => {
              chart_data[w.name] = [];
              wards[w.name] = w.values;
            });
          }
          chart_category.map((cat) => {
            Object.keys(chart_data).map((key) => {
              let value = null;
              if (key === "کل بیمارستان") {
                if (
                  ["چک لیست", "پرسشنامه", "HIS"].indexOf(
                    indicator.report_type
                  ) === -1
                ) {
                  const groupIntervals = userActions.groupBy(
                    res.data.hospital,
                    "interval_number"
                  );
                  let intervals = [];

                  Object.keys(groupIntervals).map((g) => {
                    const l = groupIntervals[g].length;
                    const value =
                      groupIntervals[g].reduce((a, b) => ({
                        ["value"]:
                          parseFloat(a["value"]) + parseFloat(b["value"]),
                      }))["value"] / l;

                    intervals.push({
                      interval_number: g,
                      value,
                    });
                  });
                  res.data.hospital = intervals;
                }
                const data = res.data.hospital.find(
                  (d) =>
                    d.interval_number.toString() ===
                    cat.interval_number.toString()
                );
                if (data) {
                  value = parseFloat(userActions.fixed(data.value));
                }
              } else {
                if (res.data.wards) {
                  const data = wards[key].find(
                    (d) => d.interval_number === cat.interval_number
                  );
                  if (data) {
                    value = parseFloat(userActions.fixed(data.value));
                  }
                }
              }
              chart_data[key].push(value);
            });
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
        this.openModal(this.state.selectedIndicator);
      }, 500);
    });
  };
  getWards = (id) => {
    return this.props.dispatch(
      userActions.API(
        "get",
        `/v2/indicator/answers/wards?id=${id}&user_id=${this.props.globalStorage.me.id}`
      )
    );
  };

  returnPeriod = (data) => {
    const name = data.measure_interval;
    if (
      name === "ماهانه" ||
      name === "سالانه" ||
      name === "سه ماه یکبار" ||
      name === "شش ماه یکبار"
    ) {
      return (
        <p
          // onClick={() => {

          //         this.setState({
          //             periodicityModal: true
          //         })
          //         this.getIndicatorPeriodicity(data.id)
          //         this.setState({
          //             currentIndicator: data
          //         })
          // }}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {name}
        </p>
      );
    } else {
      return <p>{name}</p>;
    }
  };
  getIndicatorPeriodicity = (id) => {
    this.props
      .dispatch(
        userActions.API(
          "get",
          `v2/get_indicator_interval_averages?indicator_id=${id}&page=${
            this.state.p_page
          }&perpage=${10}`,
          null,
          true,
          false
        )
      )
      .then((res) => {
        this.setState({
          periodData: res.data.intervals,
          PPageInfo: res.data.pagination_info,
        });
      });
  };

  handleSetPeriodicityModal = (bol) => {
    this.setState({
      periodicityModal: bol,
    });
  };

  handleSetP_Page = (page) => {
    this.setState({
      p_page: page,
    });
  };

  exportExcel = () => {
    const { dispatch } = this.props;
    this.timeout.current = setTimeout(() => {
      userActions.failure("مشکل در آماده سازی فایل خروجی");
      clearInterval(this.interval.current);
      this.setState({ excelLoading: false });
    }, 120000);

    this.setState({ excelLoading: true });
    dispatch(
      userActions.API(
        "get",
        `v2/indicator/user_indicators_excel?year=${this.props.globalStorage.year}`,
        null,
        false
      )
    ).then((res) => {
      if (res.status === 200) {
        this.interval.current = setInterval(() => {
          dispatch(
            userActions.API("get", res.data.url, null, false, false)
          ).then((response) => {
            if (response.status == 200) {
              this.setState({ excelLoading: false });
              clearInterval(this.interval.current);
              clearTimeout(this.timeout.current);
              window.open(userConstants.SERVER_URL_2 + res.data.url, "_blank");
            }
          });
        }, 5000);
      }
    });
  };

  stopExcel = () => {
    this.setState({ excelLoading: false });
    clearInterval(this.interval.current);
    clearTimeout(this.timeout.current);
  };

  showIntervals = (intervals, measure_interval = "", indicator) => {
    let title;
    let days = null;
    if (!indicator) return;
    let repeat_value =
      indicator.measure_interval === "روزانه"
        ? 12
        : userActions.getPeriodCount(indicator.measure_interval);
    // create virtual interval based on measure_interval
    const boxes = []; //new Array(repeat_value).fill({});
    for (let i = 0; i < repeat_value; i++) {
      boxes.push({});
    }
    if (intervals) {
      intervals.map((interval) => {
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
      const result = boxes.map((interval, index) => {
        title = userActions.getIntervalTitle(
          measure_interval === "روزانه" ? "ماهانه" : measure_interval,
          index + 1
        );
        if (measure_interval === "روزانه") {
          days = this.getDays(index + 1, interval);
          interval = {};
        }
        const colorTheme = this.getTheme(interval, indicator);
        return {
          colorTheme,
          component: (
            <CollectorCalendarInterval
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
              colorTheme={colorTheme}
              year={this.props.globalStorage.year}
              pwa={this.props.pwa}
            />
          ),
        };
      });
      return result;
    }
  };

  getTotalAverage = (total) => {
    if (total && !isNaN(total)) {
      return total.toFixed(2);
    } else {
      return "-";
    }
  };

  render() {
    const {
      per_page,
      new_indicators,
      total_indicators,
      indicator,
      isCollector,
      // indicators,
      page,
      interval,
      formula,
      numerator_help_popover,
      denumerator_help_popover,
      wards,
      ward,
      excelLoading,
      indicator_loading,
    } = this.state;
    const { indicators } = this.props.globalStorage;
    console.log(
      "globalStorage indicators: ",
      this.props.globalStorage.indicators
    );
    console.log("indicators: ", indicators);

    const newWards = [
      { name: "همه بخش های بیمارستان", _id: "" },
      ...this.props.globalStorage.wards,
    ];

    return (
      <>
        {!this.props.match.params.pwa && (
          <Routes page={isCollector ? "collector" : "monitor"} />
        )}
        {excelLoading && <ExcelLoading stop={this.stopExcel} />}

        <div className="container-fluid pb-5">
          <div className="indicator-RightTitle">
            <div>
              <h2
                style={{
                  color: "#333",
                  fontFamily: "iransansBold",
                  marginRight: "20px",
                  fontSize: "20px",
                }}
              >
                شـhghghgghgاخص
              </h2>
            </div>
            {/*<div className="indicator-excelBox">*/}
            {/*    <img src={excelPic} className="indicator-excelIcon" alt="" />*/}
            {/*    <span onClick={this.exportExcel} className="mx-4"> خـروجـی اکـسل </span>*/}
            {/*</div>*/}
          </div>
          {!this.props.match.params.pwa && (
            <>
              {/* <div className="row  ">*/}
              {/*    <div className="col-lg-10 m-auto ">*/}
              {/*        <div className="form-group mt-3 ">*/}
              {/*            <input type="text"*/}
              {/*                name="keyword"*/}
              {/*                value={keyword}*/}
              {/*                onChange={e => userActions.handleChangeInput.call(this, e, this.searchByQuery)}*/}
              {/*                className="form-control rounded-pill border-0 py-4   text-center text-blue"*/}
              {/*                placeholder="نام و کد شاخص،بخش های مرتبط و هر یک از مشخصه های شاخص را وارد کنید" />*/}
              {/*        </div>*/}
              {/*    </div>*/}
              {/*</div>*/}
              {/* {isCollector &&*/}
              {/*    <div className="row justify-content-center  mt-4">*/}

              {/*        <label className="py-1 mx-2 w-100 d-block"*/}
              {/*            style={{ maxWidth: 350, fontSize: '.8em' }}>*/}
              {/*            <Select className="text-justify custom-select-2"*/}
              {/*                value={filter_by_ward_id}*/}
              {/*                name="filter_by_ward_id"*/}
              {/*                placeholder="بخش مورد نظر را انتخاب کنید"*/}
              {/*                isClearable*/}
              {/*                onChange={(v, d) => {*/}
              {/*                    userActions.handleChangeSelect.call(this, v, d, null, null, (f) => {*/}
              {/*                        this.getCollectorIndicators(1, null, f || '')*/}
              {/*                    })*/}
              {/*                }}*/}
              {/*                options={this.props.globalStorage.wards}*/}
              {/*                getOptionLabel={opt => opt.name}*/}
              {/*                getOptionValue={opt => opt._id}*/}

              {/*            />*/}
              {/*        </label>*/}

              {/*    </div>*/}

              <div className="d-flex justify-content-center container">
                <div className="col-md-4 col-12">
                  <div className="mt-5  text-center  ">
                    <div
                      className="card-body"
                      style={{ background: "darkblue", borderRadius: "20px" }}
                    >
                      <p className="card-title  ">
                        <small
                          className=" lalezar"
                          style={{ color: "#fff", fontSize: "17px" }}
                        >
                          {" "}
                          کل شاخص ها
                        </small>
                      </p>
                      <h5
                        className="card-text  iran-sans_Bold my-1"
                        style={{ color: "#fff", fontSize: "17px" }}
                      >
                        {indicators?.length || "-"}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div
                    className="mt-5  text-center"
                    style={{ background: "#2fcfc7", borderRadius: "20px" }}
                  >
                    <div className="card-body">
                      <p className=" card-title">
                        <small
                          className=" lalezar"
                          style={{ color: "#fff", fontSize: "17px" }}
                        >
                          {" "}
                          شاخص های دیده نشده
                        </small>
                      </p>
                      <h5
                        className="card-text iran-sans_Bold "
                        style={{ color: "#fff", fontSize: "17px" }}
                      >
                        {/* {new_indicators} */}-
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {this.props.match.params.pwa ? (
            <>
              <Navbar
                name={isCollector ? "اندازه گیری شاخص" : "پایش شاخص"}
                url={`/pwa`}
              />
              <div
                className="col-12 indicator_agahi  px-0 "
                style={{ paddingTop: "5em" }}
              >
                {this.props?.indicators?.map((item, index) => {
                  return (
                    <div
                      className="card my-3 "
                      key={isCollector ? item.id : item.indicator.id}
                    >
                      <div className="card-body px-3 py-0">
                        <div className="row text-center title py-2">
                          {isCollector ? item.title : item.indicator.title}
                        </div>
                        <div className="row border_item">
                          <div
                            className="col-6 text-center py-2"
                            style={{ borderLeft: "1px solid #ccc" }}
                          >
                            <lable className="lable">دوره تنـاوب</lable>
                            <div className="item">
                              {isCollector
                                ? item.measure_interval
                                : item.indicator.measure_interval}
                            </div>
                          </div>
                          <div className="col-6 text-center py-2">
                            <lable className="lable">مبنـای شاخـص</lable>
                            <div className="item">
                              {isCollector ? item.basis : item.indicator.basis}
                            </div>
                          </div>
                        </div>
                        <div className="row border_item">
                          <div
                            className="col-4 text-center py-2"
                            style={{ borderLeft: "1px solid #ccc" }}
                          >
                            <lable className="lable">حـد پایین</lable>
                            <div className="item">
                              {isCollector
                                ? item.lower_limit
                                : item.indicator.lower_limit}
                            </div>
                          </div>
                          <div
                            className="col-4 text-center py-2"
                            style={{ borderLeft: "1px solid #ccc" }}
                          >
                            <lable className="lable">تارگـت</lable>
                            <div className="item">
                              {isCollector
                                ? item.target
                                : item.indicator.target}
                            </div>
                          </div>
                          <div className="col-4 text-center py-2">
                            <lable className="lable">حـد بالا</lable>
                            <div className="item">
                              {isCollector
                                ? item.upper_limit
                                : item.indicator.upper_limit}
                            </div>
                          </div>
                        </div>
                        <div className="row d-flex justify-content-center">
                          <button
                            className="col-11  btn rounded-pill btn-primary my-3 detail_style"
                            onClick={(ev) => {
                              this.detailIndicator(
                                isCollector ? item : item.indicator,
                                index,
                                ev
                              );
                            }}
                          >
                            جزییـات
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="note bg-white my-5 mx-sm-5 mx-3 py-4">
              {/* <HospitalTable
                                totalPage={Math.ceil(total_indicators / per_page)}
                                active={page}
                                title={isCollector ? "جمع آوری شاخص ها" : "پایش شاخص ها"}
                                rows={indicators}
                                headers={
                                    isCollector ? collectorTable.headers : monitorTable.headers
                                }
                                pageOnChange={isCollector ? this.getCollectorIndicators : this.getMonitorIndicators}
                                loader={loader}
                            /> */}
              {/* start table */}
              <div className="indicator-kol">
                {/* start nav */}
                <div className="indicator-topnav">
                  <a className="indicator-active">
                    {/* <FilterList className="indicator-icon" /> */}
                  </a>
                  {/*<a*/}
                  {/*    className="indicator-active p-1 mt-2 " href="#home">فیلتـر</a>*/}
                  {/* <div  className="khatRight"></div> */}

                  {/* <a  className="indicator-active" href="#home">وضعیت</a>
                                    <select className="indicator-drowp" >
                                        <option value="">همه</option>
                                        <option value="done">ارسال شده</option>
                                        <option value="temporary">ارسال نشده</option>
                                    </select> */}
                  <a className="indicator-active mr-2" href="#home">
                    فیلتـر بر اسـاس (بخش / واحـد متولـی)
                  </a>

                  <select
                    className="indicator-drowp"
                    name="filter_by_ward_id"
                    onChange={(e) => {
                      this.getCollectorIndicators(1, null, e.target.value);
                      // userActions.handleChangeSelect.call(this, e.target.value, e.target.name, null, null, (f) => {
                      //     this.getCollectorIndicators(1, null, e.target.value)
                      // })
                    }}
                  >
                    {newWards.map((w, i) => {
                      return (
                        <option key={i} value={w._id}>
                          {w.name}
                        </option>
                      );
                    })}
                  </select>

                  {/* start Search */}
                  <div component="div" className="indicator-searchContainer">
                    <div component="form" action="/action_page.php">
                      {/*<input*/}
                      {/*    onChange={(e) => this.searchByQuery(e.target.value)}*/}
                      {/*    // onChange={e => userActions.handleChangeInput.call(this, e, this.searchByQuery)}*/}
                      {/*    // className="indicator-area" type="text" placeholder="جستجو در شاخص" name="search" />*/}
                      {/*<div component='div' className="indicator-search" >*/}
                      {/*    /!* <Search /> *!/*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </div>
                {/*start sadegh*/}
                <table className="indicator-tbl">
                  <thead>
                    <tr className="indicator-tr">
                      <th className="indicator-th" style={{ width: "3%" }}>
                        ردیف
                      </th>
                      <th className="indicator-th" style={{ width: "13%" }}>
                        عنـوان
                      </th>
                      <th className="indicator-th" style={{ width: "4%" }}>
                        واحـد متـولی
                      </th>
                      <th className="indicator-th" style={{ width: "3%" }}>
                        تارگت
                      </th>
                      <th className="indicator-th" style={{ width: "4%" }}>
                        وضعیت موجود
                      </th>
                      <th className="indicator-th" style={{ width: "68%" }}>
                        اندازه گیری (بر اساس دوره تناوب)
                      </th>
                      { <th className="indicator-th" style={{ width: "5%" }}>
                         مقادیر
                      </th> }
                    </tr>
                  </thead>
                  <tbody>
                    {indicator_loading && (
                      <tr className="p-4">
                        <td colSpan={6} className="text-center p-4">
                          <img src={loadingGif} style={{ width: "30px" }} />
                        </td>
                      </tr>
                    )}
                    {indicators?.length && !indicator_loading ? (
                      indicators?.map((row, i) => {
                        const class_name =
                          i % 2 === 0 ? "indicator-td" : "indicator-tdd";
                        return (
                          <tr className="animated fadeIn" key={i}>
                            <td className={class_name} style={{ width: "3%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                {row.report_type == "پرسشنامه" ||
                                row.report_type == "چک لیست" ? (
                                  <img
                                    className="mx-1"
                                    style={{ width: "15px" }}
                                    src={checkListIcon}
                                    alt="چک لیست"
                                  />
                                ) : null}
                                {i + 1}
                              </div>
                            </td>
                            <td
                              className={class_name}
                              style={{ width: "13%", lineHeight: "2.5em" }}
                            >
                              {isCollector ? row.title : row.indicator.title}
                            </td>
                            <td className={class_name} style={{ width: "4%" }}>
                              {isCollector
                                ? row.main_ward_name
                                  ? row.main_ward_name
                                  : "نامشخص"
                                : row.indicator.main_ward_name
                                ? row.indicator.main_ward_name
                                : "نامشخص"}
                            </td>
                            <td className={class_name} style={{ width: "3%" }}>
                              {isCollector
                                ? row.target
                                  ? row.target
                                  : "-"
                                : row.indicator.target
                                ? row.indicator.target
                                : "-"}
                            </td>
                            <td className={class_name} style={{ width: "4%" }}>
                              {this.getTotalAverage(
                                isCollector
                                  ? row.total_average
                                  : row.indicator.total_average
                              )}
                            </td>
                            {/*اندازه گیری */}
                            <td className={class_name} style={{ width: "68%" }}>
                              <div>
                                <div className="d-flex flex-wrap justify-content-center ">
                                  {isCollector
                                    ? this.showIntervals(
                                        row.intervals,
                                        row.measure_interval,
                                        row
                                      ).map((c, i) => c.component)
                                    : this.showIntervals(
                                        row.indicator.intervals,
                                        row.indicator.measure_interval,
                                        row.indicator
                                      ).map((c, i) => c.component)}
                                </div>
                              </div>
                            </td>
                            {/* <td className={class_name} style={{ width: "5%" }}>
                              <img
                                onClick={(ev) => {
                                  this.detailIndicator(
                                    isCollector ? row : row.indicator,
                                    i,
                                    ev
                                  );
                                }}
                                title="جزییات"
                                style={{ width: "50px", cursor: "pointer" }}
                                src={moreIcon}
                                alt="عملیات"
                              />
                            </td> */}
                          </tr>
                        );
                      })
                    ) : !indicator_loading ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center" }}>
                          <p
                            style={{
                              fontSize: "10px",
                              fontFamily: "iransansBold",
                              margin: "10px",
                            }}
                          >
                            اطلاعاتی جهت نمایش موجود نیست
                          </p>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
                <div className="w-100 d-flex justify-content-end pl-4">
                  {indicators.length ? (
                    <Pagination
                      totalPage={Math.ceil(total_indicators / per_page)}
                      active={page}
                      callBack={
                        isCollector
                          ? this.getCollectorIndicators
                          : this.getMonitorIndicators
                      }
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* end nav */}
            </div>
          )}
        </div>
        {/*Insert Value Of Indicator*/}
        <Modal
          isOpen={this.state.IsMonitorScreenOpen}
          onRequestClose={this.closeMonitorScreenModal}
          style={this.props.match.params.pwa ? customStylespwa : customStyles}
          shouldCloseOnOverlayClick={false}
          portalClassName="full_screen_modal monitorScreenModal"
        >
          {/* top warning nav */}
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
          style={this.props.match.params.pwa ? customStylespwa : customStyles}
          contentLabel="User Modal"
          portalClassName="full_screen_modal selelctUsers"
        >
          {indicator && (
            <CollectorsIndicatorCalender
              reloadInterval={this.reloadInterval}
              isIndicator={true}
              CloseModal={this.closeModal}
              measure_interval={indicator.measure_interval}
              total_average={this.state.total_average}
              indicator={indicator}
              intervals={this.state.boxes}
              only_me={true}
              isCollector={isCollector}
              openReport={this.openReport}
              OpenMonitorScreenModal={
                isCollector ? this.OpenMonitorScreenModal : undefined
              }
              openDetailModal={this.openDetailModal}
              detailFormula={
                indicator.report_type !== "چک لیست" &&
                indicator.report_type !== "پرسشنامه"
                  ? true
                  : undefined
              }
              detailChecklist={
                indicator.report_type === "چک لیست" ||
                indicator.report_type === "پرسشنامه"
                  ? true
                  : undefined
              }
              selectedIndicator={this.state.selectedIndicator}
              pwa={this.props.match.params.pwa ? "pwastyle" : ""}
            />
          )}
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
            <button
              className="btn btn-link float-right"
              onClick={this.closeReport}
            >
              <i className="fal fa-times text-danger" />{" "}
            </button>
            <div className="row py-3 pb-5">
              <div className="col-12 text-center d-flex flex-wrap">
                {wards.length > 1 && (
                  <div className="custom-select-box form-group text-right w-100">
                    <label
                      className="color-dark text-iransansBold my-3"
                      style={{ fontSize: "0.8em" }}
                    >
                      بخــش ها
                    </label>
                    <Select
                      options={wards}
                      className="text-center custom-select-2"
                      isClearable
                      getOptionLabel={(opt) => opt.name}
                      getOptionValue={(opt) => opt.id}
                      onChange={(value, data) =>
                        userActions.handleChangeSelect.call(
                          this,
                          value,
                          data,
                          null,
                          null,
                          this.getChart
                        )
                      }
                      value={ward}
                      name="ward"
                      autoFocus={false}
                      isMulti={true}
                      //   onChange={userActions.handleChangeSelect.bind(this)}
                      placeholder={"انتخاب کنید"}
                      //   options={type_options}
                    />
                  </div>
                )}
                {this.state.gauges1 && (
                  <div
                    className="w-100 bg-white box-shadow d-flex flex-wrap overflow-auto"
                    style={{ height: 300 }}
                  >
                    {Object.keys(this.state.gauges1).map((g, i) => (
                      <div className="col-6" key={i}>
                        <Chart
                          height={300}
                          exporting={{
                            enabled: false,
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
                              shape: "arc",
                            },
                          }}
                          tooltip={{
                            enabled: false,
                          }}
                          yAxis={{
                            min:
                              this.state.gauges1Config.min !==
                              this.state.gauges1Config.max
                                ? this.state.gauges1Config.min
                                : this.state.gauges1Config.min,
                            max:
                              this.state.gauges1Config.min !==
                              this.state.gauges1Config.max
                                ? this.state.gauges1Config.max
                                : this.state.gauges1Config.max + 1,
                            stops:
                              indicator.upper_limit != null &&
                              indicator.lower_limit != null &&
                              indicator.lower_limit !== indicator.upper_limit
                                ? [
                                    [
                                      indicator.lower_limit,
                                      indicator.desirability == "افزاینده"
                                        ? "#DF5353"
                                        : "#55BF3B",
                                    ],
                                    [
                                      indicator.upper_limit,
                                      indicator.desirability == "افزاینده"
                                        ? "#55BF3B"
                                        : "#DF5353",
                                    ], // green
                                  ]
                                : undefined,
                            lineWidth: 0,
                            tickWidth: 0,
                            minorTickInterval: null,
                            tickAmount: 1,
                            title: {
                              y: -70,
                            },
                            labels: {
                              y: 16,
                            },
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
                                  "</div>",
                              },
                            },
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
                    style={{
                      borderRadius: "12px",
                      padding: "60px",
                      maxHeight: 500,
                    }}
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
              <button
                className="btn btn-primary rounded-pill"
                onClick={this.closeReport}
              >
                {" "}
                بازگشت
              </button>
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
              <Media
                query="(min-width: 770px)"
                render={() => (
                  <>
                    <div className="Cource  indicator_detail pwa_styles_indicator">
                      {/*headerIndeicator*/}
                      <div className=" headerIndeicator">
                        <div
                          className="text-center  "
                          style={{
                            background: "#104c82",
                            color: "#ffffff",
                            padding: "15px",
                            borderTopRightRadius: "20px",
                            borderTopLeftRadius: "20px",
                            fontSize: "13px",
                            fontFamily: "iransansbold",
                          }}
                        >
                          مشاهده شناسنامه شاخص با عنوان {indicator.title} (کد -{" "}
                          {indicator.code} )
                        </div>

                        <div className={"row d-flex justify-content-around"}>
                          <div className="col-lg-3 my-2 "></div>
                        </div>
                      </div>
                      {/*form indicator state*/}

                      <div className="container-fluid shadow   py-5  bg-white">
                        <div className="row d-flex justify-content-center  ">
                          {indicator.creation_date && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                تاریخ تدوین
                              </span>
                              <div
                                className=" bg-dark text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.creation_date} </span>
                              </div>
                            </div>
                          )}
                          {indicator.edit_date && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                تاریخ بازنگری
                              </span>
                              <div
                                className=" bg-dark text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.edit_date} </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className={
                            "row d-flex justify-content-center  my-4 p-xl-4 "
                          }
                        >
                          {indicator.quality_dimension && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                بعـد کیفیت
                              </span>
                              <div
                                className=" bg-pink   text-white "
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                {indicator.quality_dimension.map((q, j) => (
                                  <span key={j}>
                                    {" "}
                                    {q}{" "}
                                    {j + 1 < indicator.quality_dimension.length
                                      ? ","
                                      : ""}{" "}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {indicator.report_type && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                نحـوه گزارش
                              </span>
                              <div
                                className=" bg-warning text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.report_type} </span>
                              </div>
                            </div>
                          )}
                          {indicator.source && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                منبـع شاخص
                              </span>
                              <div
                                className=" bg-success text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.source} </span>
                              </div>
                            </div>
                          )}
                          {indicator.measurement_unit && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                واحـد انـدازه گیـری
                              </span>
                              <div
                                className=" bg-light-blue text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.measurement_unit} </span>
                              </div>
                            </div>
                          )}
                          {indicator.desirability && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                مطلـوبیت شاخص
                              </span>
                              <div
                                className=" bg-danger text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.desirability} </span>
                              </div>
                            </div>
                          )}
                          {indicator.basis && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                مبنـا شاخص
                              </span>
                              <div
                                className=" bg-purple text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.basis} </span>
                              </div>
                            </div>
                          )}
                          {indicator.aspect && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                جنبـه شاخص
                              </span>
                              <div
                                className=" bg-purple text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.aspect} </span>
                              </div>
                            </div>
                          )}
                          {indicator.indicator_type && (
                            <div
                              className="col-xl-3 col-lg-3 col-md-6  my-3 "
                              style={{ textAlign: "right", fontSize: "13px" }}
                            >
                              <span
                                className=""
                                style={{ fontFamily: "iransansBold" }}
                              >
                                نـوع شاخص
                              </span>
                              <div
                                className=" bg-purple text-white"
                                style={{
                                  marginTop: "10px",
                                  borderRadius: "10px",
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "10px",
                                }}
                              >
                                <span> {indicator.indicator_type} </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={"row  "}>
                          {indicator.definition && (
                            <div
                              className={
                                "col-lg-12 col-md-12 mt-4 text-center my-2"
                              }
                            >
                              <label
                                htmlFor=""
                                className="rounded-pill  px-4  titleInput bg-white"
                                style={{
                                  fontSize: "13px",
                                  fontFamily: "iransansBold",
                                  padding: "10px",
                                }}
                              >
                                تعـریف شـاخص و اهمیت موضـوع
                              </label>
                              <div
                                className=" box-border "
                                style={{ borderRadius: "20px" }}
                              >
                                {indicator.definition.map((item, index) => {
                                  return (
                                    <p
                                      style={{
                                        textAlign: "justify",
                                        fontSize: "12px",
                                        lineHeight: "2em",
                                      }}
                                      key={index}
                                      className="p-10 "
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
                                className="rounded-pill  px-4  titleInput bg-white"
                                style={{
                                  fontSize: "13px",
                                  fontFamily: "iransansBold",
                                  padding: "10px",
                                }}
                              >
                                دلایل منطقـی جمع آوری شـاخص{" "}
                              </label>

                              <div
                                className=" box-border"
                                style={{ borderRadius: "20px" }}
                              >
                                {indicator.logical_reasons_of_collecting &&
                                  indicator.logical_reasons_of_collecting.map(
                                    (item, index) => {
                                      return (
                                        <p
                                          style={{
                                            textAlign: "justify",
                                            fontSize: "12px",
                                            lineHeight: "2em",
                                          }}
                                          key={index}
                                          className="p-10 "
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
                            className="calculation d-flex flex-wrap flex-column col-lg-8 align-items-center py-5 my-5 mx-auto"
                            style={{ borderRadius: "20px" }}
                          >
                            <div className="row justify-content-end w-100">
                              <ContentEditable
                                innerRef={this.numerator}
                                name="numerator"
                                html={indicator.numerator} // innerHTML of the editable div
                                disabled={true} // use true to disable edition
                                onChange={(e) =>
                                  userActions.maskInput.call(
                                    this,
                                    e,
                                    "numerator",
                                    {
                                      className: "iran_sans_Bold text_muted",
                                    }
                                  )
                                } // handle innerHTML change
                                className="rounded-pill col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2 pwa_test_compute"
                                style={{
                                  border: "1px solid #b0b0b0",
                                  fontSize: "13px",
                                }}
                                tagName="div"
                              />

                              <div className="d-flex justify-content-center col-2">
                                <Popover
                                  isOpen={numerator_help_popover}
                                  position={["top", "right", "left", "bottom"]} // preferred position
                                  padding={10}
                                  onClickOutside={() =>
                                    this.setState({
                                      numerator_help_popover: false,
                                    })
                                  }
                                  content={({
                                    position,
                                    targetRect,
                                    popoverRect,
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
                                        numerator_help_popover:
                                          !numerator_help_popover,
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
                                className="rounded-pill  py-2 col-2 shadow-sm text-center"
                                style={{
                                  border: "1px solid #b0b0b0",
                                  fontSize: "13px",
                                }}
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
                                onChange={(e) =>
                                  userActions.maskInput.call(
                                    this,
                                    e,
                                    "denumerator",
                                    { className: "iran-sans_Bold text-muted" }
                                  )
                                } // handle innerHTML change
                                className="rounded-pill  col-6 bg-white shadow-sm d-flex flex-wrap align-items-center justify-content-center py-2 pwa_test_compute"
                                style={{
                                  border: "1px solid #b0b0b0",
                                  fontSize: "13px",
                                }}
                                tagName="div"
                              />
                              <div className="d-flex justify-content-center col-2">
                                <Popover
                                  isOpen={denumerator_help_popover}
                                  position={["bottom", "left", "right", "top"]} // preferred position
                                  padding={10}
                                  onClickOutside={() =>
                                    this.setState({
                                      denumerator_help_popover: false,
                                    })
                                  }
                                  content={({
                                    position,
                                    targetRect,
                                    popoverRect,
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
                                            indicator.denumerator_help.split(
                                              "\n"
                                            ).length || 1
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
                                        denumerator_help_popover:
                                          !denumerator_help_popover,
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
                          {indicator.target !== null ||
                          indicator.upper_limit !== null ||
                          indicator.lower_limit !== null ? (
                            <div className="calculation-inputs flex-wrap d-flex justify-content-around col-lg-8 py-5 my-5">
                              {indicator.target !== null && (
                                <div className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                  <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">
                                    تارگت
                                  </h4>
                                  <div className="box-target text-center py-3 mt-3">
                                    {indicator.target}
                                  </div>
                                </div>
                              )}

                              {indicator.upper_limit !== null && (
                                <div className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                  <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">
                                    حد بالا
                                  </h4>
                                  <div className="box-target text-center py-3 mt-3">
                                    {indicator.upper_limit}
                                  </div>
                                </div>
                              )}

                              {indicator.lower_limit !== null && (
                                <div className="d-flex flex-column align-items-center input-group-lg col-xl-2 col-lg-3 col-md-6 col-sm-9">
                                  <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2">
                                    حد پایین
                                  </h4>
                                  <div className="box-target text-center py-3 mt-3">
                                    {indicator.lower_limit}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
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
              <Media
                query="(max-width: 769px)"
                render={() => (
                  <>
                    <div className="Cource  indicator_detail pwa_styles_indicator">
                      {/*headerIndeicator*/}
                      <img
                        src={backIcon}
                        alt="backIcon"
                        onClick={this.closeDetailModal}
                        className="col-7btn d-block mx-auto my-2 px-5"
                        style={{ width: "125px", cursor: "pointer" }}
                      />

                      <div className="container-fluid headerIndeicator">
                        <div
                          className={"row d-flex justify-content-around my-4"}
                        >
                          <div className="col-lg-3my-2">
                            <div
                              className="text-center   py-2 text-dark iran-sans_Bold bg-white "
                              style={{ fontSize: ".9em" }}
                            >
                              {indicator.title}
                            </div>
                          </div>
                          {indicator.code && (
                            <div className="col-lg-3 my-2">
                              <div
                                className={`text-center  rounded-pill  text-white shadow bg-navy-blue  py-2 iran-sans_Bold ${
                                  this.props.match.params.pwa
                                    ? "indicator_detail_joziat"
                                    : ""
                                }`}
                              >
                                {indicator.code}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row d-flex justify-content-center">
                        {indicator.creation_date && (
                          <div className={"col-6 mt-4 "}>
                            <p
                              className="text-right pwa_date_review"
                              htmlFor=""
                            >
                              {" "}
                              تاریخ تدویـن
                            </p>
                            <div className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
                              <p className="dateText">
                                {indicator.creation_date}
                              </p>
                              <i className="fal fa-calendar-alt fa-1x"></i>
                            </div>
                          </div>
                        )}
                        {indicator.edit_date && (
                          <div className={"col-6 mt-4 "}>
                            <p
                              className="text-right pwa_date_review"
                              htmlFor=""
                            >
                              {" "}
                              تاریخ بازنگـری
                            </p>
                            <div className="rounded-pill py-2 dateBox d-flex justify-content-around align-items-center">
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
                        {indicator.quality_dimension && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold text-right title_pwa_indicator">
                              بعـد کیفیت
                            </div>
                            <div className="text-center bg-pink rounded-pill py-2 text-white  overflow-hidden text_pwa_indicator_colorful">
                              {indicator.quality_dimension.map((q, j) => (
                                <span key={j}>
                                  {" "}
                                  {q}{" "}
                                  {j + 1 < indicator.quality_dimension.length
                                    ? ","
                                    : ""}{" "}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {indicator.report_type && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold text-right title_pwa_indicator">
                              نحـوه گـزارش
                            </div>
                            <div className="text-center bg-warning rounded-pill py-2 text-white text_pwa_indicator_colorful">
                              <span> {indicator.report_type} </span>
                            </div>
                          </div>
                        )}
                        {indicator.source && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold text-right title_pwa_indicator">
                              منبـع شـاخص
                            </div>
                            <div className="text-center bg-success rounded-pill py-2 text-white text_pwa_indicator_colorful">
                              <span> {indicator.source} </span>
                            </div>
                          </div>
                        )}
                        {indicator.measurement_unit && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold text-right title_pwa_indicator">
                              واحـد اندازه گیـری
                            </div>
                            <div className="text-center bg-light-blue rounded-pill py-2  text-white text_pwa_indicator_colorful ">
                              <span> {indicator.measurement_unit} </span>
                            </div>
                          </div>
                        )}
                        {indicator.desirability && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold text-right title_pwa_indicator">
                              مطلوبیت شـاخص
                            </div>
                            <div className="text-center bg-danger rounded-pill py-2 text-white text_pwa_indicator_colorful ">
                              <span> {indicator.desirability} </span>
                            </div>
                          </div>
                        )}
                        {indicator.basis && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold text-right title_pwa_indicator">
                              مبنـا شـاخص
                            </div>
                            <div className="text-center bg-purple rounded-pill py-2 text-white text_pwa_indicator_colorful">
                              <span> {indicator.basis} </span>
                            </div>
                          </div>
                        )}
                        {indicator.aspect && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2 ">
                            <div className="iransansBold text-right title_pwa_indicator">
                              جنبـه شـاخص
                            </div>
                            <div className="text-center bg-navy-blue rounded-pill py-2 text-white text_pwa_indicator_colorful">
                              <span> {indicator.aspect}</span>
                            </div>
                          </div>
                        )}
                        {indicator.indicator_type && (
                          <div className="col-xl-3 col-lg-3 col-md-6  my-2">
                            <div className="iransansBold  text-right title_pwa_indicator">
                              نـوع شـاخص
                            </div>
                            <div className="text-center bg-light-green rounded-pill py-2  text-white text_pwa_indicator_colorful">
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
                              style={{ marginTop: "-1.5em " }}
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
                          <label
                            for=""
                            class="rounded-pill  px-4 py-1 titleInput bg-white"
                          >
                            فرمول محاسباتی
                          </label>
                          <div
                            className="calculation d-flex flex-wrap flex-column rounded box-border align-items-center py-4"
                            style={{ boxShadow: "unset" }}
                          >
                            <div className="row justify-content-end w-100 px-2">
                              <ContentEditable
                                innerRef={this.numerator}
                                name="numerator"
                                html={indicator.numerator} // innerHTML of the editable div
                                disabled={true} // use true to disable edition
                                onChange={(e) =>
                                  userActions.maskInput.call(
                                    this,
                                    e,
                                    "numerator",
                                    {
                                      className: "iran_sans_Bold text_muted",
                                    }
                                  )
                                } // handle innerHTML change
                                className="border-0 col-9 bg-white d-flex flex-wrap align-items-center text-center justify-content-center py-2 pwa_test_compute"
                                tagName="div"
                              />

                              <div className="d-flex justify-content-center col-2 item_hidden_pwa">
                                <Popover
                                  isOpen={numerator_help_popover}
                                  position={["top", "right", "left", "bottom"]} // preferred position
                                  padding={10}
                                  onClickOutside={() =>
                                    this.setState({
                                      numerator_help_popover: false,
                                    })
                                  }
                                  content={({
                                    position,
                                    targetRect,
                                    popoverRect,
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
                                        numerator_help_popover:
                                          !numerator_help_popover,
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
                                onChange={(e) =>
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
                              <div className="d-flex justify-content-center col-2  item_hidden_pwa">
                                <Popover
                                  isOpen={denumerator_help_popover}
                                  position={["bottom", "left", "right", "top"]} // preferred position
                                  padding={10}
                                  onClickOutside={() =>
                                    this.setState({
                                      denumerator_help_popover: false,
                                    })
                                  }
                                  content={({
                                    position,
                                    targetRect,
                                    popoverRect,
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
                                            indicator.denumerator_help.split(
                                              "\n"
                                            ).length || 1
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
                                        denumerator_help_popover:
                                          !denumerator_help_popover,
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
                          <label
                            for=""
                            class="rounded-pill  px-4 py-1  titleInput bg-white"
                            style={{ zIndex: "1" }}
                          >
                            حد مجاز
                          </label>
                          {indicator.target !== null ||
                          indicator.upper_limit !== null ||
                          indicator.lower_limit !== null ? (
                            <div
                              className="pt-4 rounded box-border calculation-inputs flex-wrap d-flex justify-content-around col-12 py-2 my-1 px-0"
                              style={{ boxShadow: "unset" }}
                            >
                              {indicator.target !== null && (
                                <div className="d-flex flex-column align-items-center input-group-lg  col-4">
                                  <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2 pwa_target_font">
                                    تارگت
                                  </h4>
                                  <div className="text-center py-1 mt-1">
                                    {indicator.target}
                                  </div>
                                </div>
                              )}

                              {indicator.upper_limit !== null && (
                                <div className="d-flex flex-column align-items-center input-group-lg col-4">
                                  <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2 pwa_target_font">
                                    حد بالا
                                  </h4>
                                  <div className="text-center py-1 mt-1">
                                    {indicator.upper_limit}
                                  </div>
                                </div>
                              )}

                              {indicator.lower_limit !== null && (
                                <div className="d-flex flex-column align-items-center input-group-lg col-4">
                                  <h4 className="rounded-underline text-center color-dark lalezar w-100 pb-2 pwa_target_font">
                                    حد پایین
                                  </h4>
                                  <div className="text-center py-1 mt-1">
                                    {indicator.lower_limit}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              />
            </>
          )}
        </Modal>
        {/* {
                    this.state.periodicityModal && (
                        <PeriodicityModal setPeriodicityModal={this.handleSetPeriodicityModal} periodicityModal={periodicityModal} periodData={this.state.periodData}
                            currentIndicator={this.state.currentIndicator}
                            p_pageInfo={this.state.PPageInfo}
                            p_page={this.state.p_page}
                            setP_page={this.handleSetP_Page}
                        />
                    )
                } */}
      </>
    );
  }
}

const IndicatorCollctorCompact = connect((state) => ({
  globalStorage: state.globalStorage,
}))(IndicatorCollectorOrMonitor);
export { IndicatorCollctorCompact };
