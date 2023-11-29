import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { userActions } from "../_actions";
import Loading from "../assets/images/loading_2.gif";
import Loading2 from "../assets/images/loading2.gif";
import { connect } from "react-redux";
import { UsersInterface } from "../Interfaces";
import InfiniteScroll from "react-infinite-scroller";
import Select from "react-select";
Modal.setAppElement("#root");

const customStyles = {
  content : {
    top                   : '55%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }

};

let timer = null;
class UsersSelectResponsive_ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isModalOpen: false,
      isChecked: false,
      loadUsers: false,
      loadCommittees: false,
      page: 1,
      committees: [],
      selectedCommittee:'',
      search: "",
      has_more: true,
      isCheckedAll: false,
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  openModal = () => {
    const selectedUsers = [...this.props.selectedUsers];
    this.setState({ users: [], selectedUsers }, () => {
      this.props.dispatch(userActions.start_request());
      this.getUsers(1).then(res => {
        this.props.dispatch(userActions.finish_request());
        this.setState({
          isModalOpen: true
        });
      });
    });
  };
  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };
  toggleChecked = (user = null) => {
    const { users, isChecked, selectedUsers } = this.state;

    if (user) {
      const index = selectedUsers.findIndex(u => u.id === user.id);
      if (index === -1) {
        selectedUsers.push(user);
      } else {
        selectedUsers.splice(index, 1);
      }
      this.setState({ selectedUsers }, () => {
        this.setState({ isCheckedAll: this.isCheckedAll() });
      });
    } else {
      this.setState(
        {
          isChecked: !isChecked
        },
        () => {
          users.map(usr => {
            const index = selectedUsers.findIndex(u => u && u.id === usr.id);
            if (isChecked && index >= 0) {
              /*all user unselect*/
              selectedUsers.splice(index, 1);
            } else if (!isChecked && index === -1) {
              /*all user select*/
              selectedUsers.push(usr);
            }
          });
          this.setState({ selectedUsers }, () => {
            this.setState({ isCheckedAll: this.isCheckedAll() });
          });
        }
      );
    }
  };
  handleCommite=(selectedCommittee)=>{
       if(selectedCommittee){
         this.getUsers(1,selectedCommittee.id);
       }else{
        this.getUsers(1,null)
       }
//     this.state.committees.map((committee,i)=>
// {
//           if(selectedCommittee==committee){
//               this.setState({selectedCommittee:false},()=>{
//                   this.getUsers(1,null)
//               });
//           }else{
//               this.setState({selectedCommittee:committee},()=>{
//                   this.getUsers(1,committee.id)
//               });
//           }
//         }
      
//   )
  }
  userChecked = id => {
    const { selectedUsers } = this.state;
    return selectedUsers.findIndex(u => u.id === id) >= 0;
  };
  isCheckedAll = () => {
    const { selectedUsers, users } = this.state;
    return selectedUsers.length === users.length;
  };
  handleClickCheckBox = e => {
    e.target.checked = !e.target.checked;
  };
  getUsers = (
    page,
    committee_id = this.state.selectedCommittee,
    search = this.state.search
  ) => {
    this.setState({ loadUsers: true, has_more: false });
    let cid = "";
    let s = "";
    if (
      committee_id !== this.state.selectedCommittee ||
      search !== this.state.search
    ) {
      this.setState({ users: [] }, () => {});
    }
    if (committee_id) {
      if (committee_id.id) {
        committee_id = committee_id.id;
      }
      cid = "&committee_id=" + committee_id;
    }
    if (search) {
      s = "&search=" + search;
    }
    const response = this.props.dispatch(
      userActions.API(
        "get",
        `/v2/get_users?page=${page}&per=24${s + cid}`,
        null,
        false
      )
    );
    response.then(res => {
      const has_more = res.data.length > 0;
      this.setState({
        page: parseInt(page) + 1,
        has_more,
        loadUsers: false,
        users: [...this.state.users, ...res.data]
      });
    });
    return response;
  };
  getCommittees = () => {
    this.setState({ loadCommittees: true });
    this.props
      .dispatch(
        userActions.API(
          "get",
          `/v1/list_of_commitees?id=${this.props.globalStorage.me.hospital_id}&year=${this.props.globalStorage.year}`,
          null,
          false
        )
      )
      .then(res => {
        this.setState({ loadCommittees: false });
        this.setState({ committees: res.data });
      });
  };
  loadMore = () => {
    this.getUsers(
      this.state.page,
      this.state.selectedCommittee,
      this.state.search
    );
  };
  componentDidMount() {
    if (this.props.globalStorage.me) {
      this.getCommittees();
    }
  }
  submit = () => {
    this.props.submit(this.state.selectedUsers);
    //this.props.submit(this.state.selectedCommittee);
    this.closeModal();
  };
  search = () => {
    timer = null;
    this.setState({ users: [] }, () => {
      this.getUsers(1);
    });
  };
  delay(fn, ms) {
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
  }
  async onRefresh(res) {
    this.search();
  }
  render() {

    const {
      loadUsers,
      committees,
      selectedCommittee,
      loadCommittees,
      search,
      has_more
    } = this.state;
    return (
      <div>
        <button onClick={this.openModal} className={this.props.className}>
          {" "}
          {this.props.children}
        </button>

        <Modal
          isOpen={this.state.isModalOpen}
          //   onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="User Modal"
          portalClassName="full_screen_modal selelctUsers selelctUsers_pwa"
        >
          <div className="py-3 bg-white rounded">
            <div className="container">
            

              <div className="row ">
                <div className="col-12 m-auto ">
                  <div className="form-group mt-3   w-100">
                    <input
                      type="text"
                      className="form-control rounded-pill       py-4   text-center text-blue-responsive"
                      placeholder="نـام و نـام خانوادگـی، و یا سمت را جستجـو کنیـد "
                      name="search"
                      onChange={userActions.handleChangeInput.bind(this)}
                      value={search}
                      onKeyUp={this.delay(this.search, 1500)}
                    />
                  </div>
                </div>
                {/* <button
                onClick={this.search}
                className="btn w-50 d-flex justify-content-center btn-primary iran-sans_Bold text-center p-2 rounded-pill  text-white mb-3 mx-4 mx-auto"
              >
                {" "}
               جستجو
              </button> */}
                <div className="col-12 bg-white d-flex justify-content-center">
                  {/* <div
                    className="bg-blue  px-3 d-flex align-items-center   justify-content-center  col-sm-3"
                    style={{ minHeight: 300 }}
                  >
                    <button
                      className="iran-sans_Bold text-white d-flex justify-content-center rotate90  btn btn-link"
                      onClick={() => {
                        this.setState({ selectedCommittee: false }, () => {
                          this.getUsers(1, null);
                        });
                      }}
                      style={{ width:"100px" }}
                    >
                      {" "}
                      اعضای بیمارستان
                    </button>
                  </div> */}
                  <div className="d-flex flex-column align-items-start justify-content-start mx-1 w-100 ">
                    <div className="mb-4 w-100">
                      {loadCommittees && (
                        <img
                          src={Loading2}
                          alt="در حال پردازش اطلاعات"
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                      {/* {committees.map((committee,i)=>
                                                <button className={`rounded btn btn-blue my-1 w-100 py-4 ${selectedCommittee==committee && 'active'}`} onClick={()=>{
                                                    if(selectedCommittee===committee){
                                                        this.setState({selectedCommittee:false},()=>{
                                                            this.getUsers(1,null)
                                                        });
                                                    }else{
                                                        this.setState({selectedCommittee:committee},()=>{
                                                            this.getUsers(1,committee.id)
                                                        });
                                                    }

                                                }} key={i}>{committee.name==='ندارد'?'سایر کمیته ها':committee.name}</button >
                                            )} */}
                      <Select
                        isClearable
                        className={committees.map((committee,i)=>`text-justify custom-select-2 placeholder_font w-100 choose_commite ${selectedCommittee===committee && 'active'}`)}
                        value={selectedCommittee}
                        name="selectedCommittee"
                        placeholder="انتخـاب کمیتـه هـا"
                        onChange={(value,e)=>{userActions.handleChangeSelect.call(this,value,e,null,null,this.handleCommite)}}
                        options={committees}
                        getOptionLabel={opt => opt.name}
                        getOptionValue={opt => opt.id}
                        id="committees"
                      />
     
                    </div>
                  </div>
                </div>
                <div className="col-12 bg-white">
                  <div
                    className="shadow-sm overflow-auto border_userindisticator "
                    ref={ref => (this.scrollParentRef = ref)}
                  >
                    <div className="d-flex w-100 bg-dark iran-sans_Bold  text-center py-1 px-3   text-white rounded-top d-flex align-items-center justify-content-center">
                      <div className="col-1  text-white px-0">
                        <button
                          className="btn btn-link p-0 pt-1"
                         
                          type={"button"}
                          onClick={() => {
                            this.toggleChecked();
                          }}
                        >
                          <i
                           style={{fontSize:'1.5em',color:'#fff'}}
                            className={`fal ${
                              this.state.isCheckedAll
                                ? "fa-check-square"
                                : "fa-square"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="col-7 text-white font_header_selected d-flex align-items-center justify-content-center ">نـام خانوادگـی </div>
                      <div className="col-4 text-white font_header_selected d-flex align-items-center justify-content-center ">سمت</div>
                    </div>

                    {/* <!--row2--> */}
                    <div style={{height:"300px",overflow:"auto"}}>
                    <InfiniteScroll
                      pageStart={1}
                      loadMore={this.loadMore}
                      hasMore={has_more}
                      initialLoad={false}
                      useWindow={false}
                      getScrollParent={() => this.scrollParentRef}
                    >
                      {this.state.users.map((user, index) => {
                        return (
                          <button
                            onClick={() => this.toggleChecked(user)}
                            className="btn btn-link w-100 d-flex bg-white iran-sans_Bold  border-0 text-center p-1 my-1  text-white rounded"
                            key={index}
                          >
                            <div className="col-1 text-blue-responsive">
                              <i
                                style={{fontSize:'1.8em'}}
                                className={`fal ${
                                  this.userChecked(user.id)
                                    ? "fa-check-square text-success"
                                    : "fa-square"
                                }`}
                              />
                            </div>
                            <div className="col-7 text-blue-responsive px-0">
                              {" "}
                              {user.firstname + " " + user.lastname}
                            </div>
                            <div className="col-4 text-blue-responsive">
                              {user.post || "-"}
                            </div>
                          </button>
                        );
                      })}
                    </InfiniteScroll>
                    </div>
                    {loadUsers && (
                      <img
                        src={this.state.users.length === 0 ? Loading : Loading2}
                        className="d-block m-auto"
                        alt="در حال پردازش اطلاعات"
                        style={{ maxWidth: "100%" }}
                      />
                    )}
                    {!loadUsers && this.state.users.length == 0 && (
                      <p className="text-muted text-center h5 py-5">
                        اطلاعاتی جهت نمایش یافت نشد.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <br />
              <div className="row justify-content-center pb-4 mt-3">
                <div className="col-12 d-flex justify-content-center">
                <button
                  type="button"
                  className="col-5 btn btn-blue rounded-pill mx-1   my-1 col-sm-2"
                  onClick={this.submit}
                >
                  ثبت{" "}
                </button>
                <button
                  type="button"
                  onClick={this.closeModal}
                  className="col-5 btn btn-outline-blue rounded-pill  mx-1  my-1 col-sm-2"
                >
                  انصـراف
                </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
UsersSelectResponsive_.defaultProps = {
  selectedUsers: []
};
UsersSelectResponsive_.propTypes = {
  selectedUsers: PropTypes.arrayOf(PropTypes.shape(UsersInterface)),
  submit: PropTypes.func
};
const UsersSelectResponsive = connect(state => ({
  globalStorage: state.globalStorage
}))(UsersSelectResponsive_);
export { UsersSelectResponsive };
