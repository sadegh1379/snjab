import React, { Component } from "react";
import Logopwa from "../../assets/images/endlogo.png";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import avameltahdidkonande from "../../assets/images/imeni_bimar.png";
import nazarsanji from "../../assets/images/nazarsanji.png";
import khata from "../../assets/images/khata.png";
import Select from "react-select";
import arrowback from "../../assets/images/arrowback.png";
import { connect } from "react-redux";
import { userActions } from "../../_actions";
import { userConstants } from "../../_constants";
import Modal from "react-modal";
import sharepwa from "../../assets/images/sharepwa.png";
import snjabPwaModal from "../../assets/images/snjabPwaModal.png";
import { Link } from "react-router-dom";
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-45%',
    transform             : 'translate(-50%, -50%)',
    boxShadow             :'rgba(0, 0, 0, 0.35) 0px 1px 3px 0px',
    border                :'0px',
    overflow              :"hiiden",
    bsckgroundColor       :"rgba(255, 255, 255,1)",
    width                 :"100%",
    height                :"100%"
  }
};
class Login_ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      hospital: null,
      step: 0,
      cell_phone: "",
      password: "",
      verification: false,
      remember: false,
      wait_verify: 0,
      wait_remember: 0,
      code_1: "",
      code_2: "",
      code_3: "",
      code_4: "",
      dev: false,
      top: false,
      modalIsOpen: true,
      width:window.innerWidth,
      icons: [
        {
          url: khata,
          value: "گـزارش خطا",
          link: "/pwa/errorreport"
        },
        {
          url: nazarsanji,
          value: "نظرسنجـی",
          link: ""
        },

        {
          url: avameltahdidkonande,
          value: "ایمنی بیمار",
          link: "/pwa/fmea"
        }
      ]
    };
  }
 modalBrowser=()=>{
 return(
  <Modal
  isOpen={this.state.modalIsOpen}
  onRequestClose={this.closeModal}
  style={customStyles}
  contentLabel="Example Modal"

  >

  <div className="row text-center modaldetial">
  <div className="col-12 iconmodal"><img src={snjabPwaModal}/></div>
    <div className="col-10 m-auto modalbox">
    <div className="col-12 header"> وب اپلیکیشن<span style={{color:"#1b93df"}}> سنجـاب </span>را به صفحه اصلی موبایل خود اضافه کنید</div>
    <hr/>
    <div className="col-12 steps">
     <p>1-درنوار پایین دکمه <img src={sharepwa} alt="share_pwa"/> <span>”share“</span> را انتخاب کنید.</p>
     <p>2-منوی باز شده را به چپ بکشید وگزینه <span>”add to home screen“</span> را انتخاب کنید.</p>
     <p>3-در مرحله بعد در قسمت بالا روی <span>Add</span> کلیلک کنید.</p>
    </div>
    <button className="closeModal col-11" onClick={this.closeModal}>متوجـه شـدم</button>
    </div>
  </div>
  
  </Modal>
 )
 }
 detectmob=()=> { 
  if(window.matchMedia('(display-mode: standalone)').matches) {
    return   this.setState({ modalIsOpen:false})
  }
  else if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  || navigator.userAgent.match(/Mozilla/i)
  || navigator.userAgent.match(/safari/i)
  ){
    
     return   this.setState({ modalIsOpen:true})
   }
  else {
     return false;
   }
 }
  componentDidMount() {
   this.detectmob()
    
     
    this.props.dispatch(userActions.getHospitals());
    if (this.state.step === 1) {
      this.setState({ open: !this.state.open });
    }

     
  }

   
 
  closeModal=()=> {
    this.setState({modalIsOpen: false});
  }


  // heightPage = () => {
  //  let elem= document.getElementById('root');
  //  elem.animate({scrollTop: 400},300)

    
  // }
  openBottomSheet = open => {

    this.setState({ open });

  };

  toggleBottomSheet = () => {
    this.openBottomSheet(!this.state.open);
  };

  goLogin = e => {
    if (e) {
      e.preventDefault();
    }
    if (this.state.hospital !== null) {
      this.setState({ step: 1 });
      this.setState({ open: false });
    } else {
      userActions.failure("لطفا بیمارستان را انتخاب نمایید");
    }
  };
  loginTOApp = e => {
    if (e) {
      e.preventDefault();
    }

    const { cell_phone, password, hospital } = this.state;

    if (cell_phone.length) {
      if (password.length >= 6) {
        const params = { cell_phone, password, id: hospital.id };
        this.props
          .dispatch(userActions.login(params))
          .then(res => {
            this.afterLogin(res.data.token);
          })
          .catch(err => {
            if (err.response.status == "401")
              userActions.failure("نام کاربری یا کلمه عبور اشتباه است.");
            else if (
              err.response.status == "403" ||
              err.response.status == "402"
            )
              userActions.failure(
                "اطلاعات شما هنوز توسط ادمین سامانه تأیید نشده است."
              );
            else if (
              err.response.status == "404" ||
              err.response.data.message === "user not found"
            )
              userActions.failure("این نام کاربری در سامانه موجود نیست.");
          });
      } else {
        userActions.failure("کیبورد فارسی نباشد، کلمه عبور می بایست حداقل 6 کاراکتر باشد.");
      }
    } else {
      userActions.failure("لطفاً نام کاربری خود را وارد کنید.");
    }
  };
  afterLogin = (token) => {
    this.props.history.push('/pwa');
  }
  verifyUser = () => {
    const { cell_phone, code_1, code_2, code_3, code_4 } = this.state;
    if (cell_phone.length === 11 && cell_phone.startsWith('09')) {
      if (code_4.length && code_3.length && code_2.length && code_1.length) {
        const params = { username: cell_phone, sms_code: code_1 + code_2 + code_3 + code_4 }
        this.props.dispatch(userActions.API('post', '/v1/user/verify', params)).then(res => {
          if (res.data.message == 'no need for activation') {
            this.props.dispatch(userActions.question("اخطار", "این شماره تلفن قبلاً تأیید شده است. اگر شماره وارد شده متعلق به شما است ولی کلمه عبور خود را فراموش کرده اید، آن را بازیابی کنید.")).then(res => {
              if (res.value) {
                this.remember();
              }
            });

          } else {
            this.setState({ verification: false, remember: false, loginView: true });

          }
        }).catch(err => {
          if (err.response.status == 403) {
            userActions.failure('کد وارد شده اشتباه است');
          }
        })
      } else {
        userActions.failure('لطفاً کد تأیید را به طور کامل وارد کنید.')
      }
    } else {
      userActions.failure("لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید.");
    }
  }
  goBack = () => {
    this.setState({ step: this.state.step - 1 });

  };
  handleCloseModal = () => {
    this.setState({ verification: false, remember: false });
  };
  showVerify = () => {
    this.setState({ verification: true, remember: false });
  };
  remember = () => {
    this.setState({ verification: true, remember: true });
  };
  rememberPassword = () => {
    const { cell_phone, wait_remember } = this.state;
    if (wait_remember !== cell_phone) {
      if (cell_phone.length === 11 && cell_phone.startsWith("09")) {
        this.props
          .dispatch(
            userActions.API("post", "/v1/user/resetpassword", { cell_phone })
          )
          .then(res => {
            this.handleCloseModal();
            userActions.successToast("کلمه عبور جدید برای شما ارسال شد.");
            this.setState({ wait_remember: cell_phone });
            setTimeout(() => {
              this.setState({ wait_remember: 0 });
            }, 60 * 3 * 1000);
          })
          .catch(error => {
            if (
              error.response.data.message ==
              "no user exist with this phone number."
            ) {
              userActions.failure(
                "این شماره تلفن همراه در سامانه ثبت نشده است."
              );
            }
          });
      } else {
        userActions.failure(
          "لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید."
        );
      }
    } else {
      userActions.failure(
        "لطفاً تا زمان دریافت پیامک کمی صبر نمایید. " +
        "<br/>" +
        "در صورت عدم دریافت پیامک پس از 3 دقیقه مجدداً تلاش کنید."
      );
    }
  };
  resend = () => {
    const { cell_phone, wait_verify } = this.state;
    if (wait_verify !== cell_phone) {
      if (cell_phone.length === 11 && cell_phone.startsWith("09")) {
        const params = { cell_phone };
        this.props
          .dispatch(userActions.API("post", "/v1/user/resendcode", params))
          .then(res => {
            this.setState({ wait_verify: cell_phone });
            setTimeout(() => {
              this.setState({ wait_verify: 0 });
            }, 1000 * 3 * 60);
            userActions.successToast(
              "کد فعال سازی به شماره تلفن همراه شما مجدداً ارسال شد."
            );
          })
          .catch(err => {
            if (
              err.response.data.message === "no such user." ||
              err.response.data.message ===
              "no user exist with this phone number."
            ) {
              userActions.failure("این شماره تلفن در سامانه ثبت نشده است.");
            } else {
              userActions.failure(
                "در خواست ارسال مجدد پیامک فعال سازی برای شما ثبت شده است. حهت ثبت دوباره درخواست باید 3 دقیقه صبر کنید."
              );
            }
          });
      } else {
        userActions.failure(
          "لطفاً شماره تلفن همراه 11 رقمی خود را به صورت *********09 وارد کنید."
        );
      }
    } else {
      userActions.failure(
        "لطفاً تا زمان دریافت پیامک کمی صبر نمایید. " +
        "<br/>" +
        "در صورت عدم دریافت پیامک پس از 3 دقیقه مجدداً تلاش کنید."
      );
    }
  };

  headerhospital() {
    return (
      <>
        <div className=" col-12 loginpwa pt-5">
          <img className="col-8" src={Logopwa} />
        </div>
        {/* <p className="title mb-0">ســنجاب</p> */}
        {/* <div className="col-9 mx-auto">
          <p className="text p-2">سامانه نوین و جامع اعتباربخشی</p>
          <p className="site_url">www.snjab.ir</p>
        </div> */}
      </>
    );
  }
  headerlogin() {
    return (
      <div className="col-12 mx-auto">
        <div className=" col-12 hospital_logo pt-5">
          <img
    
            src={userConstants.SERVER_URL + this.state.hospital.logo.url}
          />
        </div>

        <div className=" col-12 loginpwa">
          <p className="iran-sans_Bold">{this.state.hospital.name}</p>
        </div>
    
      </div>
    );
  }

  hospital() {
    
    return (
      <form onSubmit={this.goLogin}>
        <div className="hospital">
          {/* <label className="w-100 py-2 iran-sans_Bold align-content-center title">
            {" "}
            لطفا بیمارستان خود را انتخاب کنید
        </label> */}
          <div className="col-12 mx-auto mt-2 mb-5" >
            <Select
              className="w-100 text-justify custom-select-2"
              value={this.state.hospital}
              onChange={userActions.handleChangeSelect.bind(this)}
              name="hospital"
              placeholder="بیمارستان را انتخاب کنید..."
              options={this.props.globalStorage.hospitals}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.id}
            />
          </div>

          <div className="col-12 mx-auto mb-4 text-center" style={{marginTop:"6em"}}>
            <button className="w-100 choseitem mx-auto " type="submit"> انتخاب بیمارستان و گام بعد</button>
          </div>
        </div>
      </form>
    );
  }

  login = () => {
    return (
      
      <form className="login" dir="rtl" onSubmit={this.loginTOApp}>
        <div className="user-input-wrp mt-4 mb-4">
          <div className="inputlogin">
            <input
              autoComplete="new-password"
              type="tel"
              className="form-control border-0 rounded-pill"
              onChange={e =>
                userActions.handleChangeInput.call(this, e, "number")
              }
              value={this.state.cell_phone}
              name="cell_phone"
              maxLength={11}
              placeholder="نام کاربـری"
              required
            />
        
          </div>
          <div className="inputlogin">
            <input
              autoComplete="new-password"
              type="password"
              className="form-control border-0 rounded-pill"
              name="password"
              value={this.state.password}
              onChange={userActions.handleChangeInput.bind(this)}
              placeholder="کلمه عبـور"
              required
            />
        
          </div>
        </div>
        <div className="col-12 mx-auto mt-4 mb-4 text-center">
        <p className="forgetpass" onClick={this.remember}>
            کلمه عبور را فراموش کرده ام
          </p>
          <button className="choseitem mx-auto w-100" type="submit">
            ورود
          </button>
       
        </div>
        <div className="row">
        <div className="col-12  d-flex justify-content-center w-100" >
          {this.state.icons.map((image, index) => {
            return (
              <div className="col-4" key={index}>
               <Link to={image.link}>
                <div className="icons-loginpage justify-content-center d-flex">
                  <img src={image.url} alert="icons-loginpage" />
                </div>
                <div className="text-loginpage">{image.value}</div>
                </Link>
              </div>
            );
          })}
        </div>
        </div>
        <Modal
          isOpen={this.state.verification}
          onRequestClose={this.handleCloseModal}
          contentLabel="Example Modal"
          portalClassName="full_screen_modal"
          className="withmodal"
        >
          <div className="modal-content pwa-style container px-4 border-0">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (this.state.remember) this.rememberPassword();
                else this.verifyUser();
              }}
              className="animated fadeIn row my-4 d-flex justify-content-center step2"
            >
              <div className="w-100  " style={{ maxWidth: 615 }}>
                <div className="form-group text-right ">
                  <label className="iran-sans_Bold text-primary my-3">
                    {" "}
                    تلفن همــــراه
                  </label>
                  <div className="d-flex justify-content-around">
                    <input
                      className="form-control input-underline iran-sans_Bold text-center"
                      type="text"
                      placeholder=""
                      maxLength={11}
                      autoComplete="new-password"
                      name="cell_phone"
                      value={this.state.cell_phone}
                      onChange={userActions.handleChangeInput.bind(this)}
                    />
                  </div>
                </div>
              </div>
              {this.state.remember ? (
                ""
              ) : (
                  <div
                    className="d-flex justify-content-center w-100 my-4"
                    style={{ maxWidth: 615 }}
                  >
                    <div className="col-sm-1 animated rubberBand">
                      <input
                        className="form-control input-underline iran-sans_Bold text-center "
                        type="text"
                        name="code_4"
                        value={this.state.code_4}
                        maxLength={1}
                        tabIndex={5}
                        onChange={userActions.handleChangeInput.bind(this)}
                        onKeyUp={e => {
                          this.goNextFild(e, this.null);
                        }}
                        ref={this.code_4}
                      />
                    </div>
                    <div className="col-sm-1 animated rubberBand">
                      <input
                        className="form-control input-underline iran-sans_Bold text-center"
                        type="text"
                        name="code_3"
                        value={this.state.code_3}
                        maxLength={1}
                        tabIndex={4}
                        onChange={userActions.handleChangeInput.bind(this)}
                        onKeyUp={e => {
                          this.goNextFild(e, this.code_4);
                        }}
                        ref={this.code_3}
                      />
                    </div>
                    <div className="col-sm-1 animated rubberBand">
                      <input
                        className="form-control input-underline iran-sans_Bold text-center"
                        type="text"
                        name="code_2"
                        value={this.state.code_2}
                        maxLength={1}
                        tabIndex={3}
                        onChange={userActions.handleChangeInput.bind(this)}
                        onKeyUp={e => {
                          this.goNextFild(e, this.code_3);
                        }}
                        ref={this.code_2}
                      />
                    </div>
                    <div className="col-sm-1 animated rubberBand">
                      <input
                        className="form-control input-underline iran-sans_Bold text-center"
                        type="text"
                        name="code_1"
                        value={this.state.code_1}
                        maxLength={1}
                        tabIndex={2}
                        onChange={userActions.handleChangeInput.bind(this)}
                        onKeyUp={e => {
                          this.goNextFild(e, this.code_2);
                        }}
                        ref={this.code_1}
                      />
                    </div>
                  </div>
                )}
              <div className="d-flex w-100 justify-content-center">
                <button
                  className="rounded-pill btn btn-primary w-100 my-1  mx-1 iran-sans_Bold"
                  style={{ maxWidth: 150, minWidth: 100, fontSize: ".8em" }}
                  type="button"
                  onClick={this.handleCloseModal}
                >
                  بازگشت
                </button>
                {!this.state.remember && (
                  <button
                    className="rounded-pill btn btn-primary w-100 my-1  mx-1 iran-sans_Bold"
                    style={{ maxWidth: 150, minWidth: 100, fontSize: ".8em" }}
                    type="button"
                    onClick={this.resend}
                  >
                    ارسال مجدد کد
                  </button>
                )}
                <button
                  className="rounded-pill btn btn-primary custom-btn w-100 my-1  mx-1 iran-sans_Bold"
                  style={{ maxWidth: 150, minWidth: 100, fontSize: ".8em" }}
                  type="submit"
                >
                  {this.state.remember ? "بازیابی کلمه عبور" : "تأیید"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </form>
    );
  };

  render() {

    return (
      <div className="backgroundappp container-fluid">
      {this.state.modalIsOpen &&
          <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
      
          >
       
          <div className="row text-center modaldetial">
          <div className="col-12 iconmodal"><img src={snjabPwaModal}/></div>
            <div className="col-10 m-auto modalbox">
            <div className="col-12 header"> وب اپلیکیشن<span style={{color:"#104c82"}}> سنجـاب </span>را به صفحه اصلی موبایل خود اضافه کنید</div>
            <hr/>
            <div className="col-12 steps">
             <p>1-درنوار پایین دکمه <img src={sharepwa} alt="share_pwa"/> <span>”share“</span> را انتخاب کنید.</p>
             <p>2-منوی باز شده را به چپ بکشید وگزینه <span>”add to home screen“</span> را انتخاب کنید.</p>
             <p>3-در مرحله بعد در قسمت بالا روی <span>Add</span> کیلیک کنید.</p>
            </div>
            <button className="closeModal col-11" onClick={this.closeModal}>متوجـه شـدم</button>
            </div>
          </div>
          
          </Modal>
      }
        {this.state.step > 0 ? (
          <div className="goback" onClick={this.goBack}>
            <span className="arrowback">
              <img src={arrowback} />
            </span>
          </div>
        ) : (
            ""
          )}
        <div className="col-12 text-center headerpwa">
          {this.state.step === 0 && this.headerhospital()}
          {this.state.step === 1 && this.headerlogin()}
        </div>
        <div className="swipe-pwa row">
      
              <div className="col-12 content">
                {this.state.step === 0 && this.hospital()}
                {this.state.step === 1 && this.login()}

                {/* <div className="title alarm mt-4 iran-sans_Bold">
                  توجه:در صورتی که عضو نیستید از سامانه اصلی عضو شوید
                </div> */}
              </div>
 
        </div>
      </div>
    );
  }
}

export const Login = connect(state => ({
  globalStorage: state.globalStorage
}))(Login_);
