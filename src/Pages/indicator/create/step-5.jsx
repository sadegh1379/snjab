import React from 'react';
import MonitorIcon from '../../../assets/images/job.png';
import CollectorIcon from '../../../assets/images/network.png';
import AddIcon from '../../../assets/images/add.png';
import Modal from "react-modal";
import ReactTooltip from 'react-tooltip';
import {UsersSelect,HospitalTable} from "../../../_components";
import {userActions} from "../../../_actions";
import {connect} from "react-redux";
import {SelectCollector,SelectMonitor} from "../components"
Modal.setAppElement('#root');

export class Step5_ extends React.Component {

    constructor(props){
        super(props);
        this.state=Object.assign({
            CollectorModal:false,
            MonitorModal:false,
            collectors:[],
            monitors:[],
            headers:[
                {
                    title:'ردیف',
                    getData:(item,index)=>{
                        return index+1;
                    },
                    style:{
                        width:'10%'
                    }
                },
                {
                    title:'بخش ها/واحد ها',
                    getData:(item,index)=>{
                        return "";
                    },
                    style:{
                        width:'30%'
                    }
                },
                {
                    title:'مسئولین پایش',
                    getData:(item,index)=>{
                        return item.ward;
                    },
                    style:{
                        width:'30%'
                    }
                },
                {
                    title:'عملیات',
                    getData:(item,index)=>{
                        return <button className="btn btn-link"><i className="fal fa-trash-alt text-danger"/> </button>;
                    },
                    style:{
                        width:'30%'
                    }
                }
            ],
        },props.globalStorage.temp);

    }


   /* componentDidUpdate(props,state){
        if(props.globalStorage.temp!==this.state){
            this.props.dispatch(userActions.setTemp({temp:this.state}))
        }
    }*/


    render(){
        const {temp}=this.props.globalStorage;

        return(
            <div className="row d-flex justify-content-center ">

                <div className="d-flex flex-column align-items-center " style={{padding: '15px'}}>

                    <SelectCollector iconWidth={50} iconHeight={50} indicatorId={temp?temp.indicator_id:''}/>
                    <span className="iran-sans_Bold py-2 text-dark" style={{fontSize:'13px'}}>مسئولیـن جمـع آوری</span>
                </div>
                <div className="d-flex flex-column align-items-center " style={{padding: '15px'}}>

                    <SelectMonitor iconWidth={50} iconHeight={50} indicatorId={temp?temp.indicator_id:''}/>
                    <span className="iran-sans_Bold py-2 text-dark" style={{fontSize:'13px'}}>مسئولیـن پایش</span>
                </div>

            </div>
        )
    }
}

const Step5=connect((state) => ({globalStorage: state.globalStorage}))(Step5_);
export {Step5}