import {
GET_PRODUCT_SUCCESS,
 PRODUCT_REQUEST,
} from "./actiontype";

const initialstate = {
  isLoading: false,
  isError: false,
  projects: [],  
};
export const reducer = (state = initialstate, { type, payload }) => {
  switch (type) {
    case PRODUCT_REQUEST:
      return { ...state, isLoading: true };
      case GET_PRODUCT_SUCCESS:
        return { ...state, isLoading: false, projects: payload };
    default:
      return initialstate;
  }
};
