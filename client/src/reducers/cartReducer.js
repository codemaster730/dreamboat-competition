import { ADD_ITEM, LOAD_ITEMS, SAVE_ITEMS } from "../actions/types";

const initialState = {
  cartItems: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEM:
      return Object.assign({}, state, {
        cartItems: state.cartItems.concat(action.payload)
      });
    
    case LOAD_ITEMS:
      return {
        ...state,
        cartItems: state.cartItems.concat(action.payload)
      }

    case SAVE_ITEMS: 
      return Object.assign({}, state, {
        cartItems: action.payload
      })

    default:
      return state;
  }
}
