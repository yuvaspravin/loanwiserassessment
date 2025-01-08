/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { ADD_APPLICANT_NAME } from "../action";

const initialUserState = {
  applicant_name: [],
};

const reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case ADD_APPLICANT_NAME:
      return { ...state, applicant_name: action.payload };
    default:
      return state;
  }
};

export default reducer;
