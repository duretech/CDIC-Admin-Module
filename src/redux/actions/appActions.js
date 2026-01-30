import { 
    SET_USER_DETAIL,
    TOGGEL_SIDEBAR,
    ASSIGN_VALUE
} from "../actions/actionTypes";

export const setUserDetail = data => ({
    type: SET_USER_DETAIL,
    payload: data
  });