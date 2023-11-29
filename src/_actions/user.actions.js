import { userConstants, OPERATOR_REGEX } from "../_constants";
import { generalService } from "../_services";
import localstorageTTL from "localstorage-ttl";
import { alertActions } from "./";
import { history } from "../_helpers";
import Swal from "sweetalert2";
import { store } from "../_helpers";
import moment from "jalali-moment";
import ReactDOM from "react-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) + replacement + this.substr(index + 1, this.length)
  );
};

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 5000,
});
const operator = {
  "+": function (a, b) {
    if (typeof a !== "number") {
      a = a != undefined && !isNaN(a) ? parseFloat(a) : 0;
    }
    if (typeof b !== "number") {
      b = b != undefined && !isNaN(b) ? parseFloat(b) : 0;
    }
    return a + b;
  },
  "-": function (a, b) {
    return a - b;
  },
  "*": function (a, b) {
    return a * b;
  },
  "/": function (a, b) {
    return a / b;
  },
  "^": function (a, b) {
    return b > 1 ? this["*"](a, this["^"](a, b - 1)) : a;
  },
};
export const userActions = {
  resetRemember,
  setRemember,
  fixed,
  toggleState,
  logout,
  start_request,
  finish_request,
  failure,
  successToast,
  question,
  successAlert,
  API,
  Get_all_answerer_info_menu_items,
  handleChangeSelect,
  handleChangeHook,
  handleChangeInput,
  maskInput,
  handleChangeFile,
  login,
  getHospitals,
  getCommittees,
  getMe,
  onlyRTL,
  setToken,
  setStorage,
  getWards,
  setTemp,
  generateSelectLabelValue,
  getUsers,
  persianNumber,
  persianMonth,
  groupBy,
  resolve,
  math_map,
  onlyDigit,
  getIndicator,
  getIntervalTitles,
  getIntervalTitle,
  getAvailableInterval,
  kartabl,
  searchItem,
  recentError,
  getPeriodCount,
  intervalPerfix,
  print,
  exportExcel,
  find_user,
};

/**
 *
 * *
 * @param data=([{name:'sheetName',data:[]}])
 * @param fileName
 */
function exportExcel(data, fileName) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const wb = { Sheets: {}, SheetNames: [] };
  data.map((s) => {
    const ws = XLSX.utils.json_to_sheet(s.data);
    if (wb.SheetNames.indexOf(s.name) === -1) {
      wb.Sheets[s.name] = ws;
      wb.SheetNames.push(s.name);
    }
  });
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataE = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(dataE, fileName + fileExtension);
}

/**
 *
 * @param data=Ref[Object]
 * @returns {Function}
 */
function print(data, name = "") {
  //console.log(data,data.innerHtml.toString())
  return (dispatch) => {
    const html = `<html><head>
<meta http-equiv="content-type" content="text/html; charset=UTF8">
<link rel="stylesheet" href="${
      userConstants.SERVER_URL_2
    }/snjab_style/assets/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link href="${
      userConstants.SERVER_URL_2
    }/snjab_style/assets/css/all.min.css" rel="stylesheet" type="text/css">
<style>
@font-face {
  font-family:'IRANSansWeb';
  src:url('${
    userConstants.SERVER_URL_2
  }/snjab_style/assets/font/IRANSansWeb.woff') format('woff'),
  url('${
    userConstants.SERVER_URL_2
  }/snjab_style/assets/font/IRANSansWeb.ttf') format('ttf') ;
}
@font-face {
  font-family:'iransansBold';
  src:url('${
    userConstants.SERVER_URL_2
  }/snjab_style/assets/font/IRANSansWeb_Bold.woff') format('woff'),
  url('${
    userConstants.SERVER_URL_2
  }/snjab_style/assets/font/IRANSansWeb_Bold.ttf') format('ttf') ;
}

*{

font-family: 'IRANSansWeb';
  direction: rtl;
}
.iran-sans_Bold,.iran_sans_Bold{
  font-family:iransansBold;
}
.printIndexForm {
 font-size: 0.75em;
 width: 1200px;
}
 .printIndexForm .color-exact {
 color-adjust: exact !important;
 -webkit-print-color-adjust: exact !important;
 print-color-adjust: exact !important;
}
</style>
</head>
                    ${ReactDOM.findDOMNode(data).innerHTML}
                    </html>`;
    dispatch(
      userActions.API("post", "/v1/pdf", { data: html, name: name.trim() })
    ).then((res) => {
      window.open(`${userConstants.SERVER_URL}${res.data.url}`, "_blank");
    });
  };
}
function getIndicator(year, withData = false, userId) {
  return (dispatch) => {
    const result = dispatch(
      userActions.API(
        "get",
        `/v2/indicator/compact${withData ? "_with_data" : ""}?year=${year}${userId ? `&user_id=${userId}` : ""}`
      )
    );
    result.then((res) => {
      dispatch(success(res.data));
    });
    return result;
  };
  function success(data) {
    return { type: userConstants.INDICATORS, data };
  }
}
function getPeriodCount(measure_interval, year) {
  year = year || store.getState().globalStorage.year;
  switch (measure_interval) {
    case "روزانه":
      console.log(year);
      return moment(`${year}/01/01`, "jYYYY/jMM/jDD").isLeapYear() ? 366 : 365;

    case "هفتگی":
      return 52;

    case "ماهانه":
      return 12;
    case "دوبار در ماه":
      return 24;

    case "دو ماه یکبار":
      return 6;

    case "سه ماه یکبار":
      return 4;

    case "شش ماه یکبار":
      return 2;

    case "سالانه":
      return 1;
    default:
      return 0;
  }
}
function getAvailableInterval(measure_interval) {
  const timelines = [
    "روزانه",
    "هفتگی",
    "ماهانه",
    "سه ماه یکبار",
    "شش ماه یکبار",
    "سالانه",
  ];
  return generateSelectLabelValue(
    timelines.splice(timelines.indexOf(measure_interval) + 1, 5)
  );
}
function intervalPerfix(measure_interval) {
  switch (measure_interval) {
    case "هفتگی":
      return "هفته ";

    case "ماهانه":
      return "ماه ";
    case "دوبار در ماه":
      return "بار ";

    case "دو ماه یکبار":
      return "دو ماهه ";

    case "سه ماه یکبار":
      return "سه ماهه ";

    case "شش ماه یکبار":
      return "شش ماهه ";

    case "سالانه":
      return "سال ";
    default:
      return "";
  }
}
function getIntervalTitle(
  measure_interval,
  i,
  year = store.getState().globalStorage.year
) {
  return measure_interval === "ماهانه"
    ? persianMonth(i)
    : measure_interval === "سالانه"
    ? year
    : measure_interval === "روزانه"
    ? moment().jDayOfYear(i).format("jMMMM jDD")
    : intervalPerfix(measure_interval) + persianNumber(i, true);
}
function getIntervalTitles(
  measure_interval,
  year = store.getState().globalStorage.year
) {
  const intervals = [];
  for (let i = 1; i <= getPeriodCount(measure_interval, year); i++) {
    intervals.push({
      name: getIntervalTitle(measure_interval, i, year),
    });
  }
  return intervals;
}
function generateSelectLabelValue(arr) {
  return Array.isArray(arr)
    ? arr.map((itm) => ({ label: itm, value: itm }))
    : [];
}
function start_request() {
  return { type: userConstants.LOADING_SHOW };
}
function finish_request() {
  return { type: userConstants.LOADING_HIDE };
}
function question(title, text) {
  return (dispatch) =>
    Swal.fire({
      title,
      text,
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    });
}
function successAlert(title, text) {
  return Swal.fire({
    title,
    text,
    type: "success",
    showCancelButton: false,
    confirmButtonColor: "#00c200",
    confirmButtonText: "تأیید",
  });
}
async function failure(error) {
  try {
    console.error(error);
    if (error) {
      let e = "";
      if (error.data) {
        e = error.data.error || error.data.message || error.data.toString();
      } else {
        e = error;
      }
      if (error.status >= 500) {
        toast({
          type: "error",
          title: "موقتاً سرور با مشکل مواجه است. لطفاً کمی بعد مجدد تلاش کنید.",
        });
      } else if (error.status === 401) {
        toast({
          type: "error",
          title: "لطفاً وارد سامانه شوید.",
        });
      } else if (error.status === 466 || error.status === 462) {
        toast({
          type: "error",
          title: e + "\n" + "در برخی سوالات تکرار وجود دارد",
        });
      } else {
        toast({
          type: "error",
          title: e,
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
}
function successToast(msg) {
  return toast({
    type: "success",
    title: msg,
  });
}
function API(method, url, params, needLoading = true, redirect = true) {
  return (dispatch) => {
    if (needLoading) {
      dispatch(start_request());
    }
    const result = generalService[method](url, params);
    result
      .then((res) => {
        if (needLoading) {
          dispatch(finish_request());
        }
      })
      .catch((err) => {
        if (needLoading) {
          dispatch(finish_request());
        }
        failure(err.response);
        if (redirect && err.response.status === 401) {
          localStorage.removeItem("globalStorage");
          dispatch({ type: userConstants.LOGOUT });
          history.push("/");
        }
      });
    return result;
  };
}
function resolve(path, obj) {
  return path.split(".").reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, obj || this);
}
function handleChangeSelect(value, data, parent, index, callback) {
  if (parent) {
    const arr = this.state[parent];
    if (!Array.isArray(arr)) {
      arr[data.name] = value;
    } else {
      arr[index][data.name] = value;
    }
    this.setState({ parent: arr }, () => {
      if (callback) callback(value);
    });

    return false;
  }
  this.setState({ [data.name]: value }, () => {
    if (callback) callback(value);
  });
}
function toggleState(name, parent, index, callBack) {
  if (parent) {
    const arr = this.state[parent];
    if (!Array.isArray(arr)) {
      arr[name] = !arr[name];
    } else {
      arr[index][name] = !arr[index][name];
    }
    this.setState({ parent: arr }, () => {
      if (callBack) {
        callBack(this.state[parent]);
      }
    });

    return false;
  }
  this.setState({ [name]: !this.state[name] }, () => {
    if (callBack) {
      callBack(this.state[name]);
    }
  });
}
function handleChangeHook(value, name, fn) {
  fn({ [name]: value });
}
function handleChangeInput(e, ...accept) {
  const { name, value } = e.target;
  const callBack = accept.find((a) => typeof a === "function");
  if (accept && accept.length && value !== null && value !== undefined) {
    if (accept.length === 1 && !callBack) {
      if (accept.indexOf("fa") >= 0) {
        if (!onlyRTL(value)) {
          failure("لطفاً کیبورد خود را فارسی کنید.");
          this.setState({ [name]: this.state[name] });
          return false;
        }
      } else if (accept.indexOf("en") >= 0) {
        if (!onlyLTR(value)) {
          failure("لطفاً کیبورد خود را انگلیسی کنید.");
          this.setState({ [name]: this.state[name] });
          return false;
        }
      } else if (accept.indexOf("number") >= 0) {
        if (!onlyDigit(value)) {
          failure("شما تنها مجاز به وارد کردن اعداد می باشید. ");
          this.setState({ [name]: this.state[name] });
          return false;
        }
      } else {
        const reg = new RegExp(accept[0]);
        if (!reg.test(value)) {
          this.setState({ [name]: this.state[name] }, () => {
            if (callBack) {
              callBack(value);
            }
          });
          return false;
        }
      }
    } else {
      if (accept.indexOf("fa") >= 0 && accept.indexOf("number") >= 0) {
        if (!onlyRTL(value) && !onlyDigit(value)) {
          failure("شما تنها مجاز به وارد کردن اعداد و حروف فارسی می باشید. ");
          this.setState({ [name]: this.state[name] });
          return false;
        }
      } else if (accept.indexOf("en") >= 0 && accept.indexOf("number") >= 0) {
        if (!onlyLTR(value) && !onlyDigit(value)) {
          failure("شما تنها مجاز به وارد کردن اعداد و حروف لاتین می باشید. ");
          this.setState({ [name]: this.state[name] });
          return false;
        }
      }
    }
  }
  this.setState({ [name]: value }, () => {
    if (callBack) {
      callBack(value);
    }
  });
}
function maskInput(e, name, props, regex = OPERATOR_REGEX) {
  /*mask input state by <span class="props.classNmae" style="props.style">regex</span>*/

  const { className, style } = props;
  const reg = new RegExp(/(<span\b[^>]*>)|(<\/span>)/g);
  const reg2 = new RegExp(/(<font\b[^>]*>)|(<\/font>)/g);
  let ADD_SPACE_TO_LAST_WORD = false;
  let html = e.target.value;
  // const isHaveSemicolon=html.slice(-2).indexOf(';')===0;/*FireFox box for add &nbsp;*/
  //
  // if(!isHaveSemicolon && html.charAt(html.length-2)===' '){
  //     console.log('replace')
  //     html=html.replaceAt(html.length-2,'&nbsp;')
  // }
  html = html.replace(/<br>/g, "&nbsp;");

  if (
    html.length > 5 &&
    html.lastIndexOf("&nbsp;") === html.length - 6 &&
    html.charAt(html.lastIndexOf("&nbsp;") - 6) != "&" &&
    html.charAt(html.lastIndexOf("&nbsp;") - 7) != "<"
  ) {
    ADD_SPACE_TO_LAST_WORD = true;
  }
  //html= html.replace(/<br>/g,'');

  let lastText = this.state[name] || "";
  lastText = lastText.replace(/<br>/g, "");
  const endAt = lastText.lastIndexOf(">&nbsp;");
  const isSignOnDelete =
    endAt === lastText.length - 7 && lastText.length > html.length;
  if (isSignOnDelete) {
    const startAt = html.lastIndexOf("&nbsp;<");
    html = html.substr(0, startAt);
  }
  html = html.replace(reg, "");
  html = html.replace(reg2, "");
  html = html.replace(/&nbsp;/g, "");
  html = html.replace(/<br>/g, "");
  let html2 = "";
  const splited = html.split(regex);
  const operators = [];
  let html3 = html;
  while (html3.search(regex) >= 0) {
    const i = html3.search(regex);
    let opt = html3.substr(i, 1);
    operators.push(opt);
    html3 = html3.replaceAt(i, "");
  }
  splited.map((str, i) => {
    if (str != "") {
      html2 += str;
      if (operators[i]) {
        html2 += `&nbsp;<span class="${className}" style="${style || ""}">${
          operators[i]
        }</span>&nbsp;`;
      }
    }
  });
  if (ADD_SPACE_TO_LAST_WORD) {
    html2 += "&nbsp;";
  }
  this.setState({ [name]: html2 });

  /*let lastText=this.state[name] || '';
    lastText=lastText.replace(/<br>/g,'')
    const endAt=lastText.lastIndexOf('>&nbsp;');
    if(endAt===lastText.length-7 && lastText.length>html.length){
        const startAt=html.lastIndexOf('&nbsp;<');
        html=html.substr(0,startAt)
    }
    let html2=html;
    let srcSplited=html.split(reg);
    const {className,style}=props;
    srcSplited.map((str,i)=>{
        if(str!=='&nbsp;'){
            let optIndex=str.search(regex);
            if(optIndex>=0){
                const Index=html.indexOf(str);
                html2=html.replaceAt(Index+optIndex,`&nbsp;<span class="${className}" style="${style || ''}">${str.charAt(optIndex)}</span>&nbsp;`)
            }
        }

    })
    this.setState({ [name]:html2 })*/
  /* let srcHtml=html.replace(/(<span\b[^>]*>)[^<>]*(<\/span>)/i,'');
    if(OPERATOR_REGEX.test(srcHtml)){

    }
    console.log(html)
    const endIndex=html.charAt(html.length-1);
    const {className,style}=props;
    if(OPERATOR_REGEX.test(endIndex)){
        console.log(endIndex)
        html=html.replaceAt(html.length-1,`&nbsp;<span class="${className}" style="${style}">${endIndex}</span>&nbsp;`)
        console.log(html)
    }
    this.setState({ [name]:html });*/
  // let srcHtml=html.replace(/(<span\b[^>]*>)[^<>]*(<\/span>)/i,'');
  // console.log(srcHtml)
  /* srcHtml.map(h=>{
       const htmlSplited=h.split('');

       htmlSplited.map((chr,i)=>{

         if(OPERATOR_REGEX.test(chr) ){
           console.log(chr,i)
           html=html.replaceAt(i,`<span style="color:red">${chr}</span>`)

         }
       })
     })*/
}
function handleChangeFile(name, file) {
  this.setState({ [name]: file.base64 });
}
function logout(noRedirect = false) {
  return (dispatch) => {
    dispatch(
      question("خروج از پرتال", "آیا تمایل به خروج از پرتال را دارید؟")
    ).then((result) => {
      if (result.value) {
        localStorage.removeItem("globalStorage");
        dispatch({ type: userConstants.LOGOUT });
        if (!noRedirect) history.push("/");
      }
    });
  };
}
function getMe() {
  return (dispatch) => {
    dispatch(userActions.API("get", "/v1/user/me")).then((res) => {
      const globalStorage = localstorageTTL.get("globalStorage");
      localstorageTTL.set(
        "globalStorage",
        { ...globalStorage, ...res.data },
        24 * 60 * 60 * 1000
      );
      dispatch(success(res.data));
    });
  };
  function success(data) {
    return { type: userConstants.ME, data };
  }
}

function getWards(hospital) {
  return (dispatch) => {
    const res = dispatch(
      userActions.API(
        "get",
        hospital
          ? `/v1/search_ward?hospital_id=${hospital}`
          : "/v1/user/hospital/ward_lists"
      )
    );

    res.then((r) => {
      dispatch({
        type: userConstants.WARDS,
        data: hospital ? r.data.result : r.data,
      });
    });
    return res;
  };
}
function Get_all_answerer_info_menu_items() {
  return (dispatch) => {
    const res = dispatch(
      userActions.API("get", "/v2/get_all_answerer_info_menu_items")
    );
    res.then((r) => {
      dispatch({
        type: userConstants.ALL_ANSWERER_INFO_MENU_ITEMS,
        data: r.data.items,
      });
    });
    return res;
  };
}
function getUsers(hospital_id) {
  return (dispatch) => {
    const res = dispatch(
      userActions.API(
        "get",
        `/v1/search_user?hospital_id=${hospital_id}&query=`,
        null,
        false
      )
    );
    res.then((r) => {
      dispatch({ type: userConstants.USERS, data: r.data.result });
    });
    return res;
  };
}
function getHospitals(needLoading = true) {
  return (dispatch) => {
    dispatch(userActions.API("get", "/v1/hospitals", null, needLoading)).then(
      (res) => {
        dispatch(success(res.data));
      }
    );
  };
  function success(data) {
    return { type: userConstants.HOSPITALS, data };
  }
}
function getCommittees(id, year) {
  return (dispatch) => {
    dispatch(
      userActions.API("get", `/v1/list_of_commitees?id=${id}&year=${year}`)
    ).then((res) => {
      dispatch(success(res.data));
    });
  };
  function success(data) {
    return { type: userConstants.COMMITTEES, data };
  }
}
function setToken(data) {
  return (dispatch) => {
    localstorageTTL.set("globalStorage", data, 24 * 60 * 60 * 1000);
    return new Promise((resolve, reject) => {
      dispatch({ type: userConstants.LOGIN_SUCCESS, data });

      dispatch(getMe());

      resolve(data);
    });
  };
}
function setStorage(data, key) {
  return (dispatch) => {
    const globalStorage = localstorageTTL.get("globalStorage");
    localstorageTTL.set(
      "globalStorage",
      { ...globalStorage, ...data },
      24 * 60 * 60 * 1000
    );
    return new Promise((resolve, reject) => {
      if (key) {
        dispatch({ type: userConstants.ANY, key, data });
      } else {
        Object.keys(data).map((key) => {
          dispatch({ type: userConstants.ANY, key: key, data: data[key] });
        });
      }

      resolve(data);
    });
  };
}
function setTemp(data, key) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      if (key) {
        dispatch({ type: userConstants.TEMP, key, data });
      } else {
        Object.keys(data).map((key) => {
          dispatch({ type: userConstants.TEMP, key: key, data: data[key] });
        });
      }

      resolve(data);
    });
  };
}
function login(params) {
  return (dispatch) => {
    const respons = dispatch(
      API("post", "/v1/user/signin", params, true, false)
    );
    respons
      .then((res) => {
        dispatch(setToken(res.data)).then(() => {
          // dispatch(getMe(res.data.access_token));
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status == "401") {
            userActions.failure("نام کاربری یا کلمه عبور اشتباه است.");
          } else {
            if (err.response.data.message == "username is not found") {
              this.setState({ login: false });
              userActions.failure(
                "شماره وارد شده در سامانه یافت نشد لطفاً ابتدا عضو شوید."
              );
            }
          }
        }
      });
    return respons;
  };
}
function onlyRTL(s) {
  /*  const ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');*/
  const reg = /^([\u0600-\u06FF]+\s?)+$/;
  return s !== undefined && s !== null && s.toString().length
    ? reg.test(s)
    : true;
}
function onlyLTR(s) {
  /*  const ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');*/
  const reg = new RegExp("^([A-Za-z]+s?)+$");
  return s !== undefined && s !== null && s.toString().length
    ? reg.test(s)
    : true;
}
function onlyDigit(s) {
  const reg = new RegExp(/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/);
  return s !== undefined && s !== null && s.toString().length
    ? reg.test(s)
    : true;
}
function persianNumber(str, om) {
  var delimiter,
    digit,
    i,
    iThree,
    numbers,
    part,
    parts,
    result,
    resultThree,
    three;
  if (!isFinite(str)) {
    return "";
  }
  if (typeof str !== "string") {
    str = str.toString();
  }
  parts = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
    "کوادریلیون",
    "کویینتیلیون",
    "سکستیلیون",
  ];
  numbers = {
    0: [
      "",
      "صد",
      "دویست",
      "سیصد",
      "چهارصد",
      "پانصد",
      "ششصد",
      "هفتصد",
      "هشتصد",
      "نهصد",
    ],
    1: ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"],
    2: ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"],
    two: [
      "ده",
      "یازده",
      "دوازده",
      "سیزده",
      "چهارده",
      "پانزده",
      "شانزده",
      "هفده",
      "هجده",
      "نوزده",
    ],
    zero: "صفر",
  };
  delimiter = " و ";
  str = str
    .split("")
    .reverse()
    .join("")
    .replace(/\d{3}(?=\d)/g, "$&,")
    .split("")
    .reverse()
    .join("")
    .split(",")
    .map(function (str) {
      return Array(4 - str.length).join("0") + str;
    });
  result = (function () {
    let results;
    results = [];
    for (iThree in str) {
      three = str[iThree];
      resultThree = (function () {
        let j, len, results1;
        results1 = [];
        for (i = j = 0, len = three.length; j < len; i = ++j) {
          digit = three[i];
          if (i === 1 && digit === "1") {
            results1.push(numbers.two[three[2]]);
          } else if (
            (i !== 2 || three[1] !== "1") &&
            numbers[i][digit] !== ""
          ) {
            results1.push(numbers[i][digit]);
          } else {
            continue;
          }
        }
        return results1;
      })();
      resultThree = resultThree.join(delimiter);
      part = resultThree.length > 0 ? " " + parts[str.length - iThree - 1] : "";
      results.push(resultThree + part);
    }
    return results;
  })();
  result = result.filter(function (x) {
    return x.trim() !== "";
  });
  result = result.join(delimiter).trim();
  if (result !== "") {
    if (om)
      if (result === "یک") {
        result = "اول";
      } else if (result === "سی") {
        result = "سی اُم";
      } else if (result.indexOf("سه") !== -1) {
        result = result.replace("سه", "سوم");
      } else {
        result = result + "م";
      }
    return result;
  } else {
    return numbers.zero;
  }
}
function persianMonth(str) {
  if (!isFinite(str)) {
    return "";
  }
  if (typeof str !== "number") {
    str = parseInt(str);
  }
  var month = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  return month[str - 1];
}
function groupBy(list, props) {
  if (props.indexOf(".") >= 0) {
    const props_splited = props.split(".");
    return list.reduce((a, b) => {
      (a[b[props_splited[0]][props_splited[1]]] =
        a[b[props_splited[0]][props_splited[1]]] || []).push(b);
      return a;
    }, {});
  } else {
    return list.reduce((a, b) => {
      (a[b[props]] = a[b[props]] || []).push(b);
      return a;
    }, {});
  }
}

function math_map(arr) {
  if (arr.length >= 3 && operator[arr[1]] !== undefined) {
    let result = operator[arr[1]](arr[2], arr[0]);
    if (arr.length !== 3) {
      return math_map([result].concat(arr.slice(3, arr.length)));
    } else {
      return result;
    }
  } else {
    return arr[0] ? arr[0] : 0;
  }
}

function kartabl(year, page, per, menu, submenu) {
  return (dispatch) => {
    return dispatch(
      API(
        "get",
        `/v1/user/kartabl?year=${year}&page=${page}&per=${per}&menu=${menu}&submenu=${submenu}`
      )
    );
  };
}

function fixed(num) {
  return !num
    ? num
    : parseFloat(num.toFixed(2))
    ? num.toFixed(2)
    : parseFloat(num.toFixed(4))
    ? num.toFixed(4)
    : num.toFixed(6);
}

function searchItem(query, menu, submenu) {
  return (dispatch) => {
    return dispatch(
      API(
        "get",
        `/v1/user/kartabl/search?query=${query}&menu=${menu}&submenu=${submenu}`
      )
    );
  };
}

function recentError(year) {
  return (dispatch) => {
    return dispatch(
      API("get", `/v1/user/hospital/error_controls/recent?year=${year}`)
    );
  };
}
function setRemember(data) {
  return (dispatch) => {
    let timer = data.time || 15 * 60 * 1000;
    data.time = timer;

    return new Promise((resolve, reject) => {
      dispatch({ type: userConstants.REMEMBER, data });
      localstorageTTL.set("remember", data, data.time);
      const timerSetInterval = setInterval(() => {
        if (data.time <= 0) {
          clearInterval(timerSetInterval);
          dispatch({ type: userConstants.REMOVE_REMEMBER, data });
        } else {
          data.time -= 1000;
          dispatch({ type: userConstants.REMEMBER, data });
          localstorageTTL.set("remember", data, data.time);
        }
      }, 1000);
      resolve(data);
    });
  };
}
function resetRemember() {
  return (dispatch) => {
    const r = store.getState().globalStorage.remember;
    if (r) {
      const timerSetInterval = setInterval(() => {
        if (r.time <= 0) {
          clearInterval(timerSetInterval);
          dispatch({ type: userConstants.REMOVE_REMEMBER, data: r });
        } else {
          r.time -= 1000;
          dispatch({ type: userConstants.REMEMBER, data: r });
          localstorageTTL.set("remember", r, r.time);
        }
      }, 1000);
    }
  };
}

function find_user(users, user_id) {
  return users.find((u) => u.id == user_id);
}
