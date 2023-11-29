import React, { Component } from 'react'
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import {userActions} from "../_actions";
import Loading from '../assets/images/loading_2.gif';
import Loading2 from '../assets/images/loading2.gif';
import {connect} from "react-redux";
import { UsersInterface} from '../Interfaces'
import InfiniteScroll from 'react-infinite-scroller';
import Select from "react-select";
Modal.setAppElement('#root');


const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      },

  };

  let timer = null;
class UsersSelect_ extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            users:[],
            isModalOpen: false,
            isChecked: false,
            loadUsers:false,
            loadCommittees:false,
            page:1,
            committees:[],
            selectedCommittee:null,
            search:'',
            has_more:true,
            isCheckedAll:false,
            wards:[],
            ward:''
        }
        this.onRefresh=this.onRefresh.bind(this);
    }

    wardOnChange=(w)=>{
        if(w){

            this.setState({page:1,has_more:false,loadUsers:false,users:[w]});
        }else{
            this.getUsers(1)
        }

    }
    openModal = () => {
        const selectedUsers=[...this.props.selectedUsers];
        this.setState({users:[],selectedUsers},()=>{
            this.props.dispatch(userActions.start_request());
            this.getUsers(1).then(res=>{
                this.props.dispatch(userActions.finish_request());
                this.setState({
                    isModalOpen: true,
                })
            })
        });

    }
    closeModal = () => {
        this.setState({
            isModalOpen: false,
        })
    }
    toggleChecked = (user=null) => {
        const {users,isChecked,selectedUsers}=this.state;

        if(user){

            const index=selectedUsers.findIndex(u=>u.id===user.id);
            if(index===-1){
                selectedUsers.push(user);
            }else{
                selectedUsers.splice(index,1);
            }
            this.setState({selectedUsers},()=>{
                this.setState({isCheckedAll:this.isCheckedAll()})
            })
        }else {
            this.props.dispatch(userActions.API('get',`/v1/search_user?query=&hospital_id=${this.props.globalStorage.me.hospital_id}`)).then(res=>{
                this.setState({
                    isChecked: !isChecked
                },()=>{

                    this.setState({selectedUsers:res.data.result.map(function (u) {
                            return ({
                                firstname:u.fn,
                                lastname:u.ln,
                                id:u.id,
                                avatar:u.avatar
                            })
                        })},()=>{
                        this.setState({isCheckedAll:this.isCheckedAll()})
                    })


                })
            })

        }

    }
    userChecked=(id)=>{
        const {selectedUsers}=this.state;
        return selectedUsers.findIndex(u=>u.id===id)>=0;
    }
    isCheckedAll=()=>{
        const {selectedUsers,users}=this.state;
        return selectedUsers.length>=users.length;
    }
    handleClickCheckBox = (e) => {

       e.target.checked=!e.target.checked;
    }
    getUsers=(page,committee_id=this.state.selectedCommittee,search=this.state.search)=>{
        this.setState({loadUsers:true,has_more:false});
        let cid='';
        let s='';
        if(committee_id!==this.state.selectedCommittee || search!==this.state.search){
            this.setState({users:[]},()=>{

            });
        }
        if(committee_id){
            if(committee_id.id){
                committee_id=committee_id.id;
            }
            cid='&committee_id='+committee_id;
        }
        if(search){
            s='&search='+search;
        }
       const response= this.props.dispatch(userActions.API('get',`/v2/get_users?page=${page}&per=24${s+cid}`,null,false));
        response.then(res=>{
            const has_more=res.data.length>0;
            this.setState({page:parseInt(page)+1,has_more,loadUsers:false,users:[...this.state.users,...res.data]});


        });
       return response;
    }
    getCommittees=()=>{
        this.setState({loadCommittees:true});
        this.props.dispatch(userActions.API('get',`/v1/list_of_commitees?id=${this.props.globalStorage.me.hospital_id}&year=${this.props.globalStorage.year}`,null,false)).then(res=>{
            this.setState({loadCommittees:false});
            this.setState({committees:res.data});
        });

    }
    loadMore=()=>{
        this.getUsers(this.state.page,this.state.selectedCommittee,this.state.search)
    }
    getWards=()=>{
        this.props.dispatch(userActions.API('get','/v1/user/hospital/get_hospital_ward_responsibles',null,false)).then(res=>{
            this.setState({wards:res.data})
        })
    }
    componentDidMount() {
        if(this.props.globalStorage.me){
            this.getCommittees();
            this.getWards();
        }
    }
    submit=()=>{
        this.props.submit(this.state.selectedUsers)
        this.closeModal()
    }
    search=()=>{
        timer=null;
        this.setState({users:[]},()=>{
            this.getUsers(1);
        });

    }
    delay(fn, ms) {

        return function(...args) {
            if(timer)
                clearTimeout(timer);
          timer = setTimeout(fn.bind(this, ...args), ms || 0)
        }
      }
      async onRefresh(res){
       this.search();
      }
    render() {
    const {loadUsers,committees,selectedCommittee,loadCommittees,search,has_more,wards,ward}=this.state;
        return (
            <div >

                <button onClick={this.openModal} className={this.props.className}> {this.props.children}</button>

                <Modal
                    isOpen={this.state.isModalOpen}
                    //   onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="User Modal"
                    portalClassName="full_screen_modal selelctUsers"
                >

                    <div className="py-3 bg-white rounded container" style={{borderRadius: '20px'}}>
                        <div className="container">

                         <div onClick={this.closeModal} className=" w-100 btn-primary iran-sans_Bold text-center p-2  text-white" style={{fontSize:'13px'}}>انتخاب اعضا </div>


                            <div className="row">
                                <div className="col-lg-12 m-auto">
                                    <div className="form-group mt-3 w-100">
                                        <input type="text"
                                               className="form-control rounded-pill py-4 text-center text-gray" style={{fontSize: '12px'}}
                                               placeholder="نـام و  نـام خانوادگـی، و یـا سمت شخص مورد نظـر را جستجـو کنیـد "
                                               name="search"
                                               onChange={userActions.handleChangeInput.bind(this)}
                                               value={search}
                                               onKeyUp={
                                                this.delay(this.search,1000)
                                               }
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="w-100 pt-3 pb-4">
                                        <div className="form-group text-right ">
                                            <label className="iran-sans_Bold text-right text-dark" style={{fontSize: '12px',paddingRight: '10px'}}> فیلتـر بـر اسـاس بخش </label>
                                            <Select className="text-center custom-select-2 text-center" style={{fontSize: '12px!important'}}
                                                    value={ward}
                                                    name="ward"
                                                    isClearable
                                                    placeholder="بخش مـورد نظـر را نتخـاب کنیـد"
                                                    onChange={(v, d) => userActions.handleChangeSelect.call(this, v, d, null, null, this.wardOnChange)}
                                                    options={wards}
                                                    getOptionLabel={opt => opt.ward}
                                                    getOptionValue={opt => opt.ward}
                                                    id="ward"

                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 bg-white d-flex justify-content-center pl-0 ">
                                    <div className="bg-blue px-3 d-flex align-items-center justify-content-center  col-sm-3" style={{minHeight:300,borderRadius:'20px'}}>
                                        <button
                                            className="iran-sans_Bold text-white d-flex justify-content-center rotate90  btn btn-link"
                                            onClick={()=>{
                                                this.setState({selectedCommittee:false},()=>{
                                                    this.getUsers(1,null)
                                                });
                                            }}
                                            style={{minWidth:300,borderRadius:'20px'}}> اعضـای بیمـارستـان</button></div>
                                    <div className="d-flex flex-column align-items-start justify-content-start mx-1  " >
                                        <div className="overflowY overflow-hidden pl-5" style={{maxHeight:600}}>
                                            {loadCommittees && <img src={Loading2} alt="جستـجـو در بیمـارستـان" style={{maxWidth:'100%'}}/>}
                                            {committees.map((committee,i)=>
                                                <button className={` btn btn-blue my-1 w-100 py-4  ${selectedCommittee==committee && 'active'}`} style={{borderRadius:'20px',fontSize:'13px',fontFamily:'iransansBold'}} onClick={()=>{
                                                    if(selectedCommittee===committee){
                                                        this.setState({selectedCommittee:false},()=>{
                                                            this.getUsers(1,null)
                                                        });
                                                    }else{
                                                        this.setState({selectedCommittee:committee},()=>{
                                                            this.getUsers(1,committee.id)
                                                        });
                                                    }

                                                }} key={i}>{committee.name==='ندارد'?'سایر کمیته ها':committee.name}</button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 bg-white pr-0">
                                    <div className="shadow-sm overflow-auto" ref={(ref) => this.scrollParentRef = ref} style={{height:600}}>
                                        <div className="d-flex w-100 bg-dark iran-sans_Bold  text-center p-3   text-white rounded-top ">
                                            <div className="col-4  text-white">
                                                <button className="btn btn-link p-0" type={"button"} onClick={()=>{this.toggleChecked()}}>
                                                    <i className={`fal text-white ${this.state.isCheckedAll?'fa-check-square':'fa-square'}`}/>
                                                </button>
                                            </div>
                                            <div className="col-4 text-white">نام خانوادگی </div>
                                            <div className="col-4 text-white">سمت</div>
                                        </div>

                                        {/* <!--row2--> */}
                                        <InfiniteScroll
                                            pageStart={1}
                                            loadMore={this.loadMore}
                                            hasMore={has_more}
                                            initialLoad={false}
                                            useWindow={false}
                                            getScrollParent={() => this.scrollParentRef}
                                        >
                                            {this.state.users.map(
                                                (user, index) => {
                                                    return (
                                                        <button onClick={()=>this.toggleChecked(user)} className="btn btn-link w-100 d-flex bg-white iran-sans_Bold  border-0 text-center p-3 my-1  text-white rounded " key={index}>
                                                            <div className="col-4 text-blue">
                                                               <i className={`fal ${this.userChecked(user.id)?'fa-check-square text-success':'fa-square'}`}/>
                                                            </div>
                                                            <div className="col-4 text-blue"> {user.firstname+' '+user.lastname}</div>
                                                            <div className="col-4 text-blue">{user.post || '-'}</div>
                                                        </button>
                                                    )
                                                }

                                            )}
                                        </InfiniteScroll>

                                        {loadUsers && <img src={this.state.users.length===0 ?Loading:Loading2} className="d-block m-auto" alt="در حال پردازش اطلاعات" style={{maxWidth:'100%'}}/>}
                                        {!loadUsers && this.state.users.length==0 && <p className="text-muted text-center h5 py-5">اطلاعاتی جهت نمایش یافت نشد.</p>}
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="row justify-content-center pb-4 mt-3">
                                <button type="button" className="btn btn-blue rounded-pill    mx-4 my-1 col-sm-2" onClick={this.submit}>ثبت </button>
                                <button type="button" onClick={this.closeModal} className="btn btn-outline-blue rounded-pill    mx-4 my-1 col-sm-2">انصراف</button>
                            </div>
                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
}
UsersSelect_.defaultProps={
    selectedUsers:[]
}
UsersSelect_.propTypes={
    selectedUsers:PropTypes.arrayOf(PropTypes.shape(UsersInterface)),
    submit:PropTypes.func
}
const UsersSelect=connect((state) => ({globalStorage: state.globalStorage}))(UsersSelect_);
export {UsersSelect}



