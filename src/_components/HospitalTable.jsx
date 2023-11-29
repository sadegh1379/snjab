import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { Pagination } from "./Pagination";
import AddIcon from "../assets/images/add.png";
import renderHTML from "react-render-html";
/**
 * HospitalTable Component
 * @augments {Component<Props, State>}
 */
export class HospitalTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active || 1,
    };
  }
  pageOnChange = (active) => {
    this.setState({ active }, () => {
      this.props.pageOnChange(active);
    });
  };
  render() {
    const { active } = this.state;
    return (
      <div className="custom-table">
        {this.props.showPagination === false && this.props.title === "" ? (
          <></>
        ) : (
          <div className="row d-flex justify-content-between   my-4 px-4  ">
            <div className="col-lg-6 text-right col-sm-8">
              <span className="iran-sans text-right text-sm-center text-md-center">
                {this.props.title}
              </span>
            </div>
            <div className="col-lg-6 text-left d-flex justify-content-end col-sm-8  ">
              <Pagination
                totalPage={this.props.totalPage}
                active={active}
                callBack={this.pageOnChange}
              />
            </div>
          </div>
        )}
        {/*
                    <!--table--> */}
        <div
          className={`${this.props.marginClassName} overflow-auto`}
          style={{ minHeight: this.props.minHeight || "20px" }}
        >
          <div
            className="table-title align-items-center d-flex text-white rounded-pill m-2 "
            style={{ minWidth: this.props.minWidth }}
          >
            {this.props.headers.map((h, i) => (
              <div className=" text-center" style={h.style || {}} key={i}>
                {renderHTML(h.title)}
              </div>
            ))}
          </div>
          <div
            className="contentsTbl flex-column d-flex mx-2"
            style={{ minWidth: this.props.minWidth }}
          >
            {this.props.rows.map((r, i) => (
              <div
                className={`contents-row bg-white d-flex flex-wrap flex-row rounded-pill my-2 py-1 ${
                  i % 2 === 0 ? "" : "odd-contents-row"
                }`}
                key={i}
              >
                {this.props.headers.map((h, j) => (
                  <div
                    className={`align-self-center text-center iran-sans_Bold ${
                      h.className || ""
                    }`}
                    style={h.style}
                    key={j}
                  >
                    {h.getData(r, i)}
                  </div>
                ))}
              </div>
            ))}
            {this.props.rows.length === 0 ? (
              this.props.loader !== undefined ? (
                <p
                  className="contents-row odd-contents-row text-center rounded-pill my-2 py-1"
                  style={{ backgroundColor: "#f1f2f1" }}
                >
                  {this.props.loader}
                </p>
              ) : (
                <p
                  className="contents-row odd-contents-row text-center rounded-pill my-2 py-1"
                  style={{
                    fontSize: "13px",
                    fontFamily: "iransansbold",
                    color: "#646464",
                  }}
                >
                  اطلاعـاتـی جهت نمـایش موجـود نمی باشـد.
                </p>
              )
            ) : (
              ""
            )}

            {this.props.addToTable !== undefined && (
              <div className="  radius-5 my-2 py-1 ">
                <div
                  className={`align-self-start text-center iran-sans_Bold px-5`}
                >
                  <button
                    className="btn btn-link"
                    data-tip="افـزودن سطـر بـه جـدول"
                    onClick={() => {
                      this.props.addToTable();
                    }}
                  >
                    <img src={AddIcon} alt="add ward" width={60} />{" "}
                  </button>
                  <ReactTooltip type="light" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
HospitalTable.propTypes = {
  marginClassName: PropTypes.string,
  showPagination: PropTypes.bool,
  totalPage: PropTypes.number.isRequired,
  pageOnChange: PropTypes.func.isRequired,
  minWidth: PropTypes.string,
  active: PropTypes.number,
  title: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.object),
  addToTable: PropTypes.func,
  loader: PropTypes.any,
  minHeight: PropTypes.any,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      style: PropTypes.object,
      getData: PropTypes.func.isRequired,
      className: PropTypes.string,
    })
  ),
};

HospitalTable.defaultProps = {
  minWidth: "1150px",
  padding:'10px',
  marginClassName: "mx-lg-5",
  showPagination: true,
  rows: [],
};
