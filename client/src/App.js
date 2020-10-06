import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

//Auth
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

//Routes
import PrivateRoute from "./components/private-route/PrivateRoute";
import AdminRoute from "./components/admin-route/AdminRoute";

// User pages
import Home from "./components/home/Home";
import GalleryPage from "./components/gallery/GalleryPage";
import SpotBallMain from "./components/spot-the-ball/SpotBallMain";
import Checkout from "./components/checkout/Checkout";

// Admin pages
import UserList from "./components/admin/users/UserList";
import BoatList from "./components/admin/boats/BoatList";
import SpotBallList from "./components/admin/spotballs/SpotBallList";
import TicketList from "./components/admin/tickets/TicketList";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Home} />
            <Route exact path="/boats" component={GalleryPage} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch> 
              <PrivateRoute path="/spot-the-ball" component={SpotBallMain} />
              <PrivateRoute path="/checkout" component={Checkout} />
              <AdminRoute exact path="/admin/users" component={UserList} />
              <AdminRoute exact path="/admin/boats" component={BoatList} />
              <AdminRoute exact path="/admin/spotballs" component={SpotBallList} />
              <AdminRoute exact path="/admin/tickets" component={TicketList} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;