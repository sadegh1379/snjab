import { userConstants } from '../_constants';
import localstorageTTL from 'localstorage-ttl';
import moment from 'jalali-moment'
import axios from "axios";
const global=localstorageTTL.get('globalStorage') || {};
const remember=localstorageTTL.get('remember') ;
let {token,me,year}=global;


const defualts={
    remember,
    hospitals:[],
    all_answerer_info_menu_items:[],
    users:[],
    committees:[],
    wards:[],
    indicators:[],
    year:year || moment().jYear(),
    loading:0,
    temp:{}
}


const initialState = token ? Object.assign({},defualts,{token,me}) : defualts;
export function globalStorage(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOADING_SHOW:
      return {
          ...state,
        loading: state.loading+1
      };
      case userConstants.LOADING_HIDE:
        return {
            ...state,
            loading: state.loading-1
        };
      case userConstants.LOGIN_SUCCESS:

          axios.defaults.headers.common['Authorization']=action.data.token;
          return {
              ...state,
              token: action.data.token
          };
      case userConstants.ME:

          return {
              ...state,
              ...action.data
          };
      case userConstants.HOSPITALS:

          return {
              ...state,
              hospitals: action.data
          };
      case userConstants.INDICATORS:

          return {
              ...state,
              indicators: action.data
          };
      case userConstants.WARDS:

          return {
              ...state,
              wards: action.data
          };
      case userConstants.USERS:

          return {
              ...state,
              users: action.data
          };
      case userConstants.COMMITTEES:

          return {
              ...state,
              committees: action.data
          };
      case userConstants.ALL_ANSWERER_INFO_MENU_ITEMS:

          return {
              ...state,
              all_answerer_info_menu_items: action.data
          };
      case userConstants.LOGOUT:
          return {
              ...state,
              token: null,
              me:null
          };
      case userConstants.ANY:
          return {
              ...state,
              [action.key]:action.data
          };
      case userConstants.TEMP:
          return {
              ...state,
              [action.key]:action.data
          };
      case userConstants.REMEMBER:
          return {
              ...state,
              remember:action.data
          }
      case userConstants.REMOVE_REMEMBER:
          return {
              ...state,
              remember:null
          }

    default:
      return state
  }
}