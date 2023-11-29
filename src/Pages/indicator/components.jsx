import React, { Component } from "react";
import Select from "react-select";
import Modal from "react-modal";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import MaskInput from "react-text-mask";
import Popover, { ArrowContainer } from "react-tiny-popover";
import * as _ from "lodash";
import AddIcon from "../../assets/images/plus.png";
import LogoHospital from "../../assets/images/LogoHospital.png";
import MonitorIcon from "../../assets/images/job.png";
import Payeh from "../../assets/images/payeh.png";
import GaugeIcon from "../../assets/images/gauge.png";
import CollectorIcon from "../../assets/images/network.png";
import { UsersSelect, HospitalTable, InputGenerator } from "../../_components";
import { userActions } from "../../_actions";
import { userConstants } from "../../_constants";
import moment from "jalali-moment/jalali-moment";
import Media from "react-media";
import division from "../../assets/images/div_iocn.png";
import multiple from "../../assets/images/x_iocn.png";
import equall from "../../assets/images/equall.png";
import deletenew from "../../assets/images/delete.png";
import { ROTATION } from "../../_constants";

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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: "0px",
    },
    content: {
        animationName: "animatetop",
        animationDuration: "0.4s",
        padding: "0px",
    },
};

class IntervalValue_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checklist_info: "",
            menuItems: "",
            questions: "",
            description: "",
            ward: "",
            numerators: [],
            denumerators: [],
            num_help_popover: false,
            denum_help_popover: false,
            equal: props.interval ? props.interval.average : "",
            checklist: false,
            messages: props.messages || [],
            text: "",
        };
        this.submitFormula = this.submitFormula.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.submitChecklist = this.submitChecklist.bind(this);
        this.wardOnChange = this.wardOnChange.bind(this);
    }

    sendComment = (e) => {
        e.preventDefault();
    };
    calc = () => {
        const numerators = [];
        const denumerators = [];
        this.props.formula.numerator.map((num, i) => {
            if (
                num !== "1" &&
                num !== 1 &&
                this.state["numerator_" + i] !== null &&
                this.state["numerator_" + i] !== undefined
            ) {
                let opt = this.props.formula.numerator_operators[i] || "";
                numerators.push(parseFloat(this.state["numerator_" + i]));
                if (opt) {
                    numerators.push(opt);
                }
            } else {
                numerators.push(1);
            }
        });
        this.props.formula.denumerator.map((num, i) => {
            if (
                num !== "1" &&
                num !== 1 &&
                this.state["denumerator_" + i] !== null &&
                this.state["denumerator_" + i] !== undefined
            ) {
                let opt = this.props.formula.denumerator_operators[i] || "";
                denumerators.push(parseFloat(this.state["denumerator_" + i]));
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
        const equal = (
            (eq_num / (eq_denum || 1)) *
            this.props.formula.multiplier
        ).toFixed(2);
        this.setState({ equal, numerators, denumerators });
    };
    showChecklist = () => {
        if (this.state.ward) {
            this.setState({ checklist: true });
        } else {
            userActions.failure("لطفاً بخش را انتخاب کنید.");
        }
    };

    closeChecklist = () => {
        this.setState({ checklist: false, questions: null });
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

    onChangeInfo = (item, data) => {
        const { menuItems } = this.state;
        menuItems[menuItems.indexOf(item)].value = data;
        this.setState({ menuItems });
    };

    componentDidUpdate(prop, state) {
        if (state !== this.state) {
            if (
                this.props.indicator.report_type !== "چک لیست" &&
                this.props.indicator.report_type !== "پرسشنامه"
            ) {
                const keys = Object.keys(this.state).filter(
                    (k) => k.indexOf("numerator_") >= 0
                );

                let hasChanged = false;
                keys.map((k) => {
                    if (state[k] !== this.state[k]) {
                        hasChanged = true;
                    }
                });
                if (hasChanged) {
                    this.calc();
                }
            }
        }
    }

    async getAnswererItems(indicator_id) {
        return await this.props.dispatch(
            userActions.API(
                "get",
                `/v2/get_indicator_answerer_info_menu_items?indicator_id=${indicator_id}`
            )
        );
    }

    async afterOpenModal() {
        try {
            let menuItems = [];
            let questions = [];
            let checklist_info = {};
            const res_1 = await this.props.dispatch(
                userActions.API(
                    "get",
                    `/v2/get_indicator_answerer_info_menu_items?indicator_id=${this.props.indicator.id}`
                )
            );
            menuItems = res_1.data.items;
            const res_2 = await this.props.dispatch(
                userActions.API(
                    "get",
                    `/v2/get_indicator_questions?indicator_id=${this.props.indicator.id}`
                )
            );
            questions = res_2.data.data;
            const res_3 = await this.props.dispatch(
                userActions.API(
                    "get",
                    `/v2/get_indicator_inquire_info?indicator_id=${this.props.indicator.id}`
                )
            );
            checklist_info = res_3.data.inquire_info;
            menuItems.map((m) => {
                m.value = "";
                m.value = m.item_type === "TimePicker" ? "00:00" : "";
            });
            this.setState({ menuItems, questions, checklist_info });
        } catch (e) {
            console.error(e);
        }
    }

    async submitFormula() {
        const { isCollector, indicator, interval, formula } = this.props;
        const { ward, numerators, denumerators, description, text } = this.state;
        const numerator_values = numerators.filter((itm) =>
            userActions.onlyDigit(itm)
        );
        const denumerator_values = denumerators.filter((itm) =>
            userActions.onlyDigit(itm)
        );
        if (isCollector) {
            if (ward) {
                if (
                    indicator.report_type === "چک لیست" ||
                    indicator.report_type === "پرسشنامه"
                ) {
                    this.props.CloseModal();
                } else {
                    if (numerator_values.length) {
                        if (denumerator_values.length) {
                            if (!interval.id) {
                                const addIntervalRes = await this.props.addNewInterval(
                                    interval
                                );
                                interval.id = addIntervalRes.id;
                            }
                            const answerer_info = this.state.menuItems
                                ? this.state.menuItems.map((m) => ({
                                    menu_item_id: m.id,
                                    value:
                                        typeof m.value === "object"
                                            ? m.value.id || m.value._id || m.value.value
                                            : m.value,
                                }))
                                : [];
                            const params = {
                                answerer_info,
                                infos: {
                                    formula_id: formula.id,
                                    interval_id: interval.id,
                                    ward_id: ward._id,
                                    description,
                                },
                                values: [
                                    {
                                        title: "numerator",
                                        values: numerator_values,
                                    },
                                    {
                                        title: "denumerator",
                                        values: denumerator_values,
                                    },
                                ],
                                text,
                            };
                            const res = await this.props.dispatch(
                                userActions.API(
                                    "post",
                                    "/v2/upload_indicator_formula_values",
                                    params
                                )
                            );
                            userActions.successToast(res.data.message);
                            this.props.CloseModal(true);
                        } else {
                            userActions.failure("لطفاً مقادیر مخرج را وارد کنید.");
                        }
                    } else {
                        userActions.failure("لطفاً مقادیر صورت را وارد کنید.");
                    }
                }
            } else {
                userActions.failure("لطفاً بخش را انتخاب کنید.");
            }
        }
    }

    async componentDidMount() {
        if (!this.props.globalStorage.wards.length) {
            this.props.dispatch(userActions.getWards());
        }
        if (this.props.isCollector && this.props.indicator.has_menu_item) {
            this.getAnswererItems(this.props.indicator.id).then((res) => {
                this.setState({ menuItems: res.data.items });
            });
        }
    }

    async submitChecklist(e) {
        e.preventDefault();

        const { menuItems, ward, questions } = this.state;
        const { isCollector, indicator, interval, formula } = this.props;

        const answerer_info = menuItems.map((m) => ({
            menu_item_id: m.id,
            value:
                typeof m.value === "object"
                    ? m.value.id || m.value._id || m.value.value
                    : m.value,
        }));
        const answers = [];
        questions.map((q) => {
            if (q.content) {
                q.content.map((c) => {
                    if (c.answer != undefined) {
                        answers.push({
                            question_id: c.question_id,
                            answer: c.answer,
                            value: c.value,
                        });
                    }
                });
            }
        });
        //console.log(menuItems,ward,questions)
        if (ward) {
            if (!interval.id) {
                const addIntervalRes = await this.props.addNewInterval(interval);
                interval.id = addIntervalRes.id;
            }
            this.props
                .dispatch(
                    userActions.API("post", "/v2/upload_indicator_answers_of_questions", {
                        collecting_info: {
                            interval_id: interval.id,
                            collected_from_ward: ward._id,
                        },
                        answerer_info,
                        answers,
                    })
                )
                .then((res) => {
                    userActions.successToast("اطلاعات باموفقیت ذخیره شد.");
                    this.closeChecklist();
                    this.setState({ questions: [] });
                });
        } else {
            userActions.failure("لطفاً بخش را انتخاب کنید.");
        }
    }

    async wardOnChange(ward) {
        const {
            numerator_indicator_id,
            denumerator_indicator_id,
            numerator_indicator_name,
            denumerator_indicator_name,
        } = this.props.formula;
        if (numerator_indicator_id || denumerator_indicator_id) {
            if (
                numerator_indicator_id &&
                denumerator_indicator_id &&
                numerator_indicator_id === denumerator_indicator_id
            ) {
                const res = await this.props.dispatch(
                    userActions.API(
                        "post",
                        `/v2/indicator/interval_by_ward?id=${numerator_indicator_id}`,
                        {
                            wards: [ward._id],
                            rotation: ROTATION[this.props.indicator.measure_interval],
                        }
                    )
                );
                const interval = res.data.wards[0].values.find(
                    (v) => v.interval_number === this.props.interval.interval_number
                );
                if (interval != null) {
                    this.setState({
                        numerator_0: interval.value.toFixed(2),
                        denumerator_0: interval.value.toFixed(2),
                    });
                } else {
                    this.setState({
                        numerator_0: "",
                        denumerator_0: "",
                    });
                    userActions.failure(
                        "ابتدا مقادیر شاخص " +
                        numerator_indicator_name +
                        " " +
                        "در این دوره می بایست وارد شده باشد."
                    );
                }
            } else {
                if (numerator_indicator_id) {
                    const res = await this.props.dispatch(
                        userActions.API(
                            "post",
                            `/v2/indicator/interval_by_ward?id=${numerator_indicator_id}`,
                            {
                                wards: [ward._id],
                                rotation: ROTATION[this.props.indicator.measure_interval],
                            }
                        )
                    );
                    const interval = res.data.wards[0].values.find(
                        (v) => v.interval_number === this.props.interval.interval_number
                    );
                    if (interval != null) {
                        this.setState({
                            numerator_0: interval.value.toFixed(2),
                        });
                    } else {
                        this.setState({
                            numerator_0: "",
                        });
                        userActions.failure(
                            "ابتدا مقادیر شاخص " +
                            numerator_indicator_name +
                            " " +
                            "در این دوره می بایست وارد شده باشد."
                        );
                    }
                }
                if (denumerator_indicator_id) {
                    const res = await this.props.dispatch(
                        userActions.API(
                            "post",
                            `/v2/indicator/interval_by_ward?id=${denumerator_indicator_id}`,
                            {
                                wards: [ward._id],
                                rotation: ROTATION[this.props.indicator.measure_interval],
                            }
                        )
                    );
                    const interval = res.data.wards[0].values.find(
                        (v) => v.interval_number === this.props.interval.interval_number
                    );
                    if (interval != null) {
                        this.setState({
                            denumerator_0: interval.value.toFixed(2),
                        });
                    } else {
                        this.setState({
                            denumerator_0: "",
                        });
                        userActions.failure(
                            "ابتدا مقادیر شاخص " +
                            denumerator_indicator_name +
                            " " +
                            "در این دوره می بایست وارد شده باشد."
                        );
                    }
                }
            }
        }
    }

    checkChecklist = () => {
        if (
            this.props.isCollector &&
            (this.props.indicator.report_type === "پرسشنامه" ||
                this.props.indicator.report_type === "چک لیست")
        ) {
            return true;
        }
        return false;
    };

    render() {
        const { globalStorage, formula, isCollector, indicator, interval } =
            this.props;
        const { wards } = globalStorage;
        const {
            ward,
            num_help_popover,
            denum_help_popover,
            equal,
            description,
            questions,
            menuItems,
            checklist_info,
            messages,
        } = this.state;
        return (
            <>
                <Media
                    query="(min-width: 770px)"
                    render={() => (
                        <>
                            <div className="container bg-white shadow rounded ">
                                <div className="row">
                                    <div className="col-sm-12 bg-blue  rounded-right">
                                        <div className="d-flex flex-column align-items-center py-4  ">
                                            {/*<img src={GaugeIcon} alt="" width="90" height="90" className="py-1"/>*/}
                                            <h5
                                                className=" iran-sans_Bold text-center py-1 text-white"
                                                style={{ fontSize: "13px" }}
                                            >
                                                {isCollector ? "ورود " : "مشاهده "}
                                                مقادیر شاخص ({this.props.indicator.title})
                                                <span
                                                    className="iran-sans_Bold "
                                                    style={{ fontSize: "13px" }}
                                                >
                          {" " +
                              userActions.getIntervalTitle(
                                  indicator.measure_interval,
                                  interval.interval_number
                              )}
                        </span>
                                            </h5>
                                        </div>
                                    </div>
                                    <div className=" col-sm-12 ">
                                        <div
                                            className=" pt-3 "
                                            style={{
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                                width: " 45%",
                                            }}
                                        >
                                            <div className="form-group text-right ">
                                                <label
                                                    className="iran-sans_Bold text-right "
                                                    style={{ fontSize: "12px", color: "#484848" }}
                                                >
                                                    {" "}
                                                    بخش{" "}
                                                </label>
                                                <Select
                                                    className="text-center custom-select-2"
                                                    value={ward}
                                                    name="ward"
                                                    placeholder=""
                                                    onChange={async (v, d) => {
                                                        await userActions.handleChangeSelect.call(
                                                            this,
                                                            v,
                                                            d,
                                                            null,
                                                            null,
                                                            this.wardOnChange
                                                        );

                                                        if (this.checkChecklist()) {
                                                            this.showChecklist();
                                                        }
                                                    }}
                                                    options={wards}
                                                    getOptionLabel={(opt) => opt.name}
                                                    getOptionValue={(opt) => opt._id}
                                                    id="ward"
                                                />
                                            </div>
                                        </div>
                                        {this.props.indicator.has_menu_item &&
                                            this.state.menuItems && (
                                                <div className="container-fluid  text-right ">
                                                    <div className="row d-flex justify-content-center px-1">
                                                        {this.state.menuItems.map((m, i) => (
                                                            <div className="col-6  " key={i}>
                                                                <label
                                                                    className="iran-sans_Bold"
                                                                    style={{ fontSize: "12px", color: "#484848" }}
                                                                    htmlFor=""
                                                                >
                                                                    {" "}
                                                                    {m.item}
                                                                </label>
                                                                <div className="pt-2 pb-4 ">
                                                                    <InputGenerator
                                                                        readOnly={this.state.readOnly}
                                                                        dispatch={this.props.dispatch}
                                                                        type={m.item_type}
                                                                        globalStorage={this.props.globalStorage}
                                                                        placeholder={
                                                                            m.placeholder || m.place_holder
                                                                        }
                                                                        options={
                                                                            m.options
                                                                                ? userActions.generateSelectLabelValue(
                                                                                    m.options
                                                                                )
                                                                                : []
                                                                        }
                                                                        onChange={(data) => {
                                                                            this.onChangeInfo(m, data);
                                                                        }}
                                                                        value={m.value}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        <div
                                            className={`monitor col ${
                                                this.checkChecklist() && "d-none"
                                            }`}
                                            style={{
                                                width: "55%",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                            }}
                                        >
                                            {isCollector ? (
                                                indicator.report_type === "پرسشنامه" ||
                                                indicator.report_type === "چک لیست" ? (
                                                    //   <button
                                                    //     className={`btn btn-blue d-block mx-auto my-4 rounded-pill px-5 ${
                                                    //       !ward ? "disabled" : ""
                                                    //     }`}
                                                    //     onClick={this.showChecklist}
                                                    //   >
                                                    //     <span className="px-1">تکمیل</span>
                                                    //     <span> {indicator.report_type}</span>
                                                    //   </button>
                                                    <></>
                                                ) : (
                                                    <div
                                                        className=" text-center iran-sans_Bold py-3 "
                                                        style={{
                                                            background: "#104c82",
                                                            color: "#ffffff",
                                                            marginLeft: "-15px",
                                                            marginRight: "-15px",
                                                        }}
                                                    >
                                                        لطفا مقادیر را در فـرمول وارد کنید
                                                    </div>
                                                )
                                            ) : (
                                                ""
                                            )}
                                            <div
                                                className={`calculation flex-column align-items-center py-5 mb-5 ${
                                                    this.checkChecklist() ? "d-none" : "d-flex"
                                                }`}
                                            >
                                                <div
                                                    className="row justify-content-end w-100"
                                                    data-tip={formula.numerator_placeholder}
                                                >
                                                    <div
                                                        className="rounded-pill flex-wrap  text-center d-flex justify-content-center col-6"
                                                        style={{
                                                            border: "1px solid #e4e3e3",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        {formula.numerator.map((itm, i) => (
                                                            <div className="d-flex ml-2" key={i}>
                                                                <input
                                                                    type="text"
                                                                    placeholder={itm}
                                                                    value={this.state["numerator_" + i]}
                                                                    name={"numerator_" + i}
                                                                    className="border-0  text-center"
                                                                    style={{ width: 100, fontSize: ".8em" }}
                                                                    // readOnly={indicator.report_type === 'پرسشنامه' || indicator.report_type === 'چک لیست' || itm.toString() === '1' || formula.numerator_indicator_id}
                                                                    readOnly={
                                                                        indicator.report_type === "پرسشنامه" ||
                                                                        indicator.report_type === "چک لیست" ||
                                                                        itm.toString() === "1"
                                                                    }
                                                                    onChange={(e) => {
                                                                        userActions.handleChangeInput.call(
                                                                            this,
                                                                            e,
                                                                            "number"
                                                                        );
                                                                    }}
                                                                />
                                                                <span className="iran-sans_Bold text-muted mr-2">
                                  {formula.numerator_operators[i]}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-center col-2">
                                                        <Popover
                                                            isOpen={num_help_popover}
                                                            containerClassName="always-top-of"
                                                            position={["top", "right", "left", "bottom"]} // preferred position
                                                            padding={10}
                                                            onClickOutside={() =>
                                                                this.setState({ num_help_popover: false })
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
                                                                                formula.numerator_help.indexOf("\n") >=
                                                                                0
                                                                                    ? "rounded"
                                                                                    : "rounded-pill"
                                                                            } border-0 `}
                                                                            name="numerator_help"
                                                                            value={formula.numerator_help}
                                                                            rows={
                                                                                formula.numerator_help.split("\n")
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
                                                                        num_help_popover: !num_help_popover,
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
                                                    className="d-flex align-items-center justify-content-center w-100 "
                                                    style={{ paddingLeft: "6rem", fontSize: ".8em" }}
                                                >
                                                    <input
                                                        type="text"
                                                        className="rounded-pill  py-2 px-0 col-2  text-center"
                                                        style={{
                                                            border: "1px solid #e4e3e3",
                                                            padding: "10px",
                                                        }}
                                                        name="equal"
                                                        readOnly={true}
                                                        value={equal}
                                                    />
                                                    <div className="text-center  px-2">
                                                        <b>=</b>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="rounded-pill  py-2 px-0 col-2  text-center"
                                                        style={{
                                                            border: "1px solid #e4e3e3",
                                                            padding: "10px",
                                                        }}
                                                        name="multiplier"
                                                        readOnly={true}
                                                        value={formula.multiplier}
                                                    />
                                                    <div className="text-center px-2">
                                                        <i className="fas fa-times"></i>
                                                    </div>
                                                    <div className="h-line col-7"></div>
                                                </div>
                                                <div
                                                    className="row justify-content-end w-100"
                                                    data-tip={formula.denumerator_placeholder}
                                                >
                                                    <div
                                                        className="rounded-pill flex-wrap  text-center d-flex justify-content-center  col-6"
                                                        style={{
                                                            border: "1px solid #e4e3e3",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        {formula.denumerator.map((itm, i) => (
                                                            <div className="d-flex  ml-2" key={i}>
                                                                <input
                                                                    type="text"
                                                                    placeholder={itm}
                                                                    value={this.state["denumerator_" + i]}
                                                                    name={"denumerator_" + i}
                                                                    className="border-0  text-center "
                                                                    style={{ width: 100, fontSize: ".8em" }}
                                                                    onChange={(e) => {
                                                                        userActions.handleChangeInput.call(
                                                                            this,
                                                                            e,
                                                                            "number"
                                                                        );
                                                                    }}
                                                                    // readOnly={indicator.report_type === 'پرسشنامه' || indicator.report_type === 'چک لیست' || itm.toString() === '1' || formula.denumerator_indicator_id}
                                                                    readOnly={
                                                                        indicator.report_type === "پرسشنامه" ||
                                                                        indicator.report_type === "چک لیست" ||
                                                                        itm.toString() === "1"
                                                                    }
                                                                />
                                                                <span className="iran-sans_Bold text-muted mr-2">
                                  {formula.denumerator_operators[i]}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="d-flex justify-content-center col-2">
                                                        <Popover
                                                            containerClassName="always-top-of"
                                                            isOpen={denum_help_popover}
                                                            position={["bottom", "left", "right", "top"]} // preferred position
                                                            padding={10}
                                                            onClickOutside={() =>
                                                                this.setState({ denum_help_popover: false })
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
                                                                            راهنمای مخرج
                                                                        </p>
                                                                        <textarea
                                                                            className={`form-control ${
                                                                                formula.denumerator_help.indexOf(
                                                                                    "\n"
                                                                                ) >= 0
                                                                                    ? "rounded"
                                                                                    : "rounded-pill"
                                                                            } border-0 `}
                                                                            name="denumerator_help"
                                                                            value={formula.denumerator_help}
                                                                            rows={
                                                                                formula.denumerator_help.split("\n")
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
                                                                        denum_help_popover: !denum_help_popover,
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
                                                <ReactTooltip type="dark" html={true} />
                                            </div>
                                        </div>
                                        <div
                                            className={`leg text-center ${
                                                this.checkChecklist() && "d-none"
                                            }`}
                                        >
                                            <img src={Payeh} />
                                        </div>

                                        {/*tozihat-start*/}
                                        <div
                                            className={`w-100 text-right px-3 ${
                                                this.checkChecklist() && "d-none"
                                            }`}
                                        >
                                            <label
                                                className="description  shadow-sm border px-4 rounded-pill bg-white iran-sans_Bold"
                                                style={{ fontSize: "12px", padding: "10px" }}
                                            >
                                                توضیحات تکمیلی (اقدامات اصلاحی){" "}
                                            </label>
                                            <div
                                                className=" pt-4   overflow-hidden  bg-white shadow-sm"
                                                style={{
                                                    height: "150px",
                                                    border: "1px solid #dedede",
                                                    borderRadius: "20px",
                                                    marginBottom: "20px",
                                                }}
                                            >
                        <textarea
                            name="text"
                            onChange={userActions.handleChangeInput.bind(this)}
                            className="shadow-none border-0 form-control w-100 h-100"
                            value={this.state.text}
                        ></textarea>
                                            </div>
                                        </div>
                                        {/*tozihat-end*/}

                                        <div className="d-flex w-100 justify-content-center pb-4">
                                            {isCollector && (
                                                <button
                                                    className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1"
                                                    onClick={this.submitFormula}
                                                >
                                                    ثبت
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    this.props.CloseModal();
                                                }}
                                                className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1"
                                            >
                                                بازگـشــت
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Modal
                                    isOpen={this.state.checklist}
                                    onRequestClose={this.closeChecklist}
                                    onAfterOpen={this.afterOpenModal}
                                    shouldCloseOnOverlayClick={false}
                                    portalClassName="full_screen_modal checklistModalView"
                                    style={
                                        this.props.pwa === "pwastyle"
                                            ? customStylespwa
                                            : customStyles
                                    }
                                >
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
                                            report_type={this.props.indicator.report_type}
                                        />
                                    )}
                                </Modal>
                            </div>
                        </>
                    )}
                />
                <Media
                    query="(max-width: 769px)"
                    render={() => (
                        <>
                            <div className="container bg-white shadow rounded ">
                                <div className="row">
                                    <div className="  col-sm-12 bg-blue  rounded-right">
                                        <div className="d-flex flex-column align-items-center py-4  ">
                                            <button
                                                onClick={() => {
                                                    this.props.CloseModal();
                                                }}
                                                className="btn btn-outline-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1"
                                            >
                                                بازگـشــت
                                            </button>
                                            {/*<img src={GaugeIcon} alt="" width="70" height="75" className="py-1"/>*/}
                                            <h5 className="lalezar text-center py-1 text-white">
                                                {isCollector ? "ورود " : "مشاهده "}
                                                مقادیر شاخص
                                                <span className="lalezar ">
                          {" " +
                              userActions.getIntervalTitle(
                                  indicator.measure_interval,
                                  interval.interval_number
                              )}
                        </span>
                                            </h5>
                                            <h6 className="iran-sans_Bold text-center py-1 text-white">
                                                {this.props.indicator.title}
                                            </h6>
                                            <div className="form-group text-center px-3">
                                                <label className="description border px-4 rounded-pill bg-white ">
                                                    {" "}
                                                    توضیحات{" "}
                                                </label>
                                                <textarea
                                                    value={description}
                                                    name="description"
                                                    onChange={userActions.handleChangeInput.bind(this)}
                                                    style={{ boxShadow: "unset" }}
                                                    className="form-control py-4 px-2 rounded pwa_indicator_textarea"
                                                    rows="6"
                                                    cols="50"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-sm-12 ">
                                        <div
                                            className=" pt-3 "
                                            style={{
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                                width: " 45%",
                                            }}
                                        >
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
                                                    onChange={(v, d) =>
                                                        userActions.handleChangeSelect.call(
                                                            this,
                                                            v,
                                                            d,
                                                            null,
                                                            null,
                                                            this.wardOnChange
                                                        )
                                                    }
                                                    options={wards}
                                                    getOptionLabel={(opt) => opt.name}
                                                    getOptionValue={(opt) => opt._id}
                                                    id="ward"
                                                />
                                            </div>
                                        </div>
                                        {this.props.indicator.has_menu_item &&
                                            this.state.menuItems && (
                                                <div className="container-fluid text-right  rounded  py-2 pb-4  mt-5 ">
                                                    <div className="row d-flex justify-content-center p-3 ">
                                                        {/*<div*/}
                                                        {/*    className="px-5   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5  ">اطلاعات*/}
                                                        {/*    پــایه*/}
                                                        {/*</div>*/}
                                                    </div>
                                                    <div className="row d-flex justify-content-center py-3 px-1">
                                                        {this.state.menuItems.map((m, i) => (
                                                            <div
                                                                className="col-12 my-3 position-relative"
                                                                key={i}
                                                            >
                                                                <label htmlFor=""> {m.item}</label>
                                                                <div className="pt-2 pb-4 ">
                                                                    <InputGenerator
                                                                        readOnly={this.state.readOnly}
                                                                        dispatch={this.props.dispatch}
                                                                        type={m.item_type}
                                                                        globalStorage={this.props.globalStorage}
                                                                        placeholder={
                                                                            m.placeholder || m.place_holder
                                                                        }
                                                                        options={
                                                                            m.options
                                                                                ? userActions.generateSelectLabelValue(
                                                                                    m.options
                                                                                )
                                                                                : []
                                                                        }
                                                                        onChange={(data) => {
                                                                            this.onChangeInfo(m, data);
                                                                        }}
                                                                        value={m.value}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        <div className="monitor col">
                                            {isCollector ? (
                                                indicator.report_type === "پرسشنامه" ||
                                                indicator.report_type === "چک لیست" ? (
                                                    <button
                                                        className={`btn btn-blue d-block mx-auto my-4 rounded-pill px-5 ${
                                                            !ward ? "disabled" : ""
                                                        }`}
                                                        onClick={this.showChecklist}
                                                    >
                                                        <span className="px-1">تکمیل</span>
                                                        <span> {indicator.report_type}</span>
                                                    </button>
                                                ) : (
                                                    <div
                                                        className=" text-center iran-sans_Bold py-3 "
                                                        style={{
                                                            background: "#104c82",
                                                            color: "#ffffff",
                                                            marginLeft: "-15px",
                                                            marginRight: "-15px",
                                                        }}
                                                    >
                                                        لطفا مقادیر را در فـرمول وارد کنید
                                                    </div>
                                                )
                                            ) : (
                                                ""
                                            )}
                                            <div className="calculation d-flex flex-column align-items-center py-3">
                                                <div
                                                    className="row justify-content-end w-100"
                                                    data-tip={formula.numerator_placeholder}
                                                >
                                                    <div className="flex-wrap style_pwa_calculation text-center d-flex justify-content-center col-10">
                                                        {formula.numerator.map((itm, i) => (
                                                            <div className="d-flex ml-2" key={i}>
                                                                <input
                                                                    type="text"
                                                                    placeholder={itm}
                                                                    value={this.state["numerator_" + i]}
                                                                    name={"numerator_" + i}
                                                                    className="border-0  text-center"
                                                                    style={{ width: "100%", fontSize: ".8em" }}
                                                                    readOnly={
                                                                        indicator.report_type === "پرسشنامه" ||
                                                                        indicator.report_type === "چک لیست" ||
                                                                        itm.toString() === "1" ||
                                                                        formula.numerator_indicator_id
                                                                    }
                                                                    onChange={(e) => {
                                                                        userActions.handleChangeInput.call(
                                                                            this,
                                                                            e,
                                                                            "number"
                                                                        );
                                                                    }}
                                                                />
                                                                <span className="iran-sans_Bold text-muted mr-2">
                                  {formula.numerator_operators[i]}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="d-flex justify-content-center col-2">
                                                        <Popover
                                                            isOpen={num_help_popover}
                                                            containerClassName="always-top-of"
                                                            position={["top", "right", "left", "bottom"]} // preferred position
                                                            padding={10}
                                                            onClickOutside={() =>
                                                                this.setState({ num_help_popover: false })
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
                                                                                formula.numerator_help.indexOf("\n") >=
                                                                                0
                                                                                    ? "rounded"
                                                                                    : "rounded-pill"
                                                                            } border-0 `}
                                                                            name="numerator_help"
                                                                            value={formula.numerator_help}
                                                                            rows={
                                                                                formula.numerator_help.split("\n")
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
                                                                        num_help_popover: !num_help_popover,
                                                                    });
                                                                }}
                                                                className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                                style={{ width: 25, height: 25 }}
                                                            >
                                                                <i className="fas fa-question text-white"></i>
                                                            </button>
                                                        </Popover>
                                                    </div>
                                                </div>
                                                <div
                                                    className="d-flex align-items-center justify-content-center w-100 "
                                                    style={{ paddingLeft: "3rem", fontSize: ".8em" }}
                                                >
                                                    <img
                                                        src={division}
                                                        alt="multiple"
                                                        style={{ width: "25px", margin: "1em" }}
                                                    />
                                                </div>
                                                <div
                                                    className="row justify-content-end w-100"
                                                    data-tip={formula.denumerator_placeholder}
                                                >
                                                    <div className="flex-wrap style_pwa_calculation text-center d-flex justify-content-center col-10">
                                                        {formula.denumerator.map((itm, i) => (
                                                            <div className="d-flex  ml-2" key={i}>
                                                                <input
                                                                    type="text"
                                                                    placeholder={itm}
                                                                    value={this.state["denumerator_" + i]}
                                                                    name={"denumerator_" + i}
                                                                    className="border-0  text-center "
                                                                    style={{ width: "100%", fontSize: ".8em" }}
                                                                    onChange={(e) => {
                                                                        userActions.handleChangeInput.call(
                                                                            this,
                                                                            e,
                                                                            "number"
                                                                        );
                                                                    }}
                                                                    readOnly={
                                                                        indicator.report_type === "پرسشنامه" ||
                                                                        indicator.report_type === "چک لیست" ||
                                                                        itm.toString() === "1" ||
                                                                        formula.denumerator_indicator_id
                                                                    }
                                                                />
                                                                <span className="iran-sans_Bold text-muted mr-2">
                                  {formula.denumerator_operators[i]}
                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="d-flex justify-content-center col-2">
                                                        <Popover
                                                            containerClassName="always-top-of"
                                                            isOpen={denum_help_popover}
                                                            position={["bottom", "left", "right", "top"]} // preferred position
                                                            padding={10}
                                                            onClickOutside={() =>
                                                                this.setState({ denum_help_popover: false })
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
                                                                            راهنمای مخرج
                                                                        </p>
                                                                        <textarea
                                                                            className={`form-control ${
                                                                                formula.denumerator_help.indexOf(
                                                                                    "\n"
                                                                                ) >= 0
                                                                                    ? "rounded"
                                                                                    : "rounded-pill"
                                                                            } border-0 `}
                                                                            name="denumerator_help"
                                                                            value={formula.denumerator_help}
                                                                            rows={
                                                                                formula.denumerator_help.split("\n")
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
                                                                        denum_help_popover: !denum_help_popover,
                                                                    });
                                                                }}
                                                                className="btn btn-blue rounded-circle d-flex justify-content-center align-items-center"
                                                                style={{ width: 25, height: 25 }}
                                                            >
                                                                <i className="fas fa-question text-white"></i>
                                                            </button>
                                                        </Popover>
                                                    </div>
                                                </div>
                                                <div
                                                    className="d-flex align-items-center justify-content-center w-100 "
                                                    style={{ paddingLeft: "3rem" }}
                                                >
                                                    <img
                                                        src={multiple}
                                                        alt="multiple"
                                                        style={{ width: "20px", margin: "1em" }}
                                                    />
                                                </div>

                                                <div
                                                    className="d-flex align-items-center justify-content-center w-100 "
                                                    style={{ paddingLeft: "3rem" }}
                                                >
                                                    <input
                                                        type="text"
                                                        className="style_pwa_calculation py-2 px-0 col-12 text-center"
                                                        name="multiplier"
                                                        readOnly={true}
                                                        value={formula.multiplier}
                                                    />
                                                </div>
                                                <div
                                                    className="d-flex align-items-center justify-content-center w-100 "
                                                    style={{ paddingLeft: "3rem" }}
                                                >
                                                    <div className="text-center  px-2">
                                                        <img
                                                            src={equall}
                                                            alt="multiple"
                                                            style={{ width: "20px", margin: "1em" }}
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="d-flex align-items-center justify-content-center w-100 "
                                                    style={{ paddingLeft: "3rem" }}
                                                >
                                                    <input
                                                        type="text"
                                                        className="style_pwa_calculation py-2 px-0 col-12  text-center"
                                                        name="equal"
                                                        readOnly={true}
                                                        value={equal}
                                                    />
                                                </div>

                                                <ReactTooltip type="dark" html={true} />
                                            </div>
                                        </div>
                                        <div className="leg text-center">
                                            <img src={Payeh} alt="monitor_stand" />
                                        </div>
                                        <div className="d-flex w-100 justify-content-center pb-4">
                                            {isCollector && (
                                                <button
                                                    className="btn btn-blue rounded-pill col-md-4 col-sm-6 col-10 mx-4 my-1"
                                                    onClick={this.submitFormula}
                                                >
                                                    ثبت
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Modal
                                    isOpen={this.state.checklist}
                                    onRequestClose={this.closeChecklist}
                                    onAfterOpen={this.afterOpenModal}
                                    shouldCloseOnOverlayClick={false}
                                    portalClassName="full_screen_modal checklistModalView"
                                    style={
                                        this.props.pwa === "pwastyle"
                                            ? customStylespwa
                                            : customStyles
                                    }
                                >
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
                                            report_type={this.props.indicator.report_type}
                                        />
                                    )}
                                </Modal>
                            </div>
                        </>
                    )}
                />
            </>
        );
    }
}

class ChecklistView extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.submit} className="p-4  text-right">
                <div className="container-fluid shadow rounded  py-2 pb-4 bg-white mt-5 ">
                    {this.props.report_type && this.props.checklist_info && (
                        <>
                            <div className="row d-flex justify-content-center titleVlaue p-3 ">
                                <div className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5 ">
                                    {this.props.checklist_info.title}
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center p-3  ">
                                <div className="col-lg-12 col-md-12 text-right ">
                                    <label
                                        htmlFor=""
                                        className="rounded-pill  px-4 py-1 titleInput bg-white"
                                    >
                                        {" "}
                                        توضیحات/هــدف
                                    </label>
                                    <textarea
                                        className="inputCkeckList boxshadow border-0"
                                        cols="30"
                                        rows="10"
                                        readOnly
                                        value={this.props.checklist_info.description}
                                    ></textarea>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <br />
                <br />
                <div className="container-fluid shadow rounded  py-2 pb-4 bg-white ">
                    <div className="row d-flex justify-content-center titleVlaue p-3 ">
                        <div className="col-lg-2 col-md-3   bg-white text-dark rounded-pill boxshadow   text-center py-1  lalezar h5  ">
                            اطلاعات پــایه
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center p-3 ">
                        {this.props.menuItems.map((m, i) => (
                            <div
                                className="col-lg-4  col-md-6 my-3 position-relative"
                                key={i}
                            >
                                <label htmlFor=""> {m.item}</label>
                                <div className="pt-2 pb-4 ">
                                    <InputGenerator
                                        readOnly={this.props.readOnly}
                                        dispatch={this.props.dispatch}
                                        type={m.item_type}
                                        globalStorage={this.props.globalStorage}
                                        placeholder={m.placeholder || m.place_holder}
                                        options={
                                            m.options
                                                ? userActions.generateSelectLabelValue(m.options)
                                                : []
                                        }
                                        onChange={(data) => {
                                            if (this.props.onChangeInfo)
                                                this.props.onChangeInfo(m, data);
                                        }}
                                        value={m.value}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="container-fluid  ">
                        {this.props.questions.map((q, i) => (
                            <div className="row py-5 " key={i}>
                                <p className="w-100 text-center text-justify iran-sans_Bold ">
                                    {q.component !== "default" ? q.component : ""}
                                </p>
                                <div className="w-100 ">
                                    <div
                                        className="question-table text-center "
                                        style={{ overflowX: "auto" }}
                                    >
                                        <div
                                            className="question-title d-flex mx-2 py-2"
                                            style={{ minWidth: "1100px" }}
                                        >
                                            <div className="width-5 text-center  iran-sans_Bold ">
                                                ردیف
                                            </div>
                                            <div className="w-70 text-center iran-sans_Bold">
                                                موارد مورد بررسی (سوالات)
                                            </div>
                                            {q.content[0] &&
                                                q.content[0]["answers"] &&
                                                q.content[0]["answers"].map((a, j) => (
                                                    <>
                                                        <div
                                                            key={j}
                                                            data-tip={a.answer_help}
                                                            data-for={`data-${j}`}
                                                            className="text-center iran-sans_Bold align-self-center rotate-90 py-3"
                                                            style={{
                                                                width:
                                                                    25 / q.content[0]["answers"].length + "%",
                                                                fontSize: "1em",
                                                            }}
                                                        >
                                                            {a.answer}
                                                        </div>
                                                        <ReactTooltip id={`data-${j}`} />
                                                    </>
                                                ))}
                                        </div>
                                        <div
                                            className="contents flex-column d-flex mx-2"
                                            style={{ minWidth: "1100px" }}
                                        >
                                            {/* {q.content.sort((a, b) => { */}
                                            {
                                                // q.content.sort((a, b) => {
                                                //     if (a.question_type && b.question_type) {
                                                //         if (a.question_type < b.question_type) {
                                                //             return 1;
                                                //         }
                                                //         if (a.question_type > b.question_type) {
                                                //             return -1;
                                                //         }
                                                //         return 0;
                                                //     }
                                                //     return 0;
                                                // })
                                                q.content.map((question, h) => (
                                                    <div className="row mx-0   " key={h}>
                                                        <div className="width-5 text-center text-iransans py-1 ">
                                                            <p
                                                                style={{ minHeight: "56px" }}
                                                                className={`${
                                                                    h % 2 && "question-row"
                                                                } shadow-sm mx-1 my-0 py-3 text-center `}
                                                            >
                                                                {h + 1}
                                                            </p>
                                                        </div>
                                                        <div
                                                            className={` text-center text-iransans py-1 ${
                                                                question.question_type == "سوال باز"
                                                                    ? "width-95"
                                                                    : "w-70"
                                                            } `}
                                                        >
                                                            <p
                                                                style={{ minHeight: "56px" }}
                                                                className={`${
                                                                    h % 2 && "question-row "
                                                                } shadow-sm mx-1 my-0 py-2 text-center `}
                                                            >
                                                                {question.question}
                                                            </p>
                                                        </div>
                                                        {question.question_type !== "سوال باز" &&
                                                            question.answers &&
                                                            question.answers.map((a, z) => (
                                                                <label
                                                                    key={z}
                                                                    className={`m-0 d-flex justify-content-center text-center text-iransans  py-1  position-relative  `}
                                                                    style={{
                                                                        width: 25 / question.answers.length + "%",
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="d-none"
                                                                        name={i + "-" + h}
                                                                        value={a.answer}
                                                                        onChange={(e) => {
                                                                            this.props.setAnswer(e, question, z, a);
                                                                        }}
                                                                        disabled={this.props.readOnly}
                                                                    />
                                                                    <i
                                                                        className={`fa-2x fal ${
                                                                            a.answer == question.answer
                                                                                ? "fa-check text-success"
                                                                                : ""
                                                                        } ${
                                                                            h % 2 ? "question-row " : ""
                                                                        } shadow-sm mx-1 my-0 py-3 w-100 text-center `}
                                                                    ></i>
                                                                    <span className="hint">{a.answer}</span>
                                                                </label>
                                                            ))}
                                                        {question.question_type == "سوال باز" && (
                                                            <textarea
                                                                className="border-0 form-control mb-5 mt-2 p-2 shadow-sm w-100"
                                                                name={i + "-" + h}
                                                                value={question.answer}
                                                                onChange={(e) => {
                                                                    this.props.setAnswer(e, question);
                                                                }}
                                                                readOnly={this.props.readOnly}
                                                            ></textarea>
                                                        )}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row justify-content-center pb-4 mt-4">
                        {this.props.submit && (
                            <button
                                type="submit"
                                className="btn btn-blue rounded-pill    mx-4 my-1 col-sm-5"
                            >
                                ثبت
                            </button>
                        )}
                        <button
                            onClick={this.props.closeModal}
                            type="reset"
                            className="btn btn-outline-blue rounded-pill    mx-4 my-1 col-sm-5"
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            </form>
        );
    }
}

class Collector_Monitor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CollectorModal: false,
            MonitorModal: false,
        };
    }

    handleCloseModal = () => {
        this.setState({ CollectorModal: false, MonitorModal: false });
    };
    openCollectorModal = () => {
        this.setState({ CollectorModal: true });
    };
    openMonitorModal = () => {
        this.setState({ MonitorModal: true });
    };
}

class SelectCollector_ extends Collector_Monitor {
    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            keyword: "",
        };
    }

    getCollector = () => {
        if (this.props.indicatorId) {
            this.props
                .dispatch(
                    userActions.API(
                        "get",
                        `/v2/get_indicator_collectors?indicator_id=
            ${this.props.indicatorId}`
                    )
                )
                .then((res) => {
                    const { collectors } = res.data;
                    this.setState({ selectedUsers: collectors });
                });
        }
    };
    addCollectors = (selectedUsers) => {
        this.setState({ selectedUsers });
    };
    save = () => {
        const { selectedUsers } = this.state;
        if (selectedUsers.length) {
            const params = {
                indicator_id: this.props.indicatorId,
                collector: selectedUsers
                    .filter((user) => !user.collector_id)
                    .map((user) => {
                        return { user_id: user.id };
                    }),
            };
            this.props
                .dispatch(
                    userActions.API("post", "/v2/add_indicator_collector", params)
                )
                .then((res) => {
                    userActions.successToast(res.data.message);
                    this.handleCloseModal();
                });
        } else {
            userActions.failure("لطفاً همکاران مورد نظر را انتخاب کنید.");
        }
    };
    deleteIndicatorCollector = (collector, i) => {
        const { selectedUsers } = this.state;
        this.props
            .dispatch(
                userActions.question(
                    "حذف مسئول جمع آوری",
                    "آیا از حذف مسئول جمع آوری مورد نظر مطمئن هستید؟"
                )
            )
            .then((r) => {
                if (r.value) {
                    if (collector.collector_id) {
                        this.props
                            .dispatch(
                                userActions.API(
                                    "delete",
                                    `/v2/delete_indicator_collector?collector_id=${collector.collector_id}`
                                )
                            )
                            .then((res) => {
                                selectedUsers.splice(i, 1);
                                this.setState({ selectedUsers });
                            });
                    } else {
                        selectedUsers.splice(i, 1);
                        this.setState({ selectedUsers });
                    }
                }
            });
    };

    render() {
        const { selectedUsers, keyword } = this.state;
        return (
            <>
                <button
                    className="btn  rounded-circle"
                    onClick={this.openCollectorModal}
                >
                    <img
                        src={CollectorIcon}
                        width={this.props.iconWidth}
                        height={this.props.iconHeight}
                        alt="collector"
                    />
                </button>
                <Modal
                    onAfterOpen={this.getCollector}
                    isOpen={this.state.CollectorModal}
                    onRequestClose={this.handleCloseModal}
                    contentLabel="Collector Modal"
                    portalClassName="full_screen_modal"
                    style={this.props.pwa === "pwastyle" ? customStylespwa : customStyles}
                >
                    <div
                        className=" container w-100 btn-primary iran-sans_Bold text-center p-2  text-white"
                        style={{
                            fontSize: "13px",
                            borderTopLeftRadius: "20px",
                            borderTopRightRadius: "20px",
                        }}
                    >
                        مسئولیـن جمع آوری کننـده شـاخص{" "}
                    </div>
                    <div
                        className="container bg-light  py-4 shadow-sm"
                        style={{
                            borderBottomRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                        }}
                    >
                        <div className="row">
                            <div className="col-lg-10 m-auto">
                                <div
                                    className="form-group mt-3 "
                                    style={{
                                        fontSize: "12px",
                                        border: "1px solid rgb(221, 218, 218)",
                                        borderRadius: "50em",
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="keyword"
                                        value={keyword}
                                        onChange={userActions.handleChangeInput.bind(this)}
                                        className="form-control rounded-pill border-0 py-4 shadow-sm iran-sans_Bold text-center text-dark"
                                        style={{ fontSize: "13px" }}
                                        placeholder="نـام و نـام خانوادگـی، یـا سمت شخص مـورد نظـر را جستجـو کنیـد"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex justify-content-around mt-3 ">
                            {selectedUsers
                                .filter((u) =>
                                    keyword
                                        ? u.firstname.indexOf(keyword) >= 0 ||
                                        u.lastname.indexOf(keyword) >= 0 ||
                                        (u.post && u.post.indexOf(keyword) >= 0)
                                        : true
                                )
                                .map((user, i) => (
                                    <div
                                        className="fadeIn animated d-flex flex-column align-items-center col-lg-3 col-md-6 my-2"
                                        key={i}
                                    >
                                        <button
                                            onClick={() => {
                                                this.deleteIndicatorCollector(user, i);
                                            }}
                                            data-tip="حذف"
                                            className="btn flipper rounded-circle overflow-hidden position-relative p-0"
                                            style={{
                                                minWidth: 75,
                                                maxWidth: 75,
                                                minHeight: 75,
                                                maxHeight: 75,
                                                zIndex: 9,
                                            }}
                                        >
                                            <div
                                                className="flip-box-inner bg-light"
                                                style={{ minHeight: 50 }}
                                            >
                                                <img
                                                    className="front-face bg-light"
                                                    src={userConstants.SERVER_URL_2 + user.avatar.url}
                                                    width="50"
                                                    height="50"
                                                    alt=""
                                                />
                                                <div className="back-face bg-danger text-center  d-flex align-items-center justify-content-center w-100 h-100 text-light">
                                                    <i className="fal fa-trash-alt text-white fa-2x" />
                                                </div>
                                            </div>
                                        </button>
                                        <ReactTooltip type="light" />
                                        <span
                                            style={{ fontSize: "13px", fontFamily: "iransansbold" }}
                                        >
                      {user.firstname + " " + user.lastname}
                    </span>
                                        <span
                                            style={{ fontSize: "11px", fontFamily: "iransansbold" }}
                                        >
                      {" "}
                                            {user.post || ""}
                    </span>
                                    </div>
                                ))}
                        </div>
                        <div className="  justify-content-center mt-3">
                            <div className="d-flex flex-column align-items-center mb-3 ">
                                <UsersSelect
                                    className="btn animated bounceInUp rounded-pill"
                                    selectedUsers={this.state.selectedUsers}
                                    submit={this.addCollectors}
                                >
                                    <img
                                        data-tip="افــزودن مسئـول جمـع آوری"
                                        src={AddIcon}
                                        width="75px"
                                        style={{ height: "auto" }}
                                        height="50px"
                                        alt="افــزودن مسئـول جمـع آوری"
                                    />
                                </UsersSelect>
                                <ReactTooltip type="light" />
                            </div>
                        </div>
                        <div className="w-100 d-flex justify-content-center">
                            <button
                                onClick={this.save}
                                type="button"
                                className="btn btn-blue rounded-pill px-5 mx-2"
                                style={{ minWidth: 200 }}
                            >
                                ثبت
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-blue rounded-pill px-5 mx-2"
                                style={{ minWidth: 200 }}
                                onClick={this.handleCloseModal}
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

class SelectMonitor_ extends Collector_Monitor {
    constructor(props) {
        super(props);
        this.state = {
            users: props.users || [],
            wards: this.props.globalStorage.wards,
            monitors: [],
            headers: [
                {
                    title: "ردیف",
                    getData: (item, index) => {
                        return index + 1;
                    },
                    style: {
                        width: "10%",
                        fontSize: "13px",
                        fontFamily: "iransansBold",
                    },
                },
                {
                    title: "بخش هـا/واحـد ها",
                    className: "px-2",
                    getData: (item, index) => {
                        return (
                            <Select
                                className="text-justify "
                                value={item.wards}
                                name="wards"
                                placeholder="انتخـاب بخش یـا واحـدهـا"
                                onChange={(value, data) => {
                                    userActions.handleChangeSelect.call(
                                        this,
                                        value,
                                        data,
                                        "monitors",
                                        index
                                    );
                                }}
                                options={this.state.wards}
                                getOptionLabel={(opt) => opt.name}
                                getOptionValue={(opt) => opt._id}
                                isMulti
                            />
                        );
                    },
                    style: {
                        width: "30%",
                        fontSize: "13px",
                        fontFamily: "iransansBold",
                        padding: "10px",
                    },
                },
                {
                    title: "مسئولین پایش",
                    className: "px-2",
                    getData: (item, index) => {
                        return item.monitor_id ? (
                            <p className="w-100 text-center m-0">
                                {item.user_id.fn +
                                    " " +
                                    item.user_id.ln +
                                    (item.user_id.post && item.user_id.post !== "-"
                                        ? " (" + item.user_id.post + ")"
                                        : "")}
                            </p>
                        ) : (
                            <Select
                                className="w-100 text-justify "
                                value={item.user_id}
                                name="user_id"
                                placeholder=""
                                onChange={(value, data) => {
                                    userActions.handleChangeSelect.call(
                                        this,
                                        value,
                                        data,
                                        "monitors",
                                        index
                                    );
                                }}
                                options={this.props.globalStorage.users}
                                getOptionLabel={(u) =>
                                    u.fn +
                                    " " +
                                    u.ln +
                                    (u.post && u.post !== "-" ? " (" + u.post + ")" : "")
                                }
                                getOptionValue={(u) => u.id}
                            />
                        );
                    },
                    style: {
                        width: "30%",
                        fontSize: "13px",
                        fontFamily: "iransansBold",
                    },
                },
                {
                    title: "عملیـات",
                    getData: (item, index) => {
                        return (
                            <>
                                <button
                                    className="btn btn-link"
                                    data-tip="حذف"
                                    onClick={() => {
                                        this.deleteIndicatorMonitor(item, index);
                                    }}
                                >
                                    <img
                                        src={deletenew}
                                        className="indicator-excelIcon"
                                        alt=""
                                        style={{ width: "45px", height: "auto" }}
                                    />
                                </button>
                                <ReactTooltip type="light" />
                                {!_.isEqual(item.wards_old, item.wards) && item.monitor_id && (
                                    <>
                                        <button
                                            className="btn btn-link"
                                            disabled={item.updating}
                                            data-tip="به روزرسانی"
                                            onClick={() => {
                                                this.updateIndicatorMonitor(
                                                    item,
                                                    index,
                                                    this.state.monitors
                                                );
                                            }}
                                        >
                                            <i
                                                className={`fal ${
                                                    item.updating
                                                        ? " fa-spinner-third fa-spin text-success"
                                                        : "fa-upload text-warning"
                                                } `}
                                            />
                                        </button>
                                        <ReactTooltip type="light" />
                                    </>
                                )}
                            </>
                        );
                    },
                    style: {
                        width: "30%",
                        fontSize: "13px",
                        fontFamily: "iransansBold",
                    },
                },
            ],
        };
        this.save = this.save.bind(this);
        this.updateIndicatorMonitor = this.updateIndicatorMonitor.bind(this);
    }

    addToTable = () => {
        const { monitors } = this.state;
        monitors.push({
            user_id: "",
            wards: [],
        });
        this.setState({ monitors });
    };
    getMonitors = () => {
        if (this.props.indicatorId) {
            this.props
                .dispatch(
                    userActions.API(
                        "get",
                        `/v2/get_indicator_monitors?indicator_id=${this.props.indicatorId}`
                    )
                )
                .then((res) => {
                    const { monitors } = res.data;
                    monitors.map((monitor) => {
                        monitor.user_id = {
                            fn: monitor.user.firstname,
                            ln: monitor.user.lastname,
                            post: monitor.user.post,
                            id: monitor.user.id,
                        };
                        monitor.wards_old = [...monitor.wards];
                    });
                    this.setState({ monitors });
                });
        }
    };
    deleteIndicatorMonitor = (monitor, i) => {
        const { monitors } = this.state;
        this.props
            .dispatch(
                userActions.question(
                    "حذف مسئول پایش",
                    "آیا از حذف مسئول پایش مورد نظر مطمئن هستید؟"
                )
            )
            .then((r) => {
                if (r.value) {
                    if (monitor.monitor_id) {
                        this.props
                            .dispatch(
                                userActions.API(
                                    "delete",
                                    `/v2/delete_indicator_monitor?monitor_id=${monitor.monitor_id}`
                                )
                            )
                            .then((res) => {
                                monitors.splice(i, 1);
                                this.setState({ monitors });
                            });
                    } else {
                        monitors.splice(i, 1);
                        this.setState({ monitors });
                    }
                }
            });
    };

    async updateIndicatorMonitor(monitor, i, monitors = null) {
        const params = {
            monitor_id: monitor.monitor_id,
            additional_wards: monitor.wards
                .filter((w) => !monitor.wards_old.find((wo) => wo._id === w._id))
                .map((w) => w._id),
            removal_wards: monitor.wards_old
                .filter((wo) => !monitor.wards.find((w) => wo._id === w._id))
                .map((w) => w._id),
        };
        if (monitors) {
            monitors[i]["updating"] = true;
            this.setState({ monitors });
        }
        const res = await this.props.dispatch(
            userActions.API("post", `/v2/update_monitor`, params, false)
        );
        if (monitors) {
            userActions.successToast(res.data.message);
            monitors[i]["wards_old"] = [...monitors[i]["wards"]];
            monitors[i]["updating"] = false;
            this.setState({ monitors });
        }

        return res;
    }

    async addNewMonitors(monitors) {
        const params = {
            indicator_id: this.props.indicatorId,
            monitor: monitors.map((monitor) => {
                return {
                    user_id: monitor.user_id.id,
                    wards: monitor.wards.map((ward) => ward._id),
                };
            }),
        };

        const res = await this.props.dispatch(
            userActions.API("post", "/v2/add_indicator_monitor", params)
        );
        userActions.successToast(res.data.message);
    }

    async save() {
        const { monitors } = this.state;
        const err_user_index = monitors.findIndex((m) => !m.user_id);
        const err_wards_index = monitors.findIndex(
            (m) => !m.wards || !m.wards.length
        );
        if (err_user_index >= 0) {
            userActions.failure(`لطفاً مسئول پایش رکورد
             ${userActions.persianNumber(err_user_index + 1, true)}
             را انتخاب کنید.
             `);
            return false;
        } else if (err_wards_index >= 0) {
            userActions.failure(`لطفاً بخش های رکورد
             ${userActions.persianNumber(err_wards_index, true)}
             را انتخاب کنید.
             `);
            return false;
        }
        const newMonitors = monitors.filter((monitor) => !monitor.monitor_id);
        const oldMonitors = monitors.filter(
            (monitor) =>
                monitor.monitor_id && !_.isEqual(monitor.wards_old, monitor.wards)
        );

        if (newMonitors.length) {
            await this.addNewMonitors.call(this, newMonitors);
        }
        if (oldMonitors.length) {
            await oldMonitors.map(await this.updateIndicatorMonitor);
        }
        //  userActions.failure('لطفاً مسئولین پایش مورد نظر را انتخاب کنید.');
        this.handleCloseModal();
    }

    /*componentDidMount() {
        /!*  if (!this.props.globalStorage.wards.length) {
              this.props.dispatch(userActions.getWards())
          }
          if (!this.props.globalStorage.users.length && this.props.globalStorage.me) {
              this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
          }*!/
      }*/

    render() {
        return (
            <>
                <button className="btn  rounded-circle" onClick={this.openMonitorModal}>
                    <img
                        src={MonitorIcon}
                        width={this.props.iconWidth}
                        height={this.props.iconHeight}
                        alt="monitor"
                    />
                </button>
                <Modal
                    onAfterOpen={this.getMonitors}
                    isOpen={this.state.MonitorModal}
                    onRequestClose={this.handleCloseModal}
                    contentLabel="Monitor Modal"
                    portalClassName="full_screen_modal"
                    style={this.props.pwa === "pwastyle" ? customStylespwa : customStyles}
                >
                    <div className="container-fluid bg-light rounded py-4 shadow-sm">
                        <HospitalTable
                            totalPage={1}
                            active={1}
                            rows={this.state.monitors}
                            headers={this.state.headers}
                            pageOnChange={(page) => {}}
                            addToTable={this.addToTable}
                            minHeight={400}
                        />
                        <div className="w-100 d-flex justify-content-center my-3">
                            <button
                                type="button"
                                className="btn btn-blue rounded-pill px-5 mx-2"
                                style={{ minWidth: 200 }}
                                onClick={this.save}
                            >
                                ثبت
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-blue rounded-pill px-5  mx-2"
                                style={{ minWidth: 200 }}
                                onClick={this.handleCloseModal}
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

class Print extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            MonitorReport: [
                {
                    name: "  ریاست  ",
                    value: "ریاست",
                },
                {
                    name: "  تیم مدیریت اجرایی  ",
                    value: "تیم مدیریت اجرایی",
                },
                {
                    name: "  مدیر پرستاری  ",
                    value: "مدیر پرستاری",
                },
                {
                    name: "  مسئول بهبود کیفیت  ",
                    value: "مسئول بهبود کیفیت",
                },
                {
                    name: "  ایمنی بیمار  ",
                    value: "ایمنی بیمار",
                },
                {
                    name: "  ســایــر  ",
                    value: "ســایــر",
                },
            ],
        };
    }

    render() {
        const { MonitorReport } = this.state;
        const { hospital, indicator } = this.props;
        const table = {
            width: "100%",
            border: "1.5px solid black",
            color: "black",
        };
        const td = {
            border: "1px solid black",
            textAlign: "Center",
            padding: "15px",
        };
        return hospital && indicator ? (
            <>
                {/*<div style={{border:"1.5px solid black", width: "20%"}}>*/}
                {/*        <img src={userConstants.SERVER_URL_2 + hospital.logo.url} width={100} height={95}/>*/}
                {/*</div>*/}
                {/*<div style={{width: "50%", textAlign: "center"}}>*/}
                {/*    <span className="px-1">{indicator.title}</span>*/}
                {/*</div>*/}
                {/*<div style={{width: "20%", textAlign: "center"}}>*/}
                {/*    <span className="px-1">Abolfazl</span>*/}
                {/*</div>*/}

                {/*<table style={{*/}
                {/*    padding:"10px",*/}
                {/*    width: "20%",*/}
                {/*    border: "1.5px solid black",*/}
                {/*    color: "black",*/}
                {/*}}>*/}
                {/*    <tr>*/}
                {/*        <td style={td}>*/}
                {/*            <img src={userConstants.SERVER_URL_2 + hospital.logo.url} width={100} height={95}/>*/}
                {/*        </td>*/}
                {/*    </tr>*/}
                {/*</table>*/}

                {/*<table style={{*/}
                {/*    padding:"10px",*/}
                {/*    width: "50%",*/}
                {/*    border: "1.5px solid black",*/}
                {/*    color: "black",*/}
                {/*}}>*/}
                {/*    <tr>*/}
                {/*        <td style={td}><b>عنوان شاخص</b></td>*/}
                {/*    </tr>*/}
                {/*    <tr>*/}
                {/*            <td style={td}><b>فـــرم شناسنامــه شــــاخص</b></td>*/}
                {/*    </tr>*/}

                {/*</table>*/}

                {/*<table style={{*/}
                {/*    padding:"10px",*/}
                {/*    width: "20%",*/}
                {/*    border: "1.5px solid black",*/}
                {/*    color: "black",*/}
                {/*}}>*/}
                {/*    <tr>*/}
                {/*        <td style={td}>*/}
                {/*            <img src={userConstants.SERVER_URL_2 + hospital.logo.url} width={100} height={95}/>*/}
                {/*        </td>*/}
                {/*    </tr>*/}
                {/*</table>*/}

                <div className="container-fluid row my-3 printIndexForm">
                    <div className="px-5 py-2">
                        <div className="d-flex flex-wrap justify-content-center  text-center">
                            <div className="col-2 border  ">
                                <img
                                    src={userConstants.SERVER_URL_2 + hospital.logo.url}
                                    width={100}
                                    height={95}
                                    className="p-2"
                                />
                            </div>
                            <div
                                className="col-8 border iran-sans_Bold d-flex align-items-center justify-content-center   "
                                style={{ fontSize: "1.7em" }}
                            >
                                فـرم شناسنامه شـاخص
                            </div>
                            <div className="col-2 border iran-sans_Bold d-flex align-items-center  ">
                                {" "}
                                کـد شاخص :<span className="px-1">{indicator.code}</span>
                            </div>
                            <div className="col-6 border text-right  iran-sans_Bold  py-3  ">
                                تاریخ تدوین:
                                <span className="px-1">{indicator.creation_date}</span>
                            </div>
                            <div className="col-6 border text-right  iran-sans_Bold  py-3  ">
                                {" "}
                                تاریخ بازنگری:
                                <span className="px-1">{indicator.edit_date}</span>
                            </div>

                            <div className="col-12 border text-right iran-sans_Bold  py-3  mt-3 ">
                                {" "}
                                عنوان شاخص:
                                <span className="px-1">{indicator.title}</span>
                            </div>
                            <div className="col-12 border text-right iran-sans_Bold  py-3   ">
                                تعریف شاخص و اهمیت موضوع:
                                <span className="px-1">{indicator.definition}</span>
                            </div>
                            <div className="col-12 border text-right iran-sans_Bold  py-3   ">
                                {" "}
                                دلایل منطقی جمع آوری شاخص:
                                <span className="px-1">
                  {indicator.logical_reasons_of_collecting}
                </span>
                            </div>
                            <div className="col-12 border text-right iran-sans_Bold  py-3   ">
                                فرمول شاخص :
                                <div className="d-flex flex-column justify-content-center align-items-center text-center">
                  <span className="p-1">
                    {indicator.formula.numerator_formated}
                  </span>
                                    <div className="d-flex w-100 align-items-center">
                                        {indicator.formula.multiplier && (
                                            <>
                                                <span> {indicator.formula.multiplier}</span>
                                                <i className="fal fa-times float-left" />
                                                <div
                                                    className="mx-4 my-1"
                                                    style={{
                                                        backgroundColor: "#ccc",
                                                        height: 2,
                                                        flex: "1 1 auto",
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <span className="p-1">
                    {indicator.formula.denumerator_formated}
                  </span>
                                </div>
                            </div>
                            {indicator.formula.numerator_help && (
                                <div className="col-12 border text-right iran-sans_Bold  py-3   ">
                                    تعریف صورت :
                                    <span className="px-1">
                    {indicator.formula.numerator_help
                        .split("\n")
                        .map((d, j) => (
                            <p className="text-justify" key={j}>
                                {d}
                            </p>
                        ))}
                  </span>
                                </div>
                            )}
                            {indicator.formula.denumerator_help && (
                                <div className="col-12 border text-right iran-sans_Bold  py-3   ">
                                    {" "}
                                    تعریف مخــرج:
                                    <span className="px-1">
                    {indicator.formula.denumerator_help
                        .split("\n")
                        .map((d, j) => (
                            <p className="text-justify" key={j}>
                                {d}
                            </p>
                        ))}
                  </span>
                                </div>
                            )}

                            <div className="col-2 border text-right iran-sans_Bold py-1   ">
                                {" "}
                                نوع شاخص
                            </div>
                            <div className="col-2 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                بعد کیفیت
                            </div>
                            <div className="col-2 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                مبنای تعیین شاخص
                            </div>
                            <div className="col-3 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                اهمیت شاخص از جنبه
                            </div>
                            <div className="col-3 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                دامنه کاربرد(بخش/واحد)
                            </div>
                            <div
                                className="col-2 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.indicator_type}</span>
                            </div>
                            <div
                                className="col-2 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                <span className="px-1">
                  {indicator.quality_dimension.map((q, j) => (
                      <span key={j}>
                      {" "}
                          {q}{" "}
                          {j + 1 < indicator.quality_dimension.length ? "," : ""}{" "}
                    </span>
                  ))}
                </span>
                            </div>
                            <div
                                className="col-2 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.basis}</span>
                            </div>
                            <div
                                className="col-3 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.aspect}</span>
                            </div>
                            <div
                                className="col-3 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.main_ward_name}</span>
                            </div>
                            <div className="col-2 border text-center iran-sans_Bold py-1   ">
                                واحد اندازه گیری
                            </div>
                            <div className="col-2 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                تناوب جمع آوری
                            </div>
                            <div className="col-2 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                منبع گزارش دهی
                            </div>
                            <div className="col-3 border text-center iran-sans_Bold py-1   ">
                                {" "}
                                میزان هدف
                            </div>
                            <div className="col-3 border text-center iran-sans_Bold py-1   ">
                                حد شاخص
                            </div>
                            <div
                                className="col-2 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.measurement_unit}</span>
                            </div>
                            <div
                                className="col-2 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.measure_interval}</span>
                            </div>
                            <div
                                className="col-2 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.source}</span>
                            </div>
                            <div
                                className="col-3 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                <span className="px-1">{indicator.target}</span>
                            </div>
                            <div
                                className="col-3 border text-center iran-sans_Bold py-1   "
                                style={{ minHeight: 100 }}
                            >
                                {" "}
                                <span className="px-1">
                  <p>
                    حد پایین:
                      {indicator.lower_limit}
                  </p>
                  <p>
                    حد بالا:
                      {indicator.upper_limit}
                  </p>
                </span>
                            </div>

                            <div className="col-6 border text-right iran-sans_Bold py-1 h-100  ">
                                {" "}
                                مسئول جمع آوری داده ها
                            </div>
                            <div className="col-6 border text-right iran-sans_Bold py-1 h-100  ">
                                {" "}
                                مسئول تحلیل داده ها
                            </div>
                            <div className="col-6 border text-right iran-sans_Bold py-1 h-100  ">
                <span className="px-1">
                  {indicator.collectors.map((q, j) => (
                      <span key={j}>
                      {" "}
                          {q.firstname + " " + q.lastname}{" "}
                          {j + 1 < indicator.collectors.length ? "," : ""}{" "}
                    </span>
                  ))}
                </span>
                            </div>
                            <div className="col-6 border text-right iran-sans_Bold py-1 h-100  ">
                <span className="px-1">
                  {" "}
                    <span className="px-1">
                    {indicator.monitors.map((q, j) => (
                        <span key={j}>
                        {" "}
                            {q.user.firstname + " " + q.user.lastname}{" "}
                            {j + 1 < indicator.monitors.length ? "," : ""}{" "}
                      </span>
                    ))}
                  </span>
                </span>
                            </div>

                            <div className="col-12 border text-right iran-sans_Bold  py-3 text-center  ">
                                ارســال گــزارش پایــش به:
                            </div>
                            <div className="col-12 border text-right iran-sans_Bold  py-3 d-flex justify-content-around   ">
                                {MonitorReport.map((monitor, i) => (
                                    <label
                                        key={i}
                                        htmlFor=""
                                        className="d-flex  align-items-center "
                                        style={{ fontSize: ".8em" }}
                                    >
                                        <i className="far fa-square px-3"></i>
                                        {monitor.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            ""
        );
    }
}

const SelectCollector = connect()(SelectCollector_);
const SelectMonitor = connect((state) => ({
    globalStorage: state.globalStorage,
}))(SelectMonitor_);
const IntervalValue = connect((state) => ({
    globalStorage: state.globalStorage,
}))(IntervalValue_);

export { SelectCollector, SelectMonitor, IntervalValue, ChecklistView, Print };
