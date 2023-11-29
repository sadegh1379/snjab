import React from "react";
import Modal from "react-modal";
import Select from "react-select";
import idCard from "../../../assets/images/id-card.png";
import { ReportCardModal } from "./ReportCardModal";

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
    animationDuration: "0.5s",
    padding: '0',
    // top                   : '50%',
    // left                  : '50%',
    // right                 : 'auto',
    // bottom                : 'auto',
    // marginRight           : '-50%',
    // transform             : 'translate(-50%, -50%)'
  }
};

export class EducationalHistory extends React.Component {
  state = {
    isModalOpen: false
  };

  openModal = () => {
    this.setState({
      isModalOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };
  
  render() {
    return (
      <>
        <div className={"educational-history"}>
          {/*Search*/}
          <div className="container-fluid my-5">
            <div className="search box-shadow radius-10 py-4">
              <form className="px-md-5 px-1">
                <input
                  className="text-center rounded-pill border-0 box-shadow w-100 py-3"
                  type="text"
                  placeholder={
                    "نام و نام خانوادگی کاربر، کد پرسنلی و یا سمت موردنظر خود را وارد کنید"
                  }
                />

                <div className="d-flex flex-column align-items-center my-5">
                  <div className="h-line w-50"></div>
                  <div className="header-logo-bg bg-blue rounded-circle p-2">
                    <i className="fal fa-search text-white fa-2x"></i>
                  </div>
                </div>

                <div className="row justify-content-center">
                  <div className="text-right col-xl-4 col-md-5 mx-md-4 my-2">
                    <label className="color-dark iran-sans_Bold mx-2">
                      نام و نام خانوادگی
                    </label>
                    <Select placeholder={""} />
                  </div>
                  <div className="text-right col-xl-4 col-md-5 mx-md-4 my-2">
                    <label className="color-dark iran-sans_Bold mx-2">
                      بخش یا واحد
                    </label>
                    <Select placeholder={""} />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/*Table*/}
          <div className="container-fluid">
            <div className="card border-0 box-shadow radius-10 pb-4 requstedCourses my-5">
              <div className="row d-flex justify-content-between mt-4 px-4">
                <div className="col-lg-6 text-right col-sm-8">
                  <span className="lalezar text-right color-dark text-sm-center text-md-center">
                    شناسنامـه آموزشی پرسنل بیمارستان
                  </span>
                </div>
                <div className="col-lg-6 text-left d-flex justify-content-end col-sm-8">
                  <ul className="pagination">
                    <li className="page-item">
                      <a
                        className="page-link border-0 text-success bg-transparent "
                        href="#"
                        aria-label="Previous"
                      >
                        <span
                          aria-hidden="true"
                          className="fa fa-chevron-right"
                        ></span>
                        <span className="sr-only">صفحه قبلی</span>
                      </a>
                    </li>
                    <li className="page-item ">
                      <button className="btn  btn-pages rounded-pill active iran-sans_Bold ">
                        1
                      </button>
                    </li>
                    <li className="page-item ">
                      <button className="btn  btn-pages rounded-pill deactive iran-sans_Bold">
                        2
                      </button>
                    </li>
                    <li className="page-item ">
                      <button className="btn btn-pages rounded-pill deactive iran-sans_Bold">
                        3
                      </button>
                    </li>
                    <li className="page-item ">
                      <button className="btn btn-pages rounded-pill deactive iran-sans_Bold">
                        4
                      </button>
                    </li>
                    <li className="page-item ">
                      <button className="btn btn-pages rounded-pill deactive  iran-sans_Bold">
                        5
                      </button>
                    </li>
                    <li className="page-item ">
                      <a
                        href="#"
                        className="page-link border-0 text-success bg-transparent"
                        aria-label="Next"
                      >
                        <span
                          aria-hidden="true"
                          className="fa fa-chevron-left"
                        ></span>
                        <span className="sr-only">صفحه بعدی</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/*table*/}
              <div style={{ overflowX: "auto" }}>
                <div
                  className="table-title d-flex align-items-center text-white radius-5 m-2 py-2"
                  style={{ minWidth: 1240 }}
                >
                  <div className="width-5 text-center">ردیف</div>
                  <div className="width-20 text-center">
                    نام و نام خـانوادگـی
                  </div>
                  <div className="width-15 text-center">پست سازمانی</div>
                  <div className="width-10 text-center">کـد پرسنلی</div>
                  <div className="width-15 text-center">بخش</div>
                  <div className="width-15 text-center">گــروه شغلی</div>
                  <div className="width-20 text-center">شناسنامه آموزشی</div>
                </div>
                <div
                  className="contentsTbl flex-column d-flex mx-2"
                  style={{ minWidth: 1240 }}
                >
                  <div className="contents-row bg-light-gray row radius-5 my-2 py-1">
                    <div className="width-5 align-self-center text-center iran-sans_Bold">
                      1
                    </div>
                    <div className="width-20 align-self-center text-center iran-sans_Bold">
                      مهدی همتی
                    </div>
                    <div className="width-15 align-self-center text-center iran-sans_Bold">
                      کارشناس آموزش
                    </div>
                    <div className="width-10 align-self-center text-center iran-sans_Bold">
                      3150
                    </div>
                    <div className="width-15 align-self-center text-center iran-sans_Bold">
                      دفتر پـرستاری
                    </div>
                    <div className="width-15 align-self-center text-center iran-sans_Bold">
                      بالینی
                    </div>
                    <div className="width-20 align-self-center text-center iran-sans_Bold">
                    <button onClick={this.openModal} className="btn">
                        <img src={idCard} />
                      </button>
                    </div>
                  </div>

                  <div className="contents-row row radius-5 my-2 py-1">
                    <div className="width-5 align-self-center text-center iran-sans_Bold">
                      1
                    </div>
                    <div className="width-20 align-self-center text-center iran-sans_Bold">
                      مهدی همتی
                    </div>
                    <div className="width-15 align-self-center text-center iran-sans_Bold">
                      کارشناس آموزش
                    </div>
                    <div className="width-10 align-self-center text-center iran-sans_Bold">
                      3150
                    </div>
                    <div className="width-15 align-self-center text-center iran-sans_Bold">
                      دفتر پـرستاری
                    </div>
                    <div className="width-15 align-self-center text-center iran-sans_Bold">
                      بالینی
                    </div>
                    <div className="width-20 align-self-center text-center iran-sans_Bold">
                      <button onClick={this.openModal} className="btn">
                        <img src={idCard} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Requested Modal"
          portalclassName="monitorScreenModal border-0"
        >
          <ReportCardModal />
        </Modal>
      </>
    );
  }
}
