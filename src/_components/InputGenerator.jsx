import React,{ Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import TimePicker from 'react-times';
import {DatePicker} from "react-advance-jalaali-datepicker";
import {ToggleBotton} from "./index";
import {Questions} from "./Questions";
import {userActions} from "../_actions";
import loading from '../assets/images/loading2.gif';

const INPUT_TYPES={
    ToggleButton:'ToggleButton',
    Select:'Select',
    MultiSelect:'MultiSelect',
    InputFa:'Input-fa',
    InputEn:'Input-en',
    InputNumber:'Input-number',
    DatePicker:'DatePicker',
    TimePicker:'TimePicker',
    ColorPicker:'ColorPicker',
    SelectUser:'SelectUser',
}
export class InputGenerator extends Component{
  constructor(props){
      super(props);
      this.state={
          valueOfComponent:props.value,
          users:[]
      }
  }
  componentDidUpdate(props,state){

      if(this.state.valueOfComponent!=state.valueOfComponent){
          this.props.onChange(this.state.valueOfComponent)
      }
  }
    searchFn=(value,type)=>{
        const {me}=this.props.globalStorage;
        if(me){
            this.props.dispatch(userActions.API('get',`/v1/search_${type}?hospital_id=${me.hospital_id}&query=${value}`,null,false)).then(res=>{
                if(type==='user'){
                    res.data.result.push({fn:'سایر',ln:'اعضا'})
                }
                this.setState({[type+'s']:res.data.result},()=>{
                    this.props.dispatch(userActions.setTemp(this.state.users,'UsersList'))
                });

            });

        }
    }
    search=(e,type)=>{
        const {value,name}=e.target;

        this.setState({[name]:value},()=>{
            if(value.length>=2){
                this.searchFn(value,type);
            }else{
                this.setState({[type+'s']:[]});
            }

        })
    }
    componentDidMount(){
      if(this.props.type===INPUT_TYPES.SelectUser){
          if(this.props.globalStorage.UsersList){
              this.setState({users:this.props.globalStorage.UsersList});
          }else{
              this.searchFn('','user');
          }
      }
        console.log(this.props)
    }
    getUser=(user_id)=>{

      if(user_id){
          const user= this.state.users.find(u=>u.id.toString()===user_id.toString());
          //console.log(user,user_id,this.state.users)
          if(user){
              console.log(user)
              return (user.fn+' '+user.ln+(user.post && user.post!=='-' ?' ('+user.post+')':''))
          }else{
              console.log('loading')
              return (<img src={loading} alt="لطفاً کمی صبر کنید." width={50}/>);
          }
      }else{
          return "-";
      }

    }
  render(){
      const {valueOfComponent,users}=this.state;
      if(this.props.readOnly){
          return ( <span className="d-block py-2 px-3 shadow-sm bg-light rounded-pill">{this.props.value!=undefined?(this.props.type==="SelectUser"?this.getUser(this.props.value):this.props.value):''}</span>)
      }else{
          switch (this.props.type){
              case INPUT_TYPES.ToggleButton:
                  return (<ToggleBotton btns={this.props.options}
                                        onClickHandel={(valueOfComponent)=>{this.setState({valueOfComponent})}}
                                        toggle_state={valueOfComponent}
                                        className="toggle_btn text-center d-flex align-items-center w-100 mx-auto"
                                        style={{maxWidth:300}}
                                        color="blue"/>);
              case INPUT_TYPES.InputFa:
                  return (<input type="text"
                                 className="form-control border-0 rounded-pill"
                                 value={valueOfComponent}
                                 placeholder={this.props.placeholder}
                                 name='valueOfComponent'
                                 onChange={(e)=>{userActions.handleChangeInput.call(this,e,'fa')}}

                  />)
              case INPUT_TYPES.InputEn:
                  return (<input type="text"
                                 className="form-control border-0 rounded-pill"
                                 value={valueOfComponent}
                                 placeholder={this.props.placeholder}
                                 name='valueOfComponent'
                                 onChange={(e)=>{userActions.handleChangeInput.call(this,e,'en')}}

                  />)
              case INPUT_TYPES.InputNumber:
                  return (<input type="text"
                                 className="form-control border-0 rounded-pill"
                                 value={valueOfComponent}
                                 placeholder={this.props.placeholder}
                                 name='valueOfComponent'
                                 onChange={(e)=>{userActions.handleChangeInput.call(this,e,'number')}}

                  />)
              case INPUT_TYPES.SelectUser:
                  return(<>
                      {users.length==0 &&
                      <img className="mx-auto d-block position-absolute" style={{left:0,right:0,bottom:15,zIndex:99}} src={loading} alt="لطفاً کمی صبر کنید." width={50}/>
                      }
                      <Select className="w-100 text-justify custom-select-2"
                                 value={valueOfComponent}
                                 name="valueOfComponent"
                                 placeholder=""
                                 onChange={userActions.handleChangeSelect.bind(this)}
                                 options={users}
                                 getOptionLabel={u => (u.fn+' '+u.ln+(u.post && u.post!=='-' ?' ('+u.post+')':''))}
                                 getOptionValue={u => u.fn+' '+u.ln}
                  /></>)
              case INPUT_TYPES.Select:
                  return (<Select className="text-center custom-select-2"
                                  value={valueOfComponent}
                                  name="valueOfComponent"
                                  placeholder={this.props.placeholder}
                                  onChange={userActions.handleChangeSelect.bind(this)}
                                  options={this.props.options}
                  />);
              case INPUT_TYPES.MultiSelect:
                  return (<Select className="text-center custom-select-2"
                                  value={valueOfComponent}
                                  name="valueOfComponent"
                                  placeholder={this.props.placeholder}
                                  onChange={userActions.handleChangeSelect.bind(this)}
                                  options={this.props.options}
                                  isMulti={true}
                  />);
              case INPUT_TYPES.DatePicker:
                  return(<div className="position-relative">
                      <DatePicker
                          cancelOnBackgroundClick={true}
                          inputComponent={(props)=><input type="text"
                                                          className="form-control border-0 bg-white rounded-pill text-center  pl-5"
                                                          style={{borderColor:'#efefef'}}
                                                          {...props}/>}
                          placeholder={this.props.placeholder}
                          format="jYYYY/jMM/jDD"
                          onChange={(unix, formatted)=>{this.setState({valueOfComponent:formatted})}}
                      />
                      <i className="fal fa-calendar-alt position-absolute text-muted" style={{bottom: '.4rem',left: '1rem',fontSize: '1.7em'}}/>
                  </div>);
              case INPUT_TYPES.TimePicker:
                  return(<div className="position-relative">
                      <div className="form-control rounded-pill text-center border-0 pl-5" style={{boxShadow:'0px 0px 4px 1px #ccc'}}>
                          <TimePicker
                              withoutIcon
                              time={valueOfComponent}
                              theme="material"
                              timeMode='24'
                              timezone="Asia/Tehran"
                              onTimeChange={(time) => {
                                  this.setState({valueOfComponent: time.hour + ":" + time.minute})
                              }}
                          />
                      </div>
                      <i className="fal fa-clock position-absolute text-muted"
                         style={{bottom: '0.4rem', left: '1rem', fontSize: '1.7em'}}/>
                  </div>)
              default:
                  return (<></>);

          }
      }

  }


}
InputGenerator.defaultProps = {
    options:[],
    placeholder:'',
    readOnly:false
}
InputGenerator.propTypes={
    type:PropTypes.string.isRequired,
    options:PropTypes.arrayOf(PropTypes.shape({
        label:PropTypes.string,
        value:PropTypes.any,
        icon:PropTypes.any
    })),
    placeholder:PropTypes.string,
    name:PropTypes.string,
    onChange:PropTypes.func,
    value:PropTypes.any,
    readOnly:PropTypes.bool
}