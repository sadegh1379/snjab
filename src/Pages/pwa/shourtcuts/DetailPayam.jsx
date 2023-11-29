import React, { Component } from 'react';
import { connect } from "react-redux";
import { Navbar } from "../Navbar";
import moment from "jalali-moment";
import { userConstants } from "../../../_constants";
import { userActions } from "../../../_actions";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";

class detailPayam_ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            body: '',
            open: false,
            top: false,
            user:[]
        }
    }
    componentDidMount(){
        this.getUser()
    }
    getUser=()=>{
        this.props.dispatch(userActions.getUsers(this.props.globalStorage.me.hospital_id)).then(res=>{
            this.setState({user:res.data.result})
         })
    }
    openBottomSheet = open => {

        this.setState({ open });

    };

    toggleBottomSheet = () => {
        this.openBottomSheet(!this.state.open);
      
    };
    handleSendMessage = () => {
        const params = {
            body: this.state.body,
            subject: this.props.location.state.detail.object.body,
            receiver_id:[this.props.location.state.detail.object.sender_id],
            reply_to: this.props.location.state.detail.object._id,
            id: null
        }
        this.props.dispatch(userActions.API('post', '/v1/user/mail/compose', params)).then(res => {
           
        });
        this.setState({ open:false });
        userActions.successToast('پیـام با موفقیـت ارسـال شد')
    }
    handleBody = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
     
        const { detail,unread,body } = this.props.location.state;
        const first = detail.object.body.split('\n');
        return (
            <div className="container-fluid">
                <Navbar name="پیـام" url={`/pwa/dashboard/payam`} />
                <div className="detail-shortcut" style={{ backgroundColor: 'unset', zIndex: 99 }}>
                    <div className="col-12 payam" style={{ height: '100vh' }}>
                    {unread}
                        <div className="row text-center">
                            <div className="col-12 line_part">
                            {this.state.user.map(user=>{
                                if(detail.user_id===user.id){
                                return(
                                
                                    <div className="row">
                                    <div className="col-2">
                                        <div className="circle overflow_image">
                                            <img
                                                src={
                                                    userConstants.SERVER_URL_2 +
                                                    this.props.globalStorage.me.avatar.url
                                                }
                                                alt="Card image"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-9 d-flex px-0 align-items-center  card-name " style={{ fontSize: '0.9em', font: 'iransansbold' }}>
                                    <div className="col-12">
                                    <div className="row">
                                  
                                        <div className="col-8 pr-0">
                                        <div className="col-12 text-right" style={{ fontSize: '0.7em', fontFamily: "iransansbold", color: '#8e8b8b' }}>
                                               {user.post}
                                        </div>
                                            <div className="col-12 text-right">
                                                {user.fn}{" "}
                                                {user.ln}
                                            </div>
                                    
                                        </div>
                                      
                                        <div className="col-4 px-0" style={{ fontSize: '0.7em', fontFamily: "IRANSansWeb", color: '#8e8b8b' }}>{moment(detail.object.created_at).format('jDD jMMMM jYYYY')}</div>
                                        </div>
                                        </div>
                                    </div>

                                </div>
                                )}
                            })}
                   

                            </div>
                            <div className="col-12">
                                <div className="header">{first[2]}</div>
                                <div className="body" >
                                    <p>{first[0]}</p>
                                    <p>{first[1]}</p>
                                    <p>{first[2]}</p>
                                </div>
                            </div>
                            {/* <div className="col-12 ">
                            <div class="col-12 card cardstyle my-3">
                            <div class="card-body text-center p-1" >
                            <div class="card-head " style={{top: '-1em'}}>ارسال پیام</div>
                            <p style={{width:'100%'}}><textarea type="text" name="body" onChange={this.handleBody} value={this.state.body} style={{width:'100%',borderRadius:'.5em',boxShadow: 'unset',minHeight:'150px',border: '1px solid #ccc',fontSise:'.7em'}}/></p>
                            <p style={{width:'100%'}} ><button className="btn round-pill btn-primary  col-12" style={{borderRadius:'50em'}} onClick={this.handleSendMessage}>ارسال</button></p>
                            </div>
                            </div>
                            </div> */}

                            <SwipeableBottomSheet
                                overflowHeight={this.state.open ? 0 : 55}
                                open={this.state.open}
                                onChange={this.openBottomSheet}
                                bodyStyle={this.state.top ?{ position: "absolute", bottom: "200px" } : ""}
                            >

                                <div style={{ height: "340px" }} className="answer">
                                    <div
                                        className="title-pwa"
                                        onClick={this.toggleBottomSheet} >
                                        {this.state.open ? "" : "پاسـخ"}
                                       
                                    </div>
                                    <div className="content">
                               
                                                 
                                                        <div class=" text-center p-1" >
                                                        <p style={{width:'100%'}}><textarea placeholder="چیزی بنویسید..." type="text" name="body" onChange={userActions.handleChangeInput.bind(this)} name="body" value={body} style={{width:'100%',borderRadius:'.5em',boxShadow: 'unset',minHeight:'150px',border: '1px solid #ccc',fontSize:'.6em',height:'220px',padding: "0.75em"}}/></p>
                                                        <button onClick={this.handleSendMessage} className="btn w-60" style={{border:"1px solid #fff",color:"#fff",borderRadius:"50em",width: '100%'}}>ارسـال</button>
                 
                                                        </div>

                                                        </div>
                                                       
                                  
                                </div>

                            </SwipeableBottomSheet>


                        </div>
                    </div>
                </div>
                </div>
        );

    }
}

export const detailPayam = connect(state => ({
    globalStorage: state.globalStorage
}))(detailPayam_);