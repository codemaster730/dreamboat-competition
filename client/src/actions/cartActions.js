import axios from "axios";

import {
  GET_ERRORS,
  ADD_ITEM,
  LOAD_ITEMS,
  SAVE_ITEMS
} from "./types";

// Get Cart Items from DB
export const loadItems = userData => dispatch => {
  axios
    .post("/api/carts/loadItems", userData)
    .then( res => {
      dispatch({
        type: LOAD_ITEMS,
        payload: res.data
      })
    }) 
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

// POST Cart Item tp DB
export const addItem = item => dispatch => {
  axios
    .post("/api/carts/addItem", item)
    .then(res => {
      dispatch({
        type: ADD_ITEM,
        payload: item
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// POST Cart Item to DB
export const addItems = items => dispatch => {
  axios
    .post("/api/carts/addItems", items)
    .then(res => {
      dispatch({
        type: SAVE_ITEMS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// POST Cart Item tp DB
export const saveItems = items => dispatch => {
    dispatch({
      type: SAVE_ITEMS,
      payload: items
    })
};
