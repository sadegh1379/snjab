import React, { Component } from "react";
import PropTypes from "prop-types";
import tinycolor from "tinycolor2";
import validator from "validator";
import ReactTooltip from "react-tooltip";
import moment from "jalali-moment";
import { userActions } from "../_actions";
import * as checks from "../check";

const daysStyle = {
  minWidth: 21,
  minHeight: 21,
  maxWidth: 21,
  maxHeight: 21,
  fontSize: "0.1em",
};
export class CollectorCalendarInterval extends Component {
  simulateClick1(_id) {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const auto = params.get("auto");
    if (_id == "1400" && checks.default.hide) {
      setTimeout(() => {
        document.getElementById("yearly").click();
      }, 200);
    }
  }
  btnHandler = (data, interval_number, dayOfYear = null) => {
    if (dayOfYear != null) {
      const year = this.props.year;
      const m = moment(
        `${year}/${interval_number + 1}/${dayOfYear}`,
        "jYYYY/jMM/jDD"
      );

      this.props.btnHandler(data, m.jDayOfYear());
    } else {
      this.props.btnHandler(data, interval_number + 1);
    }
  };
  detailHandler = (interval) => {
    this.props.openDetailRecords(interval);
  };
  render() {
    return (
      <div
        // className="col-lg-3 col-md-6 my-3 iran-sans_Bold"
        className="flex flex-wrap m-2 iran-sans_Bold"
        style={{ width: "75px", height: "75px" }}
        key={this.props.boxIndex}
      >
        <div className={` ${this.props.pwa ? "border_calender_pwa_none" : ""}`}>
          <div
            style={{
              background: this.props.colorTheme,
              borderTopRightRadius: "15px",
              // borderTopLeftRadius: "15px",
              fontFamily: "iransansbold",
            }}
            className={`${
              this.props.pwa ? "border_calender_pwa_header" : ""
            } card-header text-center h-100 text-white`}
          >
            <div className="row" style={{minWidth:'100px',textAlign:'center',marginRight:'-31px'}}>
              {/* {this.props.status !== undefined ? (
                <button className="icon-status btn bg-white  rounded-circle btn-cal bg-white   d-flex justify-content-center">
                  <i className={this.props.status}></i>
                </button>
              ) : (
                <></>
              )} */}
              <span
                className="col iran-sans"
                style={{ fontSize: "9px",  }}
              >
                {" "}
                {this.props.title}
              </span>
            </div>
          </div>
          {this.props.measure_interval === "روزانه" ? (
            <>
              <div
                style={{
                  backgroundColor: tinycolor(this.props.colorTheme)
                    .brighten(65)
                    .toString(),
                    borderBottomLeftRadius: "15px",
                }}
                className="card-body d-flex flex-row justify-content-center flex-wrap text-center w-100 h-100 p-2 "
              >
                {/* {this.props.days.map((day, index) => {
                  return (
                    <>
                      <button
                        data-tip={
                          day.data.average
                            ? userActions.fixed(day.data.average)
                            : day.data.average
                        }
                        onClick={(ev) => {
                          if (!this.props.readOnly)
                            this.btnHandler(
                              day.data,
                              this.props.boxIndex,
                              day.day
                            );
                        }}
                        style={Object.assign(
                          {
                            backgroundColor:
                              day.data.average != undefined
                                ? tinycolor(this.props.colorTheme).toString()
                                : "",
                          },
                          daysStyle
                        )}
                        key={index}
                        className={`text-center rounded-circle btn btn-outline-primary p-0 m-1 ${
                          day.data.average != undefined ? "text-white" : ""
                        }`}
                      >
                        {day.day}
                      </button>
                    </>
                  );
                })} */}
                روزانه
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: tinycolor(this.props.colorTheme)
                    .brighten(65)
                    .toString(),
                  borderBottomLeftRadius: "15px",
                  // borderBottomRightRadius: "15px",
                }}
                className={`card-body ${
                  this.props.pwa ? "border_calender_pwa" : ""
                } text-center w-100 h-100 p-2`}
              >
                {this.props.readOnly ? (
                  <h6
                    className="iran-sans_Bold mt-1 mb-1"
                    style={{
                      color: this.props.colorTheme,
                      // minHeight: "30px",
                      fontFamily: "iransansbold",
                      fontSize: "10px",
                    }}
                  >
                    {this.props.interval.average != null
                      ? userActions.fixed(this.props.interval.average)
                      : "-"}
                  </h6>
                ) : (
                  <h4
                    style={{
                      color: this.props.colorTheme,
                      minHeight: "50px",
                      fontSize: "16px",
                    }}
                    className="iran-sans_Bold mt-3 mb-3"
                  >
                    {this.props.interval.average != null
                      ? userActions.fixed(this.props.interval.average)
                      : "-"}
                  </h4>
                )}
              </div>
            </>
          )}
        </div>
        <ReactTooltip type="light" />
      </div>
    );
  }
}

function checkHexProp(props, propName, componentName) {
  componentName = componentName || "ANONYMOUS";
  if (props[propName]) {
    let value = props[propName];
    if (typeof value === "string") {
      return validator.isHexColor(value)
        ? null
        : new Error(propName + " in " + componentName + " is not a hex Color");
    }
  }
  return null;
}

CollectorCalendarInterval.propTypes = {
  title: PropTypes.string.isRequired,
  colorTheme: checkHexProp,
  btnHandler: PropTypes.func.isRequired,
  day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
};

CollectorCalendarInterval.defaultProps = {
  colorTheme: "#343a40",
};
