import * as actionType from "../actions/actionTypes";
const initialState = {
  userBO: {},
};

export default (state = initialState, action) => {
  // console.log("SET_USER_DETAIL>> call done", action);
  switch (action.type) {
    case actionType.SET_USER_DETAIL:
      // console.log("SET_USER_DETAIL>>", action);
      return {
        ...state,
        userBO: action.payload
      }
    default:
      return state
  }
}