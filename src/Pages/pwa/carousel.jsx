import React, { Component } from "react";
import { connect } from "react-redux";
import { userConstants } from "../../_constants";
import { userActions } from "../../_actions";
import TouchCarousel from "react-touch-carousel";
import NonPassiveTouchTarget from "./NonPassiveTouchTarget";
import touchWithMouseHOC from "react-touch-carousel/lib/touchWithMouseHOC";
import cx from "classnames";
import { Navbar } from "./Navbar";
import { Tabbar } from './Tabbar';
import { NavLink } from "react-router-dom";
const cardSize = 300;
const cardPadCount = 2;

class Carousel_ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{}, {}, {}],
      step1: [],
      itemname: null,
      stepCounter: null,
      unread: [],
      sortStep: [],
    };
  }
  componentDidMount() {

    this.getShourtcuts();

  }
  getShourtcuts = () => {
    const { year } = this.props.globalStorage;
    this.props.dispatch(
      userActions.API('get', `/v1/user/hospital/my_shortcuts?year=${year}`))
      .then(res => {
        this.props.dispatch(
          userActions.API('get', `/v1/user/kartabl?year=${year}&page=1&per=1`))
          .then(res2 => {
            const counters = res2.data[0];  
            const arr=res.data;
            const sortStep=
            [
              'indicator_agahi',
              'dastor_kar',
              'payam',
              'checklist_page',
              'sessions',
              'taiedie',
              'ravesh',
              'mashi',
              'dastor_amal',
              'process_checklist',
              'process_flowchart',
              'indicator_eghdam',
              'pdp_checking',
              'programs_confirmation',
              'program_suggestion',
              'course'
            ]
            .map(shortcut_key => {
             const s= arr.find(a=>a.key===shortcut_key)
              s.total = counters[s.key];
              s.unread = counters[s.key + '_s'];

              return s;
            })
            
                       
            this.setState({ sortStep })
          });
      });



  }

  // getUnreadShourtcuts = () => {
  //   const { year } = this.props.globalStorage;
  //   this.props.dispatch(
  //     userActions.unredShourtcuts(year, 1, 10))
  //     .then(res => {



  //        this.setState({unread:res.data[0]})

  //     });

  // }
  CarouselContainer = props => {
    const {
      cursor,
      carouselState: { active, dragging },
      ...rest
    } = props;
    let current = -Math.round(cursor) % this.state.data.length;
    while (current < 0) {
      current += this.state.data.length;
    }

    return (
      <NonPassiveTouchTarget
        className={cx("carousel-container", {
          "is-active": active,
          "is-dragging": dragging
        })}
      >
        <NonPassiveTouchTarget
          className="carousel-track"
          data-cursor={cursor}
          {...rest}
        />
        <div className="carousel-pagination-wrapper">
          <ol className="carousel-pagination">
            {this.state.data.map((_, index) => (
              <li key={index} className={current === index ? "current" : ""} />
            ))}
          </ol>
        </div>
      </NonPassiveTouchTarget>
    );
  };

  renderCard = (index, modIndex, cursor) => {

    const sliceStep1 = this.state.sortStep.slice(0, 9);
    const sliceStep2 = this.state.sortStep.slice(9, 18);

    const getShortcuts = (item) => {
      return (
        <div className="col-4 itemcarousel px-0 d-inline-block" key={item._id}>
          <NavLink to={item.key.indexOf('indicator') === -1 ? '/pwa/dashboard/' + item.key : `/pwa/indicator/${item.key === 'indicator_eghdam' ? 'collector' : 'monitor'}/pwa`}>

            {item.unread !== 0 && item.primary == true && item.unread !== undefined && <span className="showunread">{item.unread}</span>}
            <img
              className="col-12 px-0"

              src={userConstants.SNJAB_URL + 'asset/images/icons/' + item.icon}
              alt="snjab"
            />
            <span className="col-12 title px-0">{item.title}</span>

          </NavLink>
        </div>
      );


    }
    const dataStep3 = () => {
      return (
        <div className="search-pwa w-100">
          <input
            autoComplete="new-password"
            type="text"
            className="inputText simple-search-pwa w-100"
            value={this.state.search}
            name="search"
            maxLength={11}
            placeholder="دنبال چه چیزی هستید؟"
            required
          />
          <div className="adv-search-pwa"><p><span>پیشرفته</span></p></div>
        </div>
      )
    }

    cursor = -cursor;
    const item = this.state.data[modIndex];
    const translateCard = index > cursor ? 100 * (index - cursor) : 0;
    const translateText = index < cursor ? 5 * (index - cursor) : 0;
    const translateTitle = translateText * 1.2;
    const scaleTitle = index < cursor ? 1 - 0.1 * (cursor - index) : 1;
    return (
      <div
        key={index}
        className="carousel-card col-12"
        style={{ transform: `translate3d(${translateCard}%, 0, 0)` }}
        data-index={index}
        data-modIndex={modIndex}
      >
        <div className="row w-100" style={{ height: '100%', direction: "ltr" }}>
          {(index === 0 && sliceStep1.map(getShortcuts)) || (index === 1 && sliceStep2.map(getShortcuts)) || (index === 2 && dataStep3())}
        </div>
      </div>
    );
  };
  showSettings(event) {
    event.preventDefault();
  }

  render() {

    return (
      <div className="container-fluid">
      <div className="shourtcut-pwa">

        <Navbar name="سنجاب" logout />
        <TouchCarousel
          component={touchWithMouseHOC(this.CarouselContainer)}
          cardSize={cardSize}
          cardCount={3}
          cardPadCount={cardPadCount}
          autoplay={false}
          renderCard={this.renderCard}
          loop={false}
        />

        <Tabbar />
      </div>
      </div>
      
    );
  }
}
export const Carousel = connect(state => ({
  globalStorage: state.globalStorage
}))(Carousel_);