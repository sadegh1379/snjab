import React, { Component } from "react";
import { userActions } from "../../../_actions";
import { connect } from "react-redux";
import { Navbar } from "../Navbar";
import {
  DatePicker,
  DateTimePicker,
  DateRangePicker,
  DateTimeRangePicker
} from "react-advance-jalaali-datepicker";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import { UsersSelectResponsive } from "../../../_components";
import masolanjam from "../../../assets/images/masoleanjam.png";
import manabe from "../../../assets/images/manabe.png";
import { Programs } from "../../../_components";
import Modal from "react-modal";
import moment from "jalali-moment";
import editicon from '../../../assets/images/edit-flat.png';
import { isThrowStatement } from "typescript";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class DefinationSteps_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_time: "",
      end_time: "",
      user_list: [],
      description: "",
      responsible_person: "",
      selectedUsers:[],
      modalIsOpenResourceDetail: false,
      modalIsOpenResource: false,
      program_step: [],
      resource_data: [],
      edit_gam:false,
      indexOfSelectedStep:-1
     
    };
  }
  componentDidMount() {
    this.getData();
    this.getUser();
  }
  handleSendData = () => {
    const year = this.props.globalStorage.year;
    let data = this.props.location.state;
    let items = {
      title: data.suggested_program_title,
      need_money: true,
      relate_patient_safty: data.relate_patient_safty,
      description: data.description,
      steps:this.state.program_step,
      special_goal: data.special_goals,
      strategy: data.strategy_defines_value.description,
      strategic_goal: data.strategy_goals_value.description,
      ward: data.ward_list_value.name,
      year: year
    };
 
   
    this.props
      .dispatch(userActions.API("post", "/v1/user/hospital/program", items))

      .then(res2 => {
    
        this.setState({ answer: res2.data });
      });
  };
  addSteps = () => {
    if(this.state.description==='')
    {
      userActions.failure("لطفا شرح گام را وارد نمایید");
    }
    else if(this.state.start_time==="")
    {
     userActions.failure("لطفا زمان شروع را وارد نمایید");
    }
    else if(this.state.end_time==="")
    {
     userActions.failure("لطفا زمان پایان را وارد نمایید");
    }
    else if(this.state.responsible_person==="")
    {
     userActions.failure("لطفا مسئول انجام را وارد نمایید");
    }
    else{
      const step={
          
        description: this.state.description,
        start_time: this.state.start_time,
        end_time: this.state.end_time,
        responsible_person: this.state.responsible_person.id,
        responsible_personname: this.state.responsible_person,
        partners: this.state.selectedUsers.map(item=>item.id),
        partnersmap:this.state.selectedUsers,
        source_type: this.state.resource_data.resource,
        cost_description:this.state.resource_data.descripition_resource,
        cost:this.state.resource_data.value_resource,
        unit_count:this.state.resource_data.unit_cost,
        unit_cost: this.state.resource_data.total_cost,
     
      };
      const {program_step,indexOfSelectedStep}=this.state;

      if(indexOfSelectedStep>=0){
        program_step[indexOfSelectedStep]=step;
      }else{
      program_step.push(step);
      }

    this.setState({ description: '', start_time: '', end_time: '' ,responsible_person:'',indexOfSelectedStep:-1,program_step});
  }

  }

  getUser = () => {
    this.props
      .dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id))
      .then(res => {
        this.setState({ user_list: res.data.result });
      });
  };
  getData = (page = 1) => {
    const { year } = this.props.globalStorage;

    this.props
      .dispatch(userActions.kartabl(year, page, 10, "program", "suggestion"))
      .then(res => {
        this.setState({ step: res.data });
      });
  };
  focousOut=()=>{
     this.setState({start_time: ''}); 
  }

  openModalResource = () => {
    this.setState({ modalIsOpenResource: true });
  };

  afterOpenModalResource = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  };

  closeModalResource= () => {
    this.setState({ modalIsOpenResource: false });
  };
  openModalResourceDetail = () => {
    this.setState({ modalIsOpenResourceDetail: true });
  };

  afterOpenModalResourceDetail = () => {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = "#f00";
  };

  closeModalResourceDetail  = () => {
    this.setState({ modalIsOpenResourceDetail: false });
  };
  
  addCollectors = (val) => {

    this.setState({ selectedUsers:val })
  }
  getDataResource = (val) => {

    this.setState({ resource_data: val })
  }
  EditItem=(step,index)=>{
    this.setState({description:step.description,
      start_time:step.start_time,
      end_time:step.end_time,
      responsible_person:step.responsible_person,
      responsible_personname: step.responsible_personname,
      partners:step.partners,
      partnersmap:step.partnersmap,
      source_type:step.source_type,
      cost_description:step.cost_description,
      cost:step.cost,
      unit_count:step.unit_count,
      unit_cost:step.unit_cost,
      resource_data:[],
      indexOfSelectedStep:index

})

  }
  diffmoment = (d1, d2, from_now, diff, result_type) => {
    if (d1 && d2) {
      var min_date;
      var max_date;
      let rsult_type = "%";
      if (moment(d1).isBefore(d2)) {
        min_date = moment(d1);
        max_date = moment(d2);
      } else {
        min_date = moment(d2);
        max_date = moment(d1);
      }

      if (from_now) {
        if (rsult_type) {
          if (rsult_type === "%") {
            return moment().isBefore(min_date)
              ? 0
              : max_date.diff(moment(), diff) > 0
                ? ((max_date.diff(min_date, diff) -
                  max_date.diff(moment(), diff)) *
                  100) /
                max_date.diff(min_date, diff)
                : 100;
          } else {
            return max_date.diff(moment(), diff) > 0
              ? max_date.diff(moment, diff)
              : 0;
          }
        } else {
          return max_date.diff(moment(), diff) > 0
            ? max_date.diff(moment(), diff)
            : 0;
        }
      } else {
        return max_date.diff(min_date, diff);
      }
    }
    if (d1 && from_now) {
      return moment(d1).diff(moment(), diff);
    } else {
      return "";
    }
  };

  render() {

    const {
      end_time,
      start_time,
      user_list,
      step,
      description,
      responsible_person,

    } = this.state;

    const sugestionProgram = this.state.program_step.map((item, index) => {
      const diff = Math.floor(
      
        this.diffmoment(
          moment(item.start_time).format("YYYY/MM/DD"),
          moment(item.end_time).format("YYYY/MM/DD"),
          moment(),
          "%"
        )
      );
      return (
        <>
        <div className="card my-2 gams_style" key={index}>
          <div className="col-12 p-2 card-head ">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-2" key={index}>
                    <div
                      className="circle overflow_image"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <img
                        src="/static/media/web-design.5fb70898.svg"
                        style={{ top: "-100%", bottom: "-96%" }}
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <div className="col-6 px-1 d-flex pl-0 align-items-center card-name">
                  
                       {item.responsible_personname.fn} {item.responsible_personname.ln}
                 
                  
                  </div>
                  <div className="row col-4 pl-0">
                  <div className="icon-enable m-auto">
                      <img
                        src={masolanjam}
                        alt="collegue"
                        data-toggle="tooltip"
                        place="top"
                        data-tip={item.partnersmap.map(coworker=>{
            
                        
                          return     coworker.lastname
                          
                          }).join(',')}
                      />
                       <ReactTooltip type="dark" />
                    </div>
                    <div className="icon-enable m-auto" onClick={this.openModalResourceDetail}>
                      <img
                        src={manabe}
                        alt="manabe"
                      />
                    </div>
                    <div className="icon-enable m-auto" onClick={()=>{this.EditItem(item,index)}}>
                      <img
                        src={editicon}
                        alt="editicon"
                      />
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <div className="card-body ">{item.description}</div>
          <div className="col-12 px-0 py-1 card-footer">
            <div className="row mb-3 m-auto  box_progress px-1">
              <div className="col-2 px-0 text-center">
              <sub className="mb-1  sub_style" >
                تاریخ شـروع
              <span style={{ display: "block", lineHeight: "3em",color:"#353535"}}>{item.start_time}</span>
              </sub>
              </div>
              <div
                className="progress col-7"
                style={{margin: "1em" ,padding:"0px",width:"100%"}}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={Number(diff.toString().split("%"))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{
                    width: `${Number(diff.toString().split("%"))}%`
                  }}
                  
                ></div>
              </div>
              <div className="col-2 px-0 text-center">
              <sub className="mb-1 w-10 sub_style ">
                تاریخ پایان<span style={{ display: "block", lineHeight: "3em",color:"#353535"}}>{item.end_time}</span>
              </sub>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpenResourceDetail}
          onRequestClose={this.closeModalResourceDetail}
          style={customStyles}
          contentLabel="User Modal"
          portalClassName="full_screen_modal selelctUsers"
        >
          <Programs  sendData={item}  isClose={this.closeModalResourceDetail} />
        </Modal>
        </>
      );
    });

    return (
      <div className="container-fluid">
        <Navbar name="تعریف گام های برنامه" url="/pwa/detail_sugestion" />
        <div className="container defination_steps">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <label className="text-right w-100 py-1 iran-sans_Bold label">
                  {" "}
                  شـرح گـام
                </label>
                <textarea
                  onChange={userActions.handleChangeInput.bind(this)}
                  name="description"
                  value={description}
                  type="input"
                  rows="5"
                  className="w-100 textarea_style"
                ></textarea>
              </div>
              <div className="row mt-2">
                <div className="col-5 m-auto px-0">
                  <label className="text-right w-100 py-1 iran-sans_Bold label">
                    {" "}
                    تاریخ شـروع
                  </label>
                  <div className="data_picker_right">
                    <DatePicker
                      inputComponent={this.DatePickerInput}
                      value={start_time}
                      name="start_time"
                      placeholder="انتخـاب تاریخ"
                      format="jYYYY/jMM/jDD"
                      onChange={(unix, formatted) => {
                        this.setState({ start_time: formatted });
                      }}
                      onChangeRaw={(event) =>
                        this.handleChangeRaw(event.target.value)}
                      onBlur={this.focousOut}
                      id="start_time"
                      style={{ width: "100%" }}
                      controllValue={true}
                      preSelected={null}
                
                    />
                  </div>
                </div>
                <div className="col-5 m-auto px-0">
                  <label className="text-right w-100 py-1 iran-sans_Bold label">
                    {" "}
                    تاریخ پایـان
                  </label>
                  <div className="data_picker_left">
                    <DatePicker
                      value={end_time}
                      name="end_time"
                      placeholder="انتخـاب تاریخ"
                      format="jYYYY/jMM/jDD"
                      onChange={(unix, formatted) => {
                        this.setState({ end_time: formatted });
                      }}
            
                      id="end_time"
                      controllValue={true}
                      preSelected={null}
                    />
                  </div>
                </div>
              </div>
              <div className="row response_user">
                <label className="text-right w-100 py-1 iran-sans_Bold px-3 label">
                  مسئول انجـام
                </label>
                <Select
                  className="w-100 text-justify custom-select-2 placeholder_font mx-2"
                  value={responsible_person}
                  name="responsible_person"
                  placeholder="مسئول انجـام"
                  onChange={userActions.handleChangeSelect.bind(this)}
                  options={user_list}
                  getOptionLabel={opt => opt.fn + " " + opt.ln}
                  getOptionValue={opt => opt.id}
                  id="user_list"
                />
              </div>
              <div className="col-12 my-2">
                <div className="row">
                  <div className="col-5 m-auto text-center">
                    <UsersSelectResponsive
                      className="btn animated bounceInUp rounded-pill"
                      selectedUsers={this.state.selectedUsers}
                      submit={this.addCollectors}
                    >
                      <img
                       
                        src={masolanjam}
                        height="50px"
                        alt="افــزودن مسئول جمع آوری"
                      />
                    </UsersSelectResponsive>
                    <ReactTooltip type="light" />
                  </div>
                  <div
                    className="col-5 m-auto text-center"
                    onClick={this.openModalResource}
                  >
                    <img
                      data-tip="منابع"
                      className="animated bounceInUp rounded-pill"
                      src={manabe}
                      height="50px"
                      alt="منابع"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 ticket_button m-auto">
                <div className="row">

                 
                  <button
                    className="col-5 btn round-pill answer_ticket"
                    onClick={this.addSteps}
                  >
                    تاییـد و ثبت گـام
                  </button>
                  <button className="col-5  btn round-pill close_ticket ">
                    انصـراف
                  </button>
                
                   
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 px-0">{sugestionProgram}</div>
     
               <div className="set_steps" onClick={this.handleSendData}>
               ثبت و ارسـال
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpenResource}
          onRequestClose={this.closeModalResource}
          style={customStyles}
          contentLabel="User Modal"
          portalClassName="full_screen_modal selelctUsers"
        >
          <Programs isClose={this.closeModalResource} data={this.getDataResource}  />
        </Modal>
        </div>
    );
  }
}

export const DefinationSteps = connect(state => ({
  globalStorage: state.globalStorage
}))(DefinationSteps_);
